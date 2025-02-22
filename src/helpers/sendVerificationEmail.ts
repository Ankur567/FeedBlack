import { resend } from "@/lib/resend"
import verificationEmail from "../../emails/verificationEmail"
import { ApiResponse } from "@/types/apiResponse"
import VerificationEmail from "../../emails/verificationEmail";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anom Feedback | Verification Code',
            react: verificationEmail({
                username: username,
                otp: verifyCode
            }),
          });
        return {
            success: true,
            feedback: "Verification email sent successfully"
        }
    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return {
            success: false,
            feedback: "Failed to send verification email"
        }
    }
}