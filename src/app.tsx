import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Type, 
  Zap, 
  Brain, 
  RefreshCw, 
  Eye, 
  MessageSquare,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { analyzeText } from './lib/analyzer';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DEFAULT_MESSY = `I remember the kitchen... wait, no, it was the hallway. It was dark, really dark, and I could smell that old wood floor. Like, you know, that dusty smell? I was running, I think. Actually, I was walking fast. My heart was thumping. Thump, thump, thump. I reached for the handle and it was cold. So cold. I mean, it felt like ice.`;

const DEFAULT_POLISHED = `I recall the hallway vividly. The atmosphere was oppressive and the air carried the distinct, musty scent of aged oak flooring. I moved with urgent steps, my pulse quickening with every second. When I finally reached for the brass door handle, the metal was freezing, reminiscent of winter ice.`;

export default function App() {
  const [draft1, setDraft1] = useState(DEFAULT_MESSY);
  const [draft2, setDraft2] = useState(DEFAULT_POLISHED);
  const [activeTab, setActiveTab] = useState<'input' | 'analysis'>('input');

  const analysis1 = useMemo(() => analyzeText(draft1), [draft1]);
  const analysis2 = useMemo(() => analyzeText(draft2), [draft2]);

  const radarData = [
    { subject: 'Rhythm', A: analysis1.sentenceRhythm, B: analysis2.sentenceRhythm, fullMark: 100 },
    { subject: 'Repetition', A: analysis1.repetitionScore, B: analysis2.repetitionScore, fullMark: 100 },
    { subject: 'Fillers', A: Math.min(100, (analysis1.fillerCount / (analysis1.wordCount || 1)) * 1000), B: Math.min(100, (analysis2.fillerCount / (analysis2.wordCount || 1)) * 1000), fullMark: 100 },
    { subject: 'Sensory', A: analysis1.sensoryScore, B: analysis2.sensoryScore, fullMark: 100 },
    { subject: 'Correction', A: Math.min(100, (analysis1.correctionCount / 5) * 100), B: Math.min(100, (analysis2.correctionCount / 5) * 100), fullMark: 100 },
  ];

  const scoreData = [
    { name: 'Draft 1 (Messy)', score: analysis1.humanSignalScore, color: '#10b981' },
    { name: 'Draft 2 (Polished)', score: analysis2.humanSignalScore, color: '#6366f1' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] font-sans selection:bg-[#10b981] selection:text-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-serif italic font-black tracking-tighter leading-none text-[#f5f5f5]">Computational Portrait</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mt-3 font-mono text-[#10b981]">Measuring the Human Signal in Text</p>
        </div>
        <div className="flex gap-4 font-mono text-xs">
          <button 
            onClick={() => setActiveTab('input')}
            className={cn(
              "px-4 py-2 border border-white/10 transition-all",
              activeTab === 'input' ? "bg-[#f5f5f5] text-[#0a0a0a]" : "hover:bg-white/5"
            )}
          >
            01. INPUT
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            className={cn(
              "px-4 py-2 border border-white/10 transition-all",
              activeTab === 'analysis' ? "bg-[#f5f5f5] text-[#0a0a0a]" : "hover:bg-white/5"
            )}
          >
            02. ANALYSIS
          </button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'input' ? (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                <div className="space-y-4">
                <div className="flex items-center gap-2 opacity-40 font-mono text-xs uppercase tracking-wider">
                  <Type size={14} />
                  <span>Version A: The Messy Draft</span>
                </div>
                <textarea 
                  value={draft1}
                  onChange={(e) => setDraft1(e.target.value)}
                  className="w-full h-[400px] bg-white/5 border border-white/10 p-6 focus:outline-none focus:ring-1 focus:ring-[#10b981]/50 resize-none font-mono text-sm leading-relaxed text-[#f5f5f5]"
                  placeholder="Paste your unedited, raw memory here..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 opacity-40 font-mono text-xs uppercase tracking-wider">
                  <RefreshCw size={14} />
                  <span>Version B: The Polished Edit</span>
                </div>
                <textarea 
                  value={draft2}
                  onChange={(e) => setDraft2(e.target.value)}
                  className="w-full h-[400px] bg-white/5 border border-white/10 p-6 focus:outline-none focus:ring-1 focus:ring-[#10b981]/50 resize-none font-mono text-sm leading-relaxed text-[#f5f5f5]"
                  placeholder="Paste your edited, refined version here..."
                />
              </div>

              <div className="md:col-span-2 flex justify-center pt-8">
                <button 
                  onClick={() => setActiveTab('analysis')}
                  className="group flex items-center gap-4 px-8 py-4 bg-[#f5f5f5] text-[#0a0a0a] font-mono text-sm hover:bg-[#10b981] transition-all"
                >
                  GENERATE PORTRAIT
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="analysis"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="space-y-12"
            >
              {/* Score Comparison */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 border border-white/10 p-8 bg-white/5">
                  <h3 className="font-serif italic font-bold text-3xl mb-8 text-[#10b981]">Human Signal Score</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scoreData} layout="vertical" margin={{ left: 40, right: 40 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 12, fontFamily: 'monospace', fill: '#f5f5f5', opacity: 0.6 }}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: '#f5f5f5', fontFamily: 'monospace' }}
                        />
                        <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={40}>
                          {scoreData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-8 font-mono text-[10px] uppercase tracking-widest opacity-40">
                    <div>
                      <p>Draft A: {analysis1.humanSignalScore.toFixed(1)}%</p>
                      <p className="mt-1">Word Count: {analysis1.wordCount}</p>
                    </div>
                    <div>
                      <p>Draft B: {analysis2.humanSignalScore.toFixed(1)}%</p>
                      <p className="mt-1">Word Count: {analysis2.wordCount}</p>
                    </div>
                  </div>
                </div>

                <div className="border border-white/10 p-8 bg-white/5 text-[#f5f5f5] flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Brain size={80} />
                  </div>
                  <Brain className="mb-4 text-[#10b981]" size={32} />
                  <h3 className="font-serif italic font-bold text-3xl mb-4">The Paradox</h3>
                  <p className="text-base leading-relaxed opacity-70 font-sans font-light">
                    While Version A often scores higher due to "messy" markers like self-correction and fillers, the gap is frequently narrower than expected.
                  </p>
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-[10px] font-mono uppercase tracking-widest opacity-40 text-[#10b981]">Observation</p>
                    <p className="text-lg mt-3 italic opacity-90 font-serif leading-snug">
                      "Authenticity is elusive. We can detect the patterns of a human mind, but we cannot fully extract the feeling of being one."
                    </p>
                  </div>
                </div>
              </section>

              {/* Feature Breakdown */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-white/10 p-8 bg-white/5">
                  <h3 className="font-serif italic font-bold text-3xl mb-8 flex items-center gap-3">
                    <Activity size={24} className="text-[#10b981]" />
                    Feature Comparison
                  </h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#f5f5f5" strokeOpacity={0.1} />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontFamily: 'monospace', fill: '#f5f5f5', opacity: 0.6 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                          name="Draft A"
                          dataKey="A"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.4}
                        />
                        <Radar
                          name="Draft B"
                          dataKey="B"
                          stroke="#6366f1"
                          fill="#6366f1"
                          fillOpacity={0.2}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: '#f5f5f5', fontFamily: 'monospace' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-4">
                  <FeatureCard 
                    icon={<Zap size={18} />}
                    title="Sentence Rhythm"
                    description="Variation in sentence length. High variation suggests a more natural, conversational flow."
                    val1={analysis1.sentenceRhythm}
                    val2={analysis2.sentenceRhythm}
                  />
                  <FeatureCard 
                    icon={<Eye size={18} />}
                    title="Sensory Detail"
                    description="Presence of words related to sight, sound, smell, touch, and taste."
                    val1={analysis1.sensoryScore}
                    val2={analysis2.sensoryScore}
                  />
                  <FeatureCard 
                    icon={<MessageSquare size={18} />}
                    title="Self-Correction"
                    description="Markers like 'I mean' or 'actually' that indicate a mind actively processing memory."
                    val1={Math.min(100, (analysis1.correctionCount / 3) * 100)}
                    val2={Math.min(100, (analysis2.correctionCount / 3) * 100)}
                  />
                  <FeatureCard 
                    icon={<RefreshCw size={18} />}
                    title="Repetition"
                    description="Lexical density. Higher repetition can signal emotional intensity or informal speech."
                    val1={analysis1.repetitionScore}
                    val2={analysis2.repetitionScore}
                  />
                </div>
              </section>

              <div className="flex justify-center pb-12">
                <button 
                  onClick={() => setActiveTab('input')}
                  className="px-6 py-3 border border-white/10 font-mono text-xs hover:bg-[#10b981] hover:text-[#0a0a0a] transition-all"
                >
                  RE-RUN EXPERIMENT
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="border-t border-white/10 p-6 text-center">
        <div className="flex items-center justify-center gap-2 opacity-30 text-[10px] font-mono uppercase tracking-widest">
          <Info size={12} />
          <span>This tool uses deterministic heuristics to map linguistic patterns to human signals.</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  val1, 
  val2 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  val1: number, 
  val2: number 
}) {
  return (
    <div className="border border-white/10 p-6 bg-white/5">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[#10b981] opacity-80">{icon}</span>
        <h4 className="font-serif italic font-bold text-xl text-[#f5f5f5]">{title}</h4>
      </div>
      <p className="text-sm opacity-50 mb-6 leading-relaxed text-[#f5f5f5] font-sans font-light">{description}</p>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-[#f5f5f5] opacity-60">
          <span>Draft A</span>
          <span>{val1.toFixed(0)}%</span>
        </div>
        <div className="h-1 bg-white/5 w-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${val1}%` }}
            className="h-full bg-[#10b981]"
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider mt-2 text-[#f5f5f5] opacity-60">
          <span>Draft B</span>
          <span>{val2.toFixed(0)}%</span>
        </div>
        <div className="h-1 bg-white/5 w-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${val2}%` }}
            className="h-full bg-[#6366f1] opacity-60"
          />
        </div>
      </div>
    </div>
  );
}
