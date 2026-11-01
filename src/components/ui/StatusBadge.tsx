import { getStatusConfig } from '../../utils/helpers';
import { VerificationStatus } from '../../types';

interface StatusBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-xs md:text-sm px-3.5 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border transition-colors shadow-2xs ${config.bg} ${config.color} ${config.border} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
