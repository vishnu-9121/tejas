import 'dotenv/config';
import express from "express";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import mongoose from "mongoose";
import http from "http";

import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { initSocket } from "./utils/socket.js";
import { registerAllEventHandlers } from "./events/index.js";
import { corsOptions, securityHeaders, globalLimiter, timeoutHandler } from "./middlewares/security.js";

// Routes
import { authRoutes } from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import { programRoutes } from "./routes/programRoutes.js";
import { admissionsRoutes } from "./routes/admissionsRoutes.js";
import { inquiriesRoutes } from "./routes/inquiriesRoutes.js";
import { blogRoutes } from "./routes/blogRoutes.js";
import { eventsRoutes } from "./routes/eventsRoutes.js";
import { uploadRoutes } from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { courseRoutes } from "./routes/courseRoutes.js";
import { mentorRoutes } from "./routes/mentorRoutes.js";
import { workshopRoutes } from "./routes/workshopRoutes.js";
import { cmsRoutes } from "./routes/cmsRoutes.js";
import { newsletterRoutes } from "./routes/newsletterRoutes.js";
import { galleryRoutes } from "./routes/galleryRoutes.js";
import { testimonialRoutes } from "./routes/testimonialRoutes.js";
import { analyticsRoutes } from "./routes/analyticsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import emailCampaignRoutes from "./routes/emailCampaignRoutes.js";
import backupRoutes from "./routes/backupRoutes.js";
import { configureCloudinary } from "./config/cloudinary.js";

import { seedEnterpriseCMS } from "./scripts/seedEnterpriseCMS.js";
import { seedDefaultSuperAdmin } from "./scripts/seedSuperAdmin.js";

// Initialize Cloudinary
configureCloudinary();

// Initialize Database Connection & Auto-Seed CMS & Super Admin
connectDB().then(() => {
  seedEnterpriseCMS();
  seedDefaultSuperAdmin();
});

const app = express();

// 1. Security & Headers Middleware
app.use(timeoutHandler); // Must be very early in the stack
app.use(securityHeaders);
app.use(corsOptions);
app.use(globalLimiter);

// Prevent Mongo injection
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Prevent HTTP Param Pollution
app.use(hpp());

// 2. Logging & Compression
if (process.env.NODE_ENV !== "test") {
  // Use Morgan to pipe HTTP requests into Winston logger
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}
app.use(compression());

// 3. Body Parsers & Cookie Parser
app.use(express.json({ limit: "100kb" })); // Limit payload size to 100kb to prevent DoS
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

// 4. API Routes
app.get("/", (req, res) => {
  res.json({ message: "Tejas Academy API Gateway - Active (v1.0)" });
});

// API Gateway Root Info
app.get(['/api/v1', '/api/v1/'], (req, res) => {
  res.json({
    status: 'success',
    message: 'Tejas Academy API Gateway v1.0 Active',
    health: '/api/v1/health',
    documentation: 'https://unlocktejas.com/api/v1'
  });
});

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const status = dbState === 1 ? 'Healthy' : 'Degraded';
  const statusCode = dbState === 1 ? 200 : 503;

  res.status(statusCode).json({
    status,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: dbState === 1 ? 'connected' : 'disconnected',
      stateCode: dbState
    }
  });
});

// Register Versioned API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);
app.use("/api/v1/programs", programRoutes);
app.use("/api/v1/admissions", admissionsRoutes);
app.use("/api/v1/inquiries", inquiriesRoutes);
app.use("/api/v1/insights", blogRoutes);
app.use('/api/v1/events', eventsRoutes);
app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/users', userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/mentors", mentorRoutes);
app.use("/api/v1/workshops", workshopRoutes);
app.use("/api/v1/cms", cmsRoutes);
app.use("/api/v1/newsletter", newsletterRoutes);
app.use("/api/v1/gallery", galleryRoutes);
app.use("/api/v1/testimonials", testimonialRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/activity", activityRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/certificates", certificateRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/leads", leadRoutes);
app.use("/api/v1/campaigns", emailCampaignRoutes);
app.use("/api/v1/backups", backupRoutes);

// 404 Fallback for undefined API routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// 5. Global Error Handler (Must be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize WebSockets
initSocket(server);

// Register all Event Bus listeners
registerAllEventHandlers();

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export { app, server };

