import { ReactNode } from 'react';

interface MetricProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number; // percentage change
  icon?: ReactNode;
  subtext?: string;
  highlight?: boolean;
}

export default function Metric({
  label,
  value,
  unit,
  trend,
  icon,
  subtext,
  highlight = false,
}: MetricProps) {
  return (
    <div className={`metric-card ${highlight ? 'ring-2 ring-primary-500' : ''}`}>
      {icon && <div className="text-primary-400 mb-2">{icon}</div>}
      <div className="text-sm text-text-secondary mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <div className="text-2xl font-display font-semibold text-text-primary">{value}</div>
        {unit && <div className="text-xs text-text-muted">{unit}</div>}
      </div>
      {trend !== undefined && (
        <div className={`text-xs mt-2 ${trend > 0 ? 'text-accent-green' : 'text-accent-red'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
      {subtext && <div className="text-xs text-text-muted mt-1">{subtext}</div>}
    </div>
  );
}

interface ProgressProps {
  label: string;
  value: number;
  max?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showPercent?: boolean;
}

export function Progress({
  label,
  value,
  max = 100,
  color = 'primary',
  showPercent = true,
}: ProgressProps) {
  const percentage = (value / max) * 100;
  const colorMap = {
    primary: 'from-primary-500 to-primary-400',
    success: 'from-accent-green to-accent-green',
    warning: 'from-accent-orange to-accent-orange',
    danger: 'from-accent-red to-accent-red',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-text-secondary">{label}</div>
        {showPercent && <div className="text-sm font-semibold text-text-primary">{Math.round(percentage)}%</div>}
      </div>
      <div className="progress-bar">
        <div
          className={`progress-fill bg-gradient-to-r ${colorMap[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
