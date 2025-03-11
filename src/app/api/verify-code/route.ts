import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await connectDB();

  try {
    // Parse request body
    const { username, code } = await request.json();

    if (!username || !code) {
      return Response.json(
        { success: false, feedback: "Username and code are required" },
        { status: 400 }
      );
    }

    // Decode username
    const decodedUsername = decodeURIComponent(username);

    // Find user
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, feedback: "User not found" },
        { status: 400 }
      );
    }

    if (user.isVerified) {
      return Response.json(
        { success: false, feedback: "User already verified" },
        { status: 400 }
      );
    }

    // Validate code
    const isCodeValid = user.verifyCode === code;
    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();

    if (isCodeValid && !isCodeExpired) {
      user.isVerified = true;
      await user.save();
      
      return Response.json(
        { success: true, feedback: "User is verified successfully" },
        { status: 201 }
      );
    }

    return Response.json(
      {
        success: false,
        feedback: isCodeExpired ? "Code has expired" : "Code is invalid",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);

    return Response.json(
      { success: false, feedback: "Error verifying user" },
      { status: 500 }
    );
  }
}
