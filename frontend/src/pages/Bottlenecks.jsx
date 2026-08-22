import { useState, useEffect } from 'react';
import { fetchReports } from '../api';
import { Activity, AlertTriangle } from 'lucide-react';

export default function Bottlenecks() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetchReports();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
      <Activity className="w-12 h-12 animate-pulse mb-4 text-primary" />
      <div className="text-xl font-medium">Analyzing bottlenecks...</div>
    </div>
  );
  if (!data) return <div className="p-8 text-center text-danger font-medium">Failed to load bottlenecks.</div>;

  const topStage = data.bottlenecks.length > 0 ? data.bottlenecks[0] : null;

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Smart Bottlenecks</h1>
        <p className="text-lg text-slate-500 font-medium">AI-identified stages and departments where tenders are stalling.</p>
      </div>

      {topStage && topStage.delay_rate > 20 && (
        <div className="card p-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-none shadow-lg shadow-indigo-500/10 mb-12">
          <div className="flex items-center gap-3 mb-3">
             <AlertTriangle className="w-8 h-8 text-indigo-600" />
             <h2 className="text-2xl font-bold text-indigo-900">AI Recommended Focus</h2>
          </div>
          <p className="text-xl text-indigo-800 leading-relaxed">
            <strong>{topStage.name}</strong> is currently the largest source of SLA delays with a <span className="font-bold underline decoration-indigo-400 decoration-2">{topStage.delay_rate}% delay rate</span>. We recommend reallocating resources here immediately.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Stages */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4 mb-8">Delay Rate By Stage</h2>
          <div className="space-y-8">
            {data.bottlenecks.map(item => (
              <div key={item.name}>
                <div className="flex justify-between items-end mb-3">
                  <h3 className="text-xl font-bold text-slate-800">{item.name}</h3>
                  <span className={`text-lg font-bold px-3 py-1 rounded-lg ${item.delay_rate > 20 ? 'bg-danger-light text-danger border border-red-200' : 'bg-slate-100 text-slate-600'}`}>
                    {item.delay_rate}% Delay Rate
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${item.delay_rate > 30 ? 'bg-danger' : item.delay_rate > 15 ? 'bg-warning' : 'bg-success'}`}
                    style={{ width: `${item.delay_rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4 mb-8">Delay Rate By Department</h2>
          <div className="space-y-8">
            {data.departments.map(item => (
              <div key={item.name}>
                <div className="flex justify-between items-end mb-3">
                  <h3 className="text-xl font-bold text-slate-800">{item.name}</h3>
                  <span className={`text-lg font-bold px-3 py-1 rounded-lg ${item.delay_rate > 20 ? 'bg-danger-light text-danger border border-red-200' : 'bg-slate-100 text-slate-600'}`}>
                    {item.delay_rate}% Delay Rate
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${item.delay_rate > 30 ? 'bg-danger' : item.delay_rate > 15 ? 'bg-warning' : 'bg-success'}`}
                    style={{ width: `${item.delay_rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
