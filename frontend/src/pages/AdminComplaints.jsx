import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi.js";
import Badge from "../components/Badge.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { CATEGORIES, SEVERITIES, STATUSES, STATUS_COLORS, SEVERITY_COLORS } from "../utils/constants.js";
import { FileText } from "lucide-react";

export default function AdminComplaints() {
  const api = useApi();
  const [complaints, setComplaints] = useState(null);
  const [filters, setFilters] = useState({ category: "", severity: "", status: "", search: "" });

  const load = async () => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    const { data } = await api.get("/api/admin/complaints", { params });
    setComplaints(data.complaints);
  };

  useEffect(() => { load(); }, [filters]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">All Complaints</h1>
      <div className="flex flex-wrap gap-3">
        <input className="input w-auto" placeholder="Search ID or title" value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
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

      {!complaints ? <LoadingSpinner /> : complaints.length === 0 ? (
        <EmptyState icon={FileText} title="No complaints found" />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                {["ID", "Issue", "Category", "Severity", "Department", "Status", "Created", "Officer", ""].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.complaintId} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{c.complaintId}</td>
                  <td className="px-4 py-3 max-w-[180px] truncate">{c.title}</td>
                  <td className="px-4 py-3">{c.category}</td>
                  <td className="px-4 py-3"><Badge text={c.severity} colorClass={SEVERITY_COLORS[c.severity]} /></td>
                  <td className="px-4 py-3">{c.department}</td>
                  <td className="px-4 py-3"><Badge text={c.status} colorClass={STATUS_COLORS[c.status]} /></td>
                  <td className="px-4 py-3">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{c.assignedOfficer || "—"}</td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/complaints/${c.complaintId}`} className="text-primary-600 font-medium">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
