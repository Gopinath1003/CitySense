// ─── Types ───
export type UtilizationStatus = "UNDERUSED" | "NORMAL" | "HIGH" | "OVERLOAD";

export interface Hospital {
  id: string;
  name: string;
  totalBeds: number;
  occupiedBeds: number;
  icuBeds: number;
  icuOccupied: number;
  emergencyCapacity: number;
  emergencyPatients: number;
  ventilators: number;
  ventilatorsInUse: number;
  doctors: number;
  nurses: number;
  waitingPatients: number;
  ambulanceQueue: number;
  lat: number;
  lng: number;
}

export interface Road {
  id: string;
  name: string;
  capacity: number; // vehicles per hour
  currentVolume: number;
  avgSpeed: number; // km/h
  maxSpeed: number;
  length: number; // km
  lanes: number;
  accidents: number;
  construction: boolean;
  lat: number;
  lng: number;
}

export interface Alert {
  id: string;
  type: "hospital" | "traffic";
  severity: "warning" | "critical" | "info";
  title: string;
  message: string;
  source: string;
  timestamp: Date;
}

// ─── Utility Functions ───
export function getUtilizationStatus(percentage: number): UtilizationStatus {
  if (percentage > 100) return "OVERLOAD";
  if (percentage > 80) return "HIGH";
  if (percentage < 40) return "UNDERUSED";
  return "NORMAL";
}

export function getStatusColor(status: UtilizationStatus): string {
  switch (status) {
    case "OVERLOAD": return "destructive";
    case "HIGH": return "warning";
    case "UNDERUSED": return "primary";
    case "NORMAL": return "success";
  }
}

// ─── Hospital Data Generator ───
const hospitalNames = [
  "City General Hospital", "St. Mary's Medical Center", "Central Community Hospital",
  "Metro Health Institute", "Sunrise Medical Center", "Lakeside Hospital",
  "Unity Health Complex", "Greenview Medical", "Northside Regional Hospital",
  "Eastgate Medical Center"
];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateHospitals(): Hospital[] {
  return hospitalNames.map((name, i) => {
    const totalBeds = randInt(100, 500);
    const icuBeds = randInt(10, 50);
    const emergencyCapacity = randInt(20, 80);
    const ventilators = randInt(10, 40);
    const doctors = randInt(20, 80);
    const nurses = randInt(40, 150);
    return {
      id: `h-${i + 1}`,
      name,
      totalBeds,
      occupiedBeds: randInt(Math.floor(totalBeds * 0.3), Math.min(totalBeds + 20, totalBeds * 1.1)),
      icuBeds,
      icuOccupied: randInt(Math.floor(icuBeds * 0.2), Math.min(icuBeds + 5, icuBeds * 1.2)),
      emergencyCapacity,
      emergencyPatients: randInt(Math.floor(emergencyCapacity * 0.2), Math.min(emergencyCapacity + 10, emergencyCapacity * 1.3)),
      ventilators,
      ventilatorsInUse: randInt(Math.floor(ventilators * 0.1), Math.min(ventilators, ventilators)),
      doctors,
      nurses,
      waitingPatients: randInt(0, 40),
      ambulanceQueue: randInt(0, 8),
      lat: 28.5 + Math.random() * 0.3,
      lng: 77.1 + Math.random() * 0.3,
    };
  });
}

// ─── Road Data Generator ───
const roadNames = [
  "Main Highway A1", "Ring Road South", "Industrial Corridor", "Downtown Boulevard",
  "Airport Expressway", "River Bridge Road", "Tech Park Avenue", "Old City Route",
  "Northern Bypass", "Eastern Link Road", "Western Freeway", "Central Avenue",
  "Market Street", "University Road", "Hospital Access Road", "Station Road",
  "Lakefront Drive", "Hill Road", "Suburban Connector", "Commercial Strip"
];

