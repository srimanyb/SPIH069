import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDashboard } from '../api';
import { AlertCircle, AlertTriangle, CheckCircle, Clock, TrendingUp, ShieldAlert, Sparkles, Activity } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDashboard();
      setData(res);
    } catch (err) {
      setError("We couldn't load the dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
      <Activity className="w-12 h-12 animate-pulse mb-4 text-primary" />
      <div className="text-xl font-medium">Analyzing smart tenders...</div>
    </div>
  );
  
  if (error) return (
    <div className="card p-12 text-center max-w-lg mx-auto mt-12">
      <AlertTriangle className="w-16 h-16 text-danger mx-auto mb-6" />
      <p className="text-xl text-slate-800 font-semibold mb-6">{error}</p>
      <button onClick={loadDashboard} className="btn-primary">TRY AGAIN</button>
    </div>
  );

  if (!data || data.summary.total === 0) {
    return (
      <div className="card p-16 text-center mt-8 max-w-2xl mx-auto border-dashed border-2 border-slate-300">
        <Sparkles className="w-16 h-16 text-primary mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4 text-slate-900">Welcome to BidlyAI</h2>
        <p className="text-slate-500 mb-10 text-lg">Upload your tender data or load the demo dataset to let our AI engine analyze your SLA risks.</p>
        <Link to="/upload" className="btn-primary shadow-lg shadow-indigo-500/30">GET STARTED</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Smart Overview</h1>
          <p className="text-lg text-slate-500 font-medium">AI-powered insights for today's active tenders.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200 text-sm font-semibold text-slate-600">
          <span className="w-2.5 h-2.5 bg-success rounded-full animate-pulse"></span>
          AI ENGINE ACTIVE
        </div>
      </div>

      {/* Bento Box Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-primary">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-slate-500 font-semibold text-sm tracking-wider mb-2 uppercase">Total Requests</p>
          <p className="text-5xl font-bold text-slate-900">{data.summary.total.toLocaleString()}</p>
        </div>
        
        <div className="card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-warning-light rounded-2xl flex items-center justify-center mb-6 text-warning">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-slate-500 font-semibold text-sm tracking-wider mb-2 uppercase">At Risk</p>
          <p className="text-5xl font-bold text-slate-900">{data.summary.at_risk.toLocaleString()}</p>
        </div>

        {/* AI Highlight Card */}
        <div className="card p-6 ai-gradient shadow-lg shadow-indigo-500/25 border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-bl-full backdrop-blur-3xl"></div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-white backdrop-blur-md border border-white/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <p className="text-white/80 font-semibold text-sm tracking-wider mb-2 uppercase">Critical AI Alerts</p>
          <p className="text-5xl font-bold text-white">{data.summary.high_risk.toLocaleString()}</p>
        </div>

        <div className="card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="w-12 h-12 bg-danger-light rounded-2xl flex items-center justify-center mb-6 text-danger">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-slate-500 font-semibold text-sm tracking-wider mb-2 uppercase">Breached Today</p>
          <p className="text-5xl font-bold text-slate-900">{data.summary.breached_today.toLocaleString()}</p>
        </div>
      </div>

      {/* Urgent Requests List */}
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          Smart Prioritization
        </h2>
        <Link to="/requests" className="text-primary font-semibold hover:underline">View All Requests</Link>
      </div>
      
      {data.urgent_requests.length === 0 ? (
        <div className="card p-12 text-center bg-slate-50/50 border-dashed border-2">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <p className="text-2xl font-semibold text-slate-800">Perfect. No tenders require urgent intervention.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data.urgent_requests.map(req => (
            <div key={req.request_id} className="card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-l-4 hover:-translate-y-1 transition-all duration-300" style={{ borderLeftColor: req.risk_level === 'HIGH' ? '#EF4444' : req.risk_level === 'MEDIUM' ? '#F59E0B' : '#10B981'}}>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-bold text-xl text-slate-900">{req.request_id}</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold tracking-wide">
                    {req.service_type}
                  </span>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold tracking-wide">
                    {req.department}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {req.risk_level === 'HIGH' && (
                    <div className="flex items-center gap-2 text-danger font-bold text-sm bg-danger-light px-3 py-1.5 rounded-lg border border-red-200">
                      <AlertCircle className="w-5 h-5" />
                      HIGH AI RISK: {req.risk_score}%
                    </div>
                  )}
                  {req.risk_level === 'MEDIUM' && (
                    <div className="flex items-center gap-2 text-warning font-bold text-sm bg-warning-light px-3 py-1.5 rounded-lg border border-amber-200">
                      <AlertTriangle className="w-5 h-5" />
                      MEDIUM RISK: {req.risk_score}%
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm bg-slate-100 px-3 py-1.5 rounded-lg">
                    <Clock className="w-5 h-5 text-slate-400" />
                    {req.time_remaining}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 lg:mt-0">
                <Link to={`/requests/${req.request_id}`} className="btn-outline border-slate-200 hover:border-primary hover:text-primary whitespace-nowrap bg-transparent shadow-none">
                  Analyze Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
