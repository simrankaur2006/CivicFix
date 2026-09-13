import { Link } from "react-router-dom";
import { MapPin, Calendar, ChevronRight } from "lucide-react";
import Badge from "./Badge.jsx";
import { STATUS_COLORS, SEVERITY_COLORS } from "../utils/constants.js";

export default function ComplaintCard({ complaint }) {
  return (
    <div className="card flex flex-col sm:flex-row gap-4">
      <img
        src={complaint.imageUrl}
        alt={complaint.category}
        className="w-full sm:w-32 h-32 object-cover rounded-xl bg-slate-100"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="font-semibold text-slate-800">{complaint.complaintId}</p>
          <Badge text={complaint.status} colorClass={STATUS_COLORS[complaint.status]} />
        </div>
        <p className="text-sm text-slate-700 mt-1">{complaint.title}</p>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{complaint.location?.address || "—"}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(complaint.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge text={complaint.severity} colorClass={SEVERITY_COLORS[complaint.severity]} />
          <Badge text={complaint.department} />
        </div>
      </div>
      <Link
        to={`/complaints/${complaint.complaintId}`}
        className="self-center text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm font-medium"
      >
        View <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
