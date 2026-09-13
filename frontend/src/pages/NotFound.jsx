import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <p className="text-slate-500 mt-2">Page not found.</p>
      <Link to="/dashboard" className="btn-primary mt-6">Go Home</Link>
    </div>
  );
}
