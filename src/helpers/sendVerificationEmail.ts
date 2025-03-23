// import { resend } from "@/lib/resend"
import verificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";

import { Resend } from "resend";

const resend = new Resend("re_VrRJ69qY_QLRLVbQTuuasw7yThkrBE8nT");

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const response = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["codewithjeery@gmail.com"],
      subject: "Anom Feedback | Verification Code",
      //   html: "<p>it works!</p>",
      react: verificationEmail({
        username: username,
        otp: verifyCode,
      }),
    });
    console.log("Resend API Response:", response);
    return {
      success: true,
      feedback: "Verification email sent successfully",
    };
  } catch (emailError) {
    console.error("Error sending verification email", emailError);
    return {
      success: false,
      feedback: "Failed to send verification email",
    };
  }
}
