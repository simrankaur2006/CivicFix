import Complaint from "../models/Complaint.js";

export const generateComplaintId = async () => {
  const year = new Date().getFullYear();
  const count = await Complaint.countDocuments({
    complaintId: { $regex: `^CF-${year}-` },
  });
  const seq = String(count + 1284).padStart(6, "0").slice(-6);
  return `CF-${year}-${seq}`;
};
