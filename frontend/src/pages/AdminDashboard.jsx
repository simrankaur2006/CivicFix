import { useEffect, useState } from "react";
import { FileText, AlertTriangle, Loader2, CheckCircle2, Timer, Inbox } from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { useApi } from "../hooks/useApi.js";
import StatCard from "../components/StatCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444", "#0ea5e9", "#a855f7", "#14b8a6", "#eab308"];

export default function AdminDashboard() {
  const api = useApi();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/api/admin/dashboard").then((r) => setData(r.data));
  }, []);

  if (!data) return <LoadingSpinner />;
  const { cards, charts } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total" value={cards.total} icon={FileText} />
        <StatCard label="New" value={cards.newCount} icon={Inbox} accent="text-blue-600" />
        <StatCard label="High Priority" value={cards.highPriority} icon={AlertTriangle} accent="text-red-600" />
        <StatCard label="In Progress" value={cards.inProgress} icon={Loader2} accent="text-amber-600" />
        <StatCard label="Resolved" value={cards.resolved} icon={CheckCircle2} accent="text-green-600" />
        <StatCard label="Avg Resolution (hrs)" value={cards.avgResolutionHours} icon={Timer} accent="text-purple-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <p className="font-semibold mb-3">Complaints by Category</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={charts.byCategory} dataKey="value" nameKey="name" outerRadius={90} label>
                {charts.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <p className="font-semibold mb-3">Complaints by Status</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts.byStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <p className="font-semibold mb-3">Complaints by Severity</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts.bySeverity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <p className="font-semibold mb-3">Department Workload</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts.byDepartment} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card md:col-span-2">
          <p className="font-semibold mb-3">Complaints Over Time</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={charts.overTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} name="Complaints" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
