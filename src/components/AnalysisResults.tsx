import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  AudioLines,
  Wind,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Download,
  RotateCcw,
} from 'lucide-react';
import Waveform from './Waveform';
import CircularMeter from './CircularMeter';

export interface AnalysisData {
  authenticityScore: number; // 0-100 (higher = more authentic)
  confidence: number; // 0-100
  verdict: 'authentic' | 'suspicious' | 'fake';
  fileName: string;
  duration: string;
  anomalies: {
    pitch: number;
    spectral: number;
    breathing: number;
  };
}

interface AnalysisResultsProps {
  data: AnalysisData;
  onReset: () => void;
}

const verdictConfig = {
  authentic: {
    title: 'Likely Authentic',
    subtitle: 'Audio shows natural human voice characteristics',
    Icon: CheckCircle2,
    color: 'text-emerald-300',
    border: 'border-emerald-400/40',
    bg: 'bg-emerald-500/10',
    glow: 'shadow-[0_0_30px_rgba(52,211,153,0.25)]',
  },
  suspicious: {
    title: 'Potentially Manipulated',
    subtitle: 'Mixed signals detected — review anomalies below',
    Icon: AlertTriangle,
    color: 'text-amber-300',
    border: 'border-amber-400/40',
    bg: 'bg-amber-500/10',
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.25)]',
  },
  fake: {
    title: 'Likely Deepfake',
    subtitle: 'Synthetic voice patterns detected with high confidence',
    Icon: ShieldAlert,
    color: 'text-rose-300',
    border: 'border-rose-400/40',
    bg: 'bg-rose-500/10',
    glow: 'shadow-[0_0_30px_rgba(244,63,94,0.25)]',
  },
};

const anomalyMeta = [
  {
    key: 'pitch' as const,
    label: 'Pitch Inconsistencies',
    description: 'Unnatural shifts in vocal frequency',
    Icon: Activity,
  },
  {
    key: 'spectral' as const,
    label: 'Spectral Artifacts',
    description: 'Synthetic frequency signatures',
    Icon: AudioLines,
  },
  {
    key: 'breathing' as const,
    label: 'Breathing Patterns',
    description: 'Natural respiratory cues',
    Icon: Wind,
  },
];

const severity = (v: number) => {
  if (v < 30) return { label: 'Low', color: 'from-emerald-400 to-cyan-400', text: 'text-emerald-300' };
  if (v < 65) return { label: 'Moderate', color: 'from-amber-400 to-orange-400', text: 'text-amber-300' };
  return { label: 'High', color: 'from-rose-400 to-purple-500', text: 'text-rose-300' };
};

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data, onReset }) => {
  const v = verdictConfig[data.verdict];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-2xl mx-auto mt-8"
    >
      {/* Outer glow */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-cyan-400/30 via-purple-500/20 to-blue-500/30 blur-xl opacity-70" />
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-cyan-400/40 via-transparent to-purple-500/40" />

      <div className="relative rounded-3xl bg-[#0a0820]/60 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 shadow-2xl shadow-purple-950/40">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-300/70 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Analysis Complete
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Authenticity Report
            </h2>
            <p className="text-sm text-white/50 mt-1 truncate max-w-[260px] sm:max-w-md">
              {data.fileName} • {data.duration}
            </p>
          </div>
          <button
            onClick={onReset}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white/80 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Scan
          </button>
        </div>

        {/* Verdict + Meter */}
        <div className="grid grid-cols-1 sm:grid-cols-[auto,1fr] gap-6 items-center mb-6">
          <div className="flex justify-center">
            <CircularMeter value={data.authenticityScore} label="Authenticity" verdict={data.verdict} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={`relative rounded-2xl p-5 border ${v.border} ${v.bg} ${v.glow} backdrop-blur-md`}
          >
            <div className="flex items-center gap-3 mb-2">
              <v.Icon className={`w-5 h-5 ${v.color}`} />
              <span className={`text-base sm:text-lg font-semibold ${v.color}`}>
                {v.title}
              </span>
            </div>
            <p className="text-sm text-white/70 mb-4">{v.subtitle}</p>

            <div className="flex items-center justify-between text-xs text-white/60 mb-1.5">
              <span>Model Confidence</span>
              <span className="text-white font-medium tabular-nums">
                {data.confidence.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data.confidence}%` }}
                transition={{ delay: 0.7, duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500"
                style={{ boxShadow: '0 0 12px rgba(56, 189, 248, 0.5)' }}
              />
            </div>
          </motion.div>
        </div>

        {/* Waveform */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="rounded-2xl p-4 sm:p-5 border border-white/10 bg-black/30 backdrop-blur-md mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
              <AudioLines className="w-3.5 h-3.5 text-cyan-300" />
              Waveform Signature
            </div>
            <span className="text-[10px] text-white/40 tabular-nums">
              0:00 / {data.duration}
            </span>
          </div>
          <Waveform bars={72} seed={Math.round(data.authenticityScore)} />
        </motion.div>

        {/* Anomaly breakdown */}
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-cyan-300" />
            Detected Anomalies
          </div>
          <div className="space-y-3">
            {anomalyMeta.map((a, i) => {
              const value = data.anomalies[a.key];
              const sev = severity(value);
              return (
                <motion.div
                  key={a.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.12, duration: 0.5 }}
                  className="rounded-2xl p-4 border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-cyan-400/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center">
                        <a.Icon className="w-4 h-4 text-cyan-200" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {a.label}
                        </div>
                        <div className="text-xs text-white/50 truncate">
                          {a.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-sm font-semibold tabular-nums ${sev.text}`}>
                        {value.toFixed(0)}%
                      </div>
                      <div className={`text-[10px] uppercase tracking-wider ${sev.text}/80`}>
                        {sev.label}
                      </div>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ delay: 1 + i * 0.12, duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${sev.color}`}
                      style={{ boxShadow: '0 0 10px rgba(56, 189, 248, 0.3)' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6"
        >
          <button className="inline-flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all">
            <Download className="w-4 h-4" />
            Download Report
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white/90 border border-white/15 bg-white/5 hover:bg-white/10 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Analyze Another File
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalysisResults;
