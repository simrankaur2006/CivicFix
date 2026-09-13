import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useApi } from "./hooks/useApi.js";

import AppLayout from "./layouts/AppLayout.jsx";
import Landing from "./pages/Landing.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ReportIssue from "./pages/ReportIssue.jsx";
import MyComplaints from "./pages/MyComplaints.jsx";
import ComplaintDetails from "./pages/ComplaintDetails.jsx";
import MapPage from "./pages/MapPage.jsx";
import Notifications from "./pages/Notifications.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminComplaints from "./pages/AdminComplaints.jsx";
import AdminComplaintDetails from "./pages/AdminComplaintDetails.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import NotFound from "./pages/NotFound.jsx";

const Protected = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut><RedirectToSignIn /></SignedOut>
  </>
);

const AdminGate = ({ children }) => {
  const api = useApi();
  const [role, setRole] = useState(null);

  useEffect(() => {
    api.get("/api/users/me").then((r) => setRole(r.data.user.role)).catch(() => setRole("citizen"));
  }, []);

  if (role === null) return null;
  if (role !== "admin") return <Unauthorized />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      <Route element={<Protected><AppLayout /></Protected>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/complaints" element={<MyComplaints />} />
        <Route path="/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/notifications" element={<Notifications />} />

        <Route path="/admin" element={<AdminGate><AdminDashboard /></AdminGate>} />
        <Route path="/admin/complaints" element={<AdminGate><AdminComplaints /></AdminGate>} />
        <Route path="/admin/complaints/:id" element={<AdminGate><AdminComplaintDetails /></AdminGate>} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
