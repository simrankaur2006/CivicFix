import Notification from "../models/Notification.js";

export const notify = async (clerkUserId, complaintId, message) => {
  return Notification.create({ clerkUserId, complaintId, message });
};
