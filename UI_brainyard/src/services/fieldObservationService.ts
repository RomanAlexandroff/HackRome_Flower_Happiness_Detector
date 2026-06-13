import { mockFieldObservations } from "../data/mockFieldObservations";
import type { FieldObservation, FieldObservationDraft } from "../types/fieldObservation";
import { generateId } from "../utils/formatters";

const MOCK_DELAY_MS = 250;

function delay<T>(data: T, duration = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(data), duration);
  });
}

let fieldObservations = [...mockFieldObservations];

export const fieldObservationService = {
  async getFieldObservations(): Promise<FieldObservation[]> {
    return delay([...fieldObservations]);
  },

  async getFieldObservationById(id: string): Promise<FieldObservation | undefined> {
    return delay(fieldObservations.find((observation) => observation.id === id));
  },

  async createFieldObservation(data: FieldObservationDraft): Promise<FieldObservation> {
    const observation: FieldObservation = {
      id: generateId("field-observation"),
      createdAt: new Date().toISOString(),
      ...data,
    };

    fieldObservations = [observation, ...fieldObservations];
    return delay(observation);
  },

  async updateFieldObservation(id: string, data: Partial<FieldObservation>): Promise<FieldObservation | undefined> {
    let updatedObservation: FieldObservation | undefined;

    fieldObservations = fieldObservations.map((observation) => {
      if (observation.id !== id) {
        return observation;
      }

      updatedObservation = { ...observation, ...data } as FieldObservation;
      return updatedObservation;
    });

    return delay(updatedObservation);
  },
};
