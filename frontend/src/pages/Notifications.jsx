import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useApi } from "../hooks/useApi.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Notifications() {
  const api = useApi();
  const [notifications, setNotifications] = useState(null);

  const load = async () => {
    const { data } = await api.get("/api/notifications");
    setNotifications(data.notifications);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await api.put(`/api/notifications/${id}/read`);
    load();
  };

  if (!notifications) return <LoadingSpinner />;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Notifications</h1>
      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n._id} onClick={() => markRead(n._id)} className={`card cursor-pointer ${!n.read ? "border-primary-200" : ""}`}>
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
