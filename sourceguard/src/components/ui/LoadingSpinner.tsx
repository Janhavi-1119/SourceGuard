interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };

  return (
    <div className={`${sizes[size]} border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin`} />
  );
}
