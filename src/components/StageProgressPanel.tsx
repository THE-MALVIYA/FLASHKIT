import React from 'react';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { PROCESSING_STAGES } from '../constants/stages';

interface StageProgressPanelProps {
  currentStageIndex: number; // 0 to 5
  progressPercent: number;
}

export const StageProgressPanel: React.FC<StageProgressPanelProps> = ({
  currentStageIndex,
  progressPercent
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur-md">
      
      <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30">
            <Sparkles className="h-3 w-3" />
          </span>
          <h3 className="text-sm font-bold tracking-tight text-white sm:text-base">
            Multi-Stage Processing Pipeline
          </h3>
        </div>
        <span className="font-mono text-xs font-semibold text-cyan-400">
          Stage {Math.min(currentStageIndex + 1, 6)} of 6
        </span>
      </div>

      {/* Grid of stages */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {PROCESSING_STAGES.map((stage, idx) => {
          const isCompleted = progressPercent >= 100 || idx < currentStageIndex;
          const isActive = idx === currentStageIndex && progressPercent < 100;
          const isPending = idx > currentStageIndex && progressPercent < 100;

          return (
            <div
              key={stage.id}
              className={`relative flex flex-col justify-between rounded-xl border p-3.5 transition-all duration-300 ${
                isActive
                  ? 'border-cyan-500/60 bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/30'
                  : isCompleted
                  ? 'border-emerald-500/30 bg-slate-950/70 text-slate-300'
                  : 'border-slate-800/70 bg-slate-950/40 text-slate-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    0{stage.id}
                  </span>
                  <div className="text-xs font-bold leading-tight">
                    <span className={isActive ? 'text-white' : isCompleted ? 'text-slate-200' : 'text-slate-400'}>
                      {stage.name}
                    </span>
                  </div>
                </div>

                {/* Status Icon */}
                <div>
                  {isCompleted && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  )}
                  {isActive && (
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400" />
                    </span>
                  )}
                  {isPending && (
                    <Clock className="h-3.5 w-3.5 text-slate-600" />
                  )}
                </div>
              </div>

              <div className="mt-2.5">
                <p className="text-[11px] leading-relaxed text-slate-400">
                  {stage.description}
                </p>
                
                {/* Active Stage Indicator Bar */}
                {isActive && (
                  <div className="mt-2 flex items-center justify-between border-t border-cyan-500/20 pt-1.5 font-mono text-[10px] text-cyan-300">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                      PROCESSING NOW
                    </span>
                    <span>{stage.minPercent}% - {stage.maxPercent}%</span>
                  </div>
                )}
                {isCompleted && (
                  <div className="mt-2 flex items-center justify-between border-t border-emerald-500/10 pt-1.5 font-mono text-[10px] text-emerald-400">
                    <span>STAGE PASSED</span>
                    <span>VERIFIED</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
