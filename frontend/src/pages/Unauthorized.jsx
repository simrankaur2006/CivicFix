import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <ShieldAlert className="w-14 h-14 text-red-500 mb-3" />
      <h1 className="text-2xl font-bold">Unauthorized</h1>
      <p className="text-slate-500 mt-2">You don't have permission to view this page.</p>
      <Link to="/dashboard" className="btn-primary mt-6">Back to Dashboard</Link>
    </div>
  );
}
