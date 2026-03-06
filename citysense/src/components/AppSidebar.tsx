import {
  LayoutDashboard, Building2, Car, AlertTriangle, Info, LogOut, RefreshCw
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Hospitals", url: "/hospitals", icon: Building2 },
  { title: "Traffic", url: "/traffic", icon: Car },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
  { title: "About", url: "/about", icon: Info },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { logout, user } = useAuth();
  const { alerts, refreshData, lastUpdated } = useData();
  const criticalCount = alerts.filter(a => a.severity === "critical").length;

  return (
    <Sidebar collapsible="icon" className="border-r-0 shadow-md" style={{ background: "hsl(var(--sidebar-background))" }}>
      {/* Logo area */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
        <img
          src="/citysense-logo.jpeg"
          alt="CitySense"
          className="h-8 w-8 object-contain rounded flex-shrink-0"
        />
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-white font-bold text-sm">CitySense</span>
            <span className="text-white/40 text-[10px] uppercase tracking-widest">Monitor</span>
          </div>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/30 text-[10px] uppercase tracking-widest px-4 py-3">
            {collapsed ? "" : "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
                      activeClassName="bg-blue-500/20 text-blue-300 border border-blue-400/20 font-medium"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                      {!collapsed && item.title === "Alerts" && criticalCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center leading-tight">
                          {criticalCount}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-1 border-t border-white/10">
        {!collapsed && (
          <>
            <Button variant="ghost" size="sm" className="w-full justify-start text-white/40 hover:text-white hover:bg-white/10 text-xs" onClick={refreshData}>
              <RefreshCw className="mr-2 h-3 w-3" />
              Refresh · {lastUpdated.toLocaleTimeString()}
            </Button>
            <div className="text-[11px] text-white/30 px-2 truncate">{user?.username} ({user?.role})</div>
          </>
        )}
        <Button variant="ghost" size="sm" className="w-full justify-start text-white/50 hover:text-white hover:bg-white/10" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && "Logout"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
