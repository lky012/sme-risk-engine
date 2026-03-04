'use client';

import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  Activity,
  AlertOctagon,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Database,
  FileText,
  Key,
  LineChart,
  Loader2,
  Lock,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  AlertTriangle
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Syncing': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Warning':
      case 'Stale': return 'text-amber-700 bg-amber-50 border-amber-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-blue-200">
      {/* Enterprise Top Navbar */}
      <header className="bg-[#0b2136] text-white sticky top-0 z-50 shadow-md border-b border-slate-700">
        <div className="px-6 h-14 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-bold tracking-tight text-lg">
              <Building2 className="w-5 h-5 text-blue-400" />
              <span>Global Corporate Bank</span>
            </div>
            <div className="h-4 w-px bg-slate-600 mx-2"></div>
            <span className="text-slate-300 font-medium">SME Risk Assessment Engine</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              INTERNAL USE ONLY
            </span>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="Session API Key (BYOK)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-[#1a365d] border border-slate-600 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-blue-400 w-48 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Target Entity:</span>
              <div className="relative">
                <select
                  value={selectedSmeId}
                  onChange={(e) => setSelectedSmeId(e.target.value)}
                  className="appearance-none bg-[#1a365d] border border-slate-600 rounded pl-3 pr-8 py-1.5 text-xs font-semibold focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  {Object.values(mockPersonas).map(p => (
                    <option key={p.id} value={p.id}>{p.brn} - {p.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Corporate Dashboard */}
      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-4">

        {/* Entity Profile Ribbon */}
        <div className="bg-white border border-slate-300 shadow-sm rounded-sm p-4 flex flex-wrap lg:flex-nowrap justify-between items-start gap-6">
          <div className="flex-1 min-w-[300px]">
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-2xl font-bold text-slate-800">{selectedSme.name}</h2>
              <span className="px-2 py-1 rounded-sm text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                {selectedSme.type}
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-4">{selectedSme.description}</p>

            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">BRN</span>
                <span className="font-mono text-slate-700 font-medium">{selectedSme.brn}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">Incorp. Date</span>
                <span className="text-slate-700 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {selectedSme.incorporationDate}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">Risk Profile</span>
                <span className="text-slate-700 font-medium flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {selectedSme.baseRisk} (Baseline)
                </span>
              </div>
            </div>
          </div>

          <div className="w-px bg-slate-200 hidden lg:block h-24"></div>

          {/* Integrations Status Panel */}
          <div className="flex-1 min-w-[350px]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> API Data Source Integrations
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-200 rounded-sm p-2.5 bg-slate-50">
                <div className="text-[11px] text-slate-500 mb-1 flex justify-between">
                  <span>Accounting / ERP</span>
                  <span className={cn("px-1.5 rounded-[3px] border text-[10px] font-bold", getStatusColor(selectedSme.integrations.accounting.status))}>
                    {selectedSme.integrations.accounting.status}
                  </span>
                </div>
                <div className="font-semibold text-sm text-slate-800">{selectedSme.integrations.accounting.provider}</div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <RefreshCcw className="w-3 h-3" /> Last sync: {selectedSme.integrations.accounting.lastSync}
                </div>
              </div>
              <div className="border border-slate-200 rounded-sm p-2.5 bg-slate-50">
                <div className="text-[11px] text-slate-500 mb-1 flex justify-between">
                  <span>Payment Gateway</span>
                  <span className={cn("px-1.5 rounded-[3px] border text-[10px] font-bold", getStatusColor(selectedSme.integrations.payment.status))}>
                    {selectedSme.integrations.payment.status}
                  </span>
                </div>
                <div className="font-semibold text-sm text-slate-800">{selectedSme.integrations.payment.provider}</div>
                <div className="text-[10px] text-slate-600 mt-1 flex justify-between w-full font-medium">
                  <span>Vol YoY: {selectedSme.integrations.payment.volumeYoy > 0 ? '+' : ''}{selectedSme.integrations.payment.volumeYoy}%</span>
                  <span>CB Rate: {selectedSme.integrations.payment.chargebackRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-[#f8fafc] border border-slate-300 shadow-sm p-3 flex justify-between items-center rounded-sm">
          <div className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-blue-600" />
            Execute alternative data modeling to append unstructured digital sentiment to financial base score.
          </div>
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className={cn(
              "rounded-sm px-6 py-2 text-sm font-bold text-white transition-all shadow-sm disabled:opacity-50",
              "bg-[#0b2136] hover:bg-[#1a365d] border border-slate-800"
            )}
          >
            <div className="flex items-center gap-2">
              {isAnalyzing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Fetching NLP Inference...</>
              ) : (
                <><Activity className="w-4 h-4" /> Run AI Risk Engine</>
              )}
            </div>
          </button>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* Column 1: Credit Decision Result */}
          <div className="col-span-1 border border-slate-300 bg-white rounded-sm p-5 shadow-sm flex flex-col items-center justify-center relative overflow-hidden h-[300px]">
            <div className="absolute top-0 w-full h-1 bg-slate-200" />
            <div className={cn(
              "absolute top-0 left-0 h-1 transition-all duration-1000",
              riskResult.score === 'A' ? 'bg-emerald-500 w-[95%]' :
                riskResult.score === 'B' ? 'bg-blue-500 w-[75%]' :
                  riskResult.score === 'C' ? 'bg-amber-500 w-[50%]' : 'bg-rose-500 w-[20%]'
            )} />

            <div className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Final Basel Grade</div>

            <div className={cn(
              "w-24 h-24 rounded-full border-4 flex items-center justify-center my-4 shadow-sm",
              getScoreColor(riskResult.score)
            )}>
              <span className="text-4xl font-black">{riskResult.score}</span>
            </div>

            <div className="text-center w-full px-2">
              <div className="flex items-center justify-center gap-1.5 mb-2 rounded bg-slate-50 py-1.5 border border-slate-200 text-xs shadow-sm">
                {riskResult.score === 'A' || riskResult.score === 'B' ?
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> :
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                }
                <span className="font-bold text-slate-700">System Decision</span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {riskResult.recommendation}
              </p>
            </div>
          </div>

          {/* Column 2 & 3: Financial Chart */}
          <div className="col-span-1 lg:col-span-2 border border-slate-300 bg-white rounded-sm p-4 shadow-sm flex flex-col h-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <LineChart className="w-4 h-4 text-slate-500" />
                Trailing 12-Month Cashflow (Derived)
              </h3>
              <div className="text-right">
                <span className="text-xs text-slate-400 block uppercase tracking-wider font-bold mb-0.5">Fin Score</span>
                <span className="font-mono text-lg font-bold text-slate-800">{riskResult.financialScore}<span className="text-xs text-slate-400">/100</span></span>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={selectedSme.financials} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCogs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickMargin={8} axisLine={false} tickLine={false} />
                  <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '4px', fontSize: '12px', color: '#1e293b', fontWeight: 600, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" name="Revenue HKD" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="cogs" name="COGS HKD" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorCogs)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Column 4: Digital Footprint Signals */}
          <div className="col-span-1 border border-slate-300 bg-white rounded-sm p-4 shadow-sm flex flex-col h-[300px]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-500" />
                Alternative Digital Score
              </h3>
              <div className="text-right">
                <span className="text-xs text-slate-400 block uppercase tracking-wider font-bold mb-0.5">Alt Score</span>
                <span className="font-mono text-lg font-bold text-slate-800">{riskResult.digitalScore}<span className="text-xs text-slate-400">/100</span></span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 mt-2">
              {!currentAnalysis ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 border border-dashed border-slate-300 bg-slate-50 rounded-sm p-4">
                  <AlertOctagon className="w-5 h-5 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-500">NLP module standing by.</p>
                  <p className="text-[10px] text-slate-400">Run risk engine to inject unstructured OSINT data.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-sm">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1.5 text-slate-600">
                      <span>Sentiment Confidence</span>
                      <span className="text-slate-900">{currentAnalysis.Sentiment_Score}/100</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-sm h-1.5 overflow-hidden">
                      <div
                        className="h-full transition-all duration-1000 ease-out"
                        style={{ width: `${currentAnalysis.Sentiment_Score}%`, backgroundColor: currentAnalysis.Sentiment_Score > 70 ? '#059669' : currentAnalysis.Sentiment_Score > 40 ? '#d97706' : '#dc2626' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">Extracted NLP Risk Vectors</div>
                    {currentAnalysis.Key_Red_Flags.map((flag, idx) => (
                      <div key={idx} className="flex gap-2 text-xs items-start bg-rose-50/50 p-2 rounded-sm border border-rose-100">
                        <TrendingDown className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium leading-tight">{flag}</span>
                      </div>
                    ))}
                    {currentAnalysis.Positive_Highlights.length > 0 && currentAnalysis.Key_Red_Flags.length === 0 && (
                      <div className="flex gap-2 text-xs items-start bg-emerald-50/50 p-2 rounded-sm border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium leading-tight">No significant operational risks detected in recent unstructured data.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Unstructured Data Inspector */}
        <div className="border border-slate-300 bg-white shadow-sm rounded-sm mt-4">
          <div className="bg-slate-50 border-b border-slate-300 p-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              OSINT Raw Data Ingestion Stream
            </h3>
            <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded-sm border border-slate-300">
              {selectedSme.reviews.length} RECORDS FOUND
            </span>
          </div>
          <div className="p-3 h-[250px] overflow-y-auto bg-slate-900 custom-scrollbar font-mono text-xs">
            {selectedSme.reviews.map((review, i) => (
              <div key={i} className="text-slate-300 border-b border-slate-800 pb-2 mb-2 last:border-0">
                <div className="flex items-center gap-3 mb-1 text-[10px]">
                  <span className="text-blue-400 font-bold">[{review.platform.toUpperCase()}]</span>
                  <span className="text-slate-500">{review.date}</span>
                  <span className="text-emerald-400">RATING_VAL: {review.rating}/5</span>
                </div>
                <p className="text-slate-100">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
