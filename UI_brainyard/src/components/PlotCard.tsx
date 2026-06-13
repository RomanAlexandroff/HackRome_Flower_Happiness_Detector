import { ChevronRight, Radio, Thermometer, Droplets } from "lucide-react";
import type { Plot } from "../types/vineyard";
import { formatPercent, formatTemperature, getPlotDisplayName } from "../utils/formatters";
import { StatusBadge } from "./StatusBadge";

type PlotCardProps = {
  plot: Plot;
  onSelect: (plotId: string) => void;
};

export function PlotCard({ plot, onSelect }: PlotCardProps) {
  return (
    <button className="plot-card" type="button" onClick={() => onSelect(plot.id)}>
      <span className="plot-card__topline">
        <span>
          <strong>{plot.name}</strong>
          <span>{plot.fieldName}</span>
        </span>
        <ChevronRight size={20} aria-hidden="true" />
      </span>

      <span className="plot-card__status">
        <StatusBadge label={plot.status} />
      </span>

      <span className="plot-card__metrics">
        <span>
          <Droplets size={17} aria-hidden="true" />
          Soil moisture: {formatPercent(plot.soilMoisture)}
        </span>
        <span>
          <Thermometer size={17} aria-hidden="true" />
          Temperature: {formatTemperature(plot.airTemperature)}
        </span>
        <span>
          <Radio size={17} aria-hidden="true" />
          {plot.activeSensors} active sensors
        </span>
      </span>

      <span className="sr-only">Open details for {getPlotDisplayName(plot.name, plot.fieldName)}</span>
    </button>
  );
}
