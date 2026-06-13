import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { Alert } from "../types/vineyard";
import { formatDateTime } from "../utils/formatters";

type AlertItemProps = {
  alert: Alert;
  plotLabel?: string;
};

const severityIcon = {
  critical: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
};

export function AlertItem({ alert, plotLabel }: AlertItemProps) {
  const Icon = alert.severity === "info" ? CheckCircle2 : severityIcon[alert.severity];

  return (
    <article className={`alert-item alert-item--${alert.severity}`}>
      <div className="alert-item__icon" aria-hidden="true">
        <Icon size={18} />
      </div>
      <div>
        <div className="alert-item__header">
          <h3>{alert.title}</h3>
          <span>{formatDateTime(alert.timestamp)}</span>
        </div>
        <p>{alert.description}</p>
        {plotLabel ? <small>{plotLabel}</small> : null}
      </div>
    </article>
  );
}
