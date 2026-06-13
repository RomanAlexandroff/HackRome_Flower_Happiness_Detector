import { X } from "lucide-react";
import { FormEvent, useState } from "react";
import type { FieldEventDraft, FieldEventType, Plot } from "../types/vineyard";

type EventFormProps = {
  plots: Plot[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (event: FieldEventDraft) => void;
};

const eventTypes: FieldEventType[] = [
  "Irrigation",
  "Rainfall",
  "Treatment",
  "Fertilization",
  "Pruning",
  "Sampling",
  "Agronomist inspection",
  "Other",
];

const today = new Date();
const defaultDate = today.toISOString().slice(0, 10);
const defaultTime = today.toTimeString().slice(0, 5);

export function EventForm({ plots, isSubmitting, onClose, onSubmit }: EventFormProps) {
  const [plotId, setPlotId] = useState(plots[0]?.id ?? "");
  const [type, setType] = useState<FieldEventType>("Irrigation");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [durationMinutes, setDurationMinutes] = useState("20");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!plotId || !type || !date || !time || !durationMinutes) {
      setError("Please complete all required fields.");
      return;
    }

    const parsedDuration = Number(durationMinutes);

    if (Number.isNaN(parsedDuration) || parsedDuration <= 0) {
      setError("Duration must be greater than zero minutes.");
      return;
    }

    setError("");
    onSubmit({
      plotId,
      type,
      date,
      time,
      durationMinutes: parsedDuration,
      notes,
    });
  }

  return (
    <div className="modal-backdrop">
      <section aria-labelledby="field-event-title" aria-modal="true" className="modal" role="dialog">
        <div className="modal__header">
          <div>
            <p className="eyebrow">Field log</p>
            <h2 id="field-event-title">Record field event</h2>
          </div>
          <button aria-label="Close field event form" className="icon-button" type="button" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <label>
            <span>Plot</span>
            <select required value={plotId} onChange={(event) => setPlotId(event.target.value)}>
              {plots.map((plot) => (
                <option key={plot.id} value={plot.id}>
                  {plot.name} - {plot.fieldName}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Event type</span>
            <select required value={type} onChange={(event) => setType(event.target.value as FieldEventType)}>
              {eventTypes.map((eventType) => (
                <option key={eventType} value={eventType}>
                  {eventType}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Date</span>
            <input required type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>

          <label>
            <span>Time</span>
            <input required type="time" value={time} onChange={(event) => setTime(event.target.value)} />
          </label>

          <label>
            <span>Duration</span>
            <input
              min="1"
              required
              type="number"
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(event.target.value)}
            />
          </label>

          <label className="form-grid__full">
            <span>Notes</span>
            <textarea
              placeholder="Add field observations, equipment notes, or sampling context."
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>

          <div className="modal__actions">
            <button className="button button--secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="button button--primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : "Save field event"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
