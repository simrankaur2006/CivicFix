import Complaint from "../models/Complaint.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { notify } from "../services/notificationService.js";
import { SEVERITY_PRIORITY_MAP } from "../config/categories.js";

export const getDashboard = async (req, res, next) => {
  try {
    const total = await Complaint.countDocuments();
    const newCount = await Complaint.countDocuments({ status: "Submitted" });
    const highPriority = await Complaint.countDocuments({
      severity: { $in: ["High", "Critical"] },
    });
    const inProgress = await Complaint.countDocuments({ status: "In Progress" });
    const resolved = await Complaint.countDocuments({ status: "Resolved" });

    const byCategory = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const byStatus = await Complaint.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const bySeverity = await Complaint.aggregate([
      { $group: { _id: "$severity", count: { $sum: 1 } } },
    ]);
    const byDepartment = await Complaint.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);

    const overTimeRaw = await Complaint.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const resolvedDocs = await Complaint.find({ status: "Resolved" }).select(
      "createdAt updatedAt"
    );
    let avgResolutionHours = 0;
    if (resolvedDocs.length) {
      const totalHours = resolvedDocs.reduce((sum, c) => {
        return sum + (new Date(c.updatedAt) - new Date(c.createdAt)) / 3600000;
      }, 0);
      avgResolutionHours = Number((totalHours / resolvedDocs.length).toFixed(1));
    }

    res.json({
      cards: { total, newCount, highPriority, inProgress, resolved, avgResolutionHours },
      charts: {
        byCategory: byCategory.map((d) => ({ name: d._id, value: d.count })),
        byStatus: byStatus.map((d) => ({ name: d._id, value: d.count })),
        bySeverity: bySeverity.map((d) => ({ name: d._id, value: d.count })),
        byDepartment: byDepartment.map((d) => ({ name: d._id, value: d.count })),
        overTime: overTimeRaw.map((d) => ({ date: d._id, count: d.count })),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAllComplaints = async (req, res, next) => {
  try {
    const { category, severity, status, department, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (search) {
      filter.$or = [
        { complaintId: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (err) {
    next(err);
  }
};

const pushTimeline = async (complaint, status, note) => {
  complaint.timeline.push({ status, note });
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    complaint.status = status;
    await pushTimeline(complaint, status, note || `Status changed to ${status}`);
    await complaint.save();
    await notify(complaint.clerkUserId, complaint.complaintId, `Status updated: ${status}`);
    res.json({ complaint });
  } catch (err) {
    next(err);
  }
};

export const assignOfficer = async (req, res, next) => {
  try {
    const { officer } = req.body;
    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    complaint.assignedOfficer = officer;
    complaint.status = "Assigned";
    await pushTimeline(complaint, "Assigned", `Assigned to ${officer}`);
    await complaint.save();
    await notify(complaint.clerkUserId, complaint.complaintId, `Complaint assigned to ${officer}`);
    res.json({ complaint });
  } catch (err) {
    next(err);
  }
};

export const changeSeverity = async (req, res, next) => {
  try {
    const { severity } = req.body;
    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    complaint.severity = severity;
    complaint.priority = SEVERITY_PRIORITY_MAP[severity] || complaint.priority;
    await complaint.save();
    res.json({ complaint });
  } catch (err) {
    next(err);
  }
};

export const changeDepartment = async (req, res, next) => {
  try {
    const { department } = req.body;
    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    complaint.department = department;
    await complaint.save();
    res.json({ complaint });
  } catch (err) {
    next(err);
  }
};

export const resolveComplaint = async (req, res, next) => {
  try {
    const { resolutionNote, reject } = req.body;
    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    if (reject === "true") {
      complaint.status = "Rejected";
      complaint.resolutionNote = resolutionNote || "Rejected by admin";
      await pushTimeline(complaint, "Rejected", complaint.resolutionNote);
      await complaint.save();
      await notify(complaint.clerkUserId, complaint.complaintId, "Your complaint was rejected.");
      return res.json({ complaint });
    }

    if (req.file) {
      complaint.resolutionImage = await uploadToCloudinary(
        req.file.buffer,
        "civicfix/resolutions"
      );
    }
    complaint.resolutionNote = resolutionNote || "";
    complaint.status = "Resolved";
    await pushTimeline(complaint, "Resolved", resolutionNote || "Issue resolved");
    await complaint.save();
    await notify(complaint.clerkUserId, complaint.complaintId, "Your complaint has been resolved!");
    res.json({ complaint });
  } catch (err) {
    next(err);
  }
};
