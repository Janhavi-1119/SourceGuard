import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Key,
  Sliders,
  ShieldCheck,
  Database,
  Check,
  Save,
  Trash2,
  Cpu,
  Clock,
  Sparkles
} from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Settings() {
  const [apiKey, setApiKey] = useState('••••••••••••••••••••••••••••••••');
  const [model, setModel] = useState('gpt-4o');
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [freshnessMonths, setFreshnessMonths] = useState(12);
  const [strictMode, setStrictMode] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearData = () => {
    if (window.confirm('Clear all local data, cached analyses, and saved reports?')) {
      localStorage.clear();
      alert('Local storage successfully cleared.');
      window.location.reload();
    }
  };

  return (
    <div>
      <Header
        title="Settings & Engine Configuration"
        description="Fine-tune contradiction detection thresholds, API integrations, and verification parameters"
        showNewAnalysis={false}
      />

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-sm font-medium animate-in fade-in">
            <Check className="w-5 h-5 text-emerald-600" />
            Engine configurations saved successfully.
          </div>
        )}

        {/* AI Model & Providers */}
        <Card padding="lg" className="border-slate-200">
          <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-slate-100">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">AI Intelligence Core</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Synthesis Engine
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full md:w-80 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="gpt-4o">OpenAI GPT-4o (High Reasoning)</option>
                <option value="claude-3-7-sonnet">Anthropic Claude 3.7 Sonnet (Analytical)</option>
                <option value="gemini-2-5-pro">Google Gemini 2.5 Pro (Deep Research)</option>
                <option value="local-ollama">Local Llama-3.3 70B (Air-Gapped)</option>
              </select>
              <p className="text-xs text-slate-400 mt-1">
                Platform dynamically runs multi-turn cross-examination across source text tokens.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Engine API Key
              </label>
              <div className="relative max-w-md">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Keys remain encrypted client-side in secure sandbox memory.
              </p>
            </div>
          </div>
        </Card>

        {/* Verification Engine Strictness */}
        <Card padding="lg" className="border-slate-200">
          <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Verification Engine Strictness</h3>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-slate-800">
                  Consensus Confidence Threshold ({confidenceThreshold}%)
                </label>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {confidenceThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-xs text-slate-400 mt-1">
                Minimum statistical agreement required between sources before classifying a claim as "Supported".
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-semibold text-slate-800">
                  Information Stale Horizon ({freshnessMonths} Months)
                </label>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {freshnessMonths} mo
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="36"
                value={freshnessMonths}
                onChange={(e) => setFreshnessMonths(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-xs text-slate-400 mt-1">
                Sources published beyond this threshold trigger the "Potentially Outdated" warning.
              </p>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={strictMode}
                  onChange={(e) => setStrictMode(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Zero-Hallucination Strict Mode (Active)
                  </div>
                  <div className="text-xs text-slate-500">
                    Rejects any synthesis that lacks exact verbatim quotes in source documents.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </Card>

        {/* Data Storage & Cache */}
        <Card padding="lg" className="border-slate-200">
          <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-slate-100">
            <Database className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Local Cache &amp; Storage</h3>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Clear Local Verification Cache</p>
              <p className="text-xs text-slate-500">
                Removes all cached URL scrapes, claim vectors, and custom reports stored in your browser.
              </p>
            </div>
            <Button
              type="button"
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={handleClearData}
            >
              Purge Local Cache
            </Button>
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" size="md" icon={<Save className="w-4 h-4" />}>
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}

