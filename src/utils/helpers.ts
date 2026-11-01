import { VerificationStatus } from '../types';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getStatusConfig(status: VerificationStatus) {
  const configs = {
    supported: {
      label: 'Supported',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    'partially-supported': {
      label: 'Partially Supported',
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    conflicting: {
      label: 'Conflicting',
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      dot: 'bg-red-500',
    },
    insufficient: {
      label: 'Insufficient Evidence',
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      dot: 'bg-slate-400',
    },
  };
  return configs[status];
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '…' : str;
}