export function generateRoads(): Road[] {
  return roadNames.map((name, i) => {
    const lanes = randInt(2, 6);
    const capacity = lanes * randInt(400, 800);
    const maxSpeed = lanes > 3 ? randInt(80, 120) : randInt(40, 60);
    const volume = randInt(Math.floor(capacity * 0.2), Math.floor(capacity * 1.3));
    const utilization = volume / capacity;
    return {
      id: `r-${i + 1}`,
      name,
      capacity,
      currentVolume: volume,
      avgSpeed: Math.max(5, Math.floor(maxSpeed * (1 - utilization * 0.7))),
      maxSpeed,
      length: randInt(2, 25),
      lanes,
      accidents: Math.random() > 0.8 ? randInt(1, 3) : 0,
      construction: Math.random() > 0.85,
      lat: 28.5 + Math.random() * 0.3,
      lng: 77.1 + Math.random() * 0.3,
    };
  });
}

// ─── Alert Generator ───
export function generateAlerts(hospitals: Hospital[], roads: Road[]): Alert[] {
  const alerts: Alert[] = [];
  let id = 0;

  hospitals.forEach(h => {
    const bedUtil = (h.occupiedBeds / h.totalBeds) * 100;
    const icuUtil = (h.icuOccupied / h.icuBeds) * 100;
    const status = getUtilizationStatus(bedUtil);

    if (status === "OVERLOAD") {
      alerts.push({ id: `a-${id++}`, type: "hospital", severity: "critical", title: "Hospital Overload", message: `${h.name} bed occupancy at ${bedUtil.toFixed(0)}%`, source: h.name, timestamp: new Date(Date.now() - randInt(0, 3600000)) });
    } else if (status === "HIGH") {
      alerts.push({ id: `a-${id++}`, type: "hospital", severity: "warning", title: "High Bed Occupancy", message: `${h.name} at ${bedUtil.toFixed(0)}% capacity`, source: h.name, timestamp: new Date(Date.now() - randInt(0, 3600000)) });
    }
    if (icuUtil > 90) {
      alerts.push({ id: `a-${id++}`, type: "hospital", severity: "critical", title: "ICU Shortage", message: `${h.name} ICU at ${icuUtil.toFixed(0)}%`, source: h.name, timestamp: new Date(Date.now() - randInt(0, 3600000)) });
    }
    if (h.waitingPatients > 25) {
      alerts.push({ id: `a-${id++}`, type: "hospital", severity: "warning", title: "Emergency Crowding", message: `${h.waitingPatients} patients waiting at ${h.name}`, source: h.name, timestamp: new Date(Date.now() - randInt(0, 3600000)) });
    }
  });

  roads.forEach(r => {
    const util = (r.currentVolume / r.capacity) * 100;
    const status = getUtilizationStatus(util);

    if (status === "OVERLOAD") {
      alerts.push({ id: `a-${id++}`, type: "traffic", severity: "critical", title: "Traffic Congestion", message: `${r.name} at ${util.toFixed(0)}% capacity`, source: r.name, timestamp: new Date(Date.now() - randInt(0, 3600000)) });
    } else if (status === "HIGH") {
      alerts.push({ id: `a-${id++}`, type: "traffic", severity: "warning", title: "Congestion Risk", message: `${r.name} approaching capacity (${util.toFixed(0)}%)`, source: r.name, timestamp: new Date(Date.now() - randInt(0, 3600000)) });
    }
    if (r.accidents > 0) {
      alerts.push({ id: `a-${id++}`, type: "traffic", severity: "critical", title: "Accident Reported", message: `${r.accidents} accident(s) on ${r.name}`, source: r.name, timestamp: new Date(Date.now() - randInt(0, 3600000)) });
    }
  });

  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// ─── Time Series Data ───
export function generateTimeSeriesData(hours = 24) {
  return Array.from({ length: hours }, (_, i) => {
    const hour = (new Date().getHours() - hours + i + 24) % 24;
    const isPeak = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19);
    const base = isPeak ? 75 : 45;
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      hospitalUtil: Math.min(100, base + randInt(-15, 20)),
      trafficUtil: Math.min(120, (isPeak ? 85 : 40) + randInt(-10, 25)),
      emergencyLoad: Math.min(100, (isPeak ? 70 : 35) + randInt(-10, 15)),
    };
  });
}
