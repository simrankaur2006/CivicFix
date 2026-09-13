const STAGES = ["Submitted", "AI Verified", "Assigned", "In Progress", "Resolved"];

export default function Timeline({ status, entries = [] }) {
  const currentIndex = STAGES.indexOf(status);
  const isRejected = status === "Rejected";

  return (
    <div className="flex flex-col gap-0">
      {STAGES.map((stage, i) => {
        const done = !isRejected && i <= currentIndex;
        const entry = entries.find((e) => e.status === stage);
        return (
          <div key={stage} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  done ? "bg-primary-500 border-primary-500" : "bg-white border-slate-300"
                }`}
              />
              {i < STAGES.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-[28px] ${done ? "bg-primary-500" : "bg-slate-200"}`} />
              )}
            </div>
            <div className="pb-6">
              <p className={`text-sm font-medium ${done ? "text-slate-800" : "text-slate-400"}`}>{stage}</p>
              {entry && <p className="text-xs text-slate-400">{new Date(entry.at).toLocaleString()}</p>}
            </div>
          </div>
        );
      })}
      {isRejected && (
        <div className="flex gap-3">
          <div className="w-4 h-4 rounded-full bg-red-500" />
          <p className="text-sm font-medium text-red-600">Rejected</p>
        </div>
      )}
    </div>
  );
}
