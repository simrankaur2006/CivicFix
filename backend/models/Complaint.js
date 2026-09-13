import mongoose from "mongoose";

const timelineEntrySchema = new mongoose.Schema(
  {
    status: String,
    note: String,
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, unique: true },
    clerkUserId: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    imageUrl: String,
    category: { type: String, required: true },
    aiConfidence: Number,
    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low",
    },
    department: String,
    priority: String,
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    status: {
      type: String,
      enum: [
        "Submitted",
        "AI Verified",
        "Assigned",
        "In Progress",
        "Resolved",
        "Rejected",
      ],
      default: "Submitted",
    },
    assignedOfficer: { type: String, default: "" },
    duplicateOf: { type: String, default: null },
    aiAnalysis: {
      category: String,
      confidence: Number,
      severity: String,
      description: String,
    },
    resolutionImage: String,
    resolutionNote: String,
    timeline: [timelineEntrySchema],
  },
  { timestamps: true }
);

complaintSchema.index({ "location.latitude": 1, "location.longitude": 1 });

export default mongoose.model("Complaint", complaintSchema);
