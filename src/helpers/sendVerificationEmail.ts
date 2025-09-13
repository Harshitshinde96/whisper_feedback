import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Use Resend's test domain or your verified domain
      to: email,
      subject: "Whisper Feedback | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if (error) {
      console.error("Resend API error:", error);
      return {
        success: false,
        message: "Failed to send verification email",
        isAcceptingMessages: false,
      };
    }

    return {
      success: true,
      message: "Verification email sent successfully",
      isAcceptingMessages: true,
    };
  } catch (emailError) {
    console.error("Error Sending verification email", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
      isAcceptingMessages: false,
    };
  }
}
