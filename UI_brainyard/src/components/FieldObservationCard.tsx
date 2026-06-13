import { Eye, Leaf, ShieldAlert } from "lucide-react";
import type { FieldObservation } from "../types/fieldObservation";
import {
  getPrimaryObservationIndicator,
  observationTypeLabels,
} from "../utils/fieldObservationCalculations";
import { formatDateTime } from "../utils/formatters";
import { StatusBadge } from "./StatusBadge";

function getObservationIcon(observation: FieldObservation) {
  return observation.observationType === "vigour_shoot_tips" ? Leaf : ShieldAlert;
}

type FieldObservationCardProps = {
  observation: FieldObservation;
  onOpen: (observationId: string) => void;
};

export function FieldObservationCard({ observation, onOpen }: FieldObservationCardProps) {
  const Icon = getObservationIcon(observation);
  const primaryIndicator = getPrimaryObservationIndicator(observation);

  return (
    <article className="observation-card">
      <div className="observation-card__icon" aria-hidden="true">
        <Icon size={20} />
      </div>

      <div className="observation-card__content">
        <div className="observation-card__header">
          <div>
            <p className="eyebrow">{observationTypeLabels[observation.observationType]}</p>
            <h3>{observation.plotName}</h3>
          </div>
          <StatusBadge label={observation.status} />
        </div>

        <div className="observation-card__meta">
          <span>{formatDateTime(observation.observedAt)}</span>
          <span>{observation.observerName} · {observation.observerRole}</span>
          <span>{observation.sampledVines} vines sampled</span>
        </div>

        <div className="observation-card__badges">
          <span>{primaryIndicator}</span>
          {observation.observationType === "phytosanitary_inspection" ? (
            <span>{observation.actionRequired}</span>
          ) : (
            <span>{observation.vigourLevel} vigour</span>
          )}
        </div>
      </div>

      <button className="button button--secondary observation-card__button" type="button" onClick={() => onOpen(observation.id)}>
        <Eye size={17} aria-hidden="true" />
        Open detail
      </button>
    </article>
  );
}
