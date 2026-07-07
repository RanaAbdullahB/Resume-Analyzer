export default function Card({
  children,
  title,
  subtitle,
  icon,
  action,
  className = '',
  bodyClassName = '',
  noPadding = false,
  glow = false,
}) {
  return (
    <div
      className={[
        'card transition-all duration-200',
        glow && 'animate-pulse-glow',
        className,
      ].filter(Boolean).join(' ')}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-surface-border">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-sm font-semibold text-slate-100 truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : (bodyClassName || 'p-5')}>
        {children}
      </div>
    </div>
  );
}