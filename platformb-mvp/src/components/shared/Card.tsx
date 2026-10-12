export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => (
  <div className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`}>
    {children}
  </div>
);
