export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-center">
      {Icon && <Icon className="w-10 h-10 mb-3" />}
      <p className="font-medium text-slate-600">{title}</p>
      {subtitle && <p className="text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
