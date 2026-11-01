import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Link as LinkIcon,
  FileText,
  ArrowRight,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Layers,
  ChevronRight,
  Plus,
  X,
  Globe,
  Sparkles,
  ShieldCheck,
  Compass
} from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { mockDashboardStats, mockRecentAnalyses } from '../data/mockAnalysis';
import { getSavedReports } from '../services/storageService';
import { formatDate, generateId, extractDomain } from '../utils/helpers';
import { Source } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');

  const handleAddUrl = () => {
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
      },
    ]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleAddText = () => {
    const trimmed = textInput.trim();
    if (!trimmed) return;
    setSources((prev) => [
      ...prev,
      {
        id: generateId(),
        type: 'text',
        content: trimmed,
        title: `Text Source ${prev.filter((s) => s.type === 'text').length + 1}`,
      },
    ]);
    setTextInput('');
    setShowTextInput(false);
  };

  const handleRemoveSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const handleStartAnalysis = () => {
    navigate('/new-analysis', {
      state: {
        question: question.trim() || undefined,
        preloadedSources: sources.length > 0 ? sources : undefined,
      },
    });
  };

  const handleQuickPreset = (presetQuestion: string) => {
    setQuestion(presetQuestion);
  };

  return (
    <div>
      <Header
        title="Overview & Fact Engine"
        description="Verify multi-source claims, expose factual divergence, and validate evidence"
      />

      {/* Hero Headline */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Autonomous Cross-Source Verification Platform
        </div>
        <h2 className="text-3xl font-extrabold text-[#172033] tracking-tight leading-tight">
          Know what's true. Understand why.
        </h2>
        <p className="text-slate-500 text-base max-w-2xl mt-2 leading-relaxed">
          Verify information across multiple sources. Discover contradictions, outdated claims and
          missing evidence before making critical decisions.
        </p>
      </div>

      {/* Prominent Analysis Input Workspace */}
      <Card className="mb-8 border-slate-200 shadow-sm overflow-hidden" padding="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Step 1: Enter your research question or factual claim
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to verify? (e.g. 'Is remote work more productive than office work?')"
                className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-slate-200 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStartAnalysis();
                }}
              />
            </div>
          </div>

          {/* Preset Suggestions */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-medium">Try verifying:</span>
            {[
              'Is remote work more productive than office work?',
              'Has renewable energy adoption exceeded 2026 targets?',
              'Do blue light filters reduce retinal strain?',
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => handleQuickPreset(preset)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-md text-slate-600 transition-colors cursor-pointer text-left"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Source List Tags */}
          {sources.length > 0 && (
            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Attached Sources ({sources.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {sources.map((src) => (
                  <div
                    key={src.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                  >
                    {src.type === 'url' ? (
                      <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                    <span className="max-w-[200px] truncate">{src.title || src.content}</span>
                    <button
                      onClick={() => handleRemoveSource(src.id)}
                      className="text-slate-400 hover:text-rose-500 ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inline Add URL */}
          {showUrlInput && (
            <div className="flex gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in">
              <input
                type="url"
                placeholder="https://example.com/research-paper"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <Button size="sm" onClick={handleAddUrl}>
                Attach URL
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowUrlInput(false)}>
                Cancel
              </Button>
            </div>
          )}

          {/* Inline Add Text */}
          {showTextInput && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-in fade-in">
              <textarea
                placeholder="Paste news excerpt, transcript, or document text..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setShowTextInput(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddText}>
                  Attach Excerpt
                </Button>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowUrlInput(true);
                  setShowTextInput(false);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg bg-slate-50 hover:bg-indigo-50/80 border border-slate-200/80 transition-colors"
              >
                <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />
                Add Source URL
              </button>

              <button
                onClick={() => {
                  setShowTextInput(true);
                  setShowUrlInput(false);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg bg-slate-50 hover:bg-indigo-50/80 border border-slate-200/80 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                Paste Text Source
              </button>
            </div>

            <Button
              onClick={handleStartAnalysis}
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Analyze Claims
            </Button>
          </div>
        </div>
      </Card>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Analyses',
            value: mockDashboardStats.totalAnalyses,
            icon: BarChart3,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            sub: 'Queries executed'
          },
          {
            label: 'Sources Analyzed',
            value: mockDashboardStats.sourcesAnalyzed,
            icon: Layers,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            sub: 'Domains & journals'
          },
          {
            label: 'Conflicts Detected',
            value: mockDashboardStats.conflictsDetected,
            icon: AlertTriangle,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            sub: 'Opposing claims found'
          },
          {
            label: 'Reports Generated',
            value: mockDashboardStats.reportsGenerated,
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            sub: 'Evidence dossiers'
          },
        ].map((stat) => (
          <Card key={stat.label} padding="md" className="border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 leading-tight">{stat.value}</p>
                <p className="text-xs font-medium text-slate-600">{stat.label}</p>
                <p className="text-[10px] text-slate-400">{stat.sub}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Analyses Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Verification Runs</h3>
            <p className="text-xs text-slate-500">Live feed of processed multi-source queries</p>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            View all history &rarr;
          </button>
        </div>

        <Card padding="none" className="overflow-hidden border-slate-200/90 shadow-sm">
          <div className="divide-y divide-slate-100">
            {mockRecentAnalyses.map((analysis) => (
              <button
                key={analysis.id}
                onClick={() => {
                  const saved = getSavedReports().find(
                    (r) => r.question.toLowerCase() === analysis.question.toLowerCase()
                  );
                  if (saved) {
                    try {
                      sessionStorage.setItem('sourceguard_current_report', JSON.stringify(saved.result));
                    } catch {}
                    navigate('/results', { state: { result: saved.result } });
                  } else {
                    navigate('/new-analysis', { state: { question: analysis.question } });
                  }
                }}
                className="flex items-center gap-4 px-5 py-4 w-full text-left hover:bg-slate-50/80 transition-colors group cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {analysis.question}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>{formatDate(analysis.date)}</span>
                    <span>•</span>
                    <span>{analysis.sourceCount} sources cross-referenced</span>
                  </p>
                </div>
                <StatusBadge status={analysis.status} size="sm" />
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* "How It Works" Section */}
      <div>
        <div className="mb-4 px-1">
          <h3 className="text-base font-bold text-slate-900">How VerifAI Works</h3>
          <p className="text-xs text-slate-500">The 4-stage pipeline for verifiable truth intelligence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Add Sources',
              desc: 'Input multiple URLs, academic papers, or raw textual excerpts from varied viewpoints.',
              icon: Layers
            },
            {
              step: '02',
              title: 'Decompose Claims',
              desc: 'Engine extracts granular factual assertions and matches them across independent documents.',
              icon: Compass
            },
            {
              step: '03',
              title: 'Expose Conflicts',
              desc: 'Detects explicit contradictions, subtle methodological divergence, and outdated figures.',
              icon: AlertTriangle
            },
            {
              step: '04',
              title: 'Evidence Verdict',
              desc: 'Produces a synthesized, transparent conclusion strictly rooted in cited verbatim proof.',
              icon: ShieldCheck
            },
          ].map((item) => (
            <Card key={item.step} padding="lg" className="border-slate-200/90 relative overflow-hidden">
              <span className="text-4xl font-extrabold text-slate-100 absolute right-3 top-2 select-none pointer-events-none">
                {item.step}
              </span>
              <div className="relative z-10 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  <item.icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
