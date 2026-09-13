export const CATEGORIES = [
  "Pothole",
  "Damaged Road",
  "Garbage Overflow",
  "Broken Streetlight",
  "Water Leakage",
  "Open Drain",
  "Fallen Tree",
  "Damaged Public Property",
  "Other",
];

export const SEVERITIES = ["Low", "Medium", "High", "Critical"];

export const STATUSES = [
  "Submitted",
  "AI Verified",
  "Assigned",
  "In Progress",
  "Resolved",
  "Rejected",
];

export const STATUS_COLORS = {
  Submitted: "bg-slate-100 text-slate-700",
  "AI Verified": "bg-blue-100 text-blue-700",
  Assigned: "bg-purple-100 text-purple-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Resolved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export const SEVERITY_COLORS = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};
