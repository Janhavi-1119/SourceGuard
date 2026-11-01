import { NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  ScanSearch,
  FileBadge,
  Scale,
  Library,
  History,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  { to: '/', icon: Compass, label: 'Overview' },
  { to: '/new-analysis', icon: ScanSearch, label: 'New Analysis' },
  { to: '/results', icon: FileBadge, label: 'Analysis Report' },
  { to: '/comparison', icon: Scale, label: 'Comparison Matrix' },
  { to: '/saved-reports', icon: Library, label: 'Saved Reports' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/settings', icon: SlidersHorizontal, label: 'Settings' },
];

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200/90 flex flex-col z-30 transition-all duration-300 ease-in-out select-none shadow-[1px_0_4px_rgba(0,0,0,0.02)] ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-3.5 h-16 border-b border-slate-100 shrink-0">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer overflow-hidden group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center shrink-0 shadow-xs shadow-indigo-300/40 transition-transform group-hover:scale-105">
            <ShieldCheck className="w-4 h-4 text-white stroke-[2.2]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-[15px] tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                SourceGuard
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 tracking-wider uppercase mt-1">
                Truth Intelligence
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Nav Links with Distinctive Custom-Treated Icons */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <div className={`text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 pb-1.5 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? '•••' : 'Platform'}
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-50/70 text-indigo-950 font-semibold shadow-2xs'
                  : 'text-slate-600 font-medium hover:bg-slate-50/80 hover:text-slate-900'
              } ${collapsed ? 'justify-center px-0' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                {/* Refined Icon Micro-Container */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-300/40 ring-2 ring-indigo-600/10'
                      : 'bg-slate-100/90 text-slate-500 border border-slate-200/60 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 group-hover:scale-105 group-hover:shadow-2xs'
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 transition-all duration-200 ${
                      isActive
                        ? 'stroke-[2.2] scale-100'
                        : 'stroke-[1.8] group-hover:stroke-[2.1]'
                    }`}
                  />
                </div>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System Status Pill */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 bg-gradient-to-br from-indigo-50/70 to-slate-50 border border-indigo-100/70 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            SourceGuard AI Engine
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Cross-checking &amp; claim verification active.
          </p>
        </div>
      )}

      {/* User profile & footer */}
      <div className="border-t border-slate-100 p-2.5">
        <button
          onClick={() => navigate('/settings')}
          className={`flex items-center gap-2.5 p-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 w-full transition-colors cursor-pointer ${
            collapsed ? 'justify-center p-2' : ''
          }`}
        >
          <div className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ring-2 ring-indigo-50">
            SG
          </div>
          {!collapsed && (
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-semibold text-slate-900 truncate">Senior Lead Analyst</span>
              <span className="text-[10px] text-slate-400 truncate">analyst@sourceguard.ai</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
