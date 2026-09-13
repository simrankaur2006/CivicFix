import Complaint from "../models/Complaint.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { analyzeImage } from "../services/aiService.js";
import { findPossibleDuplicate } from "../services/duplicateService.js";
import { generateComplaintId } from "../utils/generateComplaintId.js";
import { notify } from "../services/notificationService.js";
import {
  CATEGORY_DEPARTMENT_MAP,
  SEVERITY_PRIORITY_MAP,
} from "../config/categories.js";

export const analyzeOnly = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Image is required" });
    const result = await analyzeImage(req.file.buffer, req.file.originalname);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const checkDuplicateOnly = async (req, res, next) => {
  try {
    const { category, latitude, longitude, description } = req.body;
    const dup = await findPossibleDuplicate({
      category,
      latitude: Number(latitude),
      longitude: Number(longitude),
      description,
    });
    if (!dup) return res.json({ duplicate: false });
    res.json({
      duplicate: true,
      complaint: {
        complaintId: dup.complaint.complaintId,
        category: dup.complaint.category,
        status: dup.complaint.status,
        imageUrl: dup.complaint.imageUrl,
        distance: dup.distance,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, latitude, longitude, address, category: manualCategory, force } =
      req.body;

    if (!req.file) return res.status(400).json({ error: "Image is required" });

    const imageUrl = await uploadToCloudinary(req.file.buffer, "civicfix/complaints");

    let aiResult;
    try {
      aiResult = await analyzeImage(req.file.buffer, req.file.originalname);
    } catch (e) {
      aiResult = {
        category: "Other",
        confidence: 0.5,
        severity: "Low",
        description: "AI service unavailable, defaulted to manual review.",
      };
    }

    const category = manualCategory || aiResult.category;
    const severity = aiResult.severity || "Low";
    const department = CATEGORY_DEPARTMENT_MAP[category] || "General";
    const priority = SEVERITY_PRIORITY_MAP[severity] || "P4";

    if (force !== "true") {
      const dup = await findPossibleDuplicate({
        category,
        latitude: Number(latitude),
        longitude: Number(longitude),
        description,
      });
      if (dup) {
        return res.status(409).json({
          duplicate: true,
          complaint: {
            complaintId: dup.complaint.complaintId,
            category: dup.complaint.category,
            status: dup.complaint.status,
            imageUrl: dup.complaint.imageUrl,
            distance: dup.distance,
          },
        });
      }
    }

    const complaintId = await generateComplaintId();

    const complaint = await Complaint.create({
      complaintId,
      clerkUserId: req.dbUser.clerkUserId,
      title,
      description,
      imageUrl,
      category,
      aiConfidence: aiResult.confidence,
      severity,
      department,
      priority,
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
        address,
      },
      status: "AI Verified",
      aiAnalysis: aiResult,
      timeline: [
        { status: "Submitted", note: "Complaint submitted by citizen" },
        { status: "AI Verified", note: `AI detected ${category} (${severity})` },
      ],
    });

    await notify(
      req.dbUser.clerkUserId,
      complaintId,
      `Your complaint ${complaintId} was submitted and AI-verified.`
    );

    res.status(201).json({ complaint });
  } catch (err) {
    next(err);
  }
};

export const getMyComplaints = async (req, res, next) => {
  try {
    const { category, severity, status, department } = req.query;
    const filter = { clerkUserId: req.dbUser.clerkUserId };
    if (category) filter.category = category;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (department) filter.department = department;

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (err) {
    next(err);
  }
};

export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    if (req.dbUser.role !== "admin" && complaint.clerkUserId !== req.dbUser.clerkUserId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.json({ complaint });
  } catch (err) {
    next(err);
  }
};

export const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    if (complaint.clerkUserId !== req.dbUser.clerkUserId && req.dbUser.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const { title, description } = req.body;
    if (title) complaint.title = title;
    if (description) complaint.description = description;
    await complaint.save();
    res.json({ complaint });
  } catch (err) {
    next(err);
  }
};

export const getAllComplaintsForMap = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({}).select(
      "complaintId category severity status location createdAt"
    );
    res.json({ complaints });
  } catch (err) {
    next(err);
  }
};
