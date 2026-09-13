import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Department from "../models/Department.js";
import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { CATEGORY_DEPARTMENT_MAP, SEVERITY_PRIORITY_MAP } from "../config/categories.js";

const CATEGORIES = Object.keys(CATEGORY_DEPARTMENT_MAP);
const SEVERITIES = ["Low", "Medium", "High", "Critical"];
const STATUSES = ["Submitted", "AI Verified", "Assigned", "In Progress", "Resolved", "Rejected"];

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1584448097639-79e5b0a3d6b4?w=600",
  "https://images.unsplash.com/photo-1590496793907-93c8bd0d51c1?w=600",
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600",
];

const randOf = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randCoord = () => ({
  latitude: 26.8467 + (Math.random() - 0.5) * 0.05,
  longitude: 80.9462 + (Math.random() - 0.5) * 0.05,
});

const run = async () => {
  await connectDB();

  await Department.deleteMany({});
  await Complaint.deleteMany({});

  const deptNames = [...new Set(Object.values(CATEGORY_DEPARTMENT_MAP))];
  for (const name of deptNames) {
    const categories = CATEGORIES.filter((c) => CATEGORY_DEPARTMENT_MAP[c] === name);
    await Department.create({ name, description: `${name} department`, categories, active: true });
  }

  const demoUserId = process.env.DEMO_CLERK_USER_ID || "demo_citizen_user";
  await User.findOneAndUpdate(
    { clerkUserId: demoUserId },
    { clerkUserId: demoUserId, name: "Demo Citizen", email: "citizen@demo.com", role: "citizen" },
    { upsert: true }
  );

  const titles = {
    "Pothole": "Large pothole on main road",
    "Damaged Road": "Road surface severely cracked",
    "Garbage Overflow": "Garbage bin overflowing for days",
    "Broken Streetlight": "Streetlight not working at night",
    "Water Leakage": "Continuous water leakage from pipe",
    "Open Drain": "Open drain without cover, safety hazard",
    "Fallen Tree": "Tree fallen after storm blocking path",
    "Damaged Public Property": "Public bench/property damaged",
    "Other": "Miscellaneous civic issue reported",
  };

  const complaints = [];
  for (let i = 0; i < 18; i++) {
    const category = randOf(CATEGORIES);
    const severity = randOf(SEVERITIES);
    const status = randOf(STATUSES);
    const coords = randCoord();
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000);

    complaints.push({
      complaintId: `CF-2026-${String(1284 + i).padStart(6, "0")}`,
      clerkUserId: demoUserId,
      title: titles[category],
      description: `${titles[category]}. Reported near locality, needs attention from ${CATEGORY_DEPARTMENT_MAP[category]}.`,
      imageUrl: randOf(SAMPLE_IMAGES),
      category,
      aiConfidence: Number((0.75 + Math.random() * 0.24).toFixed(2)),
      severity,
      department: CATEGORY_DEPARTMENT_MAP[category],
      priority: SEVERITY_PRIORITY_MAP[severity],
      location: { ...coords, address: "Sample Locality, Lucknow, UP" },
      status,
      assignedOfficer: status === "Submitted" ? "" : "Officer " + randOf(["A. Sharma", "R. Verma", "S. Khan"]),
      aiAnalysis: {
        category,
        confidence: Number((0.75 + Math.random() * 0.24).toFixed(2)),
        severity,
        description: `AI detected ${category.toLowerCase()} with ${severity.toLowerCase()} severity.`,
      },
      resolutionImage: status === "Resolved" ? randOf(SAMPLE_IMAGES) : "",
      resolutionNote: status === "Resolved" ? "Issue fixed by field team." : "",
      timeline: [{ status: "Submitted", note: "Complaint submitted", at: createdAt }],
      createdAt,
      updatedAt: createdAt,
    });
  }

  await Complaint.insertMany(complaints);
  console.log(`Seeded ${deptNames.length} departments and ${complaints.length} complaints.`);
  console.log(`Demo citizen clerkUserId: ${demoUserId}`);
  console.log("To promote a user to admin set ADMIN_CLERK_USER_ID in .env and restart the server once.");
  await mongoose.disconnect();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
