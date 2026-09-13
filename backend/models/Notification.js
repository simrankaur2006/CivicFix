import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true },
    complaintId: String,
    message: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
