export default function StatCard({ label, value, icon: Icon, accent = "text-primary-600" }) {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      {Icon && <Icon className={`w-9 h-9 ${accent}`} />}
    </div>
  );
}
