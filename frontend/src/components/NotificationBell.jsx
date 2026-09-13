import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useApi } from "../hooks/useApi.js";

export default function NotificationBell() {
  const api = useApi();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/api/notifications");
      setNotifications(data.notifications || []);
    } catch (e) {}
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const markRead = async (id) => {
    await api.put(`/api/notifications/${id}/read`);
    load();
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-slate-100">
        <Bell className="w-5 h-5 text-slate-600" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border border-slate-100 max-h-96 overflow-y-auto z-40">
          <div className="p-3 border-b font-semibold text-sm">Notifications</div>
          {notifications.length === 0 && (
            <div className="p-4 text-sm text-slate-400">No notifications yet.</div>
          )}
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => markRead(n._id)}
              className={`p-3 text-sm border-b cursor-pointer hover:bg-slate-50 ${!n.read ? "bg-primary-50/40" : ""}`}
            >
              <p>{n.message}</p>
              <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
