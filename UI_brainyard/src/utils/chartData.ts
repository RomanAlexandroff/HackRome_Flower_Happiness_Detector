import type { IrrigationMarker, Measurement } from "../types/vineyard";
import type { ChartDatum } from "../components/TimeSeriesChart";

const plotKeys: Record<string, string> = {
  "plot-a": "plotA",
  "plot-b": "plotB",
  "plot-c": "plotC",
};

export function buildSoilMoistureComparisonData(
  measurements: Measurement[],
  plotIds: string[],
): ChartDatum[] {
  const grouped = new Map<string, ChartDatum>();

  measurements
    .filter((measurement) => plotIds.includes(measurement.plotId))
    .forEach((measurement) => {
      const current = grouped.get(measurement.timestamp) ?? { timestamp: measurement.timestamp };
      current[plotKeys[measurement.plotId] ?? measurement.plotId] = measurement.soilMoisture;
      grouped.set(measurement.timestamp, current);
    });

  return Array.from(grouped.values()).sort((a, b) =>
    String(a.timestamp).localeCompare(String(b.timestamp)),
  );
}

export function buildPlotHistoryData(measurements: Measurement[], plotId: string): ChartDatum[] {
  return measurements
    .filter((measurement) => measurement.plotId === plotId)
    .map((measurement) => ({
      timestamp: measurement.timestamp,
      soilMoisture: measurement.soilMoisture,
      airHumidity: measurement.airHumidity,
      airTemperature: measurement.airTemperature,
    }))
    .sort((a, b) => String(a.timestamp).localeCompare(String(b.timestamp)));
}

export function getMarkersForPlot(irrigationMarkers: IrrigationMarker[], plotId: string) {
  return irrigationMarkers
    .filter((marker) => marker.plotId === plotId)
    .map((marker) => ({
      timestamp: marker.timestamp,
      label: marker.label,
    }));
}
