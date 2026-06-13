import { FlaskConical } from "lucide-react";
import { FormEvent, useState } from "react";
import type { FieldEvent, Plot, StudyDraft } from "../types/vineyard";

type StudyFormProps = {
  plots: Plot[];
  fieldEvents: FieldEvent[];
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (study: StudyDraft) => void;
};

const metricOptions = ["Soil moisture", "Air temperature", "Air humidity", "Rainfall"];

export function StudyForm({ plots, fieldEvents, isSubmitting, onCancel, onSubmit }: StudyFormProps) {
  const [researchQuestion, setResearchQuestion] = useState(
    "Did the 20-minute irrigation sufficiently increase soil moisture in Plot A?",
  );
  const [plotId, setPlotId] = useState("plot-a");
  const [startDate, setStartDate] = useState("2026-06-12");
  const [endDate, setEndDate] = useState("2026-06-13");
  const [metrics, setMetrics] = useState<string[]>(["Soil moisture"]);
  const [relatedFieldEventId, setRelatedFieldEventId] = useState("event-irrigation-a");
  const [notes, setNotes] = useState("Focus on the irrigation event near sensor soil-01.");
  const [error, setError] = useState("");

  function toggleMetric(metric: string) {
    setMetrics((current) =>
      current.includes(metric) ? current.filter((item) => item !== metric) : [...current, metric],
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!researchQuestion.trim() || !plotId || !startDate || !endDate || metrics.length === 0) {
      setError("Please add a question, plot, date range, and at least one metric.");
      return;
    }

    setError("");
    onSubmit({
      researchQuestion,
      plotId,
      dateRange: {
        start: startDate,
        end: endDate,
      },
      metrics,
      relatedFieldEventId: relatedFieldEventId || undefined,
      notes,
    });
  }

  return (
    <section className="view-card study-builder" aria-labelledby="study-builder-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Research workflow</p>
          <h2 id="study-builder-title">Create study</h2>
          <p>Prepare a focused evidence package from sensor data and field events.</p>
        </div>
        <div className="section-heading__icon" aria-hidden="true">
          <FlaskConical size={26} />
        </div>
      </div>

      <form className="form-grid form-grid--wide" onSubmit={handleSubmit}>
        {error ? (
          <p className="form-error form-grid__full" role="alert">
            {error}
          </p>
        ) : null}

        <label className="form-grid__full">
          <span>Research question</span>
          <textarea
            required
            rows={3}
            value={researchQuestion}
            onChange={(event) => setResearchQuestion(event.target.value)}
          />
        </label>

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
          <span>Related field event</span>
          <select value={relatedFieldEventId} onChange={(event) => setRelatedFieldEventId(event.target.value)}>
            <option value="">No related event</option>
            {fieldEvents.map((fieldEvent) => (
              <option key={fieldEvent.id} value={fieldEvent.id}>
                {fieldEvent.type} - {fieldEvent.date}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Start date</span>
          <input required type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>

        <label>
          <span>End date</span>
          <input required type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </label>

        <fieldset className="metric-picker form-grid__full">
          <legend>Metrics</legend>
          {metricOptions.map((metric) => (
            <label key={metric}>
              <input
                checked={metrics.includes(metric)}
                type="checkbox"
                onChange={() => toggleMetric(metric)}
              />
              <span>{metric}</span>
            </label>
          ))}
        </fieldset>

        <label className="form-grid__full">
          <span>Notes</span>
          <textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>

        <div className="modal__actions form-grid__full">
          <button className="button button--secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="button button--primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating..." : "Create study"}
          </button>
        </div>
      </form>
    </section>
  );
}
