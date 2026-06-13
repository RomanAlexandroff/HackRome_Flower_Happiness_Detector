export type FieldObservationType = "vigour_shoot_tips" | "phytosanitary_inspection";

export type ObserverRole = "Owner" | "Vineyard worker" | "Agronomist" | "Technician";

export type ConfidenceLevel = "Low" | "Medium" | "High";

export type FieldObservationStatus = "Draft" | "Completed" | "Reviewed";

export type CanopyDensity = "Low" | "Balanced" | "High";

export type VigourLevel = "Low" | "Moderate" | "High" | "Excessive";

export type VigourDistribution = "Uniform" | "Slightly uneven" | "Highly uneven";

export type InspectionTarget =
  | "Leaves"
  | "Shoots"
  | "Bunches"
  | "Berries"
  | "Trunk"
  | "Entire vine";

export type SymptomCategory =
  | "Discoloration"
  | "Spots or lesions"
  | "Powdery coating"
  | "Necrosis"
  | "Wilting"
  | "Deformation"
  | "Rot"
  | "Insect presence"
  | "Eggs or larvae"
  | "Other";

export type SymptomDistribution = "Isolated" | "Localized" | "Scattered" | "Widespread";

export type SymptomProgression = "New" | "Stable" | "Increasing" | "Decreasing" | "Unknown";

export type ActionRequired =
  | "No immediate action"
  | "Monitor"
  | "Agronomist review"
  | "Urgent inspection";

export interface BaseFieldObservation {
  id: string;
  observationType: FieldObservationType;
  vineyardId: string;
  vineyardName: string;
  plotId: string;
  plotName: string;
  rowOrZone?: string;
  observedAt: string;
  observerName: string;
  observerRole: ObserverRole;
  sampledVines: number;
  notes: string;
  photoUrls: string[];
  confidenceLevel: ConfidenceLevel;
  createdAt: string;
  status: FieldObservationStatus;
}

export interface VigourObservation extends BaseFieldObservation {
  observationType: "vigour_shoot_tips";
  totalObservedTips: number;
  activeTips: number;
  slowingTips: number;
  stoppedTips: number;
  averageShootLengthCm?: number;
  averageInternodeLengthCm?: number;
  canopyDensity: CanopyDensity;
  vigourLevel: VigourLevel;
  distribution: VigourDistribution;
  affectedArea?: string;
}

export interface PhytosanitaryObservation extends BaseFieldObservation {
  observationType: "phytosanitary_inspection";
  inspectionTarget: InspectionTarget;
  symptomCategory: SymptomCategory;
  suspectedIssue?: string;
  symptomaticVines: number;
  sampledOrgans?: number;
  symptomaticOrgans?: number;
  severityScore: number;
  distribution: SymptomDistribution;
  progression: SymptomProgression;
  affectedArea?: string;
  actionRequired: ActionRequired;
}

export type FieldObservation = VigourObservation | PhytosanitaryObservation;

export type CommonFieldObservationDraft = {
  vineyardId: string;
  vineyardName: string;
  plotId: string;
  plotName: string;
  rowOrZone?: string;
  observedAt: string;
  observerName: string;
  observerRole: ObserverRole;
  sampledVines: number;
  notes: string;
  photoUrls: string[];
  confidenceLevel: ConfidenceLevel;
  status: FieldObservationStatus;
};

export type VigourObservationDraft = CommonFieldObservationDraft & {
  observationType: "vigour_shoot_tips";
  totalObservedTips: number;
  activeTips: number;
  slowingTips: number;
  stoppedTips: number;
  averageShootLengthCm?: number;
  averageInternodeLengthCm?: number;
  canopyDensity: CanopyDensity;
  vigourLevel: VigourLevel;
  distribution: VigourDistribution;
  affectedArea?: string;
};

export type PhytosanitaryObservationDraft = CommonFieldObservationDraft & {
  observationType: "phytosanitary_inspection";
  inspectionTarget: InspectionTarget;
  symptomCategory: SymptomCategory;
  suspectedIssue?: string;
  symptomaticVines: number;
  sampledOrgans?: number;
  symptomaticOrgans?: number;
  severityScore: number;
  distribution: SymptomDistribution;
  progression: SymptomProgression;
  affectedArea?: string;
  actionRequired: ActionRequired;
};

export type FieldObservationDraft = VigourObservationDraft | PhytosanitaryObservationDraft;

export type ObservationValidationErrors = Record<string, string>;
