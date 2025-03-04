import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import UserModel, { User } from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function DELETE(request: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        feedback: "User not authenticated. Please sign in !!",
      },
      { status: 401 } // Use 401 for unauthorized access
    );
  }

  const { feedbackid } = await request.json();
  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { feedbacks: { _id: feedbackid } } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        {
          feedback: "Feedback not found or already deleted",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        feedback: "Feedback deleted",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return NextResponse.json(
      {
        feedback: "Error deleting feedback",
        success: false,
      },
      { status: 500 }
    );
  }
}
