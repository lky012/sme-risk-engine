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
  Key,
  FileText
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
      case 'A': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'B': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'C': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'D': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">

      {/* Corporate Top Navbar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Vertex<span className="text-blue-600">Risk</span>
            </h1>
            <span className="ml-2 px-2.5 py-1 rounded-md bg-slate-100 text-xs font-semibold text-slate-600 border border-slate-200">
              Corporate Credit System
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
                  className="bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-slate-400 transition-all w-[240px] text-slate-900 placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex items-center gap-3 hidden sm:flex">
              <div className="text-sm font-semibold text-slate-600 whitespace-nowrap">Active Entity:</div>
              <div className="relative">
                <select
                  value={selectedSmeId}
                  onChange={(e) => setSelectedSmeId(e.target.value)}
                  className="appearance-none bg-white border border-slate-300 rounded-lg pl-4 pr-10 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:border-slate-400 transition-all cursor-pointer text-slate-900 shadow-sm"
                >
                  {Object.values(mockPersonas).map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">{selectedSme.name}</h2>
            <div className="flex items-center gap-3 text-slate-600 font-medium">
              <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-slate-500" /> {selectedSme.type}</span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-slate-500" /> {selectedSme.cashRunwayMonths} Mo Cash Runway</span>
            </div>
            <p className="mt-3 text-slate-600 max-w-2xl text-sm leading-relaxed">{selectedSme.description}</p>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className={cn(
              "group relative overflow-hidden rounded-lg px-6 py-3 font-bold text-white transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100",
              "bg-blue-600 hover:bg-blue-700 border border-transparent"
            )}
          >
            <div className="flex items-center gap-2">
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Alternative Data...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  Run Risk Analysis Engine
                </>
              )}
            </div>
          </button>
        </div>

        {/* Top KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Main Risk Score Card */}
          <div className="col-span-1 rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-center items-center shadow-sm self-stretch relative overflow-hidden">
            <div className="absolute top-0 w-full h-1.5 bg-slate-200" />
            <div className={cn(
              "absolute top-0 left-0 h-1.5 transition-all duration-1000",
              riskResult.score === 'A' ? 'bg-emerald-500 w-[95%]' :
                riskResult.score === 'B' ? 'bg-blue-500 w-[75%]' :
                  riskResult.score === 'C' ? 'bg-amber-500 w-[50%]' : 'bg-rose-500 w-[20%]'
            )} />

            <div className="text-xs font-bold text-slate-500 mb-4 tracking-widest uppercase mt-2">Final Risk Grade</div>
            <div className={cn(
              "w-28 h-28 rounded-full border-4 flex items-center justify-center mb-6 shadow-sm",
              getScoreColor(riskResult.score)
            )}>
              <span className={cn("text-5xl font-black")}>
                {riskResult.score}
              </span>
            </div>

            <div className="text-center px-4 w-full">
              <div className="flex items-center justify-center gap-2 mb-3 bg-slate-50 py-2 rounded-md border border-slate-100">
                {riskResult.score === 'A' || riskResult.score === 'B' ?
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                }
                <span className="font-bold text-slate-800 text-sm">Decision Output</span>
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {riskResult.recommendation}
              </p>
            </div>
          </div>

          {/* Sub Scores */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Financial Health */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-slate-400" />
                  Financial Baseline
                </h3>
                <span className="text-xl font-bold font-mono text-slate-800">{riskResult.financialScore}<span className="text-sm text-slate-400">/100</span></span>
              </div>

              <div className="flex-1 min-h-[160px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedSme.financials} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCogs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#e2e8f0" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickMargin={8} axisLine={false} tickLine={false} />
                    <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '6px', color: '#0f172a', fontWeight: 600, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="cogs" name="COGS" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorCogs)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Digital Footprint Score */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-slate-400" />
                  Digital Sentiment
                </h3>
                <span className="text-xl font-bold font-mono text-slate-800">{riskResult.digitalScore}<span className="text-sm text-slate-400">/100</span></span>
              </div>

              {!currentAnalysis ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <Info className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-bold text-slate-600">Pending LLM Analysis</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-[200px] mx-auto">Run the risk analysis engine to quantify customer sentiment.</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                      <span className="text-slate-500">AI Confidence Index</span>
                      <span className="text-slate-900">{currentAnalysis.Sentiment_Score} / 100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                      <div
                        className="h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${currentAnalysis.Sentiment_Score}%`,
                          backgroundColor: currentAnalysis.Sentiment_Score > 70 ? '#059669' : currentAnalysis.Sentiment_Score > 40 ? '#d97706' : '#dc2626'
                        }}
                      />
                    </div>
                  </div>

                  <ul className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {currentAnalysis.Key_Red_Flags.map((flag, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium leading-snug">{flag}</span>
                      </li>
                    ))}
                    {currentAnalysis.Positive_Highlights.length > 0 && currentAnalysis.Key_Red_Flags.length === 0 && (
                      <li className="flex gap-3 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium leading-snug">Strong operational indicators detected by NLP model.</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Data Inspector Pipeline: Raw vs Analyzed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 border-t border-slate-200 pt-8">

          {/* Left: Raw Syntheti Data */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-500" />
              Raw Input Data Pipeline
            </h3>
            <p className="text-sm text-slate-500 mb-4 font-medium">
              The unstructured customer review data that is fed into the LLM during analysis.
            </p>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-[400px] flex flex-col">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 text-xs font-mono text-slate-500 font-semibold flex justify-between">
                <span>// SELECT text FROM reviews WHERE target = '{selectedSmeId}'</span>
                <span>{selectedSme.reviews.length} Rows</span>
              </div>
              <div className="overflow-y-auto p-4 space-y-4 flex-1 custom-scrollbar">
                {selectedSme.reviews.map((review, i) => (
                  <div key={i} className="text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-700">{review.platform}</span>
                      <span className="text-xs text-slate-400">{review.date}</span>
                      <span className="text-xs font-medium px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">★ {review.rating}</span>
                    </div>
                    <p className="text-slate-600">"{review.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: LLM Output */}
          <div className="animate-in fade-in duration-700">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-500" />
              LLM Extraction Output
            </h3>
            <p className="text-sm text-slate-500 mb-4 font-medium">
              The structured JSON response generated by Gemini extracting actionable risk signals.
            </p>

            {!currentAnalysis ? (
              <div className="h-[400px] bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-center">
                <p className="text-slate-400 font-medium">Run analysis to view structured output.</p>
              </div>
            ) : (
              <div className="h-[400px] flex flex-col gap-4">
                <div className="bg-white border border-rose-200 rounded-xl p-5 shadow-sm">
                  <h4 className="text-rose-700 font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <ShieldAlert className="w-4 h-4" /> Extracted Operational Risks
                  </h4>
                  {currentAnalysis.Key_Red_Flags.length > 0 ? (
                    <ul className="space-y-2">
                      {currentAnalysis.Key_Red_Flags.map((flag, i) => (
                        <li key={i} className="bg-rose-50 border border-rose-100 rounded-lg p-3 text-sm text-rose-900 font-medium">
                          {flag}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No major operational risks flagged by LLM.
                    </div>
                  )}
                </div>

                <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm">
                  <h4 className="text-emerald-700 font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4" /> Extracted Positive Signals
                  </h4>
                  {currentAnalysis.Positive_Highlights.length > 0 ? (
                    <ul className="space-y-2">
                      {currentAnalysis.Positive_Highlights.map((flag, i) => (
                        <li key={i} className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-sm text-emerald-900 font-medium">
                          {flag}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <Frown className="w-4 h-4" /> LLM detected zero positive reputation markers.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
