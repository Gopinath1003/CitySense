import { useData } from "@/contexts/DataContext";
import StatusCard from "@/components/StatusCard";
import { getUtilizationStatus, getStatusColor } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Car, Gauge, Construction, AlertTriangle } from "lucide-react";

const tooltipStyle = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  fontSize: 12,
  color: "#1e293b",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const TrafficPage = () => {
  const { roads } = useData();

  const avgSpeed = Math.round(roads.reduce((s, r) => s + r.avgSpeed, 0) / roads.length);
  const totalVolume = roads.reduce((s, r) => s + r.currentVolume, 0);
  const totalCapacity = roads.reduce((s, r) => s + r.capacity, 0);
  const accidentRoads = roads.filter(r => r.accidents > 0).length;

  const barColor = (util: number) => {
    const c = getStatusColor(getUtilizationStatus(util));
    return c === "success" ? "#22c55e" : c === "warning" ? "#f59e0b" : c === "destructive" ? "#ef4444" : "#3b82f6";
  };

  const statusBadge = (color: string) => ({
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    destructive: "bg-red-50 text-red-700 border-red-200",
    primary: "bg-blue-50 text-blue-700 border-blue-200",
  }[color] ?? "bg-slate-100 text-slate-600");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Road Traffic Monitoring</h1>
        <p className="text-sm text-slate-500 mt-0.5">20 roads · Real-time congestion analysis</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard label="Total Flow" value={totalVolume} max={totalCapacity} icon={<Car className="h-4 w-4" />} />

        <div className="bg-white border border-slate-200 rounded-xl p-5 card-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Speed</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Gauge className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="flex items-end gap-1 mt-3">
            <span className="text-3xl font-bold text-slate-800">{avgSpeed}</span>
            <span className="text-sm text-slate-400 mb-1">km/h</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 card-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accidents</span>
            <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
          </div>
          <div className="flex items-end gap-1 mt-3">
            <span className="text-3xl font-bold text-red-500">{accidentRoads}</span>
            <span className="text-sm text-slate-400 mb-1">roads affected</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 card-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Construction</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Construction className="h-4 w-4 text-amber-500" />
            </div>
          </div>
          <div className="flex items-end gap-1 mt-3">
            <span className="text-3xl font-bold text-amber-500">{roads.filter(r => r.construction).length}</span>
            <span className="text-sm text-slate-400 mb-1">active zones</span>
          </div>
        </div>
      </div>

      {/* Roads Table */}
      <div className="bg-white border border-slate-200 rounded-xl card-shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Road Segment Details</h2>
          <p className="text-xs text-slate-400 mt-0.5">Live volume, speed, and incident data</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Road</th>
                <th className="text-center px-4 py-3">Lanes</th>
                <th className="text-center px-4 py-3">Volume/Cap</th>
                <th className="text-center px-4 py-3">Speed</th>
                <th className="text-center px-4 py-3">Length</th>
                <th className="text-center px-4 py-3">Flags</th>
                <th className="text-center px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {roads.map(r => {
                const pct = (r.currentVolume / r.capacity) * 100;
                const status = getUtilizationStatus(pct);
                const color = getStatusColor(status);
                return (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{r.name}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-600">{r.lanes}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-600">{r.currentVolume}/{r.capacity}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-600">{r.avgSpeed}/{r.maxSpeed} km/h</td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-600">{r.length} km</td>
                    <td className="px-4 py-3.5 text-center text-xs space-x-1">
                      {r.accidents > 0 && <span className="bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-md text-[11px] font-medium">🚨 {r.accidents}</span>}
                      {r.construction && <span className="bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-md text-[11px] font-medium">🚧</span>}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${statusBadge(color)}`}>{status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 card-shadow">
        <h2 className="text-sm font-semibold text-slate-700 mb-1">Road Utilization Overview</h2>
        <p className="text-xs text-slate-400 mb-5">Color indicates congestion severity</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={roads.map(r => ({ name: r.name.split(" ").slice(0, 2).join(" "), util: Math.round((r.currentVolume / r.capacity) * 100) }))}>
            <XAxis dataKey="name" tick={{ fontSize: 8, fill: "#94a3b8" }} axisLine={false} tickLine={false} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 140]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="util" name="Utilization %" radius={[5, 5, 0, 0]}>
              {roads.map((r, i) => <Cell key={i} fill={barColor(Math.round((r.currentVolume / r.capacity) * 100))} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrafficPage;
