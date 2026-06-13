import { Camera, Leaf, ShieldAlert, X } from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import type {
  ActionRequired,
  CanopyDensity,
  ConfidenceLevel,
  FieldObservationDraft,
  FieldObservationStatus,
  FieldObservationType,
  InspectionTarget,
  ObserverRole,
  PhytosanitaryObservationDraft,
  SymptomCategory,
  SymptomDistribution,
  SymptomProgression,
  VigourDistribution,
  VigourLevel,
  VigourObservationDraft,
} from "../types/fieldObservation";
import type { Plot, Vineyard } from "../types/vineyard";
import {
  calculatePhytosanitaryIncidence,
  calculateTipPercentages,
  validateFieldObservation,
} from "../utils/fieldObservationCalculations";

const observerRoles: ObserverRole[] = ["Owner", "Vineyard worker", "Agronomist", "Technician"];
const confidenceLevels: ConfidenceLevel[] = ["Low", "Medium", "High"];
const observationStatuses: FieldObservationStatus[] = ["Draft", "Completed", "Reviewed"];
const canopyDensityOptions: CanopyDensity[] = ["Low", "Balanced", "High"];
const vigourLevels: VigourLevel[] = ["Low", "Moderate", "High", "Excessive"];
const vigourDistributions: VigourDistribution[] = ["Uniform", "Slightly uneven", "Highly uneven"];
const inspectionTargets: InspectionTarget[] = ["Leaves", "Shoots", "Bunches", "Berries", "Trunk", "Entire vine"];
const symptomCategories: SymptomCategory[] = [
  "Discoloration",
  "Spots or lesions",
  "Powdery coating",
  "Necrosis",
  "Wilting",
  "Deformation",
  "Rot",
  "Insect presence",
  "Eggs or larvae",
  "Other",
];
const symptomDistributions: SymptomDistribution[] = ["Isolated", "Localized", "Scattered", "Widespread"];
const progressions: SymptomProgression[] = ["New", "Stable", "Increasing", "Decreasing", "Unknown"];
const actionOptions: ActionRequired[] = [
  "No immediate action",
  "Monitor",
  "Agronomist review",
  "Urgent inspection",
];

