import { useData } from "@/contexts/DataContext";
import StatusCard from "@/components/StatusCard";
import { getUtilizationStatus, getStatusColor } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Bed, Heart, Stethoscope, Ambulance, Clock } from "lucide-react";

const tooltipStyle = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  fontSize: 12,
  color: "#1e293b",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const HospitalsPage = () => {
  const { hospitals } = useData();

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
        <h1 className="text-2xl font-bold text-slate-800">Hospital Resource Monitoring</h1>
        <p className="text-sm text-slate-500 mt-0.5">10 hospitals · Real-time capacity tracking</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard label="Total Beds" value={hospitals.reduce((s, h) => s + h.occupiedBeds, 0)} max={hospitals.reduce((s, h) => s + h.totalBeds, 0)} icon={<Bed className="h-4 w-4" />} />
        <StatusCard label="ICU Beds" value={hospitals.reduce((s, h) => s + h.icuOccupied, 0)} max={hospitals.reduce((s, h) => s + h.icuBeds, 0)} icon={<Heart className="h-4 w-4" />} />
        <StatusCard label="Ventilators" value={hospitals.reduce((s, h) => s + h.ventilatorsInUse, 0)} max={hospitals.reduce((s, h) => s + h.ventilators, 0)} icon={<Stethoscope className="h-4 w-4" />} />
        <StatusCard label="Emergency" value={hospitals.reduce((s, h) => s + h.emergencyPatients, 0)} max={hospitals.reduce((s, h) => s + h.emergencyCapacity, 0)} icon={<Ambulance className="h-4 w-4" />} />
      </div>

      {/* Hospital Table */}
      <div className="bg-white border border-slate-200 rounded-xl card-shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Hospital Details</h2>
          <p className="text-xs text-slate-400 mt-0.5">Live occupancy and resource data</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Hospital</th>
                <th className="text-center px-4 py-3">Beds</th>
                <th className="text-center px-4 py-3">ICU</th>
                <th className="text-center px-4 py-3">ER</th>
                <th className="text-center px-4 py-3">Vents</th>
                <th className="text-center px-4 py-3">Doctors</th>
                <th className="text-center px-4 py-3">Waiting</th>
                <th className="text-center px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.map(h => {
                const bedPct = (h.occupiedBeds / h.totalBeds) * 100;
                const status = getUtilizationStatus(bedPct);
                const color = getStatusColor(status);
                return (
                  <tr key={h.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{h.name}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-600">{h.occupiedBeds}/{h.totalBeds}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-600">{h.icuOccupied}/{h.icuBeds}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-600">{h.emergencyPatients}/{h.emergencyCapacity}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-600">{h.ventilatorsInUse}/{h.ventilators}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-600">{h.doctors}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-600 flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />{h.waitingPatients}
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
        <h2 className="text-sm font-semibold text-slate-700 mb-1">Bed Utilization by Hospital</h2>
        <p className="text-xs text-slate-400 mb-5">Color indicates utilization severity</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={hospitals.map(h => ({ name: h.name.split(" ").slice(0, 2).join(" "), beds: Math.round((h.occupiedBeds / h.totalBeds) * 100), icu: Math.round((h.icuOccupied / h.icuBeds) * 100) }))}>
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 130]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="beds" name="Bed %" radius={[5, 5, 0, 0]}>
              {hospitals.map((h, i) => <Cell key={i} fill={barColor(Math.round((h.occupiedBeds / h.totalBeds) * 100))} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HospitalsPage;
