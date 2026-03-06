import { Activity, Database, Cpu, Wifi, BarChart3, Shield } from "lucide-react";

const AboutPage = () => {
  const arch = [
    { icon: Wifi, title: "Data Sources", desc: "IoT sensors, traffic cameras, hospital management systems, GPS data, smart traffic signals" },
    { icon: Cpu, title: "Processing Layer", desc: "Real-time analytics engine, utilization calculators, alert detection module" },
    { icon: Database, title: "Storage", desc: "Time-series database for monitoring data, infrastructure metadata store" },
    { icon: BarChart3, title: "Visualization", desc: "Interactive dashboards, heatmaps, status panels, trend charts" },
    { icon: Shield, title: "Alert System", desc: "Threshold-based detection for overload, congestion, underuse, and emergencies" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-600" />
          About This System
        </h1>
        <p className="text-sm text-slate-500 mt-1">Infrastructure Capacity &amp; Utilization Monitoring System</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 card-shadow space-y-3">
        <h2 className="text-base font-semibold text-slate-800">Problem Statement</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Cities face inefficiencies where hospitals become overcrowded while others are underutilized,
          and roads experience heavy congestion while alternate routes remain free. This system continuously
          monitors resource usage against designed capacity, detecting congestion, overload, and underuse
          across hospital and road infrastructure.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 card-shadow space-y-3">
        <h2 className="text-base font-semibold text-slate-800">Utilization Algorithm</h2>
        <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs font-mono text-slate-700 overflow-x-auto leading-relaxed">
          {`Utilization % = (Current Usage / Max Capacity) × 100

Classification:
  0–40%   → UNDERUSED    (Blue)
  40–80%  → NORMAL       (Green)
  80–100% → HIGH         (Amber)
  > 100%  → OVERLOAD     (Red)

Alert triggers:
  Hospital: bed overload, ICU shortage, ER crowding, staff shortage
  Traffic:  congestion, accidents, construction, underused alternates`}
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-semibold text-slate-800">System Architecture</h2>
        {arch.map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-4 card-shadow hover:border-blue-200 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <item.icon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 card-shadow space-y-3">
        <h2 className="text-base font-semibold text-slate-800">Technology Stack</h2>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600">Frontend: React + Recharts + Tailwind</div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600">State: React Context + Simulated Data</div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600">Auth: Session-based Demo Login</div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600">Refresh: Auto-refresh every 30s</div>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center pb-4">
        Demo credentials: <span className="font-mono text-blue-600 font-semibold">admin</span> / <span className="font-mono text-blue-600 font-semibold">admin123</span>
      </p>
    </div>
  );
};

export default AboutPage;
