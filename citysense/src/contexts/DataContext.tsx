import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  Hospital, Road, Alert,
  generateHospitals, generateRoads, generateAlerts, generateTimeSeriesData
} from "@/lib/mockData";

interface DataContextType {
  hospitals: Hospital[];
  roads: Road[];
  alerts: Alert[];
  timeSeries: ReturnType<typeof generateTimeSeriesData>;
  refreshData: () => void;
  lastUpdated: Date;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [roads, setRoads] = useState<Road[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [timeSeries, setTimeSeries] = useState<ReturnType<typeof generateTimeSeriesData>>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refreshData = useCallback(() => {
    const h = generateHospitals();
    const r = generateRoads();
    setHospitals(h);
    setRoads(r);
    setAlerts(generateAlerts(h, r));
    setTimeSeries(generateTimeSeriesData());
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [refreshData]);

  return (
    <DataContext.Provider value={{ hospitals, roads, alerts, timeSeries, refreshData, lastUpdated }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
