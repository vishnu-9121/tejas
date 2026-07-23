import Inquiry from "../models/Inquiry.js";
import { AppError } from "../middlewares/errorHandler.js";
import { HTTP_STATUS } from "../constants/index.js";

export const createInquiry = async (data) => {
  const inquiry = await Inquiry.create(data);
  return inquiry;
};

export const getAllInquiries = async (page = 1, limit = 10, status) => {
  const query = status ? { status } : {};
  const skip = (page - 1) * limit;

  const total = await Inquiry.countDocuments(query);
  const inquiries = await Inquiry.find(query)
    .populate("assignedTo", "firstName lastName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    inquiries,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const resolveInquiry = async (id, adminNotes, userId) => {
  const inquiry = await Inquiry.findById(id);
  if (!inquiry) {
    throw new AppError("Inquiry not found", HTTP_STATUS.NOT_FOUND);
  }

  inquiry.status = "Resolved";
  inquiry.assignedTo = userId;
  if (adminNotes) {
    inquiry.adminNotes = adminNotes;
  }

  await inquiry.save();
  return inquiry;
};
