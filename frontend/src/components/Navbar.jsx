import { Link, NavLink } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { MapPin, Bell, LayoutDashboard, FileText, ListChecks, Home } from "lucide-react";
import NotificationBell from "./NotificationBell.jsx";

const linkClass = ({ isActive }) =>
  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? "bg-primary-50 text-primary-700" : "text-slate-600 hover:bg-slate-100"
  }`;

export default function Navbar() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-primary-700">
          <MapPin className="w-6 h-6" /> CivicFix
        </Link>
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/dashboard" className={linkClass}><Home className="w-4 h-4" /> Dashboard</NavLink>
          <NavLink to="/report" className={linkClass}><FileText className="w-4 h-4" /> Report Issue</NavLink>
          <NavLink to="/complaints" className={linkClass}><ListChecks className="w-4 h-4" /> My Complaints</NavLink>
          <NavLink to="/map" className={linkClass}><MapPin className="w-4 h-4" /> Map</NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}><LayoutDashboard className="w-4 h-4" /> Admin</NavLink>
          )}
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
