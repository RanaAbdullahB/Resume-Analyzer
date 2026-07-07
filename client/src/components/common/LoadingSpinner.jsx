import { Loader2 } from 'lucide-react';

// ── Spinner ───────────────────────────────────────────────────────────────
export default function LoadingSpinner({ size = 24, className = '' }) {
  return (
    <Loader2
      size={size}
      className={`animate-spin text-brand-400 ${className}`}
    />
  );
}

// ── Full-page loading overlay ─────────────────────────────────────────────
export function PageLoader({ message = 'Loading…' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-base">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-2 border-surface-border" />
          <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
        </div>
        <p className="text-sm text-slate-400">{message}</p>
      </div>
    </div>
  );
}

// ── Skeleton line ─────────────────────────────────────────────────────────
export function Skeleton({ className = '' }) {
  return (
    <div className={`shimmer rounded-md ${className}`} aria-hidden="true" />
  );
}

// ── Card skeleton for dashboard placeholders ──────────────────────────────
export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="card p-5 space-y-3 animate-fade-in">
      <Skeleton className="h-4 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}

// ── AI Thinking loader (for analysis in progress) ────────────────────────
export function AnalysisLoader() {
  const steps = [
    'Reading resume content…',
    'Parsing job requirements…',
    'Matching skills and keywords…',
    'Scoring ATS compatibility…',
    'Generating recommendations…',
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 gap-8">
      {/* Animated rings */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-brand-500/30 animate-spin" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" style={{ animationDuration: '1.5s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🤖</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-base font-semibold text-slate-100">
          AI is analyzing your resume
        </p>
        <p className="text-sm text-slate-500 max-w-xs">
          This usually takes 10–30 seconds. Gemini is reading every detail.
        </p>
      </div>

      {/* Animated steps */}
      <div className="w-full max-w-xs space-y-2">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-xs text-slate-500"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500/50 animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}