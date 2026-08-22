import { Link } from 'react-router-dom';
import { ShieldAlert, TrendingUp, Sparkles, Activity, Clock, CheckCircle } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="border-b border-slate-200/50 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white text-xl">B</span>
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">BidlyAI</span>
          </div>
          <div className="hidden md:flex gap-8 text-slate-600 font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
          </div>
          <div>
            <Link to="/app" className="btn-primary shadow-lg shadow-indigo-500/25">
              Launch Smart Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold mb-8">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered SLA Management</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-8">
            Predict SLA Delays <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Before They Happen
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop reacting to breached tenders. BidlyAI analyzes historical patterns to identify high-risk bottlenecks and recommends immediate actions to keep your department on track.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/app" className="btn-primary w-full sm:w-auto text-xl py-6 px-10 shadow-xl shadow-indigo-500/30">
              Enter Dashboard
            </Link>
            <Link to="/app/upload" className="btn-outline w-full sm:w-auto text-xl py-6 px-10">
              Try Demo Data
            </Link>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need to Protect Your SLA</h2>
            <p className="text-xl text-slate-500">A completely autonomous suite for smart tender management.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-10 md:col-span-2 bg-gradient-to-br from-slate-50 to-white">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Predictive Risk Engine</h3>
              <p className="text-lg text-slate-500 leading-relaxed mb-8">
                Our hybrid machine learning engine analyzes time elapsed, department workloads, and historical delay rates to assign a probability score to every single active request.
              </p>
              <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm w-max">
                 <ShieldAlert className="w-6 h-6 text-danger" />
                 <span className="font-bold text-slate-800">82% Chance of SLA Breach</span>
              </div>
            </div>

            <div className="card p-10 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Smart Actions</h3>
              <p className="text-lg text-indigo-100 leading-relaxed">
                Don't just stare at metrics. BidlyAI gives you clear, plain-language recommendations on exactly who to escalate to and why.
              </p>
            </div>

            <div className="card p-10 md:col-span-3 bg-slate-50 border-none flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Bottleneck Detection</h3>
                <p className="text-lg text-slate-500 leading-relaxed">
                  Instantly identify which departments and which specific workflow stages are causing systemic delays across your organization.
                </p>
              </div>
              <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                      <span>Approval Stage</span>
                      <span className="text-danger">38% Delay Rate</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-danger w-[38%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                      <span>Verification</span>
                      <span className="text-warning">21% Delay Rate</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-warning w-[21%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 bg-slate-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl font-bold text-white mb-8">Ready to secure your SLA?</h2>
          <p className="text-2xl text-slate-400 mb-12">
            Load our synthetic hackathon demo data right now and see the engine in action.
          </p>
          <Link to="/app/upload" className="btn-primary text-xl py-6 px-12 shadow-2xl shadow-indigo-500/50 hover:-translate-y-1">
            Try the Demo Flow
          </Link>
        </div>
      </section>
    </div>
  );
}
