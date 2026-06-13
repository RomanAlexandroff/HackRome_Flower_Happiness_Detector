import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string;
  unit?: string;
  comparison: string;
  icon: LucideIcon;
};

export function MetricCard({ title, value, unit, comparison, icon: Icon }: MetricCardProps) {
  return (
    <article className="metric-card">
      <div className="metric-card__icon" aria-hidden="true">
        <Icon size={22} strokeWidth={2.2} />
      </div>
      <div>
        <h3>{title}</h3>
        <p className="metric-card__value">
          {value}
          {unit ? <span>{unit}</span> : null}
        </p>
        <p className="metric-card__comparison">{comparison}</p>
      </div>
    </article>
  );
}
