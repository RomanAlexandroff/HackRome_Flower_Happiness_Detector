import type {
  FieldObservation,
  FieldObservationDraft,
  ObservationValidationErrors,
  PhytosanitaryObservation,
  PhytosanitaryObservationDraft,
  VigourObservation,
  VigourObservationDraft,
} from "../types/fieldObservation";

export const observationTypeLabels = {
  vigour_shoot_tips: "Vine Vigour & Shoot Tip Status",
  phytosanitary_inspection: "Phytosanitary Symptoms & Inspection",
} as const;

export function calculatePercentage(part: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return Math.round((part / total) * 100);
}

export function calculateTipPercentages(observation: Pick<VigourObservation, "totalObservedTips" | "activeTips" | "slowingTips" | "stoppedTips">) {
  return {
    activePercent: calculatePercentage(observation.activeTips, observation.totalObservedTips),
    slowingPercent: calculatePercentage(observation.slowingTips, observation.totalObservedTips),
    stoppedPercent: calculatePercentage(observation.stoppedTips, observation.totalObservedTips),
  };
}

export function calculatePhytosanitaryIncidence(
  observation: Pick<
    PhytosanitaryObservation,
    "sampledVines" | "symptomaticVines" | "sampledOrgans" | "symptomaticOrgans"
  >,
) {
  const organIncidencePercent =
    observation.sampledOrgans && observation.symptomaticOrgans !== undefined
      ? calculatePercentage(observation.symptomaticOrgans, observation.sampledOrgans)
      : undefined;

  return {
    incidencePercent: calculatePercentage(observation.symptomaticVines, observation.sampledVines),
    organIncidencePercent,
  };
}

function validateCommonFields(draft: FieldObservationDraft): ObservationValidationErrors {
  const errors: ObservationValidationErrors = {};

  if (!draft.plotId) {
    errors.plotId = "Choose a plot.";
  }

  if (!draft.observedAt) {
    errors.observedAt = "Choose observation date and time.";
  }

  if (!draft.observerName.trim()) {
    errors.observerName = "Enter the observer name.";
  }

  if (draft.sampledVines <= 0) {
    errors.sampledVines = "Sampled vines must be greater than zero.";
  }

  return errors;
}

export function validateVigourObservation(draft: VigourObservationDraft): ObservationValidationErrors {
  const errors = validateCommonFields(draft);
  const numericFields = [
    ["sampledVines", draft.sampledVines],
    ["totalObservedTips", draft.totalObservedTips],
    ["activeTips", draft.activeTips],
    ["slowingTips", draft.slowingTips],
    ["stoppedTips", draft.stoppedTips],
    ["averageShootLengthCm", draft.averageShootLengthCm],
    ["averageInternodeLengthCm", draft.averageInternodeLengthCm],
  ] as const;

  numericFields.forEach(([field, value]) => {
    if (value !== undefined && value < 0) {
      errors[field] = "Value must be zero or greater.";
    }
  });

  if (draft.totalObservedTips <= 0) {
    errors.totalObservedTips = "Total observed tips must be greater than zero.";
  }

  const countedTips = draft.activeTips + draft.slowingTips + draft.stoppedTips;

  if (countedTips > draft.totalObservedTips) {
    errors.stoppedTips = "Active, slowing, and stopped tips cannot exceed total observed tips.";
  }

  return errors;
}

export function validatePhytosanitaryObservation(draft: PhytosanitaryObservationDraft): ObservationValidationErrors {
  const errors = validateCommonFields(draft);
  const numericFields = [
    ["sampledVines", draft.sampledVines],
    ["symptomaticVines", draft.symptomaticVines],
    ["sampledOrgans", draft.sampledOrgans],
    ["symptomaticOrgans", draft.symptomaticOrgans],
    ["severityScore", draft.severityScore],
  ] as const;

  numericFields.forEach(([field, value]) => {
    if (value !== undefined && value < 0) {
      errors[field] = "Value must be zero or greater.";
    }
  });

  if (draft.symptomaticVines > draft.sampledVines) {
    errors.symptomaticVines = "Symptomatic vines cannot exceed sampled vines.";
  }

  if (draft.symptomaticOrgans !== undefined && draft.sampledOrgans === undefined) {
    errors.sampledOrgans = "Enter sampled organs before symptomatic organs.";
  }

  if (
    draft.sampledOrgans !== undefined &&
    draft.symptomaticOrgans !== undefined &&
    draft.symptomaticOrgans > draft.sampledOrgans
  ) {
    errors.symptomaticOrgans = "Symptomatic organs cannot exceed sampled organs.";
  }

  if (draft.severityScore < 0 || draft.severityScore > 5) {
    errors.severityScore = "Severity score must be between 0 and 5.";
  }

  return errors;
}

export function validateFieldObservation(draft: FieldObservationDraft): ObservationValidationErrors {
  return draft.observationType === "vigour_shoot_tips"
    ? validateVigourObservation(draft)
    : validatePhytosanitaryObservation(draft);
}

export function getPrimaryObservationIndicator(observation: FieldObservation): string {
  if (observation.observationType === "vigour_shoot_tips") {
    const percentages = calculateTipPercentages(observation);
    return `${percentages.activePercent}% active tips`;
  }

  const incidence = calculatePhytosanitaryIncidence(observation);
  return `${incidence.incidencePercent}% incidence`;
}

export function getObservationSummaryBadges(observation: FieldObservation): string[] {
  if (observation.observationType === "vigour_shoot_tips") {
    const percentages = calculateTipPercentages(observation);
    return [
      `${percentages.activePercent}% active tips`,
      `${percentages.slowingPercent}% slowing tips`,
      `${percentages.stoppedPercent}% stopped tips`,
      `${observation.vigourLevel} vigour`,
      `${observation.sampledVines} vines sampled`,
    ];
  }

  const incidence = calculatePhytosanitaryIncidence(observation);
  return [
    observation.suspectedIssue ? `Possible ${observation.suspectedIssue} symptoms` : observation.symptomCategory,
    `${incidence.incidencePercent}% incidence`,
    `Severity ${observation.severityScore}/5`,
    observation.distribution,
    `${observation.actionRequired} recommended`,
  ];
}
