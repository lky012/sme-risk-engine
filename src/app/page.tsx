'use client';

import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  DollarSign,
  Info,
  LineChart,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  Frown,
  Loader2,
  Key
} from 'lucide-react';
import { mockPersonas, SMEPersona } from '@/lib/mockData';
import { calculateRiskScore, RiskScoreResult } from '@/lib/scoringEngine';
import { cn } from '@/lib/utils';

type AIAnalysisData = {
  Sentiment_Score: number;
  Key_Red_Flags: string[];
  Positive_Highlights: string[];
};

export default function DashboardPage() {
  const [selectedSmeId, setSelectedSmeId] = useState<string>('blossom-co');
  const [apiKey, setApiKey] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<Record<string, AIAnalysisData | null>>({});

  const selectedSme = mockPersonas[selectedSmeId];
  const currentAnalysis = analysisData[selectedSmeId] || null;

  // Calculate current risk score (falls back to default if AI hasn't run)
  const riskResult = calculateRiskScore(selectedSme, currentAnalysis?.Sentiment_Score ?? null);

  const handleRunAnalysis = async () => {
    if (!apiKey.trim()) {
      alert('Please enter your Gemini API Key first.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaName: selectedSme.name,
          reviews: selectedSme.reviews,
          apiKey: apiKey.trim(),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'API Request Failed');
      }

      const data = await response.json();
      setAnalysisData(prev => ({ ...prev, [selectedSmeId]: data as AIAnalysisData }));

    } catch (error: any) {
      console.error('Failed to run AI analysis:', error);
      alert(`Simulation failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'A': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'B': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'C': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'D': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">

      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-white">
              Vertex<span className="text-emerald-500">Risk</span>
            </h1>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-white/5 text-xs font-medium text-slate-400 border border-white/5">
              Alternative Data Engine
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  placeholder="Enter Gemini API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-white/20 transition-all w-[240px] text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

            <div className="flex items-center gap-3 hidden sm:flex">
              <div className="text-sm font-medium text-slate-400 whitespace-nowrap">Select Entity:</div>
              <div className="relative">
                <select
                  value={selectedSmeId}
                  onChange={(e) => setSelectedSmeId(e.target.value)}
                  className="appearance-none bg-slate-900 border border-white/10 rounded-lg pl-4 pr-10 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:border-white/20 transition-all cursor-pointer text-white"
                >
                  {Object.values(mockPersonas).map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">{selectedSme.name}</h2>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {selectedSme.type}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {selectedSme.cashRunwayMonths}mo Cash Runway</span>
            </div>
            <p className="mt-3 text-slate-300 max-w-2xl text-sm leading-relaxed">{selectedSme.description}</p>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className={cn(
              "group relative overflow-hidden rounded-lg px-6 py-3 font-semibold text-white transition-all shadow-lg hover:shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100",
              "bg-gradient-to-b from-emerald-500 to-emerald-600 border border-emerald-400/20"
            )}
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-2">
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running AI Analysis...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  Run AI Sentiment Search
                </>
              )}
            </div>
          </button>
        </div>

        {/* Top KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Main Risk Score Card */}
          <div className={cn(
            "col-span-1 rounded-2xl border bg-slate-900/50 p-6 flex flex-col justify-center items-center backdrop-blur-sm self-stretch",
            riskResult.score === 'A' ? 'border-emerald-500/30' :
              riskResult.score === 'B' ? 'border-blue-500/30' :
                riskResult.score === 'C' ? 'border-amber-500/30' : 'border-rose-500/30'
          )}>
            <div className="text-sm font-medium text-slate-400 mb-4 tracking-wide uppercase">Alternative Risk Grade</div>
            <div className={cn(
              "w-32 h-32 rounded-full border-4 flex items-center justify-center shadow-2xl mb-6",
              getScoreColor(riskResult.score).replace('bg-', '').replace('border-', 'shadow-').replace('text-', '') // hacky way to inherit glow
            )}>
              <span className={cn("text-6xl font-black", getScoreColor(riskResult.score).split(' ')[1])}>
                {riskResult.score}
              </span>
            </div>

            <div className="text-center px-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                {riskResult.score === 'A' || riskResult.score === 'B' ?
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                }
                <span className="font-semibold text-white">System Recommendation</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {riskResult.recommendation}
              </p>
            </div>
          </div>

          {/* Sub Scores */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Financial Health */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-blue-400" />
                  Financial Health
                </h3>
                <span className="text-2xl font-bold font-mono text-blue-400">{riskResult.financialScore}<span className="text-lg text-slate-500">/100</span></span>
              </div>

              <div className="flex-1 min-h-[160px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedSme.financials} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCogs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                    <XAxis dataKey="month" stroke="#ffffff40" fontSize={12} tickMargin={8} />
                    <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '8px' }}
                      itemStyle={{ color: '#f8fafc' }}
                    />
                    <Area type="monotone" dataKey="revenue" name="Rev (Mock" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="cogs" name="COGS" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorCogs)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Digital Footprint Score */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none" />

              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  Digital Sentiment
                </h3>
                <span className="text-2xl font-bold font-mono text-indigo-400">{riskResult.digitalScore}<span className="text-lg text-slate-500">/100</span></span>
              </div>

              {!currentAnalysis ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-3 bg-white/5 rounded-full">
                    <Info className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">Awaiting Analysis</p>
                    <p className="text-xs text-slate-500 max-w-[200px] mt-1">Run the AI Sentiment Search to scan thousands of data points.</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">LLM Sentiment Index</span>
                      <span className="font-medium text-white">{currentAnalysis.Sentiment_Score} / 100</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-2.5 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${currentAnalysis.Sentiment_Score}%`,
                          backgroundColor: currentAnalysis.Sentiment_Score > 70 ? '#10b981' : currentAnalysis.Sentiment_Score > 40 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {currentAnalysis.Key_Red_Flags.map((flag, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span className="text-slate-300 leading-snug">{flag}</span>
                      </li>
                    ))}
                    {currentAnalysis.Positive_Highlights.length > 0 && currentAnalysis.Key_Red_Flags.length === 0 && (
                      <li className="flex gap-3 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-300 leading-snug">Strong operational indicators detected.</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Detailed Insights Row */}
        {currentAnalysis && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-lg font-semibold text-white mb-4">Deep Dive: LLM Output</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Red Flags Container */}
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
                <h4 className="text-rose-400 font-medium mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Priority Operational Risks
                </h4>
                {currentAnalysis.Key_Red_Flags.length > 0 ? (
                  <ul className="space-y-3">
                    {currentAnalysis.Key_Red_Flags.map((flag, i) => (
                      <li key={i} className="bg-slate-900/50 border border-white/5 rounded-lg p-3 text-sm text-slate-300">
                        {flag}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 text-sm p-3 bg-slate-900/50 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" /> No major operational risks flagged by LLM.
                  </div>
                )}
              </div>

              {/* Positives Container */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <h4 className="text-emerald-400 font-medium mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Positive Business Indicators
                </h4>
                {currentAnalysis.Positive_Highlights.length > 0 ? (
                  <ul className="space-y-3">
                    {currentAnalysis.Positive_Highlights.map((flag, i) => (
                      <li key={i} className="bg-slate-900/50 border border-white/5 rounded-lg p-3 text-sm text-slate-300">
                        {flag}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 text-sm p-3 bg-slate-900/50 rounded-lg">
                    <Frown className="w-4 h-4" /> LLM detected zero positive reputation markers.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
