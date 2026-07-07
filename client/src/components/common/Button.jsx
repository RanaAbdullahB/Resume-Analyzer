import { Loader2 } from 'lucide-react';

const variants = {
  primary:   'bg-brand-600 hover:bg-brand-500 text-white border-transparent shadow-lg shadow-brand-600/20 hover:shadow-brand-500/30',
  secondary: 'bg-surface-hover hover:bg-slate-700/60 text-slate-200 border-surface-border',
  danger:    'bg-red-600/10 hover:bg-red-600/20 text-red-400 border-red-500/30',
  ghost:     'bg-transparent hover:bg-surface-hover text-slate-300 border-transparent',
  outline:   'bg-transparent hover:bg-brand-600/10 text-brand-400 border-brand-500/40 hover:border-brand-500',
};

const sizes = {
  sm:  'px-3 py-1.5 text-xs gap-1.5',
  md:  'px-4 py-2.5 text-sm gap-2',
  lg:  'px-6 py-3 text-base gap-2.5',
  xl:  'px-8 py-4 text-lg gap-3',
  icon:'p-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-medium rounded-lg border',
        'transition-all duration-200 cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth && 'w-full',
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin shrink-0" size={size === 'lg' || size === 'xl' ? 20 : 16} />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}