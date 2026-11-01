import React from 'react';
import { Check, Loader2, Sparkles, Shield, XCircle } from 'lucide-react';
import Card from '../ui/Card';

export interface VerificationStage {
  id: number;
  title: string;
  description: string;
  activeDescription: string;
}

export const VERIFICATION_STAGES: VerificationStage[] = [
  {
    id: 1,
    title: 'Collecting Sources',
    description: 'Preparing the submitted URLs and pasted text.',
    activeDescription: 'Packaging submitted URLs and text excerpts for the ingestion pipeline...',
  },
  {
    id: 2,
    title: 'Extracting Content',
    description: 'Retrieving readable content from the submitted sources.',
    activeDescription: 'Fetching web pages, stripping boilerplate markup, and extracting readable text...',
  },
  {
    id: 3,
    title: 'Analysing Claims',
    description: 'Sending extracted content to the AI analysis engine.',
    activeDescription: 'Dispatching canonical source text to the AI engine to isolate core claims...',
  },
  {
    id: 4,
    title: 'Cross-checking Evidence',
    description: 'Comparing claims, identifying contradictions, and checking supporting evidence.',
    activeDescription: 'Cross-referencing claims across independent sources to identify contradictions and evidence gaps...',
  },
  {
    id: 5,
    title: 'Preparing Report',
    description: 'Organizing the findings into the final verification report.',
    activeDescription: 'Compiling findings, freshness timelines, and contradiction matrix into final dossier...',
  },
];

interface AnalysisProgressProps {
  question: string;
  sourceCount: number;
  currentStage: number; // 1 to 5, or 6 when fully finished
  isComplete: boolean;
  onCancel?: () => void;
}

export default function AnalysisProgress({
  question,
  sourceCount,
  currentStage,
  isComplete,
  onCancel,
}: AnalysisProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto py-6 animate-in fade-in duration-200">
      <Card padding="lg" className="border-slate-200/90 shadow-sm bg-white overflow-hidden">
        {/* Top Header Card */}
        <div className="border-b border-slate-100 pb-5 mb-6">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700">
              {isComplete ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Verification Complete</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Verification in Progress</span>
                </>
              )}
            </div>

            <span className="text-xs font-medium text-slate-400">
              {isComplete ? (
                'All 5 stages completed'
              ) : (
                <>
                  Stage <span className="font-semibold text-slate-700">{Math.min(currentStage, 5)}</span> of 5
                </>
              )}
            </span>
          </div>

          <h2 className="text-lg font-bold text-[#172033] tracking-tight">
            {isComplete ? 'Verification Report Ready' : 'Verifying Research Hypothesis'}
          </h2>

          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex items-start gap-2.5">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] shrink-0 mt-0.5">
              Query:
            </span>
            <span className="font-medium text-slate-900 flex-1 line-clamp-2">
              "{question}"
            </span>
            <span className="text-slate-400 font-normal shrink-0 border-l border-slate-200 pl-2">
              {sourceCount} {sourceCount === 1 ? 'source' : 'sources'}
            </span>
          </div>
        </div>

        {/* Vertical Stepper / Timeline */}
        <div className="py-2 px-1 space-y-0">
          {VERIFICATION_STAGES.map((stage, index) => {
            const isFinished = isComplete || currentStage > stage.id;
            const isActive = !isComplete && currentStage === stage.id;
            const isPending = !isComplete && currentStage < stage.id;
            const isLast = index === VERIFICATION_STAGES.length - 1;

            return (
              <div key={stage.id} className="relative flex items-start group">
                {/* Vertical Line Connector */}
                {!isLast && (
                  <div
                    className={`absolute left-[17px] top-9 bottom-0 w-0.5 transition-colors duration-300 ${
                      isFinished
                        ? 'bg-emerald-400'
                        : isActive
                        ? 'bg-gradient-to-b from-indigo-500 to-slate-200'
                        : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Step Indicator Icon */}
                <div className="relative z-10 shrink-0">
                  {isFinished ? (
                    <div className="w-9 h-9 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 transition-all shadow-2xs">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  ) : isActive ? (
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs shadow-indigo-200 ring-4 ring-indigo-50 transition-all">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-400 transition-colors">
                      {stage.id}
                    </div>
                  )}
                </div>

                {/* Step Text Details */}
                <div className={`ml-4 flex-1 pb-7 ${isLast ? 'pb-2' : ''}`}>
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-sm transition-colors ${
                        isActive
                          ? 'font-bold text-indigo-950 text-base'
                          : isFinished
                          ? 'font-semibold text-slate-800'
                          : 'font-medium text-slate-400'
                      }`}
                    >
                      {stage.title}
                    </h3>

                    {isActive && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        In Progress
                      </span>
                    )}

                    {isFinished && (
                      <span className="text-[11px] font-medium text-emerald-600">
                        Done
                      </span>
                    )}
                  </div>

                  {/* Active vs Standard Description */}
                  {isActive ? (
                    <div className="mt-1.5 p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100/80 animate-in fade-in duration-200">
                      <p className="text-xs font-medium text-indigo-900 leading-relaxed">
                        {stage.activeDescription}
                      </p>
                    </div>
                  ) : (
                    <p
                      className={`text-xs mt-0.5 transition-colors leading-relaxed ${
                        isFinished ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {stage.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info & Cancel option */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span>Deterministic verification • No hallucinated synthesis</span>
          </div>

          {!isComplete && onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Cancel analysis
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}

