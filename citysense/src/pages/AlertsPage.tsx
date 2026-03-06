import { useData } from "@/contexts/DataContext";
import { AlertTriangle, Building2, Car, Info } from "lucide-react";
import { useState } from "react";

const AlertsPage = () => {
  const { alerts } = useData();
  const [filter, setFilter] = useState<"all" | "hospital" | "traffic">("all");
  const [severityFilter, setSeverityFilter] = useState<"all" | "critical" | "warning">("all");

  const filtered = alerts
    .filter(a => filter === "all" || a.type === filter)
    .filter(a => severityFilter === "all" || a.severity === severityFilter);

  const severityStyle: Record<string, { card: string; icon: string }> = {
    critical: { card: "bg-red-50 border-red-200", icon: "text-red-500" },
    warning: { card: "bg-amber-50 border-amber-200", icon: "text-amber-500" },
    info: { card: "bg-blue-50 border-blue-200", icon: "text-blue-500" },
  };

  const activeBtn = "bg-blue-600 text-white border-blue-600 shadow-sm";
  const inactiveBtn = "bg-white text-slate-600 border-slate-200 hover:bg-slate-50";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Alert Center</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {alerts.length} alerts · <span className="text-red-500 font-medium">{alerts.filter(a => a.severity === "critical").length} critical</span>
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-400 self-center mr-1 font-medium">Type:</span>
        {(["all", "hospital", "traffic"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filter === f ? activeBtn : inactiveBtn}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="w-px bg-slate-200 mx-1 self-stretch" />
        <span className="text-xs text-slate-400 self-center mr-1 font-medium">Severity:</span>
        {(["all", "critical", "warning"] as const).map(f => (
          <button key={f} onClick={() => setSeverityFilter(f)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${severityFilter === f ? activeBtn : inactiveBtn}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Info className="h-9 w-9 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No alerts match your filters</p>
          </div>
        )}
        {filtered.map(a => {
          const style = severityStyle[a.severity] ?? severityStyle.info;
          return (
            <div key={a.id} className={`border rounded-xl p-4 flex items-start gap-4 ${style.card}`}>
              <div className={`mt-0.5 ${style.icon}`}>
                {a.severity === "critical" ? <AlertTriangle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-slate-800">{a.title}</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 bg-white/60 rounded px-1.5 py-0.5 border border-slate-200">
                    {a.type === "hospital"
                      ? <Building2 className="h-3 w-3 inline" />
                      : <Car className="h-3 w-3 inline" />}
                    {a.type}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{a.message}</p>
                <p className="text-[11px] text-slate-400 mt-1.5 font-mono">{a.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsPage;
