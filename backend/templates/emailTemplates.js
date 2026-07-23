export const getWelcomeEmailTemplate = (name) => `
<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
  <h2 style="color: #4F46E5;">Welcome to Tejas Academy of Excellence, ${name}!</h2>
  <p>We are thrilled to have you join our community of leaders and innovators.</p>
  <p>If you have any questions, feel free to reply to this email.</p>
  <br/>
  <p>Best regards,</p>
  <p><strong>The Tejas Academy Team</strong></p>
</div>
`;

export const getPasswordResetTemplate = (name, otp) => `
<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
  <h2 style="color: #4F46E5;">Password Reset Request</h2>
  <p>Hi ${name},</p>
  <p>We received a request to reset your password. Here is your One Time Password (OTP):</p>
  <h1 style="background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 5px;">${otp}</h1>
  <p>This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
  <br/>
  <p>Best regards,</p>
  <p><strong>The Tejas Academy Security Team</strong></p>
</div>
`;
