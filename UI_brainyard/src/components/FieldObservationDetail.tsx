import { ArrowLeft, Camera, Leaf, ShieldAlert } from "lucide-react";
import type { FieldObservation } from "../types/fieldObservation";
import {
  calculatePhytosanitaryIncidence,
  calculateTipPercentages,
  getObservationSummaryBadges,
  observationTypeLabels,
} from "../utils/fieldObservationCalculations";
import { formatDateTime } from "../utils/formatters";
import { StatusBadge } from "./StatusBadge";

function renderPhotoLabel(photoUrl: string, index: number): string {
  if (photoUrl.startsWith("blob:")) {
    return `Local preview ${index + 1}`;
  }

  return photoUrl.split("/").pop() || `Photo ${index + 1}`;
}

type FieldObservationDetailProps = {
  observation: FieldObservation;
  onBack: () => void;
};

export function FieldObservationDetail({ observation, onBack }: FieldObservationDetailProps) {
  const Icon = observation.observationType === "vigour_shoot_tips" ? Leaf : ShieldAlert;
  const summaryBadges = getObservationSummaryBadges(observation);

  return (
    <div className="stack">
      <button className="button button--ghost button--fit" type="button" onClick={onBack}>
        <ArrowLeft size={18} aria-hidden="true" />
        Back to observations
      </button>

      <section className="view-card observation-detail" aria-labelledby="observation-detail-title">
        <div className="study-result__header">
          <div>
            <p className="eyebrow">Field observation</p>
            <h2 id="observation-detail-title">{observationTypeLabels[observation.observationType]}</h2>
            <p>{observation.plotName} · {formatDateTime(observation.observedAt)}</p>
          </div>
          <StatusBadge label={observation.status} />
        </div>

        <div className="observation-summary-row">
          <div className="observation-summary-row__icon" aria-hidden="true">
            <Icon size={24} />
          </div>
          <div>
            <h3>Field summary</h3>
            <div className="observation-chip-list">
              {summaryBadges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="detail-grid detail-grid--four">
          <div>
            <span>Observer</span>
            <strong>{observation.observerName}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{observation.observerRole}</strong>
          </div>
          <div>
            <span>Confidence</span>
            <strong>{observation.confidenceLevel}</strong>
          </div>
          <div>
            <span>Sampled vines</span>
            <strong>{observation.sampledVines}</strong>
          </div>
        </div>

        {observation.observationType === "phytosanitary_inspection" ? (
          <p className="info-callout">
            This observation records visible symptoms and does not represent a confirmed diagnosis.
          </p>
        ) : null}

        {observation.observationType === "vigour_shoot_tips" ? (
          <VigourDetail observation={observation} />
        ) : (
          <PhytosanitaryDetail observation={observation} />
        )}

        <section className="artifact-panel" aria-labelledby="observation-notes-title">
          <h3 id="observation-notes-title">Notes and evidence</h3>
          <p className="observation-notes">{observation.notes || "No notes recorded."}</p>
          {observation.rowOrZone ? <p className="observation-notes"><strong>Row or zone:</strong> {observation.rowOrZone}</p> : null}
          {observation.photoUrls.length > 0 ? (
            <div className="photo-list">
              {observation.photoUrls.map((photoUrl, index) => (
                <div className="photo-token" key={`${photoUrl}-${index}`}>
                  <Camera size={17} aria-hidden="true" />
                  {renderPhotoLabel(photoUrl, index)}
                </div>
              ))}
            </div>
          ) : (
            <p className="observation-notes">No photos attached.</p>
          )}
        </section>
      </section>
    </div>
  );
}

function VigourDetail({ observation }: { observation: Extract<FieldObservation, { observationType: "vigour_shoot_tips" }> }) {
  const percentages = calculateTipPercentages(observation);

  return (
    <div className="research-grid">
      <article>
        <h3>Shoot tip counts</h3>
        <p>{observation.activeTips} active, {observation.slowingTips} slowing, {observation.stoppedTips} stopped out of {observation.totalObservedTips} observed tips.</p>
      </article>
      <article>
        <h3>Calculated percentages</h3>
        <p>{percentages.activePercent}% active · {percentages.slowingPercent}% slowing · {percentages.stoppedPercent}% stopped.</p>
      </article>
      <article>
        <h3>Canopy and vigour</h3>
        <p>{observation.canopyDensity} canopy density with {observation.vigourLevel.toLowerCase()} vigour and {observation.distribution.toLowerCase()} distribution.</p>
      </article>
      <article>
        <h3>Growth measurements</h3>
        <p>
          Average shoot length: {observation.averageShootLengthCm ?? "not recorded"} cm.
          Average internode length: {observation.averageInternodeLengthCm ?? "not recorded"} cm.
        </p>
      </article>
    </div>
  );
}

function PhytosanitaryDetail({ observation }: { observation: Extract<FieldObservation, { observationType: "phytosanitary_inspection" }> }) {
  const incidence = calculatePhytosanitaryIncidence(observation);

  return (
    <div className="research-grid">
      <article>
        <h3>Visible symptom record</h3>
        <p>{observation.symptomCategory} observed on {observation.inspectionTarget.toLowerCase()}. Suspected issue: {observation.suspectedIssue || "not specified"}.</p>
      </article>
      <article>
        <h3>Incidence</h3>
        <p>{incidence.incidencePercent}% of sampled vines showed visible symptoms{incidence.organIncidencePercent !== undefined ? `; ${incidence.organIncidencePercent}% organ incidence.` : "."}</p>
      </article>
      <article>
        <h3>Severity and distribution</h3>
        <p>Severity {observation.severityScore}/5, {observation.distribution.toLowerCase()} distribution, progression {observation.progression.toLowerCase()}.</p>
      </article>
      <article>
        <h3>Action required</h3>
        <p>{observation.actionRequired}. This is based on visible inspection notes, not a confirmed diagnosis.</p>
      </article>
    </div>
  );
}
