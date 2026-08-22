import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchRequests } from '../api';
import { Search, Filter, AlertCircle, AlertTriangle, Clock } from 'lucide-react';

export default function RequestsList({ filterRisk = null }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [risk, setRisk] = useState(filterRisk || 'ALL');

  useEffect(() => {
    if (filterRisk) setRisk(filterRisk);
    loadData(search, filterRisk || risk);
  }, [filterRisk]);

  async function loadData(q = '', r = 'ALL') {
    try {
      setLoading(true);
      const data = await fetchRequests(q, r);
      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    loadData(search, risk);
  }

  function handleRiskChange(e) {
    const val = e.target.value;
    setRisk(val);
    loadData(search, val);
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          {filterRisk === 'HIGH' ? 'Critical Tenders' : 'All Tenders'}
        </h1>
        <p className="text-lg text-slate-500 font-medium">Manage and track service requests across departments.</p>
      </div>

      <div className="card p-4 mb-8 flex flex-col md:flex-row gap-4 bg-white/50 backdrop-blur-md">
        <form onSubmit={handleSearch} className="flex-1 flex relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID or service..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-[17px] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        
        {!filterRisk && (
          <div className="flex items-center gap-2 relative min-w-[200px]">
            <Filter className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <select
              value={risk}
              onChange={handleRiskChange}
              className="w-full pl-12 pr-10 py-3 rounded-xl border border-slate-200 text-[17px] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none bg-white font-medium shadow-sm"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk Only</option>
              <option value="MEDIUM">Medium Risk Only</option>
              <option value="LOW">Low Risk Only</option>
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-xl p-8 text-center text-slate-500 font-medium">Loading tenders...</div>
      ) : requests.length === 0 ? (
        <div className="card p-16 text-center border-dashed border-2 border-slate-300">
          <p className="text-2xl font-semibold text-slate-700">No tenders found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map(req => (
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
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-semibold tracking-wide">
                    {req.current_stage}
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
                  {req.risk_level === 'LOW' && (
                    <div className="flex items-center gap-2 text-success font-bold text-sm bg-success-light px-3 py-1.5 rounded-lg border border-emerald-200">
                       <CheckCircle className="w-5 h-5" />
                      LOW RISK
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
