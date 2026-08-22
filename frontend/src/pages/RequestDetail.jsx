import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchRequestDetail } from '../api';
import { AlertCircle, ArrowLeft, CheckCircle, Clock, Sparkles, ShieldAlert, GitCommit, Activity } from 'lucide-react';

const STAGES = ["Submitted", "Verification", "Review", "Approval", "Completion"];

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [req, setReq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      const data = await fetchRequestDetail(id);
      setReq(data);
    } catch (err) {
      setError("We couldn't load this request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
      <Activity className="w-12 h-12 animate-pulse mb-4 text-primary" />
      <div className="text-xl font-medium">Loading smart analysis...</div>
    </div>
  );
  if (error) return (
    <div className="p-8 text-center max-w-lg mx-auto">
      <p className="text-xl text-danger font-medium mb-6">{error}</p>
      <button onClick={() => navigate(-1)} className="btn-outline">GO BACK</button>
    </div>
  );
  if (!req) return null;

  const currentStageIndex = STAGES.indexOf(req.current_stage);

  return (
    <div className="max-w-5xl mx-auto">
      <Link to={-1} className="inline-flex items-center text-slate-500 hover:text-primary mb-8 text-sm font-bold tracking-wide uppercase transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Smart Overview
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold text-slate-900">{req.request_id}</h1>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold uppercase tracking-wider border border-indigo-100">
              {req.department}
            </span>
          </div>
          <p className="text-2xl text-slate-600 font-medium">{req.service_type}</p>
        </div>
        <div className="flex gap-3">
           <button className="btn-outline shadow-sm">View History</button>
           <button className="btn-primary shadow-lg shadow-indigo-500/30">Take Action</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Risk Level */}
        <div className={`card p-8 col-span-1 lg:col-span-1 border-t-4 ${req.risk_level === 'HIGH' ? 'border-t-danger bg-gradient-to-b from-red-50 to-white' : req.risk_level === 'MEDIUM' ? 'border-t-warning bg-gradient-to-b from-amber-50 to-white' : 'border-t-success bg-gradient-to-b from-emerald-50 to-white'}`}>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">AI Risk Assessment</h2>
          <div className={`flex items-center gap-4 mb-2 ${req.risk_level === 'HIGH' ? 'text-danger' : req.risk_level === 'MEDIUM' ? 'text-warning' : 'text-success'}`}>
            {req.risk_level === 'HIGH' ? <ShieldAlert className="w-10 h-10" /> : <CheckCircle className="w-10 h-10" />}
            <span className="text-4xl font-bold">{req.risk_level}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <p className="text-5xl font-black text-slate-900">{req.risk_score}%</p>
            <p className="text-sm font-medium text-slate-500 uppercase">Probability</p>
          </div>
        </div>

        {/* Time Remaining */}
        <div className="card p-8 col-span-1 lg:col-span-2 flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">SLA Countdown</h2>
          <div className="flex items-center gap-6 text-slate-900 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <span className="text-4xl font-bold block">{req.time_remaining}</span>
              <span className="text-slate-500 font-medium">Until SLA Breach</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-xl p-4 mt-4 flex justify-between items-center">
            <span className="text-slate-500 font-medium">Target Deadline:</span>
            <span className="font-bold text-slate-900">
              {new Date(req.sla_deadline).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Why is this request at risk? */}
        <div className="col-span-1 lg:col-span-2 space-y-8">
          <div className="card p-8">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-primary" />
              Smart Analysis
            </h2>
            
            {req.risk_level !== 'LOW' ? (
              <div className="space-y-4">
                {req.reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-primary">
                      {idx + 1}
                    </span>
                    <span className="text-lg text-slate-700 font-medium pt-1">{reason}</span>
                  </div>
                ))}
              </div>
            ) : (
               <div className="flex items-start gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-success">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                  <span className="text-lg text-slate-700 font-medium pt-1">Request is progressing normally. No SLA risks detected.</span>
                </div>
            )}
          </div>

          {/* Current Status Timeline */}
          <div className="card p-8 overflow-hidden">
            <h2 className="text-xl font-bold text-slate-900 mb-8">
              Workflow Timeline
            </h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-100 rounded-full z-0"></div>
              <div className="space-y-8 relative z-10">
                {STAGES.map((stage, idx) => {
                  const isPast = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  
                  return (
                    <div key={stage} className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm border-4 border-white
                        ${isPast ? 'bg-success text-white' : isCurrent ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-slate-100 text-slate-400'}`}
                      >
                        {isPast ? <CheckCircle className="w-6 h-6" /> : <GitCommit className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className={`text-lg font-bold ${isCurrent ? 'text-primary' : isPast ? 'text-slate-900' : 'text-slate-400'}`}>
                          {stage}
                        </p>
                        {isCurrent && <p className="text-primary font-bold text-xs uppercase tracking-wider mt-1">Current Stage</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="col-span-1">
          <div className="card p-8 ai-gradient shadow-lg shadow-indigo-500/20 border-none sticky top-28">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-white backdrop-blur-md border border-white/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-2">AI Recommendation</h2>
            <h3 className="text-2xl font-bold text-white mb-6 leading-tight">{req.recommended_action}</h3>
            
            <button className="w-full bg-white text-primary font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-slate-50 transition-colors">
              Execute Action
            </button>
            <button className="w-full bg-transparent border-2 border-white/30 text-white font-bold text-lg py-3 rounded-xl hover:bg-white/10 transition-colors mt-4">
              Reassign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
