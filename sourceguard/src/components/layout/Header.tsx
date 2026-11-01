import { useNavigate } from 'react-router-dom';
import { Plus, User } from 'lucide-react';
import Button from '../ui/Button';

interface HeaderProps {
  title: string;
  description?: string;
  showNewAnalysis?: boolean;
}

export default function Header({ title, description, showNewAnalysis = true }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/70 mb-6 gap-4">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {description && <p className="text-xs md:text-sm text-slate-500 mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {showNewAnalysis && (
          <Button
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/new-analysis')}
          >
            New Analysis
          </Button>
        )}
        <div
          onClick={() => navigate('/settings')}
          className="w-9 h-9 bg-indigo-50 border border-indigo-200/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-100/80 transition-colors shadow-2xs relative group"
          title="Account Settings"
        >
          <User className="w-4 h-4 text-indigo-600" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white absolute top-0 right-0" />
        </div>
      </div>
    </header>
  );
}
