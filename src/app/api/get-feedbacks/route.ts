import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

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

    // console.log("User found:", existingUser);

    const userFeedbacks = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$feedbacks", preserveNullAndEmptyArrays: true } },
      { $sort: { "feedbacks.dateCreated": -1 } },
      { $group: { _id: "$_id", feedbacks: { $push: "$feedbacks" } } },
    ]);

    // console.log("Aggregation Result:", userFeedbacks);

    if (
      !userFeedbacks ||
      userFeedbacks.length === 0 ||
      !userFeedbacks[0].feedbacks.length
    ) {
      return Response.json(
        {
          success: false,
          feedback: "No feedbacks found for this user",
        },
        { status: 404 }
      );
    }
    // console.log(userFeedbacks[0].feedbacks);
    return Response.json(
      {
        success: true,
        feedback: userFeedbacks[0].feedbacks,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Aggregation Error:", error);
    return Response.json(
      {
        success: false,
        feedback: "Error in aggregation pipeline",
      },
      { status: 500 }
    );
  }
}
