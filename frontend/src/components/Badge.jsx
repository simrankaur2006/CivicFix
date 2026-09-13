export default function Badge({ text, colorClass }) {
  return <span className={`badge ${colorClass || "bg-slate-100 text-slate-700"}`}>{text}</span>;
}
