import nodemailer from 'nodemailer';
import { logger } from './logger.js';

/**
 * Enterprise Email Service using Nodemailer
 */
export const sendEmail = async (options) => {
  try {
    // Determine which transporter to use. In production, use SendGrid/AWS SES.
    // Here we use standard SMTP. If none configured, fallback to Ethereal (for testing).
    
    let transporterConfig = {
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    // If missing SMTP credentials, mock it for development
    if (!process.env.SMTP_USER) {
      logger.warn('[!] SMTP credentials not found. Emails will be mocked via console log.');
      console.log('--- MOCK EMAIL ---');
      console.log(`To: ${options.email}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Message: ${options.message}`);
      console.log('------------------');
      return true;
    }

    const transporter = nodemailer.createTransport(transporterConfig);

    const message = {
      from: `${process.env.FROM_NAME || 'Tejas Academy'} <${process.env.FROM_EMAIL || 'noreply@tejasacademy.edu'}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    };

    const info = await transporter.sendMail(message);
    logger.info(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    return false;
  }
};
