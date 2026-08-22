import { useState, useEffect } from 'react';
import { fetchReports } from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Reports() {
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

  if (loading) return <div className="text-xl p-8 text-center text-gray-600">Loading reports...</div>;
  if (!data) return <div className="p-8 text-center text-danger">Failed to load reports.</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Department chart */}
        <div className="card p-6 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Delay Rate By Department</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.departments} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 16, fill: '#374151' }} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Delay Rate']}
                  contentStyle={{ fontSize: '18px', borderRadius: '8px' }}
                />
                <Bar dataKey="delay_rate" radius={[0, 4, 4, 0]}>
                  {data.departments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.delay_rate > 30 ? '#ef4444' : entry.delay_rate > 15 ? '#f59e0b' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stage chart */}
        <div className="card p-6 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Delay Rate By Stage</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.bottlenecks} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 16, fill: '#374151' }} angle={-45} textAnchor="end" />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Delay Rate']}
                  contentStyle={{ fontSize: '18px', borderRadius: '8px' }}
                />
                <Bar dataKey="delay_rate" radius={[4, 4, 0, 0]}>
                  {data.bottlenecks.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.delay_rate > 30 ? '#ef4444' : entry.delay_rate > 15 ? '#f59e0b' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
