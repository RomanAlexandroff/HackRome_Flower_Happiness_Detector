import { dashboardData } from "../data/mockData";
import type {
  DashboardData,
  FieldEvent,
  FieldEventDraft,
  Study,
  StudyDraft,
} from "../types/vineyard";
import { generateId } from "../utils/formatters";

const MOCK_DELAY_MS = 350;

function delay<T>(data: T, duration = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), duration);
  });
}

export const vineyardService = {
  async getDashboardData(): Promise<DashboardData> {
    return delay({
      ...dashboardData,
      plots: [...dashboardData.plots],
      sensors: [...dashboardData.sensors],
      measurements: [...dashboardData.measurements],
      fieldEvents: [...dashboardData.fieldEvents],
      alerts: [...dashboardData.alerts],
      activities: [...dashboardData.activities],
      studies: [...dashboardData.studies],
      irrigationMarkers: [...dashboardData.irrigationMarkers],
    });
  },

  async createFieldEvent(draft: FieldEventDraft): Promise<FieldEvent> {
    const createdAt = new Date().toISOString();

    return delay(
      {
        id: generateId("field-event"),
        createdAt,
        ...draft,
      },
      250,
    );
  },

  async createStudy(draft: StudyDraft): Promise<Study> {
    const createdAt = new Date().toISOString();

    return delay(
      {
        id: generateId("study"),
        title: "Irrigation response in Plot A",
        researchQuestion: draft.researchQuestion,
        plotId: draft.plotId,
        dateRange: draft.dateRange,
        metrics: draft.metrics,
        relatedFieldEventId: draft.relatedFieldEventId,
        notes: draft.notes,
        status: "Ready for review",
        observation:
          "Soil moisture increased from 21.3% to 33.8% after the irrigation event.",
        evidence: {
          sensorReadings: 144,
          fieldEvents: 1,
          observationWindow: "24-hour observation window",
          generatedArtifacts: 2,
        },
        interpretation:
          "The irrigation produced a measurable increase in soil moisture near sensor soil-01.",
        limitations:
          "Only one irrigation event was analyzed. The measurement represents the area surrounding one sensor and should not be generalized to the entire plot.",
        suggestedNextStep:
          "Repeat the same observation for at least three irrigation events and compare measurements at different soil depths.",
        artifacts: [
          {
            id: "artifact-measurements",
            name: "measurements.csv",
            type: "csv",
            size: "18 KB",
          },
          {
            id: "artifact-metadata",
            name: "study-metadata.json",
            type: "json",
            size: "4 KB",
          },
          {
            id: "artifact-chart",
            name: "soil-moisture-chart.png",
            type: "image",
            size: "92 KB",
          },
        ],
        syncState: "not_synchronized",
        createdAt,
      },
      350,
    );
  },
};
