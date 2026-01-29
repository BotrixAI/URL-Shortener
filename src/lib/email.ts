import { Resend } from "resend";

const getEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} not defined`);
  }
  return value;
};

export async function sendResetEmail(email: string, token: string) {
  const resendApiKey = getEnv("RESEND_API_KEY");
  const emailFrom = getEnv("EMAIL_FROM");
  const baseUrl = getEnv("NEXTAUTH_URL");

  const resend = new Resend(resendApiKey);
  const resetUrl = new URL("/reset-password", baseUrl);
  resetUrl.searchParams.set("token", token);

  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p>
        <a href="${resetUrl.toString()}">
          Click here to reset your password
        </a>
      </p>
      <p>This link expires in 15 minutes.</p>
    `,
  });
}
