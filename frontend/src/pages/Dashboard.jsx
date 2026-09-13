import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Clock, Loader2, CheckCircle2, Plus } from "lucide-react";
import { useApi } from "../hooks/useApi.js";
import StatCard from "../components/StatCard.jsx";
import ComplaintCard from "../components/ComplaintCard.jsx";
import MapView from "../components/MapView.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Dashboard() {
  const api = useApi();
  const [complaints, setComplaints] = useState(null);
  const [mapComplaints, setMapComplaints] = useState([]);

  useEffect(() => {
    api.get("/api/complaints").then((r) => setComplaints(r.data.complaints)).catch(() => setComplaints([]));
    api.get("/api/complaints/map/all").then((r) => setMapComplaints(r.data.complaints)).catch(() => {});
  }, []);

  if (!complaints) return <LoadingSpinner label="Loading dashboard..." />;

  const counts = {
    total: complaints.length,
    pending: complaints.filter((c) => ["Submitted", "AI Verified"].includes(c.status)).length,
    inProgress: complaints.filter((c) => ["Assigned", "In Progress"].includes(c.status)).length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/report" className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Report Issue</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Complaints" value={counts.total} icon={FileText} />
        <StatCard label="Pending" value={counts.pending} icon={Clock} accent="text-amber-600" />
        <StatCard label="In Progress" value={counts.inProgress} icon={Loader2} accent="text-purple-600" />
        <StatCard label="Resolved" value={counts.resolved} icon={CheckCircle2} accent="text-green-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-3">Recent Complaints</h2>
          {complaints.length === 0 ? (
            <EmptyState icon={FileText} title="No complaints yet" subtitle="Report your first civic issue." />
          ) : (
            <div className="space-y-3">
              {complaints.slice(0, 4).map((c) => <ComplaintCard key={c.complaintId} complaint={c} />)}
            </div>
          )}
        </div>
        <div>
          <h2 className="font-semibold mb-3">Map Preview</h2>
          <MapView complaints={mapComplaints} height="360px" />
        </div>
      </div>
    </div>
  );
}
