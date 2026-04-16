import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const emailFrom = process.env.EMAIL_FROM || "no-reply@battlearena.local";

const transporter = smtpHost?.includes("gmail.com")
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
  : smtpHost
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
    })
  : null;

export async function sendOtpEmail(email: string, otp: string) {
  const subject = "Verification Code for AIBattleX";
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your email</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #e2e8f0;
          background-color: #0f172a;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #1e293b;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .header {
          background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.025em;
        }
        .content {
          padding: 40px;
          text-align: center;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 24px;
          color: #f1f5f9;
        }
        .description {
          font-size: 16px;
          color: #94a3b8;
          margin-bottom: 32px;
        }
        .otp-container {
          background: #334155;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 32px;
          display: inline-block;
          min-width: 200px;
        }
        .otp-code {
          font-size: 42px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 8px;
          margin: 0;
        }
        .expiry {
          font-size: 14px;
          color: #64748b;
          margin-top: 16px;
        }
        .footer {
          padding: 30px;
          text-align: center;
          border-top: 1px solid #334155;
          color: #64748b;
          font-size: 14px;
        }
        .social-links {
          margin-top: 16px;
        }
        .social-links a {
          color: #7c3aed;
          text-decoration: none;
          margin: 0 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚔️ AIBattleX</h1>
        </div>
        <div class="content">
          <div class="greeting">Verify your email address</div>
          <div class="description">
            To complete your registration, please use the following verification code.
          </div>
          <div class="otp-container">
            <div class="otp-code">${otp}</div>
            <div class="expiry">Valid for 10 minutes</div>
          </div>
          <div class="description">
            If you didn't request this code, you can safely ignore this email.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} AIBattleX. All rights reserved.<br>
          Developed with ❤️ by the AIBattleX Team
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    console.error("[Email Service] ERROR: SMTP not configured. Missing environment variables.");
    console.log("[Email Service] LOGGING OTP FOR DEV: ", otp);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"AIBattleX" <${emailFrom}>`,
      to: email,
      subject: subject,
      text: `Your AIBattleX verification code is: ${otp}`,
      html: html,
    });
    console.log(`[Email Service] Success: Message sent to ${email} (ID: ${info.messageId})`);
  } catch (err: any) {
    console.error(`\n==============================================`);
    console.error(`[Email Service] FAILED TO SEND SECURE EMAIL`);
    console.error(`[Email Service] Error: ${err.message}`);
    console.error(`[Email Service] TO FIX: Make sure your .env has a valid Gmail App Password.`);
    console.error(`[Email Service] FALLBACK OTP: ${otp}`);
    console.error(`==============================================\n`);
  }
}

