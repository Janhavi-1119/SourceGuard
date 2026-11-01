import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Link as LinkIcon,
  FileText,
  X,
  Globe,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Layers,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AnalysisProgress from '../components/analysis/AnalysisProgress';
import { Source, AnalysisOptions, AnalysisResult } from '../types';
import { generateId, extractDomain } from '../utils/helpers';
import { runAnalysis } from '../services/analysisService';
import { mockAnalysisResult } from '../data/mockAnalysis';

export default function NewAnalysis() {
  const location = useLocation();
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [isStageComplete, setIsStageComplete] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const cancelRef = useRef(false);

  const [options, setOptions] = useState<AnalysisOptions>({
    detectConflicts: true,
    checkFreshness: true,
    identifyMissing: true,
    compareReliability: true,
  });

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  useEffect(() => {
    const state = location.state as {
      question?: string;
      preloadedSources?: Source[];
    } | null;

    if (state?.question) {
      setQuestion(state.question);
    }
    if (state?.preloadedSources && state.preloadedSources.length > 0) {
      setSources(state.preloadedSources);
    }
  }, [location.state]);

  const addUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    const url = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    setSources((prev) => [
      ...prev,
      {
        id: generateId(),
        type: 'url',
        content: url,
        title: extractDomain(url),
        domain: extractDomain(url),
        reliability: 'high',
      },
    ]);
    setUrlInput('');
    setAnalysisError(null);
  };

  const addText = () => {
    const trimmed = textInput.trim();
    if (!trimmed) return;
    setSources((prev) => [
      ...prev,
      {
        id: generateId(),
        type: 'text',
        content: trimmed,
        title: `Text Source ${prev.filter((s) => s.type === 'text').length + 1}`,
        reliability: 'medium',
      },
    ]);
    setTextInput('');
    setShowTextInput(false);
    setAnalysisError(null);
  };

  const removeSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const handleLoadSampleSources = () => {
    setQuestion('Is remote work more productive than office work?');
    setSources(mockAnalysisResult.sources);
    setAnalysisError(null);
  };

  const handleCancelAnalysis = () => {
    cancelRef.current = true;
    setIsAnalyzing(false);
    setIsStageComplete(false);
    setCurrentStage(1);
  };

  const handleAnalyze = async () => {
    if (!question.trim()) {
      setAnalysisError('Please enter a research question or claim to verify.');
      return;
    }
    if (sources.length === 0) {
      setAnalysisError('Please add at least one source (URL or pasted text) to verify.');
      return;
    }

    setAnalysisError(null);
    setIsAnalyzing(true);
    setCurrentStage(1);
    setIsStageComplete(false);
    cancelRef.current = false;

    // Trigger the real analysis API call
    const apiPromise = runAnalysis(question, sources, options);

    // Progression of the in-flight preparation stages
    const progressTimeline = async () => {
      // Stage 1: Collecting Sources (~800ms)
      await new Promise((r) => setTimeout(r, 800));
      if (cancelRef.current) return;
      setCurrentStage(2);

      // Stage 2: Extracting Content (~1400ms)
      await new Promise((r) => setTimeout(r, 1400));
      if (cancelRef.current) return;
      setCurrentStage(3);

      // Stage 3: Analysing Claims (~1800ms)
      await new Promise((r) => setTimeout(r, 1800));
      if (cancelRef.current) return;
      setCurrentStage(4);

      // Stage 4: Cross-checking Evidence remains active until apiPromise actually resolves
    };

    progressTimeline();

    try {
      const result = await apiPromise;
      if (cancelRef.current) return;

      // Ensure the exact user-typed research question is guaranteed on the report object
      const verifiedReport: AnalysisResult = {
        ...result,
        question: question.trim(),
      };

      // Persist active report to sessionStorage so page refreshes retain the exact question and real data
      try {
        sessionStorage.setItem('sourceguard_current_report', JSON.stringify(verifiedReport));
      } catch (err) {
        console.warn('Could not cache report in sessionStorage:', err);
      }

      // When the real backend analysis resolves, transition to Stage 5: Preparing Report
      setCurrentStage(5);
      await new Promise((r) => setTimeout(r, 600));
      if (cancelRef.current) return;

      // Mark all stages complete
      setIsStageComplete(true);
      await new Promise((r) => setTimeout(r, 500));
      if (cancelRef.current) return;

      // Display the final verification report
      navigate('/results', { state: { result: verifiedReport } });
    } catch (err) {
      if (cancelRef.current) return;
      setIsAnalyzing(false);
      setIsStageComplete(false);
      const message =
        err instanceof Error
          ? err.message
          : 'SourceGuard analysis failed. Please check your backend connection and try again.';
      setAnalysisError(message);
    }
  };

  const toggleOption = (key: keyof AnalysisOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // If currently analyzing, render the vertical stepper loading experience
  if (isAnalyzing) {
    return (
      <div>
        <Header
          title="Verification Pipeline"
          description="Synthesizing multi-source evidence and cross-checking claims"
          showNewAnalysis={false}
        />
        <AnalysisProgress
          question={question}
          sourceCount={sources.length}
          currentStage={currentStage}
          isComplete={isStageComplete}
          onCancel={handleCancelAnalysis}
        />
      </div>
    );
  }

  return (
    <div>
      <Header
        title="New Verification Analysis"
        description="Configure target research claims, ingest primary sources, and set contradiction filters"
        showNewAnalysis={false}
      />

      {/* Error Alert Banner */}
      {analysisError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start justify-between gap-3 text-rose-900 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-950">Verification Request Could Not Be Completed</h4>
              <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">{analysisError}</p>
            </div>
          </div>
          <button
            onClick={() => setAnalysisError(null)}
            className="p-1 text-rose-400 hover:text-rose-700 rounded-md transition-colors"
            title="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Demo Preload Pill */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Hackathon Demo Shortcut:</strong> Want to test with realistic multi-source study data immediately?
          </span>
        </div>
        <button
          onClick={handleLoadSampleSources}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
        >
          Load 5 Curated Sources &amp; Question
        </button>
      </div>

      <div className="space-y-6">
        {/* A. Research Question */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            A. Research Question or Hypothesis to Verify
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (analysisError) setAnalysisError(null);
              }}
              placeholder="What would you like to verify? (e.g., 'Is remote work more productive than office work?')"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs transition-all"
            />
          </div>
        </div>

        {/* B. Add Sources */}
        <Card padding="lg" className="border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">B. Ingest Multi-Perspective Sources</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Supply URLs to news articles, research papers, or paste raw text excerpts to compare
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {sources.length} {sources.length === 1 ? 'Source' : 'Sources'} Added
            </span>
          </div>

          {/* URL Input */}
          <div className="flex gap-2.5 mb-3">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addUrl()}
                placeholder="https://www.stanford.edu/research/remote-work-study-2026"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
            <Button onClick={addUrl} variant="secondary" size="md">
              Add URL Source
            </Button>
          </div>

          {/* Text Source Toggle */}
          {!showTextInput ? (
            <button
              onClick={() => setShowTextInput(true)}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold mb-4"
            >
              <FileText className="w-3.5 h-3.5" />
              + Paste raw text excerpt as an internal or proprietary source
            </button>
          ) : (
            <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Paste Text Excerpt or Interview Statement
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste survey results, transcript notes, or press release text here..."
                rows={4}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="flex justify-end gap-2">
                <Button onClick={() => setShowTextInput(false)} variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button onClick={addText} size="sm">
                  Add Text Source
                </Button>
              </div>
            </div>
          )}

          {/* Current Source List */}
          {sources.length > 0 ? (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Active Source Registry ({sources.length})
              </div>
              {sources.map((source, index) => (
                <div
                  key={source.id}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl hover:border-slate-300 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {index + 1}
                    </span>
                    {source.type === 'url' ? (
                      <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span className="text-xs md:text-sm font-semibold text-slate-800 truncate">
                      {source.title || source.content}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate hidden md:inline">
                      {source.domain || 'Verbatim Text Document'}
                    </span>
                  </div>

                  <button
                    onClick={() => removeSource(source.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    title="Remove source"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/40">
              <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No sources added yet</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Add at least 1 source URL or text block to run verification
              </p>
            </div>
          )}
        </Card>

        {/* C. Analysis Options */}
        <Card padding="lg" className="border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-1">C. Verification Analysis Engine Options</h3>
          <p className="text-xs text-slate-500 mb-4">
            Toggle specific algorithms and anomaly checkers to run on the ingested source data
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[
              {
                key: 'detectConflicts' as const,
                label: 'Detect Conflicting Claims',
                desc: 'Find direct factual and statistical contradictions between sources.',
              },
              {
                key: 'checkFreshness' as const,
                label: 'Check Information Freshness',
                desc: 'Analyze publication dates to flag superseded or outdated figures.',
              },
              {
                key: 'identifyMissing' as const,
                label: 'Identify Missing Evidence',
                desc: 'Highlight unverified gaps and recommend follow-up investigative angles.',
              },
              {
                key: 'compareReliability' as const,
                label: 'Compare Source Reliability',
                desc: 'Benchmark peer-reviewed academic rigor vs. opinion articles.',
              },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => toggleOption(opt.key)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                  options[opt.key]
                    ? 'bg-indigo-50/50 border-indigo-200 text-slate-900'
                    : 'bg-slate-50/50 border-slate-200 text-slate-500'
                }`}
              >
                {options[opt.key] ? (
                  <ToggleRight className="w-7 h-7 text-indigo-600 shrink-0 mt-0.5" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-300 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{opt.label}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* D. Action Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
          >
            &larr; Cancel and return to overview
          </button>

          <Button
            onClick={handleAnalyze}
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            disabled={!question.trim()}
          >
            Start Verification Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
