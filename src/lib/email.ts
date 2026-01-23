import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "no-reply@yourdomain.com",
    to: email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p>
        <a href="${resetUrl}">
          Click here to reset your password
        </a>
      </p>
      <p>This link expires in 15 minutes.</p>
    `,
  });
}
