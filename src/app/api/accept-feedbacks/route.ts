import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  await connectDB();

  // we want to extract the user details from the session
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        feedback: "User not authenticated. Please sign in !!",
      },
      { status: 404 }
    );
  }

  const userId = user._id;
  const { acceptfeedbacks } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingFeedback: acceptfeedbacks },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          feedback:
            "Feedback acceptance status could not be updated as user not found",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        feedback: "Feedback acceptance status updated successfully",
        updatedUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error)
    return Response.json(
      {
        success: false,
        feedback: "Error updating user status to accept feedbacks",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDB();

  // we want to extract the user details from the session
  const session = await getServerSession(authOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        feedback: "User not authenticated. Please sign in !!",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          feedback: "Failed to find user",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingFeedback: foundUser.isAcceptingFeedback,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        feedback: "Error retrieving feedback acceptance status",
      },
      { status: 500 }
    );
  }
}
