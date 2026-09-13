import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useApi } from "../hooks/useApi.js";
import Timeline from "../components/Timeline.jsx";
import Badge from "../components/Badge.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import MapView from "../components/MapView.jsx";
import { STATUS_COLORS, SEVERITY_COLORS } from "../utils/constants.js";

export default function ComplaintDetails() {
  const { id } = useParams();
  const api = useApi();
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/api/complaints/${id}`)
      .then((r) => setComplaint(r.data.complaint))
      .catch((e) => setError(e.response?.data?.error || "Not found"));
  }, [id]);

  if (error) return <div className="card text-center py-10 text-red-500">{error}</div>;
  if (!complaint) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">{complaint.complaintId}</h1>
        <Badge text={complaint.status} colorClass={STATUS_COLORS[complaint.status]} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card space-y-3">
          <img src={complaint.imageUrl} className="w-full h-56 object-cover rounded-xl" />
          <p className="font-semibold">{complaint.title}</p>
          <p className="text-sm text-slate-600">{complaint.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge text={complaint.category} />
            <Badge text={complaint.severity} colorClass={SEVERITY_COLORS[complaint.severity]} />
            <Badge text={complaint.department} />
          </div>
          <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin className="w-4 h-4" /> {complaint.location?.address}</p>
          <p className="text-xs text-slate-400">Created: {new Date(complaint.createdAt).toLocaleString()}</p>
          <p className="text-xs text-slate-400">Updated: {new Date(complaint.updatedAt).toLocaleString()}</p>
          {complaint.aiAnalysis && (
            <div className="bg-slate-50 rounded-xl p-3 text-sm">
              <p className="font-medium mb-1">AI Analysis</p>
              <p>Category: {complaint.aiAnalysis.category}</p>
              <p>Confidence: {Math.round((complaint.aiAnalysis.confidence || 0) * 100)}%</p>
              <p>{complaint.aiAnalysis.description}</p>
            </div>
          )}
        </div>

        <div className="card">
          <p className="font-semibold mb-4">Status Timeline</p>
          <Timeline status={complaint.status} entries={complaint.timeline} />
        </div>
      </div>

      {complaint.location?.latitude && (
        <MapView complaints={[complaint]} center={[complaint.location.latitude, complaint.location.longitude]} height="300px" />
      )}

      {complaint.status === "Resolved" && (
        <div className="card">
          <p className="font-semibold mb-3">Before / After</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">Original Report</p>
              <img src={complaint.imageUrl} className="w-full h-48 object-cover rounded-xl" />
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Resolution</p>
              <img src={complaint.resolutionImage} className="w-full h-48 object-cover rounded-xl" />
            </div>
          </div>
          <p className="text-sm mt-3"><b>Note:</b> {complaint.resolutionNote}</p>
        </div>
      )}
    </div>
  );
}
