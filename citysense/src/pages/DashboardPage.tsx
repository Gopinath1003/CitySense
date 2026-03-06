import { useData } from "@/contexts/DataContext";
import StatusCard from "@/components/StatusCard";
import { getUtilizationStatus, getStatusColor } from "@/lib/mockData";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Building2, Car, AlertTriangle, Activity } from "lucide-react";

const tooltipStyle = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  fontSize: 12,
  color: "#1e293b",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const DashboardPage = () => {
  const { hospitals, roads, alerts, timeSeries } = useData();

  const totalBeds = hospitals.reduce((s, h) => s + h.totalBeds, 0);
  const occupiedBeds = hospitals.reduce((s, h) => s + h.occupiedBeds, 0);
  const totalICU = hospitals.reduce((s, h) => s + h.icuBeds, 0);
  const occupiedICU = hospitals.reduce((s, h) => s + h.icuOccupied, 0);
  const totalRoadCap = roads.reduce((s, r) => s + r.capacity, 0);
  const totalVolume = roads.reduce((s, r) => s + r.currentVolume, 0);
  const criticalAlerts = alerts.filter(a => a.severity === "critical").length;

  const hospitalBarData = hospitals.map(h => ({
    name: h.name.split(" ").slice(0, 2).join(" "),
    util: Math.round((h.occupiedBeds / h.totalBeds) * 100),
  }));

  const roadBarData = roads.slice(0, 10).map(r => ({
    name: r.name.split(" ").slice(0, 2).join(" "),
    util: Math.round((r.currentVolume / r.capacity) * 100),
  }));

  const barColor = (util: number) => {
    const s = getUtilizationStatus(util);
    const c = getStatusColor(s);
    return c === "success" ? "#22c55e" : c === "warning" ? "#f59e0b" : c === "destructive" ? "#ef4444" : "#3b82f6";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">System Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">Real-time infrastructure capacity monitoring</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard label="Total Beds" value={occupiedBeds} max={totalBeds} icon={<Building2 className="h-4 w-4" />} />
        <StatusCard label="ICU Beds" value={occupiedICU} max={totalICU} icon={<Activity className="h-4 w-4" />} />
        <StatusCard label="Road Volume" value={totalVolume} max={totalRoadCap} icon={<Car className="h-4 w-4" />} />
        <div className="bg-white border border-slate-200 rounded-xl p-5 card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Alerts</span>
            <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
          </div>
          <div className="flex items-end gap-2 mt-3">
            <span className="text-3xl font-bold text-red-500">{criticalAlerts}</span>
            <span className="text-sm text-slate-400 mb-1">critical / {alerts.length} total</span>
          </div>
          <div className="mt-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-semibold">
              {criticalAlerts > 0 ? "Action Required" : "All Clear"}
            </span>
          </div>
        </div>
      </div>

      {/* Time Series */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-slate-700">24h Utilization Trend</h2>
            <p className="text-xs text-slate-400 mt-0.5">Hospital vs. Traffic utilization over time</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-2 w-5 rounded bg-teal-400 inline-block" />Hospital</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-5 rounded bg-amber-400 inline-block" />Traffic</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={timeSeries}>
            <defs>
              <linearGradient id="gradH" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradT" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 120]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="hospitalUtil" stroke="#14b8a6" strokeWidth={2} fill="url(#gradH)" name="Hospital %" />
            <Area type="monotone" dataKey="trafficUtil" stroke="#f59e0b" strokeWidth={2} fill="url(#gradT)" name="Traffic %" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 card-shadow">
          <h2 className="text-sm font-semibold text-slate-700 mb-1">Hospital Bed Utilization</h2>
          <p className="text-xs text-slate-400 mb-5">Per-hospital bed occupancy rate</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hospitalBarData}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 120]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="util" radius={[5, 5, 0, 0]} name="Util %">
                {hospitalBarData.map((entry, i) => <Cell key={i} fill={barColor(entry.util)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 card-shadow">
          <h2 className="text-sm font-semibold text-slate-700 mb-1">Road Traffic Utilization</h2>
          <p className="text-xs text-slate-400 mb-5">Top 10 roads by congestion level</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={roadBarData}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 130]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="util" radius={[5, 5, 0, 0]} name="Util %">
                {roadBarData.map((entry, i) => <Cell key={i} fill={barColor(entry.util)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
