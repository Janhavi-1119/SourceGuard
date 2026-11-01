import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Layers,
  BookmarkPlus,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  Check,
  ShieldAlert,
  Sparkles,
  X,
  FileText
} from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import { AnalysisResult, SavedReport, ClaimSourceSupport } from '../types';
import { saveReport, getSavedReports } from '../services/storageService';
import { formatDate, generateId } from '../utils/helpers';

type Tab = 'findings' | 'claims' | 'conflicts' | 'freshness' | 'missing' | 'conclusion' | 'sources';

const tabs: { key: Tab; label: string; countBadge?: (res: AnalysisResult) => number | null }[] = [
  { key: 'findings', label: 'Key Findings' },
  { key: 'claims', label: 'Claim Comparison', countBadge: (r) => r.claims?.length || 0 },
  { key: 'conflicts', label: 'Conflicts Detected', countBadge: (r) => r.conflicts?.length || 0 },
  { key: 'freshness', label: 'Information Freshness' },
  { key: 'missing', label: 'Missing Evidence', countBadge: (r) => r.missingInfo?.length || 0 },
  { key: 'conclusion', label: 'Conclusion' },
  { key: 'sources', label: 'Source References', countBadge: (r) => r.sources?.length || 0 },
];

export default function AnalysisResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('findings');

  // Load the active report from router state or sessionStorage (do NOT default to hardcoded mock)
  const [result, setResult] = useState<AnalysisResult | null>(() => {
    const state = location.state as { result?: AnalysisResult } | null;
    if (state?.result) {
      try {
        sessionStorage.setItem('sourceguard_current_report', JSON.stringify(state.result));
      } catch {}
      return state.result;
    }
    try {
      const cached = sessionStorage.getItem('sourceguard_current_report');
      if (cached) {
        return JSON.parse(cached) as AnalysisResult;
      }
    } catch {}
    return null;
  });

  const [saved, setSaved] = useState(false);
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<{
    claimText: string;
    support: ClaimSourceSupport;
  } | null>(null);

  useEffect(() => {
    const state = location.state as { result?: AnalysisResult } | null;
    if (state?.result) {
      setResult(state.result);
      try {
        sessionStorage.setItem('sourceguard_current_report', JSON.stringify(state.result));
      } catch {}
    }
  }, [location.state]);

  useEffect(() => {
    if (!result) return;
    const savedList = getSavedReports();
    const alreadySaved = savedList.some(
      (r) =>
        r.id === result.id ||
        (r.question && result.question && r.question.trim().toLowerCase() === result.question.trim().toLowerCase())
    );
    setSaved(alreadySaved);
  }, [result]);

  const handleSave = () => {
    if (!result) return;
    const report: SavedReport = {
      id: result.id || generateId(),
      title: result.question,
      question: result.question,
      dateCreated: result.date || new Date().toISOString(),
      sourceCount: result.sources?.length || 0,
      status: result.status,
      result,
    };
    saveReport(report);
    setSaved(true);
  };

  const supportIcon = (status: string) => {
    switch (status) {
      case 'supports':
        return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'contradicts':
        return <XCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-300 shrink-0" />;
    }
  };

  const supportBadge = (status: string) => {
    switch (status) {
      case 'supports':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> Supports
          </span>
        );
      case 'contradicts':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Contradicts
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> Partially Supports
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            <HelpCircle className="w-3 h-3" /> No Info
          </span>
        );
    }
  };

  // If no report is loaded, display an appropriate empty state instead of inventing data
  if (!result) {
    return (
      <div>
        <Header
          title="Analysis Report"
          description="Evidence-backed intelligence synthesis & cross-source verification"
        />
        <Card padding="none" className="border-slate-200 shadow-sm mt-4">
          <EmptyState
            icon={<FileText className="w-12 h-12 text-slate-300" />}
            title="No Active Verification Report"
            description="You haven't run a verification analysis yet, or no report is currently loaded."
            action={
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/new-analysis')}
              >
                Start New Analysis
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  const claimsList = result.claims || [];
  const conflictsList = result.conflicts || [];
  const freshnessList = result.freshness || [];
  const missingList = result.missingInfo || [];
  const sourcesList = result.sources || [];

  const supportedClaims = claimsList.filter((c) =>
    c.sourceSupport?.some((s) => s.status === 'supports')
  );

  return (
    <div>
      <Header
        title="Analysis Report"
        description="Evidence-backed intelligence synthesis & cross-source verification"
      />

      {/* Top Banner Notice */}
      <div className="mb-6 flex items-center justify-between p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-900 text-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1 bg-indigo-600 text-white rounded-md shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-indigo-950">Verified Evidence Dossier: </span>
            <span>All claims, contradictions, and conclusions are generated directly from the submitted source documents.</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/new-analysis')}
          className="text-xs font-medium text-indigo-700 hover:text-indigo-900 underline whitespace-nowrap ml-3 cursor-pointer"
        >
          New query
        </button>
      </div>

      {/* Executive Summary Card with Research Question prominently featured */}
      <Card className="mb-6 border-slate-200/80 shadow-sm" padding="lg">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 pb-5 border-b border-slate-100">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">
                Verified Research Question
              </span>
              {result.id && <span className="text-xs text-slate-400 font-mono">ID: {result.id}</span>}
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {result.question}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDate(result.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                {sourcesList.length} {sourcesList.length === 1 ? 'source' : 'sources'} cross-referenced
              </span>
              {conflictsList.length > 0 && (
                <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {conflictsList.length} {conflictsList.length === 1 ? 'contradiction' : 'contradictions'} detected
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start">
            <div className="text-right mr-2">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                Verdict
              </div>
              <StatusBadge status={result.status} size="lg" />
            </div>

            <Button
              variant={saved ? 'secondary' : 'primary'}
              size="md"
              icon={saved ? <Check className="w-4 h-4 text-emerald-600" /> : <BookmarkPlus className="w-4 h-4" />}
              onClick={handleSave}
              disabled={saved}
            >
              {saved ? 'Saved in Reports' : 'Save Report'}
            </Button>

            <Button
              variant="secondary"
              size="md"
              icon={<Grid3X3 className="w-4 h-4 text-indigo-600" />}
              onClick={() => navigate('/comparison', { state: { result } })}
            >
              Matrix View
            </Button>
          </div>
        </div>

        {/* Dynamic Quick Highlights Grid (Calculated from actual data) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-5">
          <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-100">
            <div className="text-xs font-medium text-slate-500 mb-1">Total Claims</div>
            <div className="text-lg font-bold text-slate-900">{claimsList.length} Claims</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Extracted from sources</div>
          </div>
          <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-100">
            <div className="text-xs font-semibold text-emerald-700 mb-1">Supported Consensus</div>
            <div className="text-lg font-bold text-emerald-800">
              {supportedClaims.length} Claims
            </div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Backed by source evidence</div>
          </div>
          <div className="bg-rose-50/70 p-3 rounded-lg border border-rose-100">
            <div className="text-xs font-semibold text-rose-700 mb-1">Direct Contradictions</div>
            <div className="text-lg font-bold text-rose-800">{conflictsList.length} Conflicts</div>
            <div className="text-[11px] text-rose-600 mt-0.5">Between submitted sources</div>
          </div>
          <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-100">
            <div className="text-xs font-semibold text-amber-700 mb-1">Information Gaps</div>
            <div className="text-lg font-bold text-amber-800">{missingList.length} Items</div>
            <div className="text-[11px] text-amber-600 mt-0.5">Unverified aspects</div>
          </div>
        </div>
      </Card>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 mb-6 border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab) => {
          const badgeCount = tab.countBadge ? tab.countBadge(result) : null;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-2 -mb-px cursor-pointer ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.label}
              {badgeCount !== null && badgeCount !== undefined && badgeCount > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    tab.key === 'conflicts'
                      ? 'bg-rose-100 text-rose-700'
                      : isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* TAB 1: Key Findings */}
        {activeTab === 'findings' && (
          <div className="space-y-6">
            <Card padding="lg" className="border-slate-200/90 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h3 className="text-base font-bold text-slate-900">Collective Synthesis</h3>
              </div>
              <p className="text-base text-slate-700 leading-relaxed font-normal bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                {result.summary || 'No summary available for this analysis.'}
              </p>

              {/* Dynamic Key Takeaways rendered strictly from actual API data */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Critical Verification Takeaways
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1: Established findings */}
                  <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      What is Supported
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {supportedClaims.length > 0
                        ? `${supportedClaims.length} claim(s) backed with direct citations across submitted sources.`
                        : 'No claims were conclusively supported by the provided source material.'}
                    </p>
                  </div>

                  {/* Card 2: Contradictions */}
                  <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30">
                    <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm mb-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Where Sources Collide
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {conflictsList.length > 0
                        ? `${conflictsList.length} direct conflict(s) identified where sources make incompatible factual statements.`
                        : 'No direct contradictions detected among the analyzed sources.'}
                    </p>
                  </div>

                  {/* Card 3: Missing Information */}
                  <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/30">
                    <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm mb-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      Evidence Gaps
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {missingList.length > 0
                        ? `${missingList.length} unresolved information gap(s) flagged for follow-up verification.`
                        : 'No critical evidence gaps flagged for this question.'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions to other tabs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setActiveTab('claims')}
                className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-xs transition-all text-left group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Claim-by-Claim Breakdown
                  </div>
                  <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                    Inspect {claimsList.length} extracted claims and cited excerpts
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => navigate('/comparison', { state: { result } })}
                className="flex items-center justify-between p-4 bg-white border border-indigo-200/80 rounded-xl hover:border-indigo-300 hover:shadow-xs transition-all text-left group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-1.5">
                    <Grid3X3 className="w-3.5 h-3.5" /> Full Matrix Comparison
                  </div>
                  <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                    Compare all claims against sources in an interactive grid
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Claim Comparison */}
        {activeTab === 'claims' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Click any claim to expand specific source citations and verifiable excerpts.</span>
              <span>Showing {claimsList.length} extracted claims</span>
            </div>

            {claimsList.length === 0 ? (
              <Card padding="lg" className="text-center py-8 text-slate-500 text-sm">
                No distinct claims were extracted from the provided source material.
              </Card>
            ) : (
              claimsList.map((claim, idx) => {
                const isExpanded = expandedClaim === claim.id || (expandedClaim === null && idx === 0);
                return (
                  <Card key={claim.id || idx} padding="none" className="overflow-hidden border-slate-200 shadow-sm transition-all">
                    <button
                      onClick={() => setExpandedClaim(isExpanded ? '__none__' : claim.id)}
                      className="flex items-start md:items-center justify-between gap-4 w-full p-4 md:p-5 text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 mt-0.5 md:mt-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm md:text-base font-semibold text-slate-900">
                            {claim.text}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            {claim.sourceSupport?.map((s) => (
                              <span
                                key={s.sourceId}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100"
                              >
                                {supportIcon(s.status)}
                                <span>{s.sourceName}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/40">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pt-2">
                          Source Breakdown &amp; Evidence Extracts
                        </div>
                        <div className="space-y-2.5">
                          {claim.sourceSupport?.map((support) => (
                            <div
                              key={support.sourceId}
                              onClick={() => setSelectedEvidence({ claimText: claim.text, support })}
                              className="p-3.5 bg-white border border-slate-200/80 rounded-xl hover:border-indigo-300 hover:shadow-2xs transition-all cursor-pointer group"
                            >
                              <div className="flex items-center justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                  {supportIcon(support.status)}
                                  <span className="text-xs font-bold text-slate-800">
                                    {support.sourceName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {supportBadge(support.status)}
                                  <span className="text-xs text-indigo-600 group-hover:underline flex items-center gap-1 font-medium">
                                    Full quote <ExternalLink className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>
                              {support.evidence ? (
                                <p className="text-xs text-slate-600 italic bg-slate-50/80 p-2.5 rounded-lg border-l-2 border-indigo-400">
                                  "{support.evidence}"
                                </p>
                              ) : (
                                <p className="text-xs text-slate-400 italic">
                                  No direct statement regarding this specific claim found in this source.
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: Conflicts Detected */}
        {activeTab === 'conflicts' && (
          <div className="space-y-4">
            {conflictsList.length === 0 ? (
              <Card padding="lg" className="border-slate-200 text-center py-12">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-base font-bold text-slate-900">No Contradictions Detected</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  The AI verification engine did not find incompatible factual claims or direct contradictions among the submitted sources for this question.
                </p>
              </Card>
            ) : (
              <>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    <strong>Conflicting Information Warning:</strong> The following points show factual differences between cited sources.
                  </span>
                </div>

                {conflictsList.map((conflict, idx) => (
                  <Card key={conflict.id || idx} padding="lg" className="border-rose-100 shadow-2xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">
                          #{idx + 1}
                        </span>
                        <h4 className="text-sm md:text-base font-bold text-slate-900">
                          {conflict.claim}
                        </h4>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize self-start md:self-auto ${
                          conflict.severity === 'high'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {conflict.severity || 'medium'} Contradiction Severity
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Source A */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              {conflict.sourceA?.name || 'Source A'}
                            </span>
                            {conflict.sourceA?.date && (
                              <span className="text-[11px] text-slate-400">
                                {formatDate(conflict.sourceA.date)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs md:text-sm text-slate-700 italic leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                            "{conflict.sourceA?.statement || 'No statement provided'}"
                          </p>
                        </div>
                      </div>

                      {/* Source B */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              {conflict.sourceB?.name || 'Source B'}
                            </span>
                            {conflict.sourceB?.date && (
                              <span className="text-[11px] text-slate-400">
                                {formatDate(conflict.sourceB.date)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs md:text-sm text-slate-700 italic leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                            "{conflict.sourceB?.statement || 'No statement provided'}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
        )}

        {/* TAB 4: Information Freshness */}
        {activeTab === 'freshness' && (
          <div className="space-y-4">
            <Card padding="none" className="overflow-hidden border-slate-200">
              <div className="p-4 bg-slate-50/80 border-b border-slate-200">
                <h4 className="text-sm font-bold text-slate-900">Temporal Validity &amp; Publication Recency</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Flags claims that rely on older datasets where newer facts or subsequent studies may have superseded conclusions.
                </p>
              </div>

              {freshnessList.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No publication date metadata was detected for the provided sources.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {freshnessList.map((item, idx) => (
                    <div key={item.sourceId || idx} className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          item.isOutdated ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{item.sourceName}</span>
                            {item.isOutdated ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                                Potentially Outdated
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                                Fresh / Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{item.note}</p>
                        </div>
                      </div>

                      <div className="text-right text-xs shrink-0 self-end md:self-auto">
                        <div className="font-semibold text-slate-700">
                          {item.publishedDate ? formatDate(item.publishedDate) : 'Unknown Date'}
                        </div>
                        <div className="text-slate-400 text-[11px]">Publication Date</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* TAB 5: Missing Evidence */}
        {activeTab === 'missing' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 px-1">
              What could not be conclusively verified with the current sources provided:
            </div>

            {missingList.length === 0 ? (
              <Card padding="lg" className="border-slate-200 text-center py-8 text-slate-500 text-sm">
                No missing evidence gaps identified for this research query.
              </Card>
            ) : (
              missingList.map((item, idx) => (
                <Card key={item.id || idx} padding="lg" className="border-slate-200">
                  <div className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ?{idx + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="text-sm font-bold text-slate-900">{item.description}</h4>
                      {item.suggestedAction && (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700">
                          <strong className="text-indigo-600">Recommended Next Step: </strong>
                          {item.suggestedAction}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* TAB 6: Final Conclusion */}
        {activeTab === 'conclusion' && (
          <Card padding="lg" className="border-indigo-100 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-600 text-white rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                </span>
                <h3 className="text-base font-bold text-slate-900">Evidence-Backed Final Conclusion</h3>
              </div>
              <StatusBadge status={result.status} size="md" />
            </div>

            <div className="p-5 bg-indigo-50/40 rounded-xl border border-indigo-100 text-sm md:text-base text-slate-800 leading-relaxed font-normal">
              {result.conclusion || 'No conclusion generated for this query.'}
            </div>

            <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-slate-400">
                Generated strictly from cited source material • No hallucinated facts
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<BookmarkPlus className="w-4 h-4" />}
                  onClick={handleSave}
                  disabled={saved}
                >
                  {saved ? 'Saved' : 'Save to Reports'}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Grid3X3 className="w-4 h-4" />}
                  onClick={() => navigate('/comparison', { state: { result } })}
                >
                  Inspect Matrix
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* TAB 7: Sources */}
        {activeTab === 'sources' && (
          <div className="space-y-3">
            {sourcesList.length === 0 ? (
              <Card padding="lg" className="text-center py-8 text-slate-500 text-sm">
                No sources recorded for this report.
              </Card>
            ) : (
              sourcesList.map((source, idx) => (
                <Card key={source.id || idx} padding="lg" className="border-slate-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {source.title || source.content}
                        </h4>
                        {source.type === 'url' ? (
                          <p className="text-xs text-indigo-600 truncate mt-0.5 flex items-center gap-1 font-mono">
                            {source.content}
                          </p>
                        ) : (
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100 italic">
                            "{source.content}"
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                          {source.domain && (
                            <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {source.domain}
                            </span>
                          )}
                          {source.publishedDate && (
                            <span>Published: {formatDate(source.publishedDate)}</span>
                          )}
                          {source.reliability && (
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              source.reliability === 'high'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {source.reliability} Reliability
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {source.type === 'url' && (
                      <a
                        href={source.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors shrink-0 cursor-pointer"
                        title="Open source URL"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal for inspect single evidence */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Source Evidence Inspect
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedEvidence.support.sourceName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">Claim Under Verification:</div>
                <div className="text-sm font-medium text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {selectedEvidence.claimText}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">Assessed Relationship:</div>
                <div>{supportBadge(selectedEvidence.support.status)}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">Extracted Text Evidence:</div>
                <div className="text-sm text-slate-700 italic bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-100 leading-relaxed">
                  "{selectedEvidence.support.evidence || 'No verbatim excerpt recorded for this claim.'}"
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="secondary" size="sm" onClick={() => setSelectedEvidence(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
