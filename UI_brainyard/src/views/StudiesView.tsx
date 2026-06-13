import { FlaskConical, Plus } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { StatusBadge } from "../components/StatusBadge";
import type { Plot, Study } from "../types/vineyard";
import { formatDateRange } from "../utils/formatters";

type StudiesViewProps = {
  plots: Plot[];
  studies: Study[];
  onCreateStudy: () => void;
  onOpenStudy: (studyId: string) => void;
};

export function StudiesView({ plots, studies, onCreateStudy, onOpenStudy }: StudiesViewProps) {
  function getPlotLabel(plotId: string): string {
    const plot = plots.find((item) => item.id === plotId);
    return plot ? `${plot.name} - ${plot.fieldName}` : "Unknown plot";
  }

  return (
    <section className="view-card" aria-labelledby="studies-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Evidence workflow</p>
          <h2 id="studies-title">Studies</h2>
          <p>Convert sensor history and field events into reviewable evidence packages.</p>
        </div>
        <button className="button button--primary" type="button" onClick={onCreateStudy}>
          <Plus size={18} aria-hidden="true" />
          Create study
        </button>
      </div>

      <div className="study-list">
        {studies.length > 0 ? (
          studies.map((study) => (
            <button className="study-list-item" key={study.id} type="button" onClick={() => onOpenStudy(study.id)}>
              <span className="study-list-item__icon" aria-hidden="true">
                <FlaskConical size={20} />
              </span>
              <span>
                <strong>{study.title}</strong>
                <small>{study.researchQuestion}</small>
                <small>
                  {getPlotLabel(study.plotId)} · {formatDateRange(study.dateRange.start, study.dateRange.end)}
                </small>
              </span>
              <StatusBadge label={study.syncState === "synchronized" ? "Synchronized with Flywheel" : study.status} />
            </button>
          ))
        ) : (
          <EmptyState
            title="No studies yet"
            description="Create a study to prepare sensor evidence for later Flywheel synchronization."
          />
        )}
      </div>
    </section>
  );
}
