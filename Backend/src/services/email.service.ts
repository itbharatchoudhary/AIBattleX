import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const emailFrom = process.env.EMAIL_FROM || "no-reply@battlearena.local";

const transporter = smtpHost
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
    })
  : null;

export async function sendOtpEmail(email: string, otp: string) {
  const subject = "Battle Arena Email Verification";
  const text = `Your Battle Arena verification code is: ${otp}. It expires in 10 minutes.`;
  const html = `
    <div style="font-family: sans-serif; line-height: 1.5; color: #111;">
      <h2>Battle Arena Email Verification</h2>
      <p>Your verification code is:</p>
      <p style="font-size: 1.4rem; font-weight: 700;">${otp}</p>
      <p>This code expires in 10 minutes.</p>
    </div>
  `;

  if (!transporter) {
    console.log("[Email OTP] SMTP not configured. OTP code:", otp, "for email:", email);
    return;
  }

  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject,
    text,
    html,
  });
}
