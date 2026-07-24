import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Can be null if guest applying before account creation
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program", // Reference to future Program model
      required: false, // Make false for now to avoid population errors
    },
    programName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Interview Scheduled", "Accepted", "Rejected"],
      default: "Pending",
    },
    documents: [
      {
        name: String,
        url: String, // Cloudinary URL
        type: String, // e.g. 'transcript', 'resume'
      },
    ],
    reviewerComments: {
      type: String,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ status: 1 });
applicationSchema.index({ applicantId: 1 });
applicationSchema.index({ programId: 1 });

export const Application = mongoose.model("Application", applicationSchema);
export default Application;
