import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Music, UploadCloud, FileAudio, X, Check, Loader2 } from 'lucide-react';
import AnalysisResults, { AnalysisData } from './AnalysisResults';

const tiers = [
  { value: 'free', label: 'Free', meta: '30s • 3MB' },
  { value: 'tier1', label: 'Tier 1', meta: '1min • 4MB' },
  { value: 'tier2', label: 'Tier 2', meta: '2min • 8MB' },
  { value: 'tier3', label: 'Tier 3', meta: '5min • 20MB' },
];

const languages = [
  { value: 'auto', label: 'Auto Detect' },
  { value: 'en-global', label: 'English (US/Global)' },
  { value: 'en-in', label: 'English (Indian Accent)' },
];

interface DropdownProps<T extends { value: string; label: string; meta?: string }> {
  options: T[];
  value: string;
  onChange: (v: string) => void;
}

function Dropdown<T extends { value: string; label: string; meta?: string }>({
  options,
  value,
  onChange,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setTimeout(() => setOpen(false), 120);
        }}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl bg-black/40 backdrop-blur-md border text-left transition-all duration-300 ${
          focused || open
            ? 'border-cyan-400/60 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        <span className="text-sm">
          <span className="text-white">{selected?.label}</span>
          {selected?.meta && (
            <span className="ml-2 text-cyan-300/70 text-xs">({selected.meta})</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-cyan-300 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <motion.div
        initial={false}
        animate={{
          opacity: open ? 1 : 0,
          y: open ? 0 : -8,
          pointerEvents: open ? 'auto' : 'none',
        }}
        transition={{ duration: 0.2 }}
        className="absolute z-30 mt-2 w-full rounded-xl bg-[#0b0820]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-900/40 overflow-hidden"
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onMouseDown={() => {
              onChange(opt.value);
              setOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition ${
              opt.value === value
                ? 'bg-cyan-500/10 text-cyan-200'
                : 'text-white/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span>
              {opt.label}
              {opt.meta && (
                <span className="ml-2 text-xs text-cyan-300/60">({opt.meta})</span>
              )}
            </span>
            {opt.value === value && <Check className="w-4 h-4 text-cyan-300" />}
          </button>
        ))}
      </motion.div>
    </div>
  );
}

const formatDuration = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const generateAnalysis = (file: File): AnalysisData => {
  // Pseudo-random but stable per filename for a believable demo
  let h = 0;
  for (let i = 0; i < file.name.length; i++) h = (h * 31 + file.name.charCodeAt(i)) >>> 0;
  const r = (offset: number) => {
    const x = Math.sin(h + offset) * 10000;
    return x - Math.floor(x);
  };

  const score = 15 + r(1) * 80; // 15 - 95
  const verdict: AnalysisData['verdict'] =
    score > 70 ? 'authentic' : score > 40 ? 'suspicious' : 'fake';

  // Anomalies inversely correlated to authenticity
  const base = 100 - score;
  const jitter = () => (r(Math.random() * 100) - 0.5) * 30;

  return {
    authenticityScore: score,
    confidence: 70 + r(2) * 28,
    verdict,
    fileName: file.name,
    duration: formatDuration(20 + r(3) * 100),
    anomalies: {
      pitch: Math.max(5, Math.min(95, base + jitter())),
      spectral: Math.max(5, Math.min(95, base + jitter())),
      breathing: Math.max(5, Math.min(95, base + jitter())),
    },
  };
};

const UploadCard: React.FC = () => {
  const [tier, setTier] = useState('free');
  const [lang, setLang] = useState('auto');
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | null) => {
    if (!f) return;
    setFile(f);
    setResults(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleAnalyze = () => {
    if (!file || analyzing) return;
    setAnalyzing(true);
    setResults(null);
    setTimeout(() => {
      setResults(generateAnalysis(file));
      setAnalyzing(false);
      // Smoothly scroll to results
      setTimeout(() => {
        const el = document.getElementById('analysis-results');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }, 2200);
  };

  const handleReset = () => {
    setResults(null);
    setFile(null);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative w-full max-w-2xl mx-auto"
      >
        {/* Outer glow */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-cyan-400/30 via-purple-500/20 to-blue-500/30 blur-xl opacity-70" />
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-cyan-400/40 via-transparent to-purple-500/40" />

        <div className="relative rounded-3xl bg-[#0a0820]/60 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 shadow-2xl shadow-purple-950/40">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Upload Audio File
            </h2>
            <p className="text-sm sm:text-base text-white/60 mt-2">
              Upload your audio file for authenticity analysis
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs text-cyan-200/80 mb-2 font-medium tracking-wide uppercase">
                API Tier
              </label>
              <Dropdown options={tiers} value={tier} onChange={setTier} />
            </div>
            <div>
              <label className="block text-xs text-cyan-200/80 mb-2 font-medium tracking-wide uppercase">
                Language
              </label>
              <Dropdown options={languages} value={lang} onChange={setLang} />
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".mp3,.wav,.m4a,audio/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />

          <motion.div
            onClick={() => !analyzing && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            whileHover={{ scale: analyzing ? 1 : 1.01 }}
            whileTap={{ scale: analyzing ? 1 : 0.99 }}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 px-6 py-10 sm:py-12 flex flex-col items-center justify-center text-center overflow-hidden ${
              isDragging
                ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_40px_rgba(56,189,248,0.4)]'
                : 'border-white/15 bg-white/[0.02] hover:border-cyan-400/50 hover:bg-cyan-400/[0.04] hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]'
            } ${analyzing ? 'pointer-events-none opacity-80' : ''}`}
          >
            <motion.div
              className="absolute w-32 h-32 rounded-full border border-cyan-400/30"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-600/30 backdrop-blur flex items-center justify-center border border-white/10 mb-4 shadow-lg shadow-cyan-500/20">
              {analyzing ? (
                <Loader2 className="w-7 h-7 text-cyan-200 animate-spin" />
              ) : file ? (
                <FileAudio className="w-7 h-7 text-cyan-200" />
              ) : (
                <Music className="w-7 h-7 text-cyan-200" />
              )}
            </div>

            {file ? (
              <div className="relative flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30">
                <UploadCloud className="w-4 h-4 text-cyan-300" />
                <span className="text-sm text-cyan-100 font-medium truncate max-w-[200px] sm:max-w-xs">
                  {file.name}
                </span>
                {!analyzing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <>
                <p className="relative text-base sm:text-lg font-medium text-white">
                  Drop audio file here
                </p>
                <p className="relative text-sm text-white/50 mt-1">
                  or click to browse (MP3, WAV, M4A)
                </p>
              </>
            )}
          </motion.div>

          {file && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleAnalyze}
              disabled={analyzing}
              className="mt-5 w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing audio patterns...
                </>
              ) : (
                'Analyze Audio'
              )}
            </motion.button>
          )}
        </div>
      </motion.div>

      <div id="analysis-results">
        <AnimatePresence>
          {results && !analyzing && (
            <AnalysisResults data={results} onReset={handleReset} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default UploadCard;
