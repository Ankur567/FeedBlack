import { NextApiRequest, NextApiResponse } from "next";
import Sentiment from "sentiment";
import { ApiResponse } from "@/types/apiResponse";
import { User } from "next-auth";
import connectDB from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel, { Feedback } from "@/model/User";

const sentiment = new Sentiment();

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        feedback: "User not authenticated. Please sign in !!",
      },
      { status: 401 }
    );
  }

  const user: User = session.user;
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return Response.json(
        {
          success: false,
          feedback: "User not found in DB",
        },
        { status: 404 }
      );
    }

    const userFeedbacks = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$feedbacks", preserveNullAndEmptyArrays: true } },
      { $sort: { "feedbacks.dateCreated": -1 } },
      { $group: { _id: "$_id", feedbacks: { $push: "$feedbacks" } } },
    ]);
    const stats = {
      positive: 0,
      negative: 0,
      neutral: 0,
    };

    const feedbacks = userFeedbacks[0].feedbacks;
    feedbacks.forEach((fb: { content: string }) => {
      const result = sentiment.analyze(fb.content);
      if (result.score > 0) stats.positive++;
      else if (result.score < 0) stats.negative++;
      else stats.neutral++;
    });
    console.log(stats);
    return Response.json(
      {
        success: true,
        feedback: stats,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      {
        success: false,
        feedback: "Error",
      },
      { status: 500 }
    );
  }
}
