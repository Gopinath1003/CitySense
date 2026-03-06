import { ReactNode } from "react";
import { getUtilizationStatus, getStatusColor } from "@/lib/mockData";

interface Props {
  label: string;
  value: number;
  max: number;
  unit?: string;
  icon?: ReactNode;
}

export default function StatusCard({ label, value, max, unit = "", icon }: Props) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const status = getUtilizationStatus(pct);
  const color = getStatusColor(status);

  const colorClasses: Record<string, string> = {
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    destructive: "bg-red-50 text-red-700 border-red-200",
    primary: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const barClasses: Record<string, string> = {
    success: "bg-green-500",
    warning: "bg-amber-400",
    destructive: "bg-red-500",
    primary: "bg-blue-500",
  };

  const iconBgClasses: Record<string, string> = {
    success: "bg-green-50 text-green-600",
    warning: "bg-amber-50 text-amber-600",
    destructive: "bg-red-50 text-red-600",
    primary: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 card-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        {icon && (
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${iconBgClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-slate-800">{value}{unit}</span>
        <span className="text-sm text-slate-400 mb-1">/ {max}{unit}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barClasses[color]}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400">{pct.toFixed(0)}% utilized</span>
        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${colorClasses[color]}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
