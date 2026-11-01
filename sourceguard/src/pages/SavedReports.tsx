import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Trash2,
  ExternalLink,
  Calendar,
  Layers,
  Filter,
  AlertCircle,
  PlusCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import { SavedReport, VerificationStatus } from '../types';
import { getSavedReports, deleteReport, saveReport } from '../services/storageService';
import { formatDate, generateId } from '../utils/helpers';
import { mockAnalysisResult } from '../data/mockAnalysis';

export default function SavedReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadReports = () => {
    const loaded = getSavedReports();
    // If empty initially, seed with sample saved reports for great demo experience
    if (loaded.length === 0) {
      const initialReport: SavedReport = {
        id: 'rep-demo-01',
        title: mockAnalysisResult.question,
        question: mockAnalysisResult.question,
        dateCreated: mockAnalysisResult.date,
        sourceCount: mockAnalysisResult.sources.length,
        status: mockAnalysisResult.status,
        result: mockAnalysisResult,
      };
      saveReport(initialReport);
      setReports([initialReport]);
    } else {
      setReports(loaded);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this saved report?')) {
      deleteReport(id);
      loadReports();
    }
  };

  const handleOpenReport = (report: SavedReport) => {
    try {
      sessionStorage.setItem('sourceguard_current_report', JSON.stringify(report.result));
    } catch {}
    navigate('/results', { state: { result: report.result } });
  };

  const handleResetDemo = () => {
    const demo1: SavedReport = {
      id: generateId(),
      title: 'Is remote work more productive than office work?',
      question: 'Is remote work more productive than office work?',
      dateCreated: '2026-10-30T14:30:00Z',
      sourceCount: 5,
      status: 'conflicting',
      result: mockAnalysisResult,
    };
    const demo2: SavedReport = {
      id: generateId(),
      title: 'Has global renewable energy adoption reached milestone targets in 2026?',
      question: 'Has global renewable energy adoption reached milestone targets in 2026?',
      dateCreated: '2026-10-25T11:15:00Z',
      sourceCount: 6,
      status: 'supported',
      result: {
        ...mockAnalysisResult,
        id: 'analysis-renewable',
        question: 'Has global renewable energy adoption reached milestone targets in 2026?',
        status: 'supported',
        summary: 'Cross-verification across 6 peer-reviewed and IEA energy reports confirms global renewable deployment exceeded the 2025 milestone targets by 8.4%.',
      },
    };
    saveReport(demo1);
    saveReport(demo2);
    loadReports();
  };

  // Filter reports
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <Header
        title="Saved Reports"
        description="Organize, review, and export verified intelligence dossiers"
      />

      {/* Action / Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved reports by keyword or question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-400 px-2 font-medium">Status:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'supported', label: 'Supported' },
              { id: 'conflicting', label: 'Conflicting' },
              { id: 'partially-supported', label: 'Partial' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  statusFilter === f.id
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
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={handleResetDemo}
            title="Populate demo reports"
          >
            Demo Seeds
          </Button>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Card padding="none">
          <EmptyState
            icon={<FileText className="w-12 h-12" />}
            title="No reports found"
            description={
              searchQuery
                ? 'No saved reports match your search query or status filter.'
                : 'You have not saved any verification reports yet. Run a new analysis to create and save reports.'
            }
            action={
              <Button
                variant="primary"
                size="md"
                icon={<PlusCircle className="w-4 h-4" />}
                onClick={() => navigate('/new-analysis')}
              >
                Start New Analysis
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3.5">
          {filteredReports.map((report) => (
            <Card
              key={report.id}
              padding="lg"
              className="border-slate-200/90 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div
                onClick={() => handleOpenReport(report)}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <StatusBadge status={report.status} size="sm" />
                    <span className="text-xs text-slate-400 font-mono">ID: {report.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {report.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(report.dateCreated)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {report.sourceCount} sources verified
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<ExternalLink className="w-4 h-4 text-slate-500" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenReport(report);
                    }}
                  >
                    Open Dossier
                  </Button>
                  <button
                    onClick={(e) => handleDelete(report.id, e)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

