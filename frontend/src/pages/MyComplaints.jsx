import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { useApi } from "../hooks/useApi.js";
import ComplaintCard from "../components/ComplaintCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { CATEGORIES, SEVERITIES, STATUSES } from "../utils/constants.js";

export default function MyComplaints() {
  const api = useApi();
  const [complaints, setComplaints] = useState(null);
  const [filters, setFilters] = useState({ category: "", severity: "", status: "" });

  const load = async () => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    const { data } = await api.get("/api/complaints", { params });
    setComplaints(data.complaints);
  };

  useEffect(() => { load(); }, [filters]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">My Complaints</h1>
      <div className="flex flex-wrap gap-3">
        <select className="input w-auto" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input w-auto" value={filters.severity} onChange={(e) => setFilters({ ...filters, severity: e.target.value })}>
          <option value="">All Severities</option>
          {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input w-auto" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {!complaints ? (
        <LoadingSpinner />
      ) : complaints.length === 0 ? (
        <EmptyState icon={FileText} title="No complaints found" subtitle="Try adjusting your filters." />
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => <ComplaintCard key={c.complaintId} complaint={c} />)}
        </div>
      )}
    </div>
  );
}
