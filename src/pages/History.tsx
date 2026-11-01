import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Search,
  ExternalLink,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { mockRecentAnalyses } from '../data/mockAnalysis';
import { getSavedReports } from '../services/storageService';
import { formatDate } from '../utils/helpers';

export default function History() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Extended mock history
  const [historyItems, setHistoryItems] = useState([
    ...mockRecentAnalyses,
    {
      id: '4',
      question: 'Do blue light blocking glasses improve sleep quality?',
      date: '2026-10-22',
      status: 'insufficient' as const,
      sourceCount: 3,
    },
    {
      id: '5',
      question: 'Did the 2024 AI Copyright Directive alter fair use standards in the EU?',
      date: '2026-10-18',
      status: 'supported' as const,
      sourceCount: 7,
    },
    {
      id: '6',
      question: 'Is microdosing proven effective for treatment-resistant clinical depression?',
      date: '2026-10-12',
      status: 'conflicting' as const,
      sourceCount: 5,
    },
  ]);

  const filtered = historyItems.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenItem = (item: typeof historyItems[0]) => {
    const saved = getSavedReports().find(
      (r) => r.question.toLowerCase() === item.question.toLowerCase()
    );
    if (saved) {
      try {
        sessionStorage.setItem('sourceguard_current_report', JSON.stringify(saved.result));
      } catch {}
      navigate('/results', { state: { result: saved.result } });
    } else {
      navigate('/new-analysis', { state: { question: item.question } });
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all verification run history?')) {
      setHistoryItems([]);
    }
  };

  return (
    <div>
      <Header
        title="Audit & Run History"
        description="Comprehensive log of all automated fact verification queries and source ingestion jobs"
      />

      {/* Search and control bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search query log history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {historyItems.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 className="w-4 h-4 text-slate-400" />}
            onClick={handleClearHistory}
          >
            Clear History
          </Button>
        )}
      </div>

      {/* History table card */}
      <Card padding="none" className="overflow-hidden border-slate-200 shadow-sm">
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No historical analysis runs found matching your search.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenItem(item)}
                className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <StatusBadge status={item.status} size="sm" />
                    <span className="text-[11px] text-slate-400 font-mono">Job #{item.id}</span>
                  </div>
                  <h4 className="text-sm md:text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.question}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(item.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {item.sourceCount} sources cross-referenced
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    View Verification <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

