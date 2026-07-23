import Application from "../models/Application.js";
import { AppError } from "../middlewares/errorHandler.js";
import { HTTP_STATUS } from "../constants/index.js";

export const createApplication = async (data) => {
  const application = await Application.create(data);
  return application;
};

export const getAllApplications = async (page = 1, limit = 10, status) => {
  const query = status ? { status } : {};
  const skip = (page - 1) * limit;

  const total = await Application.countDocuments(query);
  const applications = await Application.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean(); // Lean for performance

  return {
    applications,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateApplicationStatus = async (id, status, reviewerComments) => {
  const application = await Application.findById(id);
  if (!application) {
    throw new AppError("Application not found", HTTP_STATUS.NOT_FOUND);
  }

  application.status = status;
  if (reviewerComments) {
    application.reviewerComments = reviewerComments;
  }

  await application.save();
  return application;
};
