import { ClipboardCheck, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { FieldObservationCard } from "../components/FieldObservationCard";
import type { FieldObservation, FieldObservationStatus, FieldObservationType } from "../types/fieldObservation";
import type { Plot } from "../types/vineyard";

const typeFilters: Array<{ label: string; value: "all" | FieldObservationType }> = [
  { label: "All observations", value: "all" },
  { label: "Vigour & shoot tips", value: "vigour_shoot_tips" },
  { label: "Phytosanitary inspections", value: "phytosanitary_inspection" },
];

const statusOptions: Array<"all" | FieldObservationStatus> = ["all", "Draft", "Completed", "Reviewed"];

type FieldObservationsViewProps = {
  observations: FieldObservation[];
  plots: Plot[];
  onAddObservation: () => void;
  onOpenObservation: (observationId: string) => void;
};

export function FieldObservationsView({
  observations,
  plots,
  onAddObservation,
  onOpenObservation,
}: FieldObservationsViewProps) {
  const [typeFilter, setTypeFilter] = useState<"all" | FieldObservationType>("all");
  const [plotFilter, setPlotFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | FieldObservationStatus>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredObservations = useMemo(() => {
    return [...observations]
      .filter((observation) => typeFilter === "all" || observation.observationType === typeFilter)
      .filter((observation) => plotFilter === "all" || observation.plotId === plotFilter)
      .filter((observation) => statusFilter === "all" || observation.status === statusFilter)
      .filter((observation) => {
        const observedDate = observation.observedAt.slice(0, 10);
        return (!startDate || observedDate >= startDate) && (!endDate || observedDate <= endDate);
      })
      .sort((a, b) => new Date(b.observedAt).getTime() - new Date(a.observedAt).getTime());
  }, [endDate, observations, plotFilter, startDate, statusFilter, typeFilter]);

  return (
    <section className="view-card" aria-labelledby="field-observations-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Field work evidence</p>
          <h2 id="field-observations-title">Field Observations</h2>
          <p>Record visual vigour checks and phytosanitary inspections alongside sensor data.</p>
        </div>
        <button className="button button--primary" type="button" onClick={onAddObservation}>
          <Plus size={18} aria-hidden="true" />
          Add field observation
        </button>
      </div>

      <div className="observation-filter-bar" aria-label="Field observation filters">
        <div className="observation-filter-tabs" role="group" aria-label="Observation type">
          {typeFilters.map((filter) => (
            <button
              className={typeFilter === filter.value ? "is-active" : undefined}
              key={filter.value}
              type="button"
              onClick={() => setTypeFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <label>
          <span>Plot</span>
          <select value={plotFilter} onChange={(event) => setPlotFilter(event.target.value)}>
            <option value="all">All plots</option>
            {plots.map((plot) => (
              <option key={plot.id} value={plot.id}>{plot.name} - {plot.fieldName}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Start date</span>
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>

        <label>
          <span>End date</span>
          <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </label>

        <label>
          <span>Status</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | FieldObservationStatus)}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status === "all" ? "All statuses" : status}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="observation-list">
        {filteredObservations.length > 0 ? (
          filteredObservations.map((observation) => (
            <FieldObservationCard key={observation.id} observation={observation} onOpen={onOpenObservation} />
          ))
        ) : (
          <EmptyState
            description="Adjust filters or add a new field observation from the vineyard inspection workflow."
            icon={ClipboardCheck}
            title={observations.length > 0 ? "No observations match these filters" : "No field observations yet"}
          />
        )}
      </div>

      {observations.length === 0 ? (
        <div className="empty-action">
          <button className="button button--primary" type="button" onClick={onAddObservation}>
            <Plus size={18} aria-hidden="true" />
            Create first observation
          </button>
        </div>
      ) : null}
    </section>
  );
}
