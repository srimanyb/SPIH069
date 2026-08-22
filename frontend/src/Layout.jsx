import { Outlet, NavLink } from 'react-router-dom';
import { Home, List, AlertTriangle, Activity, BarChart, Settings, Menu, Bell, Search, User } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const navItems = [
  { path: '/app', label: 'Dashboard', icon: Home },
  { path: '/app/requests', label: 'Requests', icon: List },
  { path: '/app/at-risk', label: 'At Risk', icon: AlertTriangle },
  { path: '/app/bottlenecks', label: 'Bottlenecks', icon: Activity },
  { path: '/app/reports', label: 'Reports', icon: BarChart },
  { path: '/app/upload', label: 'Data & Settings', icon: Settings },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Mobile sidebar backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Sleek Dark Theme */}
      <aside
        className={clsx(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-secondary text-secondary-foreground transition-transform duration-300 ease-in-out lg:transform-none flex flex-col m-4 rounded-3xl shadow-2xl lg:shadow-none lg:m-0 lg:rounded-none lg:border-r lg:border-slate-800",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0"
        )}
      >
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="font-bold text-white text-xl">B</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white leading-none">BidlyAI</h1>
            <p className="text-slate-400 text-xs font-medium mt-1">SMART TENDER PORTAL</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 text-[17px] font-medium",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                )
              }
            >
              <item.icon className="w-6 h-6" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-6">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <p className="font-semibold text-white">Dept. Manager</p>
              <p className="text-sm text-slate-400">Municipal Dept</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header Bar */}
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 lg:px-12 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Menu className="w-7 h-7" />
            </button>
            <div className="hidden md:flex relative w-full max-w-md">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tenders, requests, or IDs..." 
                className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white"></span>
            </button>
            <div className="hidden sm:flex w-12 h-12 bg-gradient-to-tr from-indigo-100 to-purple-100 border border-indigo-200 rounded-xl items-center justify-center">
              <span className="font-bold text-indigo-700">JD</span>
            </div>
          </div>
        </header>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto pb-24">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
