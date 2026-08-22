import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, List, AlertTriangle, Activity, BarChart, Settings, MoreVertical, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { path: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/requests', label: 'All Requests', icon: List },
  { path: '/app/at-risk', label: 'At Risk', icon: AlertTriangle },
  { path: '/app/bottlenecks', label: 'Bottlenecks', icon: Activity },
  { path: '/app/reports', label: 'Reports', icon: BarChart },
  { path: '/app/upload', label: 'Data & Settings', icon: Settings },
];

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#FAFAFC] overflow-hidden font-sans">
      
      {/* Sidebar - Pure White Light Theme */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-full flex-shrink-0 z-10 relative shadow-[2px_0_15px_-3px_rgba(0,0,0,0.02)]">
        <div>
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center shadow-sm">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">DelayGuard</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-3 py-6 flex flex-col gap-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                    isActive
                      ? "bg-slate-50 text-slate-900"
                      : "text-slate-500 hover:bg-slate-50/50 hover:text-slate-800"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={clsx("w-5 h-5", isActive ? "text-[#2563EB]" : "text-slate-400")} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
        
        {/* User Profile */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-xl cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-600 font-bold">
                DO
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Dept. Officer</p>
                <p className="text-xs text-slate-500">Gov. Administration</p>
              </div>
            </div>
            <MoreVertical className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-[1200px] mx-auto p-8 lg:p-12 pb-24">
          <Outlet />
        </div>
      </main>
      
    </div>
  );
}
