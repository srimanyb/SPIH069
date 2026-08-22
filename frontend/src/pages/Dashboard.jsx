import { useState, useEffect } from 'react';
import { fetchDashboard } from '../api';
import { 
  FileText, Clock, CalendarDays, Award, Sparkles, Paperclip, AlertCircle, 
  Search, Eye, MoreVertical, ArrowUp, Edit3, MessageSquare, AlertTriangle, Activity, ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const res = await fetchDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Fallback data structure for styling purposes based on the screenshot layout
  const d = data && data.summary.total > 0 ? data : {
    summary: { total: 1248, breached_today: 43, at_risk: 156, high_risk: 28 },
    urgent_requests: [
      { request_id: 'REQ-9921', service_type: 'Building Permit', department: 'Urban Planning', time_remaining: '2 Hours left', current_stage: 'Review Phase', risk_level: 'HIGH' },
      { request_id: 'REQ-9920', service_type: 'Business License', department: 'Commerce', time_remaining: '1 Day left', current_stage: 'Document Verification', risk_level: 'HIGH' },
      { request_id: 'REQ-9919', service_type: 'Health Inspection', department: 'Public Health', time_remaining: 'Overdue', current_stage: 'Assigned', risk_level: 'HIGH' }
    ]
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="font-medium">Loading Dashboard...</div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
        <p className="text-lg text-slate-600">Welcome back, Department Officer.</p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Green */}
        <div className="bg-white rounded-xl border-[1.5px] border-[#22C55E]/40 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-600">Active Requests</span>
              <span className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mt-1">
                {d.summary.total}
              </span>
            </div>
            <div className="p-2 bg-[#22C55E]/10 rounded-lg shrink-0">
              <FileText className="w-5 h-5 text-[#22C55E]" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#22C55E]">
            <ArrowUp className="w-3 h-3 shrink-0" />
            <span>Volume</span>
          </div>
        </div>

        {/* Card 2: Red */}
        <div className="bg-white rounded-xl border-[1.5px] border-[#EF4444]/40 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-600">SLA Breached</span>
              <span className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mt-1">
                {d.summary.breached_today}
              </span>
            </div>
            <div className="p-2 bg-[#EF4444]/10 rounded-lg shrink-0">
              <Clock className="w-5 h-5 text-[#EF4444]" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#EF4444]">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>Immediate Action</span>
          </div>
        </div>

        {/* Card 3: Blue */}
        <div className="bg-white rounded-xl border-[1.5px] border-[#3B82F6]/40 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-600">At Risk of Delay</span>
              <span className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mt-1">
                {d.summary.at_risk}
              </span>
            </div>
            <div className="p-2 bg-[#3B82F6]/10 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5 text-[#3B82F6]" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
            <span>Next 48 Hours</span>
          </div>
        </div>

        {/* Card 4: Purple */}
        <div className="bg-white rounded-xl border-[1.5px] border-[#A855F7]/40 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-600">Critical AI Alerts</span>
              <span className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mt-1">
                {d.summary.high_risk}
              </span>
            </div>
            <div className="p-2 bg-[#A855F7]/10 rounded-lg shrink-0">
              <ShieldAlert className="w-5 h-5 text-[#A855F7]" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#A855F7]">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>AI Prediction</span>
          </div>
        </div>
      </div>

      {/* Ask Bidly Section -> Ask DelayGuard */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Ask DelayGuard AI</h2>
        <div className="bg-[#EEF2FF] rounded-2xl p-6 shadow-sm border border-[#E0E7FF]">
          <div className="bg-white rounded-xl p-3 flex items-center shadow-sm border border-slate-100 mb-4">
            <Sparkles className="w-5 h-5 text-slate-400 mx-3" />
            <input 
              type="text" 
              placeholder="Ask me anything about SLA risks, bottlenecks, or pending requests..." 
              className="flex-1 outline-none text-slate-700 bg-transparent text-[15px]"
            />
            <div className="flex items-center gap-3 px-3 border-l border-slate-100">
              <button className="text-slate-400 hover:text-slate-600 transition-colors"><Paperclip className="w-5 h-5" /></button>
              <button className="text-slate-400 hover:text-slate-600 transition-colors"><div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center text-[10px] font-bold">P</div></button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="bg-white border border-slate-100 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 flex items-center gap-2 shadow-sm hover:bg-slate-50">
              <AlertTriangle className="w-4 h-4 text-orange-500" /> Show high-risk requests
            </button>
            <button className="bg-white border border-slate-100 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 flex items-center gap-2 shadow-sm hover:bg-slate-50">
              <Activity className="w-4 h-4 text-blue-500" /> Analyze main bottlenecks
            </button>
            <button className="bg-white border border-slate-100 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 flex items-center gap-2 shadow-sm hover:bg-slate-50">
              <MessageSquare className="w-4 h-4 text-purple-500" /> Explain SLA delay factors
            </button>
            <button className="bg-white border border-slate-100 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 flex items-center gap-2 shadow-sm hover:bg-slate-50">
              <Sparkles className="w-4 h-4 text-green-500" /> Auto-assign resources
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-center gap-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
            <Sparkles className="w-5 h-5 text-purple-600" /> Ask DelayGuard AI
          </button>
          <button className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-center gap-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
            <FileText className="w-5 h-5 text-blue-600" /> Generate SLA Report
          </button>
          <button className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-center gap-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
            <Activity className="w-5 h-5 text-green-600" /> View Bottlenecks
          </button>
          <button className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-center gap-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
            <Search className="w-5 h-5 text-orange-500" /> Find Stalled Requests
          </button>
        </div>
      </div>

      {/* Recent Tenders -> Recent Urgent Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Urgent Requests</h2>
          <Link to="/app/requests" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
            View all requests &rarr;
          </Link>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Request ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Service Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Department</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">SLA Deadline</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Risk Level</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {d.urgent_requests.slice(0, 3).map((req, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 whitespace-nowrap">{req.request_id}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{req.service_type}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{req.department}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{req.time_remaining}</td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    {req.risk_level === 'HIGH' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        High AI Risk
                      </span>
                    ) : req.risk_level === 'MEDIUM' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                        Medium Risk
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Low Risk
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Link to={`/app/requests/${req.request_id}`} className="hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></Link>
                      <button className="hover:text-slate-600 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
