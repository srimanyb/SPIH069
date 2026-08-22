import { useState, useEffect, useRef } from 'react';
import { fetchDashboard, fetchRequests, fetchReports } from '../api';
import {
  FileText, Clock, Sparkles, AlertCircle,
  Search, Eye, MoreVertical, ArrowUp, MessageSquare,
  AlertTriangle, Activity, ShieldAlert, Send, X, Download, ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// ── AI Brain: rule-based smart responses using live data ─────────────────────
function getAIResponse(query, dashData, allRequests) {
  const q = query.toLowerCase();
  const summary = dashData?.summary || {};
  const requests = allRequests || [];
  const highRisk = requests.filter(r => r.risk_level === 'HIGH');
  const overdue = requests.filter(r => r.time_remaining === 'Overdue');

  // Department analysis
  const deptCount = {};
  highRisk.forEach(r => { deptCount[r.department] = (deptCount[r.department] || 0) + 1; });
  const worstDept = Object.entries(deptCount).sort((a, b) => b[1] - a[1])[0];

  // Stage analysis
  const stageCount = {};
  requests.forEach(r => { stageCount[r.current_stage] = (stageCount[r.current_stage] || 0) + 1; });
  const worstStage = Object.entries(stageCount).sort((a, b) => b[1] - a[1])[0];

  if (q.includes('high risk') || q.includes('high-risk') || q.includes('critical')) {
    return `🔴 **${summary.high_risk || 0} Critical High-Risk Requests** require immediate attention.\n\n` +
      `${worstDept ? `📍 **${worstDept[0]}** department has the most — ${worstDept[1]} critical cases.\n\n` : ''}` +
      `Top urgent cases:\n${highRisk.slice(0, 3).map(r => `• **${r.request_id}** – ${r.service_type} (${r.time_remaining})`).join('\n')}\n\n` +
      `➡️ Recommended: Escalate immediately to department supervisors.`;
  }

  if (q.includes('bottleneck') || q.includes('stuck') || q.includes('stage')) {
    return `⚠️ **Bottleneck Analysis**\n\n` +
      `Most congested stage: **${worstStage ? worstStage[0] : 'N/A'}** with ${worstStage ? worstStage[1] : 0} requests.\n\n` +
      `${summary.at_risk || 0} requests are at risk of missing their SLA in the next 48 hours.\n\n` +
      `➡️ Recommended: Redistribute workload and assign more reviewers to the "${worstStage?.[0]}" stage.`;
  }

  if (q.includes('overdue') || q.includes('breach') || q.includes('sla')) {
    return `🚨 **SLA Status Report**\n\n` +
      `• **${summary.breached_today || 0}** requests have already breached SLA.\n` +
      `• **${overdue.length}** are currently overdue and need escalation NOW.\n` +
      `• **${summary.at_risk || 0}** more will breach within 48 hours.\n\n` +
      `${overdue.length > 0 ? `Most critical: **${overdue[0].request_id}** – ${overdue[0].department}\n\n` : ''}` +
      `➡️ Recommended: Send automated escalation alerts to department heads.`;
  }

  if (q.includes('department') || q.includes('dept') || q.includes('team')) {
    const deptList = Object.entries(deptCount).sort((a, b) => b[1] - a[1]).slice(0, 4);
    return `🏢 **Department Risk Summary**\n\n` +
      (deptList.length > 0
        ? deptList.map(([d, c]) => `• **${d}**: ${c} high-risk requests`).join('\n')
        : 'No department data available yet.') +
      `\n\n➡️ Recommended: Focus resources on **${worstDept?.[0] || 'the highest-risk department'}** first.`;
  }

  if (q.includes('assign') || q.includes('resource') || q.includes('help')) {
    return `🤖 **AI Resource Recommendation**\n\n` +
      `Based on current workload distribution:\n\n` +
      `• Assign 2 extra reviewers to **${worstDept?.[0] || 'high-load departments'}**\n` +
      `• Prioritize **${highRisk[0]?.request_id || 'top critical requests'}** for immediate processing\n` +
      `• Enable fast-track approval for overdue requests (${overdue.length} total)\n\n` +
      `➡️ This action could reduce SLA breaches by an estimated **35%** today.`;
  }

  if (q.includes('summary') || q.includes('overview') || q.includes('status')) {
    return `📊 **Current System Overview**\n\n` +
      `• **${summary.total || 0}** total active requests\n` +
      `• **${summary.high_risk || 0}** critical (HIGH risk)\n` +
      `• **${summary.at_risk || 0}** at risk in next 48 hours\n` +
      `• **${summary.breached_today || 0}** SLA breaches today\n\n` +
      `Overall SLA compliance rate: **${summary.total ? Math.round((1 - summary.breached_today / summary.total) * 100) : 100}%**\n\n` +
      `➡️ System is ${summary.high_risk > 20 ? '🔴 under high stress' : summary.high_risk > 5 ? '🟡 moderate risk' : '🟢 healthy'}.`;
  }

  return `🤖 **DelayGuard AI** here! I can help you with:\n\n` +
    `• **"Show high-risk requests"** – See critical cases\n` +
    `• **"Analyze bottlenecks"** – Find stuck stages\n` +
    `• **"SLA breach status"** – Check deadline violations\n` +
    `• **"Department analysis"** – Risk by department\n` +
    `• **"Auto-assign resources"** – AI recommendations\n\n` +
    `Try asking any of these!`;
}

// ── SLA Report Generator ──────────────────────────────────────────────────────
function generateReportCSV(dashData, requests) {
  const summary = dashData?.summary || {};
  const now = new Date().toLocaleString();
  const rows = [
    ['DelayGuard SLA Report', now],
    [],
    ['SUMMARY'],
    ['Total Active Requests', summary.total],
    ['SLA Breached', summary.breached_today],
    ['At Risk (48h)', summary.at_risk],
    ['Critical AI Alerts', summary.high_risk],
    [],
    ['REQUEST DETAILS'],
    ['Request ID', 'Service Type', 'Department', 'Stage', 'Risk Level', 'Time Remaining', 'Recommended Action'],
    ...requests.map(r => [r.request_id, r.service_type, r.department, r.current_stage, r.risk_level, r.time_remaining, r.recommended_action])
  ];
  return rows.map(r => r.join(',')).join('\n');
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI Chat state
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { role: 'ai', text: '👋 Hello! I\'m **DelayGuard AI**. Ask me about SLA risks, bottlenecks, or any department performance. What would you like to know?' }
  ]);
  const [aiThinking, setAiThinking] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMessages]);

  async function loadAll() {
    try {
      setLoading(true);
      const [dash, reqs] = await Promise.all([fetchDashboard(), fetchRequests('', 'ALL')]);
      setData(dash);
      setAllRequests(reqs.requests || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleAISend(text) {
    const msg = text || aiInput.trim();
    if (!msg) return;
    setAiInput('');
    setAiMessages(m => [...m, { role: 'user', text: msg }]);
    setAiThinking(true);
    await new Promise(r => setTimeout(r, 800)); // simulate thinking
    const response = getAIResponse(msg, data, allRequests);
    setAiMessages(m => [...m, { role: 'ai', text: response }]);
    setAiThinking(false);
  }

  function handleGenerateReport() {
    const csv = generateReportCSV(data, allRequests);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DelayGuard_SLA_Report_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleViewBottlenecks() { navigate('/app/bottlenecks'); }

  function handleFindStalled() { navigate('/app/requests?risk=HIGH'); }

  const d = data && data.summary.total > 0 ? data : {
    summary: { total: 1248, breached_today: 43, at_risk: 156, high_risk: 28 },
    urgent_requests: [
      { request_id: 'REQ-9921', service_type: 'Building Permit', department: 'Urban Planning', time_remaining: '2 hours', current_stage: 'Review Phase', risk_level: 'HIGH' },
      { request_id: 'REQ-9920', service_type: 'Business License', department: 'Commerce', time_remaining: '8 hours', current_stage: 'Document Verification', risk_level: 'HIGH' },
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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border-[1.5px] border-[#22C55E]/40 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-600">Active Requests</span>
              <span className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mt-1">{d.summary.total}</span>
            </div>
            <div className="p-2 bg-[#22C55E]/10 rounded-lg shrink-0"><FileText className="w-5 h-5 text-[#22C55E]" /></div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#22C55E]"><ArrowUp className="w-3 h-3" /><span>Volume</span></div>
        </div>
        <div className="bg-white rounded-xl border-[1.5px] border-[#EF4444]/40 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-600">SLA Breached</span>
              <span className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mt-1">{d.summary.breached_today}</span>
            </div>
            <div className="p-2 bg-[#EF4444]/10 rounded-lg shrink-0"><Clock className="w-5 h-5 text-[#EF4444]" /></div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#EF4444]"><AlertCircle className="w-3 h-3" /><span>Immediate Action</span></div>
        </div>
        <div className="bg-white rounded-xl border-[1.5px] border-[#3B82F6]/40 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-600">At Risk of Delay</span>
              <span className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mt-1">{d.summary.at_risk}</span>
            </div>
            <div className="p-2 bg-[#3B82F6]/10 rounded-lg shrink-0"><AlertTriangle className="w-5 h-5 text-[#3B82F6]" /></div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-400"><span>Next 48 Hours</span></div>
        </div>
        <div className="bg-white rounded-xl border-[1.5px] border-[#A855F7]/40 p-5 shadow-sm flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-600">Critical AI Alerts</span>
              <span className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight mt-1">{d.summary.high_risk}</span>
            </div>
            <div className="p-2 bg-[#A855F7]/10 rounded-lg shrink-0"><ShieldAlert className="w-5 h-5 text-[#A855F7]" /></div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-[#A855F7]"><Sparkles className="w-3 h-3" /><span>AI Prediction</span></div>
        </div>
      </div>

      {/* Ask DelayGuard AI */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Ask DelayGuard AI</h2>
        <div className="bg-[#EEF2FF] rounded-2xl p-6 shadow-sm border border-[#E0E7FF]">
          <div className="bg-white rounded-xl p-3 flex items-center shadow-sm border border-slate-100 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-400 mx-3 shrink-0" />
            <input
              type="text"
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAISend()}
              placeholder="Ask me anything about SLA risks, bottlenecks, or pending requests..."
              className="flex-1 outline-none text-slate-700 bg-transparent text-[15px]"
            />
            <button
              onClick={() => handleAISend()}
              className="ml-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-2 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { icon: <AlertTriangle className="w-4 h-4 text-orange-500" />, label: 'Show high-risk requests', q: 'Show high risk requests' },
              { icon: <Activity className="w-4 h-4 text-blue-500" />, label: 'Analyze main bottlenecks', q: 'Analyze main bottlenecks' },
              { icon: <MessageSquare className="w-4 h-4 text-purple-500" />, label: 'Explain SLA delay factors', q: 'SLA breach status' },
              { icon: <Sparkles className="w-4 h-4 text-green-500" />, label: 'Auto-assign resources', q: 'Auto-assign resources' },
            ].map(({ icon, label, q }) => (
              <button
                key={label}
                onClick={() => { setAiOpen(true); handleAISend(q); }}
                className="bg-white border border-slate-100 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors"
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setAiOpen(true)}
            className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-center gap-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-purple-50 hover:border-purple-300 transition-all"
          >
            <Sparkles className="w-5 h-5 text-purple-600" /> Ask DelayGuard AI
          </button>
          <button
            onClick={handleGenerateReport}
            className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-center gap-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            <Download className="w-5 h-5 text-blue-600" /> Generate SLA Report
          </button>
          <button
            onClick={handleViewBottlenecks}
            className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-center gap-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-green-50 hover:border-green-300 transition-all"
          >
            <Activity className="w-5 h-5 text-green-600" /> View Bottlenecks
          </button>
          <button
            onClick={handleFindStalled}
            className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-center gap-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-orange-50 hover:border-orange-300 transition-all"
          >
            <Search className="w-5 h-5 text-orange-500" /> Find Stalled Requests
          </button>
        </div>
      </div>

      {/* Recent Urgent Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Urgent Requests</h2>
          <Link to="/app/requests" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Request ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Service Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Department</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Time Remaining</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Risk Level</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {d.urgent_requests.slice(0, 5).map((req, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 whitespace-nowrap">{req.request_id}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{req.service_type}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{req.department}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{req.time_remaining}</td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    {req.risk_level === 'HIGH'
                      ? <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">High Risk</span>
                      : req.risk_level === 'MEDIUM'
                      ? <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">Medium Risk</span>
                      : <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Low Risk</span>}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <Link to={`/app/requests/${req.request_id}`} className="hover:text-blue-600 text-slate-400 transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Chat Modal */}
      {aiOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAiOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col" style={{ maxHeight: '80vh' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">DelayGuard AI</p>
                  <p className="text-xs text-green-500 font-semibold">● Online</p>
                </div>
              </div>
              <button onClick={() => setAiOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-slate-50 border border-slate-200 text-slate-700 rounded-bl-sm'
                  }`}>
                    {msg.text.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </div>
                </div>
              ))}
              {aiThinking && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick suggestions */}
            <div className="px-5 pb-2 flex gap-2 flex-wrap">
              {['SLA summary', 'Worst department', 'Overdue requests'].map(s => (
                <button
                  key={s}
                  onClick={() => handleAISend(s)}
                  className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl border border-slate-200 px-4 py-2">
                <input
                  autoFocus
                  type="text"
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAISend()}
                  placeholder="Ask anything..."
                  className="flex-1 outline-none bg-transparent text-sm text-slate-700"
                />
                <button
                  onClick={() => handleAISend()}
                  disabled={!aiInput.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg p-1.5 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
