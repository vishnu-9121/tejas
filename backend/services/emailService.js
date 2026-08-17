import { transporter } from "../config/mailer.js";
import { logger } from "../utils/logger.js";

/**
 * Generic email sending function
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body content
 */
export const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `Tejas Academy <${process.env.SMTP_FROM_EMAIL || "support@unlocktejas.com"}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Error sending email to ${to}: ${error.message}`);
    return false; // Fail silently to not break the API chain, but log the error
  }
};

/**
 * Send Welcome/OTP Email
 */
export const sendWelcomeEmail = async (user, otp) => {
  const subject = "Welcome to Tejas Academy - Verification Required";
  const html = `
    <h2>Welcome ${user.firstName}!</h2>
    <p>Thank you for registering at Tejas Academy of Excellence.</p>
    <p>Your verification code is: <strong>${otp}</strong></p>
    <p>Please enter this code on the verification page to activate your account.</p>
  `;
  return await sendEmail(user.email, subject, html);
};

/**
 * Send Password Reset Email
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const subject = "Tejas Academy - Password Reset Request";
  const html = `
    <h2>Password Reset</h2>
    <p>You requested a password reset. Click the link below to reset your password.</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `;
  return await sendEmail(user.email, subject, html);
};
