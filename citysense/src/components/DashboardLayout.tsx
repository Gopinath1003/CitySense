import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border px-4 bg-white shadow-sm sticky top-0 z-10">
            <SidebarTrigger className="mr-3 text-slate-600 hover:text-slate-900" />
            <img
              src="/citysense-logo.jpeg"
              alt="CitySense"
              className="h-8 w-8 object-contain rounded mr-2"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-slate-800">CitySense</span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase">Infrastructure Monitor</span>
            </div>
            <div className="ml-auto flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-700 font-medium">LIVE</span>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
