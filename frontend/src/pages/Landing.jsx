import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import {
  MapPin, Camera, ShieldCheck, BarChart3, Construction, Trash2, Lightbulb,
  Droplets, TreePine, Building2, ArrowRight,
} from "lucide-react";

const ISSUES = [
  { icon: Construction, label: "Potholes" },
  { icon: Trash2, label: "Garbage Overflow" },
  { icon: Lightbulb, label: "Broken Streetlights" },
  { icon: Droplets, label: "Water Leakage" },
  { icon: TreePine, label: "Fallen Trees" },
  { icon: Building2, label: "Damaged Property" },
];

const STEPS = [
  { title: "Snap a Photo", desc: "Upload an image of the civic issue you noticed.", icon: Camera },
  { title: "AI Analyzes It", desc: "Our AI detects category and severity instantly.", icon: ShieldCheck },
  { title: "Track Resolution", desc: "Follow real-time progress until it's resolved.", icon: BarChart3 },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg text-primary-700">
          <MapPin className="w-6 h-6" /> CivicFix
        </div>
        <SignedOut>
          <Link to="/sign-in" className="btn-primary">Sign In</Link>
        </SignedOut>
        <SignedIn>
          <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
        </SignedIn>
      </nav>

      <section className="max-w-4xl mx-auto text-center px-4 py-20">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
          Report. Track. <span className="text-primary-600">Improve Your City.</span>
        </h1>
        <p className="mt-5 text-lg text-slate-600">
          CivicFix uses AI to help citizens report public issues and enables authorities to
          resolve them faster and more transparently.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <SignedOut>
            <Link to="/sign-up" className="btn-primary flex items-center gap-2">Report an Issue <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/sign-in" className="btn-secondary">Track Complaint</Link>
          </SignedOut>
          <SignedIn>
            <Link to="/report" className="btn-primary flex items-center gap-2">Report an Issue <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/complaints" className="btn-secondary">Track Complaint</Link>
          </SignedIn>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.title} className="card text-center">
              <s.icon className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-center mb-10">Issues We Handle</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {ISSUES.map((i) => (
            <div key={i.label} className="card text-center py-6">
              <i.icon className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium">{i.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-center mb-10">Why CivicFix</h2>
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div className="card"><p className="font-semibold">AI-Powered</p><p className="text-sm text-slate-500 mt-1">Instant category & severity detection.</p></div>
          <div className="card"><p className="font-semibold">Transparent</p><p className="text-sm text-slate-500 mt-1">Track every complaint in real time.</p></div>
          <div className="card"><p className="font-semibold">Data-Driven</p><p className="text-sm text-slate-500 mt-1">Analytics help authorities prioritize.</p></div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        © 2026 CivicFix — Smart Public Issue Reporting & Resolution Platform
      </footer>
    </div>
  );
}
