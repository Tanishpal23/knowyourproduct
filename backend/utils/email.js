const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (to, otp) => {
  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #4f46e5, #0d9488); padding: 32px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 800;">KnowYourProduct</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Password Reset Request</p>
      </div>
      <div style="padding: 32px;">
        <p style="color: #334155; margin: 0 0 16px; font-size: 15px;">You requested to reset your password. Use the OTP below — it expires in <strong>10 minutes</strong>.</p>
        <div style="background: white; border: 2px solid #e0e7ff; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="color: #6366f1; font-size: 42px; font-weight: 900; letter-spacing: 12px; margin: 0;">${otp}</p>
        </div>
        <p style="color: #64748b; font-size: 13px; margin: 0;">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
      </div>
      <div style="background: #f1f5f9; padding: 16px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2026 KnowYourProduct · For educational awareness only</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `KnowYourProduct <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your OTP: ${otp} — KnowYourProduct Password Reset`,
    html,
  });
};

module.exports = { sendOTPEmail };
