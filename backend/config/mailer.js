import nodemailer from "nodemailer";
import { logger } from "../utils/logger.js";

// Create a singleton transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER || "dummy_user",
    pass: process.env.SMTP_PASS || "dummy_pass",
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    logger.error(`Nodemailer configuration error: ${error.message}`);
  } else {
    logger.info("Nodemailer is ready to take our messages");
  }
});
