export type BadgeVariant = 'default' | 'verified' | 'demo' | 'unknown';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export const Badge = ({ children, variant = 'default' }: BadgeProps) => {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-slate-100 text-slate-700',
    verified: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    demo: 'bg-blue-100 text-blue-700 border border-blue-200',
    unknown: 'bg-slate-50 text-slate-400',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};