function getCurrentDateTimeLocal(): string {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

function parseNumber(value: string): number {
  return Number(value || 0);
}

function parseOptionalNumber(value: string): number | undefined {
  return value.trim() === "" ? undefined : Number(value);
}

function FieldError({ message }: { message?: string }) {
  return message ? <span className="field-error">{message}</span> : null;
}

type FieldObservationFormProps = {
  vineyard: Vineyard;
  plots: Plot[];
  defaultPlotId?: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (draft: FieldObservationDraft) => void;
};

export function FieldObservationForm({
  vineyard,
  plots,
  defaultPlotId,
  isSubmitting,
  onCancel,
  onSubmit,
}: FieldObservationFormProps) {
  const initialPlotId = defaultPlotId ?? plots[0]?.id ?? "";
  const [observationType, setObservationType] = useState<FieldObservationType>("vigour_shoot_tips");
  const [plotId, setPlotId] = useState(initialPlotId);
  const [rowOrZone, setRowOrZone] = useState("");
  const [observedAt, setObservedAt] = useState(getCurrentDateTimeLocal());
  const [observerName, setObserverName] = useState("Elena Rossi");
  const [observerRole, setObserverRole] = useState<ObserverRole>("Agronomist");
  const [sampledVines, setSampledVines] = useState("30");
  const [notes, setNotes] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>("Medium");
  const [status, setStatus] = useState<FieldObservationStatus>("Completed");

  const [totalObservedTips, setTotalObservedTips] = useState("120");
  const [activeTips, setActiveTips] = useState("84");
  const [slowingTips, setSlowingTips] = useState("24");
  const [stoppedTips, setStoppedTips] = useState("12");
  const [averageShootLengthCm, setAverageShootLengthCm] = useState("");
  const [averageInternodeLengthCm, setAverageInternodeLengthCm] = useState("");
  const [canopyDensity, setCanopyDensity] = useState<CanopyDensity>("Balanced");
  const [vigourLevel, setVigourLevel] = useState<VigourLevel>("Moderate");
  const [vigourDistribution, setVigourDistribution] = useState<VigourDistribution>("Uniform");
  const [vigourAffectedArea, setVigourAffectedArea] = useState("");

  const [inspectionTarget, setInspectionTarget] = useState<InspectionTarget>("Leaves");
  const [symptomCategory, setSymptomCategory] = useState<SymptomCategory>("Powdery coating");
  const [suspectedIssue, setSuspectedIssue] = useState("");
  const [symptomaticVines, setSymptomaticVines] = useState("0");
  const [sampledOrgans, setSampledOrgans] = useState("");
  const [symptomaticOrgans, setSymptomaticOrgans] = useState("");
  const [severityScore, setSeverityScore] = useState("0");
  const [symptomDistribution, setSymptomDistribution] = useState<SymptomDistribution>("Isolated");
  const [progression, setProgression] = useState<SymptomProgression>("Unknown");
  const [phytoAffectedArea, setPhytoAffectedArea] = useState("");
  const [actionRequired, setActionRequired] = useState<ActionRequired>("Monitor");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedPlot = useMemo(
    () => plots.find((plot) => plot.id === plotId) ?? plots[0],
    [plotId, plots],
  );

  const tipPercentages = calculateTipPercentages({
    totalObservedTips: parseNumber(totalObservedTips),
    activeTips: parseNumber(activeTips),
    slowingTips: parseNumber(slowingTips),
    stoppedTips: parseNumber(stoppedTips),
  });

  const incidence = calculatePhytosanitaryIncidence({
    sampledVines: parseNumber(sampledVines),
    symptomaticVines: parseNumber(symptomaticVines),
    sampledOrgans: parseOptionalNumber(sampledOrgans),
    symptomaticOrgans: parseOptionalNumber(symptomaticOrgans),
  });

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setPhotoUrls(files.map((file) => URL.createObjectURL(file)));
  }

  function buildCommonDraft() {
    return {
      vineyardId: vineyard.id,
      vineyardName: vineyard.name,
      plotId: selectedPlot?.id ?? plotId,
      plotName: selectedPlot ? `${selectedPlot.name} - ${selectedPlot.fieldName}` : "Unknown plot",
      rowOrZone: rowOrZone.trim() || undefined,
      observedAt: observedAt ? new Date(observedAt).toISOString() : "",
      observerName,
      observerRole,
      sampledVines: parseNumber(sampledVines),
      notes,
      photoUrls,
      confidenceLevel,
      status,
    };
  }

  function buildDraft(): FieldObservationDraft {
    const common = buildCommonDraft();

    if (observationType === "vigour_shoot_tips") {
      const draft: VigourObservationDraft = {
        ...common,
        observationType,
        totalObservedTips: parseNumber(totalObservedTips),
        activeTips: parseNumber(activeTips),
        slowingTips: parseNumber(slowingTips),
        stoppedTips: parseNumber(stoppedTips),
        averageShootLengthCm: parseOptionalNumber(averageShootLengthCm),
        averageInternodeLengthCm: parseOptionalNumber(averageInternodeLengthCm),
        canopyDensity,
        vigourLevel,
        distribution: vigourDistribution,
        affectedArea: vigourAffectedArea.trim() || undefined,
      };

      return draft;
    }

    const draft: PhytosanitaryObservationDraft = {
      ...common,
      observationType,
      inspectionTarget,
      symptomCategory,
      suspectedIssue: suspectedIssue.trim() || undefined,
      symptomaticVines: parseNumber(symptomaticVines),
      sampledOrgans: parseOptionalNumber(sampledOrgans),
      symptomaticOrgans: parseOptionalNumber(symptomaticOrgans),
      severityScore: parseNumber(severityScore),
      distribution: symptomDistribution,
      progression,
      affectedArea: phytoAffectedArea.trim() || undefined,
      actionRequired,
    };

    return draft;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const draft = buildDraft();
    const validationErrors = validateFieldObservation(draft);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit(draft);
  }

  return (
    <section className="view-card observation-form-card" aria-labelledby="field-observation-form-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Field Observations</p>
          <h2 id="field-observation-form-title">Add field observation</h2>
          <p>Record human inspection data alongside sensor measurements for later analysis.</p>
        </div>
        <button aria-label="Cancel field observation" className="icon-button" type="button" onClick={onCancel}>
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="observation-type-selector" role="group" aria-label="Observation type">
        <button
          className={observationType === "vigour_shoot_tips" ? "is-active" : undefined}
          type="button"
          onClick={() => setObservationType("vigour_shoot_tips")}
        >
          <Leaf size={18} aria-hidden="true" />
          Vine Vigour & Shoot Tip Status
        </button>
        <button
          className={observationType === "phytosanitary_inspection" ? "is-active" : undefined}
          type="button"
          onClick={() => setObservationType("phytosanitary_inspection")}
        >
          <ShieldAlert size={18} aria-hidden="true" />
          Phytosanitary Symptoms & Inspection
        </button>
      </div>

      <form className="form-grid form-grid--wide" onSubmit={handleSubmit}>
        <fieldset className="observation-form__group form-grid__full">
          <legend>Observation context</legend>

          <label>
            <span>Plot</span>
            <select value={plotId} onChange={(event) => setPlotId(event.target.value)}>
              {plots.map((plot) => (
                <option key={plot.id} value={plot.id}>{plot.name} - {plot.fieldName}</option>
              ))}
            </select>
            <FieldError message={errors.plotId} />
          </label>

          <label>
            <span>Row or zone</span>
            <input value={rowOrZone} onChange={(event) => setRowOrZone(event.target.value)} placeholder="Rows 4-8, west edge" />
          </label>

          <label>
            <span>Date and time</span>
            <input
              aria-invalid={Boolean(errors.observedAt)}
              type="datetime-local"
              value={observedAt}
              onChange={(event) => setObservedAt(event.target.value)}
            />
            <FieldError message={errors.observedAt} />
          </label>

          <label>
            <span>Observer name</span>
            <input
              aria-invalid={Boolean(errors.observerName)}
              value={observerName}
              onChange={(event) => setObserverName(event.target.value)}
            />
            <FieldError message={errors.observerName} />
          </label>

          <label>
            <span>Observer role</span>
            <select value={observerRole} onChange={(event) => setObserverRole(event.target.value as ObserverRole)}>
              {observerRoles.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
          </label>

          <label>
            <span>Sampled vines</span>
            <input
              aria-invalid={Boolean(errors.sampledVines)}
              min="0"
              type="number"
              value={sampledVines}
              onChange={(event) => setSampledVines(event.target.value)}
            />
            <FieldError message={errors.sampledVines} />
          </label>

          <label>
            <span>Confidence level</span>
            <select value={confidenceLevel} onChange={(event) => setConfidenceLevel(event.target.value as ConfidenceLevel)}>
              {confidenceLevels.map((level) => <option key={level} value={level}>{level}</option>)}
            </select>
          </label>

          <label>
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as FieldObservationStatus)}>
              {observationStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </fieldset>

        {observationType === "vigour_shoot_tips" ? (
          <VigourFields
            activeTips={activeTips}
            averageInternodeLengthCm={averageInternodeLengthCm}
            averageShootLengthCm={averageShootLengthCm}
            canopyDensity={canopyDensity}
            errors={errors}
            setActiveTips={setActiveTips}
            setAverageInternodeLengthCm={setAverageInternodeLengthCm}
            setAverageShootLengthCm={setAverageShootLengthCm}
            setCanopyDensity={setCanopyDensity}
            setSlowingTips={setSlowingTips}
            setStoppedTips={setStoppedTips}
            setTotalObservedTips={setTotalObservedTips}
            setVigourAffectedArea={setVigourAffectedArea}
            setVigourDistribution={setVigourDistribution}
            setVigourLevel={setVigourLevel}
            slowingTips={slowingTips}
            stoppedTips={stoppedTips}
            tipPercentages={tipPercentages}
            totalObservedTips={totalObservedTips}
            vigourAffectedArea={vigourAffectedArea}
            vigourDistribution={vigourDistribution}
            vigourLevel={vigourLevel}
          />
        ) : (
          <PhytosanitaryFields
            actionRequired={actionRequired}
            errors={errors}
            incidence={incidence}
            inspectionTarget={inspectionTarget}
            phytoAffectedArea={phytoAffectedArea}
            progression={progression}
            sampledOrgans={sampledOrgans}
            setActionRequired={setActionRequired}
            setInspectionTarget={setInspectionTarget}
            setPhytoAffectedArea={setPhytoAffectedArea}
            setProgression={setProgression}
            setSampledOrgans={setSampledOrgans}
            setSeverityScore={setSeverityScore}
            setSuspectedIssue={setSuspectedIssue}
            setSymptomaticOrgans={setSymptomaticOrgans}
            setSymptomaticVines={setSymptomaticVines}
            setSymptomCategory={setSymptomCategory}
            setSymptomDistribution={setSymptomDistribution}
            severityScore={severityScore}
            suspectedIssue={suspectedIssue}
            symptomaticOrgans={symptomaticOrgans}
            symptomaticVines={symptomaticVines}
            symptomCategory={symptomCategory}
            symptomDistribution={symptomDistribution}
          />
        )}

        <label className="form-grid__full">
          <span>Notes</span>
          <textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Record observations, sampling conditions, and follow-up context." />
        </label>

        <label className="form-grid__full">
          <span>Photographs</span>
          <input accept="image/*" multiple type="file" onChange={handlePhotoChange} />
        </label>

        {photoUrls.length > 0 ? (
          <div className="photo-preview-list form-grid__full">
            {photoUrls.map((photoUrl, index) => (
              <div className="photo-preview" key={photoUrl}>
                <img alt={`Field observation preview ${index + 1}`} src={photoUrl} />
                <span><Camera size={15} aria-hidden="true" /> Photo {index + 1}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="modal__actions form-grid__full">
          <button className="button button--secondary" type="button" onClick={onCancel}>Cancel</button>
          <button className="button button--primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Saving..." : "Save observation"}
          </button>
        </div>
      </form>
    </section>
  );
}

type VigourFieldsProps = {
  totalObservedTips: string;
  activeTips: string;
  slowingTips: string;
  stoppedTips: string;
  averageShootLengthCm: string;
  averageInternodeLengthCm: string;
  canopyDensity: CanopyDensity;
  vigourLevel: VigourLevel;
  vigourDistribution: VigourDistribution;
  vigourAffectedArea: string;
  tipPercentages: ReturnType<typeof calculateTipPercentages>;
  errors: Record<string, string>;
  setTotalObservedTips: (value: string) => void;
  setActiveTips: (value: string) => void;
  setSlowingTips: (value: string) => void;
  setStoppedTips: (value: string) => void;
  setAverageShootLengthCm: (value: string) => void;
  setAverageInternodeLengthCm: (value: string) => void;
  setCanopyDensity: (value: CanopyDensity) => void;
  setVigourLevel: (value: VigourLevel) => void;
  setVigourDistribution: (value: VigourDistribution) => void;
  setVigourAffectedArea: (value: string) => void;
};

function VigourFields({
  totalObservedTips,
  activeTips,
  slowingTips,
  stoppedTips,
  averageShootLengthCm,
  averageInternodeLengthCm,
  canopyDensity,
  vigourLevel,
  vigourDistribution,
  vigourAffectedArea,
  tipPercentages,
  errors,
  setTotalObservedTips,
  setActiveTips,
  setSlowingTips,
  setStoppedTips,
  setAverageShootLengthCm,
  setAverageInternodeLengthCm,
  setCanopyDensity,
  setVigourLevel,
  setVigourDistribution,
  setVigourAffectedArea,
}: VigourFieldsProps) {
  return (
    <fieldset className="observation-form__group form-grid__full">
      <legend>Vine Vigour & Shoot Tip Status</legend>

      <label>
        <span>Total observed shoots or tips</span>
        <input aria-invalid={Boolean(errors.totalObservedTips)} min="0" type="number" value={totalObservedTips} onChange={(event) => setTotalObservedTips(event.target.value)} />
        <FieldError message={errors.totalObservedTips} />
      </label>
      <label>
        <span>Active tips</span>
        <input aria-invalid={Boolean(errors.activeTips)} min="0" type="number" value={activeTips} onChange={(event) => setActiveTips(event.target.value)} />
        <FieldError message={errors.activeTips} />
      </label>
      <label>
        <span>Slowing tips</span>
        <input aria-invalid={Boolean(errors.slowingTips)} min="0" type="number" value={slowingTips} onChange={(event) => setSlowingTips(event.target.value)} />
        <FieldError message={errors.slowingTips} />
      </label>
      <label>
        <span>Stopped tips</span>
        <input aria-invalid={Boolean(errors.stoppedTips)} min="0" type="number" value={stoppedTips} onChange={(event) => setStoppedTips(event.target.value)} />
        <FieldError message={errors.stoppedTips} />
      </label>

      <div className="calculation-strip form-grid__full" aria-live="polite">
        <span>{tipPercentages.activePercent}% active tips</span>
        <span>{tipPercentages.slowingPercent}% slowing tips</span>
        <span>{tipPercentages.stoppedPercent}% stopped tips</span>
        <span>{vigourLevel} vigour</span>
      </div>

      <label>
        <span>Average shoot length cm</span>
        <input aria-invalid={Boolean(errors.averageShootLengthCm)} min="0" type="number" value={averageShootLengthCm} onChange={(event) => setAverageShootLengthCm(event.target.value)} />
        <FieldError message={errors.averageShootLengthCm} />
      </label>
      <label>
        <span>Average internode length cm</span>
        <input aria-invalid={Boolean(errors.averageInternodeLengthCm)} min="0" type="number" value={averageInternodeLengthCm} onChange={(event) => setAverageInternodeLengthCm(event.target.value)} />
        <FieldError message={errors.averageInternodeLengthCm} />
      </label>
      <label>
        <span>Canopy density</span>
        <select value={canopyDensity} onChange={(event) => setCanopyDensity(event.target.value as CanopyDensity)}>
          {canopyDensityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
      <label>
        <span>Vigour level</span>
        <select value={vigourLevel} onChange={(event) => setVigourLevel(event.target.value as VigourLevel)}>
          {vigourLevels.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
      <label>
        <span>Distribution</span>
        <select value={vigourDistribution} onChange={(event) => setVigourDistribution(event.target.value as VigourDistribution)}>
          {vigourDistributions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
      <label>
        <span>Affected area</span>
        <input value={vigourAffectedArea} onChange={(event) => setVigourAffectedArea(event.target.value)} placeholder="Specific rows or zones" />
      </label>
    </fieldset>
  );
}

type PhytosanitaryFieldsProps = {
  inspectionTarget: InspectionTarget;
  symptomCategory: SymptomCategory;
  suspectedIssue: string;
  symptomaticVines: string;
  sampledOrgans: string;
  symptomaticOrgans: string;
  severityScore: string;
  symptomDistribution: SymptomDistribution;
  progression: SymptomProgression;
  phytoAffectedArea: string;
  actionRequired: ActionRequired;
  incidence: ReturnType<typeof calculatePhytosanitaryIncidence>;
  errors: Record<string, string>;
  setInspectionTarget: (value: InspectionTarget) => void;
  setSymptomCategory: (value: SymptomCategory) => void;
  setSuspectedIssue: (value: string) => void;
  setSymptomaticVines: (value: string) => void;
  setSampledOrgans: (value: string) => void;
  setSymptomaticOrgans: (value: string) => void;
  setSeverityScore: (value: string) => void;
  setSymptomDistribution: (value: SymptomDistribution) => void;
  setProgression: (value: SymptomProgression) => void;
  setPhytoAffectedArea: (value: string) => void;
  setActionRequired: (value: ActionRequired) => void;
};

function PhytosanitaryFields({
  inspectionTarget,
  symptomCategory,
  suspectedIssue,
  symptomaticVines,
  sampledOrgans,
  symptomaticOrgans,
  severityScore,
  symptomDistribution,
  progression,
  phytoAffectedArea,
  actionRequired,
  incidence,
  errors,
  setInspectionTarget,
  setSymptomCategory,
  setSuspectedIssue,
  setSymptomaticVines,
  setSampledOrgans,
  setSymptomaticOrgans,
  setSeverityScore,
  setSymptomDistribution,
  setProgression,
  setPhytoAffectedArea,
  setActionRequired,
}: PhytosanitaryFieldsProps) {
  return (
    <fieldset className="observation-form__group form-grid__full">
      <legend>Phytosanitary Symptoms & Inspection</legend>
      <p className="info-callout form-grid__full">This observation records visible symptoms and does not represent a confirmed diagnosis.</p>

      <label>
        <span>Inspection target</span>
        <select value={inspectionTarget} onChange={(event) => setInspectionTarget(event.target.value as InspectionTarget)}>
          {inspectionTargets.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
      <label>
        <span>Symptom category</span>
        <select value={symptomCategory} onChange={(event) => setSymptomCategory(event.target.value as SymptomCategory)}>
          {symptomCategories.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
      <label>
        <span>Suspected issue</span>
        <input value={suspectedIssue} onChange={(event) => setSuspectedIssue(event.target.value)} placeholder="Hypothesis only, not confirmed" />
      </label>
      <label>
        <span>Symptomatic vines</span>
        <input aria-invalid={Boolean(errors.symptomaticVines)} min="0" type="number" value={symptomaticVines} onChange={(event) => setSymptomaticVines(event.target.value)} />
        <FieldError message={errors.symptomaticVines} />
      </label>
      <label>
        <span>Sampled organs</span>
        <input aria-invalid={Boolean(errors.sampledOrgans)} min="0" type="number" value={sampledOrgans} onChange={(event) => setSampledOrgans(event.target.value)} />
        <FieldError message={errors.sampledOrgans} />
      </label>
      <label>
        <span>Symptomatic organs</span>
        <input aria-invalid={Boolean(errors.symptomaticOrgans)} min="0" type="number" value={symptomaticOrgans} onChange={(event) => setSymptomaticOrgans(event.target.value)} />
        <FieldError message={errors.symptomaticOrgans} />
      </label>
      <label>
        <span>Severity score 0-5</span>
        <input aria-invalid={Boolean(errors.severityScore)} max="5" min="0" type="number" value={severityScore} onChange={(event) => setSeverityScore(event.target.value)} />
        <FieldError message={errors.severityScore} />
      </label>
      <label>
        <span>Distribution</span>
        <select value={symptomDistribution} onChange={(event) => setSymptomDistribution(event.target.value as SymptomDistribution)}>
          {symptomDistributions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>

      <div className="calculation-strip form-grid__full" aria-live="polite">
        <span>{incidence.incidencePercent}% incidence</span>
        <span>Severity {severityScore || 0}/5</span>
        <span>{symptomDistribution}</span>
        <span>{actionRequired}</span>
        {incidence.organIncidencePercent !== undefined ? <span>{incidence.organIncidencePercent}% organ incidence</span> : null}
      </div>

      <label>
        <span>Progression</span>
        <select value={progression} onChange={(event) => setProgression(event.target.value as SymptomProgression)}>
          {progressions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
      <label>
        <span>Action required</span>
        <select value={actionRequired} onChange={(event) => setActionRequired(event.target.value as ActionRequired)}>
          {actionOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
      <label className="form-grid__full">
        <span>Affected area</span>
        <input value={phytoAffectedArea} onChange={(event) => setPhytoAffectedArea(event.target.value)} placeholder="Specific rows, canopy level, or zone" />
      </label>
    </fieldset>
  );
}
