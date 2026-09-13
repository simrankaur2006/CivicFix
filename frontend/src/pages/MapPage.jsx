import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi.js";
import MapView from "../components/MapView.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const FILTERS = ["All", "High Priority", "Pending", "In Progress", "Resolved"];

export default function MapPage() {
  const api = useApi();
  const [complaints, setComplaints] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api.get("/api/complaints/map/all").then((r) => setComplaints(r.data.complaints));
  }, []);

  if (!complaints) return <LoadingSpinner />;

  const filtered = complaints.filter((c) => {
    if (filter === "All") return true;
    if (filter === "High Priority") return ["High", "Critical"].includes(c.severity);
    if (filter === "Pending") return ["Submitted", "AI Verified"].includes(c.status);
    if (filter === "In Progress") return ["Assigned", "In Progress"].includes(c.status);
    if (filter === "Resolved") return c.status === "Resolved";
    return true;
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Complaint Map</h1>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
              filter === f ? "bg-primary-500 text-white border-primary-500" : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <MapView complaints={filtered} height="560px" />
    </div>
  );
}
