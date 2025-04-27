import connectDB from "@/lib/connectDB";
import { Feedback } from "@/model/Feedback";
import UserModel from "@/model/User";
import Sentiment from "sentiment";

const sentiment = new Sentiment();

export async function POST(request: Request) {
  await connectDB();

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          feedback: "User not found",
        },
        { status: 404 }
      );
    }

    // is user accepting feedbacks?
    if (!user.isAcceptingFeedback) {
      return Response.json(
        {
          success: false,
          feedback: "User is not accepting feedbacks",
        },
        { status: 401 }
      );
    }
    const stats = {
        positive: 0,
        negative: 0,
        neutral: 0,
      };
    const result = sentiment.analyze(content);
    let sentimentLabel: "Positive" | "Negative" | "Neutral";
    if (result.score > 0) {
      stats.positive++;
      sentimentLabel = "Positive";
    } else if (result.score < 0) {
      stats.negative++;
      sentimentLabel = "Negative";
    } else {
      stats.neutral++;
      sentimentLabel = "Neutral";
    }
    const newFeedback = { content, dateCreated: new Date(), sentiment: sentimentLabel };
    user.feedbacks.push(newFeedback as Feedback);
    await user.save();
    return Response.json(
      {
        success: true,
        feedback: "Feedback sent succesfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        feedback: "Error sending feedback",
      },
      { status: 500 }
    );
  }
}
