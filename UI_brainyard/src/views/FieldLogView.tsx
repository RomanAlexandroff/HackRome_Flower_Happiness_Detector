import { Plus } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import type { FieldEvent, Plot } from "../types/vineyard";

type FieldLogViewProps = {
  plots: Plot[];
  fieldEvents: FieldEvent[];
  onRecordEvent: () => void;
};

export function FieldLogView({ plots, fieldEvents, onRecordEvent }: FieldLogViewProps) {
  function getPlotLabel(plotId: string): string {
    const plot = plots.find((item) => item.id === plotId);
    return plot ? `${plot.name} - ${plot.fieldName}` : "Unknown plot";
  }

  return (
    <section className="view-card" aria-labelledby="field-log-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Operations</p>
          <h2 id="field-log-title">Field Log</h2>
          <p>Record irrigation, rainfall, treatments, inspections, and sampling activity.</p>
        </div>
        <button className="button button--primary" type="button" onClick={onRecordEvent}>
          <Plus size={18} aria-hidden="true" />
          Record field event
        </button>
      </div>

      <div className="field-log-list">
        {fieldEvents.length > 0 ? (
          fieldEvents.map((fieldEvent) => (
            <article className="field-event-item field-event-item--wide" key={fieldEvent.id}>
              <div>
                <strong>{fieldEvent.type}</strong>
                <span>{getPlotLabel(fieldEvent.plotId)}</span>
              </div>
              <p>{fieldEvent.notes || "No notes added."}</p>
              <small>
                {fieldEvent.date} at {fieldEvent.time} · {fieldEvent.durationMinutes} min
              </small>
            </article>
          ))
        ) : (
          <EmptyState
            title="No field events"
            description="Use the record button to add the first field observation."
          />
        )}
      </div>
    </section>
  );
}
