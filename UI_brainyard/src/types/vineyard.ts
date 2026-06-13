export type PlotStatus = "Healthy" | "Water stress risk" | "Monitoring";

export type SensorStatus = "Online" | "Low battery" | "Offline";

export type AlertSeverity = "critical" | "warning" | "info";

export type FieldEventType =
  | "Irrigation"
  | "Rainfall"
  | "Treatment"
  | "Fertilization"
  | "Pruning"
  | "Sampling"
  | "Agronomist inspection"
  | "Other";

export type ActivityType =
  | "irrigation"
  | "import"
  | "note"
  | "study"
  | "event";

export type StudyStatus = "Draft" | "Ready for review" | "Synchronized";

export type FlywheelSyncState =
  | "not_synchronized"
  | "preparing_evidence"
  | "uploading_artifacts"
  | "synchronized";

export interface Vineyard {
  id: string;
  name: string;
  location: string;
  tagline: string;
  lastSensorUpdate: string;
}

export interface Plot {
  id: string;
  name: string;
  fieldName: string;
  soilMoisture: number;
  airTemperature: number;
  airHumidity: number;
  status: PlotStatus;
  activeSensors: number;
  areaHectares: number;
  grapeVariety: string;
}

export interface Sensor {
  id: string;
  label: string;
  plotId: string;
  type: "Soil moisture" | "Air temperature" | "Air humidity" | "Rain gauge";
  batteryLevel: number;
  status: SensorStatus;
  lastReading: number;
  unit: "%" | "°C" | "mm";
}

export interface Measurement {
  id: string;
  plotId: string;
  timestamp: string;
  soilMoisture: number;
  airTemperature: number;
  airHumidity: number;
  rainfall: number;
}

export interface FieldEvent {
  id: string;
  plotId: string;
  type: FieldEventType;
  date: string;
  time: string;
  durationMinutes: number;
  notes: string;
  createdAt: string;
}

export interface Alert {
  id: string;
  plotId?: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}

export interface Artifact {
  id: string;
  name: string;
  type: "csv" | "json" | "image";
  size: string;
}

export interface EvidenceSummary {
  sensorReadings: number;
  fieldEvents: number;
  observationWindow: string;
  generatedArtifacts: number;
}

export interface Study {
  id: string;
  title: string;
  researchQuestion: string;
  plotId: string;
  dateRange: {
    start: string;
    end: string;
  };
  metrics: string[];
  relatedFieldEventId?: string;
  notes: string;
  status: StudyStatus;
  observation: string;
  evidence: EvidenceSummary;
  interpretation: string;
  limitations: string;
  suggestedNextStep: string;
  artifacts: Artifact[];
  syncState: FlywheelSyncState;
  createdAt: string;
}

export interface IrrigationMarker {
  timestamp: string;
  plotId: string;
  label: string;
}

export interface DashboardData {
  vineyard: Vineyard;
  plots: Plot[];
  sensors: Sensor[];
  measurements: Measurement[];
  fieldEvents: FieldEvent[];
  alerts: Alert[];
  activities: Activity[];
  studies: Study[];
  irrigationMarkers: IrrigationMarker[];
}

export interface StudyDraft {
  researchQuestion: string;
  plotId: string;
  dateRange: {
    start: string;
    end: string;
  };
  metrics: string[];
  relatedFieldEventId?: string;
  notes: string;
}

export interface FieldEventDraft {
  plotId: string;
  type: FieldEventType;
  date: string;
  time: string;
  durationMinutes: number;
  notes: string;
}
