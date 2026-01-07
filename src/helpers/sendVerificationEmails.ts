import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", 
      to: email,
      subject: "Mystery Message Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    console.log("Resend API success:", response);

    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError: any) {
    console.error(" Resend API error:", JSON.stringify(emailError, null, 2));
    return { success: false, message: "Failed to send verification email." };
  }
}
