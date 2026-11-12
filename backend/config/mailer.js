const nodemailer = require("nodemailer");

/**
 * Create Gmail OAuth2 or SMTP transporter
 */
const getTransporter = () => {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  // 1. Gmail OAuth2
  if (user && clientId && clientSecret && refreshToken) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: user,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
      },
    });
  }

  // 2. Gmail / SMTP with App Password
  if (user && pass) {
    const host = process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '587');
    const secure = process.env.EMAIL_SECURE === 'true' || port === 465;

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass
      }
    });
  }

  return null;
};

/**
 * Verify mail server connection on startup
 */
const verifyMailer = async () => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(
      "[Mailer] Note: Set EMAIL_USER + (GOOGLE_CLIENT_ID & GOOGLE_REFRESH_TOKEN OR EMAIL_PASS) in .env for live Gmail delivery"
    );
    return false;
  }

  try {
    await transporter.verify();
    console.log("✅ [Mailer] Mail server connected successfully");
    return true;
  } catch (error) {
    console.error("❌ [Mailer] Mail server connection error:", error.message);
    return false;
  }
};

/**
 * Send password reset OTP email
 */
const sendOtpEmail = async ({
  to,
  fullName,
  otp,
}) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[Mailer] Mail credentials not configured in .env. (Email to ${to} queued internally)`);
    return { success: true, simulated: true };
  }

  const fromAddress =
    process.env.EMAIL_FROM ||
    `SkillSync <${process.env.EMAIL_USER || 'no-reply@skillsync.edu'}>`;

  const html = `
    <div
      style="
        font-family: -apple-system, BlinkMacSystemFont,
        'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        max-width: 520px;
        margin: 0 auto;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      "
    >

      <!-- Header -->
      <div
        style="
          background: #0f172a;
          padding: 24px;
          text-align: center;
          border-bottom: 3px solid #6366f1;
        "
      >

        <h1
          style="
            color: #ffffff;
            font-size: 22px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
          "
        >
          SkillSync
        </h1>

        <p
          style="
            color: #94a3b8;
            font-size: 13px;
            margin: 4px 0 0 0;
          "
        >
          Student Skill Exchange Platform
        </p>

      </div>

      <!-- Content -->
      <div
        style="
          padding: 32px 28px;
          color: #1e293b;
        "
      >

        <h2
          style="
            font-size: 18px;
            font-weight: 600;
            color: #0f172a;
            margin-top: 0;
          "
        >
          Reset Your Password
        </h2>

        <p
          style="
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
            margin: 12px 0 20px 0;
          "
        >

          Hello ${
            fullName
              ? `<strong>${fullName}</strong>`
              : "Student"
          },<br><br>

          We received a request to reset your
          SkillSync password.

          Use the verification code below to continue securely.

        </p>

        <!-- OTP -->
        <div
          style="
            background: #f8fafc;
            border: 1.5px dashed #6366f1;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            margin: 24px 0;
          "
        >

          <span
            style="
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              color: #64748b;
              letter-spacing: 1px;
              display: block;
              margin-bottom: 8px;
            "
          >
            Your Verification Code
          </span>

          <div
            style="
              font-size: 34px;
              font-weight: 800;
              letter-spacing: 8px;
              color: #4f46e5;
              font-family: monospace;
            "
          >
            ${otp}
          </div>

          <span
            style="
              font-size: 12px;
              color: #64748b;
              display: block;
              margin-top: 8px;
            "
          >
            This code expires in
            <strong>10 minutes</strong>.
          </span>

        </div>

        <p
          style="
            font-size: 13px;
            color: #64748b;
            line-height: 1.5;
            margin: 24px 0 0 0;
          "
        >
          If you did not request a password reset,
          you can safely ignore this email.
        </p>

        <p
          style="
            font-size: 12px;
            color: #dc2626;
            margin: 12px 0 0 0;
            font-weight: 500;
          "
        >
          Never share this verification code with anyone.
        </p>

      </div>

      <!-- Footer -->
      <div
        style="
          background: #f8fafc;
          padding: 16px 24px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
          border-top: 1px solid #f1f5f9;
        "
      >
        SkillSync • Student Skill Exchange Platform
      </div>

    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: fromAddress,

      to: to,

      subject:
        "SkillSync Password Reset Verification Code",

      html: html,
    });

    console.log(
      `[Mailer] Password reset email accepted for ${to}`
    );

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(
      "[Mailer] Verification email failed:",
      error.message
    );

    throw error;
  }
};

module.exports = {
  getTransporter,
  verifyMailer,
  sendOtpEmail,
};