import { ArrowLeft, FileText } from "lucide-react";
import type { FlywheelSyncState, Plot, Study } from "../types/vineyard";
import { formatDateRange } from "../utils/formatters";
import { FlywheelSyncStatus } from "./FlywheelSyncStatus";
import { StatusBadge } from "./StatusBadge";
import { ChartDatum, TimeSeriesChart } from "./TimeSeriesChart";

type StudyResultProps = {
  study: Study;
  plot: Plot;
  chartData: ChartDatum[];
  markers: Array<{
    timestamp: string;
    label: string;
  }>;
  syncState: FlywheelSyncState;
  isSynchronizing: boolean;
  onBack: () => void;
  onSynchronize: () => void;
};

export function StudyResult({
  study,
  plot,
  chartData,
  markers,
  syncState,
  isSynchronizing,
  onBack,
  onSynchronize,
}: StudyResultProps) {
  return (
    <div className="stack">
      <button className="button button--ghost button--fit" type="button" onClick={onBack}>
        <ArrowLeft size={18} aria-hidden="true" />
        Back to studies
      </button>

      <section className="view-card study-result" aria-labelledby="study-result-title">
        <div className="study-result__header">
          <div>
            <p className="eyebrow">Study result</p>
            <h2 id="study-result-title">{study.title}</h2>
            <p>{study.researchQuestion}</p>
          </div>
          <StatusBadge label={study.status} />
        </div>

        <div className="detail-grid detail-grid--four">
          <div>
            <span>Selected plot</span>
            <strong>{plot.name} - {plot.fieldName}</strong>
          </div>
          <div>
            <span>Observation period</span>
            <strong>{formatDateRange(study.dateRange.start, study.dateRange.end)}</strong>
          </div>
          <div>
            <span>Metrics</span>
            <strong>{study.metrics.join(", ")}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{study.status}</strong>
          </div>
        </div>

        <div className="evidence-strip">
          <div>
            <span>Sensor readings</span>
            <strong>{study.evidence.sensorReadings}</strong>
          </div>
          <div>
            <span>Irrigation events</span>
            <strong>{study.evidence.fieldEvents}</strong>
          </div>
          <div>
            <span>Observation window</span>
            <strong>{study.evidence.observationWindow}</strong>
          </div>
          <div>
            <span>Generated artifacts</span>
            <strong>{study.evidence.generatedArtifacts}</strong>
          </div>
        </div>

        <div className="chart-card chart-card--large">
          <div className="section-heading">
            <div>
              <h3>Main chart</h3>
              <p>{study.observation}</p>
            </div>
          </div>
          <TimeSeriesChart
            data={chartData}
            height={390}
            lines={[{ dataKey: "soilMoisture", name: `${plot.name} soil moisture`, color: "#1f6b46" }]}
            markers={markers}
          />
        </div>

        <div className="research-grid">
          <article>
            <h3>Evidence summary</h3>
            <p>{study.observation}</p>
          </article>
          <article>
            <h3>Interpretation</h3>
            <p>{study.interpretation}</p>
          </article>
          <article>
            <h3>Limitations</h3>
            <p>{study.limitations}</p>
          </article>
          <article>
            <h3>Suggested next step</h3>
            <p>{study.suggestedNextStep}</p>
          </article>
        </div>

        <section className="artifact-panel" aria-labelledby="artifact-title">
          <h3 id="artifact-title">Evidence package</h3>
          <div className="artifact-list">
            {study.artifacts.map((artifact) => (
              <article className="artifact-item" key={artifact.id}>
                <FileText size={18} aria-hidden="true" />
                <div>
                  <strong>{artifact.name}</strong>
                  <span>{artifact.type.toUpperCase()} · {artifact.size}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <FlywheelSyncStatus
          isSynchronizing={isSynchronizing}
          state={syncState}
          onSynchronize={onSynchronize}
        />
      </section>
    </div>
  );
}
