import { CalendarDays, FlaskConical, Plus } from "lucide-react";
import type { Vineyard } from "../types/vineyard";
import { formatDateTime } from "../utils/formatters";

type HeaderProps = {
  pageTitle: string;
  vineyard: Vineyard;
  onRecordEvent: () => void;
  onCreateStudy: () => void;
};

export function Header({ pageTitle, vineyard, onRecordEvent, onCreateStudy }: HeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">{vineyard.name} · {vineyard.location}</p>
        <h1>{pageTitle}</h1>
        <p className="app-header__update">
          <CalendarDays size={16} aria-hidden="true" />
          Last sensor update: {formatDateTime(vineyard.lastSensorUpdate)}
        </p>
      </div>

      <div className="app-header__actions" aria-label="Primary actions">
        <button className="button button--secondary" type="button" onClick={onRecordEvent}>
          <Plus size={18} aria-hidden="true" />
          Record field event
        </button>
        <button className="button button--primary" type="button" onClick={onCreateStudy}>
          <FlaskConical size={18} aria-hidden="true" />
          Create study
        </button>
      </div>
    </header>
  );
}
