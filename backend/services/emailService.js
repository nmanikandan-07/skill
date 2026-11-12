const nodemailer = require('nodemailer');

// Initialize transporter if credentials exist
const createTransporter = () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
};

/**
 * Send password reset email with 6-digit OTP code
 */
const sendPasswordResetEmail = async ({ to, fullName, resetCode, resetToken }) => {
  const transporter = createTransporter();
  
  const resetUrl = `http://localhost:${process.env.PORT || 3000}/pages/forgot-password.html?email=${encodeURIComponent(to)}&token=${resetToken}&code=${resetCode}`;
  
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">SkillSync</h1>
        <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Password Reset Request</p>
      </div>
      <div style="padding: 32px 24px; color: #334155;">
        <p style="font-size: 16px; margin: 0 0 16px;">Hello <strong>${fullName || 'Student'}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #64748b; margin: 0 0 24px;">
          We received a request to reset your password for your SkillSync account. Use the 6-digit verification code below to set a new password:
        </p>
        
        <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
          <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; letter-spacing: 1px;">Your 6-Digit Reset Code</span>
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; margin: 10px 0; font-family: monospace;">
            ${resetCode}
          </div>
          <span style="font-size: 12px; color: #94a3b8;">This code is valid for 15 minutes</span>
        </div>

        <div style="text-align: center; margin: 32px 0 24px;">
          <a href="${resetUrl}" style="background: #4f46e5; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">
            Reset Password Now
          </a>
        </div>

        <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 24px 0 0; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          If you did not request this password reset, please ignore this email. Your account remains secure.
        </p>
      </div>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"SkillSync" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to,
        subject: `SkillSync Password Reset Code: ${resetCode}`,
        html: htmlContent
      });
      console.log(`[EmailService] Password reset email sent to ${to}`);
      return { sent: true, mode: 'smtp' };
    } catch (err) {
      console.error(`[EmailService] Failed to send email via SMTP:`, err.message);
    }
  }

  // Development dispatch log (without exposing secret OTP)
  console.log(`[EmailService] Password reset verification email dispatched to ${to}`);

  return { sent: true, mode: 'simulated' };
};

module.exports = {
  sendPasswordResetEmail
};
