import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useApi } from "../hooks/useApi.js";
import Badge from "../components/Badge.jsx";
import Timeline from "../components/Timeline.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { CATEGORIES, SEVERITIES, STATUSES, STATUS_COLORS, SEVERITY_COLORS } from "../utils/constants.js";

export default function AdminComplaintDetails() {
  const { id } = useParams();
  const api = useApi();
  const [complaint, setComplaint] = useState(null);
  const [officer, setOfficer] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [resolutionFile, setResolutionFile] = useState(null);

  const load = async () => {
    const { data } = await api.get(`/api/complaints/${id}`);
    setComplaint(data.complaint);
  };

  useEffect(() => { load(); }, [id]);

  if (!complaint) return <LoadingSpinner />;

  const patch = async (url, body, isForm) => {
    try {
      await api.put(url, body, isForm ? { headers: { "Content-Type": "multipart/form-data" } } : {});
      toast.success("Updated");
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || "Update failed");
    }
  };

  const assign = () => officer && patch(`/api/admin/complaints/${id}/assign`, { officer });
  const changeStatus = (status) => patch(`/api/admin/complaints/${id}/status`, { status });
  const changeSeverity = (severity) => patch(`/api/admin/complaints/${id}/severity`, { severity });
  const changeDepartment = (department) => patch(`/api/admin/complaints/${id}/department`, { department });

  const resolve = async (reject = false) => {
    const form = new FormData();
    form.append("resolutionNote", resolutionNote);
    if (reject) form.append("reject", "true");
    if (resolutionFile) form.append("image", resolutionFile);
    try {
      await api.post(`/api/admin/complaints/${id}/resolve`, form, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(reject ? "Complaint rejected" : "Complaint resolved");
      load();
    } catch (e) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">{complaint.complaintId}</h1>
        <Badge text={complaint.status} colorClass={STATUS_COLORS[complaint.status]} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card space-y-3">
          <img src={complaint.imageUrl} className="w-full h-56 object-cover rounded-xl" />
          <p className="font-semibold">{complaint.title}</p>
          <p className="text-sm text-slate-600">{complaint.description}</p>
          <p className="text-sm text-slate-500">{complaint.location?.address}</p>
          {complaint.aiAnalysis && (
            <div className="bg-slate-50 rounded-xl p-3 text-sm">
              <p className="font-medium mb-1">AI Result</p>
              <p>Category: {complaint.aiAnalysis.category} ({Math.round((complaint.aiAnalysis.confidence || 0) * 100)}%)</p>
              <p>{complaint.aiAnalysis.description}</p>
            </div>
          )}
          {complaint.duplicateOf && <p className="text-sm text-amber-600">Possible duplicate of: {complaint.duplicateOf}</p>}
        </div>

        <div className="card">
          <p className="font-semibold mb-4">Timeline</p>
          <Timeline status={complaint.status} entries={complaint.timeline} />
        </div>
      </div>

      <div className="card space-y-4">
        <p className="font-semibold">Admin Actions</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Assign Officer</label>
            <div className="flex gap-2 mt-1">
              <input className="input" placeholder="Officer name" value={officer} onChange={(e) => setOfficer(e.target.value)} />
              <button className="btn-primary" onClick={assign}>Assign</button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Change Status</label>
            <select className="input mt-1" value={complaint.status} onChange={(e) => changeStatus(e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Change Severity</label>
            <select className="input mt-1" value={complaint.severity} onChange={(e) => changeSeverity(e.target.value)}>
              {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Change Department</label>
            <select className="input mt-1" value={complaint.department} onChange={(e) => changeDepartment(e.target.value)}>
              {[...new Set(CATEGORIES.map((c) => complaint.department))].concat(complaint.department).filter((v, i, a) => a.indexOf(v) === i).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card space-y-3">
        <p className="font-semibold">Resolve / Reject</p>
        <textarea className="input" rows={3} placeholder="Resolution note" value={resolutionNote} onChange={(e) => setResolutionNote(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => setResolutionFile(e.target.files[0])} />
        <div className="flex gap-3">
          <button className="btn-primary" onClick={() => resolve(false)}>Mark Resolved</button>
          <button className="btn-secondary text-red-600" onClick={() => resolve(true)}>Reject</button>
        </div>
      </div>
    </div>
  );
}
