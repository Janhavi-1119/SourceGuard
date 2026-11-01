import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  HelpCircle,
  ArrowLeft,
  Download,
  Info,
  ExternalLink,
  X,
  Search,
  Grid3X3
} from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { AnalysisResult, Claim, ClaimSourceSupport, Source } from '../types';

export default function ComparisonMatrix() {
  const location = useLocation();
  const navigate = useNavigate();

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

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCell, setSelectedCell] = useState<{
    claim: Claim;
    source: Source;
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

  if (!result) {
    return (
      <div>
        <Header
          title="Cross-Source Comparison Matrix"
          description="Tabular cross-examination of decomposed claims against independent sources"
        />
        <Card padding="none" className="border-slate-200 mt-4">
          <EmptyState
            icon={<Grid3X3 className="w-12 h-12 text-slate-300" />}
            title="No Active Comparison Matrix"
            description="You haven't run a verification analysis yet, or no active report is loaded."
            action={
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/new-analysis')}
              >
                Start Verification Analysis
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  const claimsList = result.claims || [];
  const sourcesList = result.sources || [];

  // Filter claims
  const filteredClaims = claimsList.filter((claim) => {
    const matchesSearch = claim.text.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'all') return matchesSearch;
    const hasStatus = claim.sourceSupport?.some((s) => s.status === filterStatus);
    return matchesSearch && hasStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'supports':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'contradicts':
        return <XCircle className="w-5 h-5 text-rose-600" />;
      case 'partial':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-300" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'supports':
        return 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 text-emerald-900';
      case 'contradicts':
        return 'bg-rose-50 hover:bg-rose-100/80 border-rose-200 text-rose-900';
      case 'partial':
        return 'bg-amber-50 hover:bg-amber-100/80 border-amber-200 text-amber-900';
      default:
        return 'bg-slate-50/60 hover:bg-slate-100 border-slate-200 text-slate-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'supports':
        return 'Supports';
      case 'contradicts':
        return 'Contradicts';
      case 'partial':
        return 'Partial';
      default:
        return 'No Info';
    }
  };

  const exportCSV = () => {
    const header = ['Claim', ...sourcesList.map((s) => s.title || s.content)];
    const rows = claimsList.map((claim) => {
      const row = [claim.text];
      sourcesList.forEach((source) => {
        const support = claim.sourceSupport?.find((s) => s.sourceId === source.id);
        row.push(support ? getStatusText(support.status) : 'No info');
      });
      return row;
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [header.join(','), ...rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `verification-matrix-${result.id || Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Header
        title="Cross-Source Comparison Matrix"
        description="Tabular cross-examination of decomposed claims against independent sources"
      />

      {/* Top Question Context Card */}
      <div className="mb-6 p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Research Question
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-0.5">
            {result.question}
          </h2>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/results', { state: { result } })}
        >
          Back to Report
        </Button>
      </div>

      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search claims..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg w-52 md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-400 px-2 font-medium">Filter:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'supports', label: 'Supported' },
              { id: 'contradicts', label: 'Conflicting' },
              { id: 'partial', label: 'Partial' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterStatus === f.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={exportCSV}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Color Legend & Instructions */}
      <div className="mb-4 p-3 bg-white border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
            Matrix Legend:
          </span>
          <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-semibold">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Supports Claim
          </div>
          <div className="flex items-center gap-1.5 text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 font-semibold">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Contradicts Claim
          </div>
          <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Partially Supports
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            No Relevant Information
          </div>
        </div>

        <div className="text-slate-400 text-[11px] flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          Click any cell to reveal cited quotes &amp; raw excerpts
        </div>
      </div>

      {/* Matrix Table */}
      <Card padding="none" className="overflow-hidden border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[280px] min-w-[240px] sticky left-0 bg-slate-50/95 backdrop-blur-xs z-10 border-r border-slate-200">
                  Decomposed Claim
                </th>
                {sourcesList.map((source, index) => (
                  <th
                    key={source.id || index}
                    className="p-3 text-xs font-bold text-slate-700 min-w-[150px] max-w-[200px] border-r border-slate-200 last:border-r-0"
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] text-indigo-600 uppercase font-mono tracking-wider">
                        Source {index + 1}
                      </span>
                      <span className="truncate font-semibold text-slate-900 mt-0.5" title={source.title || source.content}>
                        {source.title || (source.domain ? `${source.domain}` : 'Direct Text')}
                      </span>
                      {source.domain && (
                        <span className="text-[10px] text-slate-400 font-normal truncate">
                          {source.domain}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td
                    colSpan={sourcesList.length + 1}
                    className="p-8 text-center text-sm text-slate-500"
                  >
                    {claimsList.length === 0
                      ? 'No claims available to compare in this report.'
                      : 'No claims match your search/filter criteria.'}
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim, cIdx) => (
                  <tr key={claim.id || cIdx} className="hover:bg-slate-50/50 transition-colors">
                    {/* Sticky Claim Column */}
                    <td className="p-4 text-xs md:text-sm font-semibold text-slate-800 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {cIdx + 1}
                        </span>
                        <span className="leading-snug">{claim.text}</span>
                      </div>
                    </td>

                    {/* Source Position Cells */}
                    {sourcesList.map((source) => {
                      const support = claim.sourceSupport?.find((s) => s.sourceId === source.id) || {
                        sourceId: source.id,
                        sourceName: source.title || 'Source',
                        status: 'no-info' as const,
                      };

                      return (
                        <td
                          key={source.id}
                          className="p-2 border-r border-slate-200 last:border-r-0 text-center align-middle"
                        >
                          <button
                            onClick={() => setSelectedCell({ claim, source, support })}
                            className={`w-full py-3 px-2.5 rounded-lg border transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${getStatusBg(
                              support.status
                            )}`}
                            title="Click to view evidence details"
                          >
                            {getStatusIcon(support.status)}
                            <span className="text-[11px] font-bold tracking-tight">
                              {getStatusText(support.status)}
                            </span>
                            {support.evidence && (
                              <span className="text-[10px] text-slate-500 max-w-[130px] truncate underline decoration-dotted">
                                View quote
                              </span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal for Cell click */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  Verification Detail
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedCell.source.title || selectedCell.source.content}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">Underlying Claim:</div>
                <div className="text-sm font-semibold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedCell.claim.text}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="text-xs font-semibold text-slate-600">Assessed Stance:</span>
                <div className="flex items-center gap-1.5">
                  {getStatusIcon(selectedCell.support.status)}
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {getStatusText(selectedCell.support.status)}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">Cited Evidence &amp; Verbatim Passage:</div>
                {selectedCell.support.evidence ? (
                  <div className="text-xs md:text-sm text-slate-800 italic bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100 leading-relaxed">
                    "{selectedCell.support.evidence}"
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl">
                    No explicit mention or evidence extracted from this source for this specific claim.
                  </div>
                )}
              </div>

              {selectedCell.source.type === 'url' && (
                <div className="pt-2">
                  <a
                    href={selectedCell.source.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    Open Original Source URL <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button variant="secondary" size="sm" onClick={() => setSelectedCell(null)}>
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
