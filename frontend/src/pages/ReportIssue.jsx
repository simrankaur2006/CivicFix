import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UploadCloud, MapPin, Locate, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";
import { useApi } from "../hooks/useApi.js";
import { CATEGORIES } from "../utils/constants.js";
import MapView from "../components/MapView.jsx";

const STEP_LABELS = ["Photo", "AI Analysis", "Location", "Details", "Review", "Done"];

export default function ReportIssue() {
  const api = useApi();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState({ latitude: null, longitude: null, address: "" });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duplicate, setDuplicate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const onFileSelected = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const runAnalysis = async () => {
    setStep(2);
    setAnalyzing(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const { data } = await api.post("/api/ai/analyze", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAiResult(data);
      setCategory(data.category);
    } catch (e) {
      toast.error("AI analysis failed. Please select category manually.");
      setAiResult({ category: "Other", confidence: 0, severity: "Low", description: "Manual review needed." });
      setCategory("Other");
    } finally {
      setAnalyzing(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          address: location.address || "Current location",
        });
        toast.success("Location captured");
      },
      () => toast.error("Could not get location")
    );
  };

  const checkDuplicate = async () => {
    try {
      const { data } = await api.post("/api/ai/duplicate-check", {
        category,
        latitude: location.latitude,
        longitude: location.longitude,
        description,
      });
      if (data.duplicate) {
        setDuplicate(data.complaint);
        setStep(5);
      } else {
        setDuplicate(null);
        submitComplaint(false);
      }
    } catch (e) {
      submitComplaint(false);
    }
  };

  const submitComplaint = async (force) => {
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("title", title);
      form.append("description", description);
      form.append("category", category);
      form.append("latitude", location.latitude);
      form.append("longitude", location.longitude);
      form.append("address", location.address);
      if (force) form.append("force", "true");

      const { data } = await api.post("/api/complaints", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data.complaint);
      setDuplicate(null);
      setStep(6);
    } catch (err) {
      if (err.response?.status === 409) {
        setDuplicate(err.response.data.complaint);
        setStep(5);
      } else {
        toast.error(err.response?.data?.error || "Submission failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Report an Issue</h1>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        {STEP_LABELS.map((l, i) => (
          <div key={l} className={`flex-1 text-center py-1 rounded-full ${step === i + 1 ? "bg-primary-100 text-primary-700 font-semibold" : ""}`}>
            {l}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card">
          <label
            className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center py-14 cursor-pointer hover:border-primary-400"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); onFileSelected(e.dataTransfer.files[0]); }}
          >
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onFileSelected(e.target.files[0])} />
            {preview ? (
              <img src={preview} alt="preview" className="max-h-56 rounded-xl object-contain" />
            ) : (
              <>
                <UploadCloud className="w-10 h-10 text-primary-500 mb-2" />
                <p className="font-medium">Click to upload or drag & drop</p>
                <p className="text-sm text-slate-400">PNG, JPG up to 8MB</p>
              </>
            )}
          </label>
          <button disabled={!file} onClick={runAnalysis} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
            Analyze Image <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          {analyzing ? (
            <div className="text-center py-10">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="font-medium">Analyzing your report...</p>
            </div>
          ) : aiResult ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-slate-400">Detected Issue</p><p className="font-semibold">{aiResult.category}</p></div>
                <div><p className="text-slate-400">Confidence</p><p className="font-semibold">{Math.round(aiResult.confidence * 100)}%</p></div>
                <div><p className="text-slate-400">Severity</p><p className="font-semibold">{aiResult.severity}</p></div>
                <div className="col-span-2"><p className="text-slate-400">AI Explanation</p><p>{aiResult.description}</p></div>
              </div>
              <div>
                <label className="text-sm font-medium">Category (edit if needed)</label>
                <select className="input mt-1" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex justify-between">
                <button className="btn-secondary flex items-center gap-1" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4" /> Back</button>
                <button className="btn-primary flex items-center gap-1" onClick={() => setStep(3)}>Next <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {step === 3 && (
        <div className="card space-y-4">
          <button onClick={useCurrentLocation} className="btn-secondary flex items-center gap-2"><Locate className="w-4 h-4" /> Use Current Location</button>
          <div>
            <label className="text-sm font-medium">Address</label>
            <input className="input mt-1" placeholder="Enter address" value={location.address}
              onChange={(e) => setLocation({ ...location, address: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="input" type="number" placeholder="Latitude" value={location.latitude || ""}
              onChange={(e) => setLocation({ ...location, latitude: parseFloat(e.target.value) })} />
            <input className="input" type="number" placeholder="Longitude" value={location.longitude || ""}
              onChange={(e) => setLocation({ ...location, longitude: parseFloat(e.target.value) })} />
          </div>
          {location.latitude && location.longitude && (
            <MapView complaints={[{ complaintId: "preview", category, severity: "Low", status: "Submitted", location }]} center={[location.latitude, location.longitude]} height="250px" />
          )}
          <div className="flex justify-between">
            <button className="btn-secondary flex items-center gap-1" onClick={() => setStep(2)}><ArrowLeft className="w-4 h-4" /> Back</button>
            <button disabled={!location.latitude || !location.longitude} className="btn-primary flex items-center gap-1" onClick={() => setStep(4)}>Next <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="card space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input className="input mt-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short title" />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea className="input mt-1" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue" />
          </div>
          <div className="flex justify-between">
            <button className="btn-secondary flex items-center gap-1" onClick={() => setStep(3)}><ArrowLeft className="w-4 h-4" /> Back</button>
            <button disabled={!title || submitting} className="btn-primary flex items-center gap-1" onClick={checkDuplicate}>
              {submitting ? "Checking..." : "Continue"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 5 && duplicate && (
        <div className="card space-y-4">
          <div className="flex items-center gap-2 text-amber-700 bg-amber-50 rounded-xl p-3">
            <AlertTriangle className="w-5 h-5" /> A similar complaint may already exist nearby.
          </div>
          <div className="flex gap-4">
            <img src={duplicate.imageUrl} className="w-24 h-24 rounded-xl object-cover" />
            <div className="text-sm">
              <p><b>ID:</b> {duplicate.complaintId}</p>
              <p><b>Category:</b> {duplicate.category}</p>
              <p><b>Distance:</b> {duplicate.distance}m</p>
              <p><b>Status:</b> {duplicate.status}</p>
            </div>
          </div>
          <div className="flex justify-between">
            <button className="btn-secondary" onClick={() => navigate(`/complaints/${duplicate.complaintId}`)}>View Existing Complaint</button>
            <button className="btn-primary" disabled={submitting} onClick={() => submitComplaint(true)}>
              {submitting ? "Submitting..." : "Submit Anyway"}
            </button>
          </div>
        </div>
      )}

      {step === 6 && result && (
        <div className="card text-center space-y-4">
          <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
          <h2 className="text-xl font-bold">Complaint Submitted!</h2>
          <div className="grid grid-cols-2 gap-3 text-sm text-left max-w-sm mx-auto">
            <p className="text-slate-400">Complaint ID</p><p className="font-semibold">{result.complaintId}</p>
            <p className="text-slate-400">Category</p><p className="font-semibold">{result.category}</p>
            <p className="text-slate-400">Department</p><p className="font-semibold">{result.department}</p>
            <p className="text-slate-400">Severity</p><p className="font-semibold">{result.severity}</p>
            <p className="text-slate-400">Priority</p><p className="font-semibold">{result.priority}</p>
            <p className="text-slate-400">Status</p><p className="font-semibold">{result.status}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button className="btn-primary" onClick={() => navigate(`/complaints/${result.complaintId}`)}>Track Complaint</button>
            <button className="btn-secondary" onClick={() => navigate("/complaints")}>My Complaints</button>
            <button className="btn-secondary" onClick={() => window.location.reload()}>Report Another Issue</button>
          </div>
        </div>
      )}
    </div>
  );
}
