import { ArrowLeft, BatteryLow, ClipboardCheck, Droplets, Plus, Radio, Thermometer } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { FieldObservationCard } from "../components/FieldObservationCard";
import { StatusBadge } from "../components/StatusBadge";
import { TimeSeriesChart } from "../components/TimeSeriesChart";
import type { FieldObservation } from "../types/fieldObservation";
import type { FieldEvent, IrrigationMarker, Measurement, Plot, Sensor } from "../types/vineyard";
import { buildPlotHistoryData, getMarkersForPlot } from "../utils/chartData";
import { formatDateTime, formatPercent, formatTemperature } from "../utils/formatters";

type PlotDetailViewProps = {
  plot: Plot;
  sensors: Sensor[];
  measurements: Measurement[];
  fieldEvents: FieldEvent[];
  fieldObservations: FieldObservation[];
  irrigationMarkers: IrrigationMarker[];
  onAddObservation: () => void;
  onBack: () => void;
  onAnalyzeIrrigationResponse: () => void;
  onOpenObservation: (observationId: string) => void;
};

export function PlotDetailView({
  plot,
  sensors,
  measurements,
  fieldEvents,
  fieldObservations,
  irrigationMarkers,
  onAddObservation,
  onBack,
  onAnalyzeIrrigationResponse,
  onOpenObservation,
}: PlotDetailViewProps) {
  const plotSensors = sensors.filter((sensor) => sensor.plotId === plot.id);
  const plotEvents = fieldEvents.filter((fieldEvent) => fieldEvent.plotId === plot.id);
  const plotObservations = fieldObservations
    .filter((observation) => observation.plotId === plot.id)
    .sort((a, b) => new Date(b.observedAt).getTime() - new Date(a.observedAt).getTime());
  const chartData = buildPlotHistoryData(measurements, plot.id);
  const markers = getMarkersForPlot(irrigationMarkers, plot.id);

  return (
    <div className="stack">
      <button className="button button--ghost button--fit" type="button" onClick={onBack}>
        <ArrowLeft size={18} aria-hidden="true" />
        Back to overview
      </button>

      <section className="view-card plot-detail" aria-labelledby="plot-detail-title">
        <div className="plot-detail__header">
          <div>
            <p className="eyebrow">{plot.fieldName}</p>
            <h2 id="plot-detail-title">{plot.name}</h2>
            <p>{plot.grapeVariety} · {plot.areaHectares} ha</p>
          </div>
          <StatusBadge label={plot.status} />
        </div>

        <div className="detail-grid">
          <div>
            <Droplets size={20} aria-hidden="true" />
            <span>Soil moisture</span>
            <strong>{formatPercent(plot.soilMoisture)}</strong>
          </div>
          <div>
            <Thermometer size={20} aria-hidden="true" />
            <span>Air temperature</span>
            <strong>{formatTemperature(plot.airTemperature)}</strong>
          </div>
          <div>
            <Radio size={20} aria-hidden="true" />
            <span>Air humidity</span>
            <strong>{formatPercent(plot.airHumidity)}</strong>
          </div>
          <div>
            <Radio size={20} aria-hidden="true" />
            <span>Active sensors</span>
            <strong>{plot.activeSensors}</strong>
          </div>
        </div>

        <div className="chart-card chart-card--embedded">
          <div className="section-heading">
            <div>
              <h3>Historical sensor measurements</h3>
              <p>Soil moisture readings are shown against the irrigation event marker.</p>
            </div>
            <button className="button button--primary" type="button" onClick={onAnalyzeIrrigationResponse}>
              <Droplets size={18} aria-hidden="true" />
              Analyze irrigation response
            </button>
          </div>
          <TimeSeriesChart
            data={chartData}
            height={390}
            lines={[{ dataKey: "soilMoisture", name: `${plot.name} soil moisture`, color: "#1f6b46" }]}
            markers={markers}
          />
        </div>
      </section>


      <section className="view-card" aria-labelledby="plot-observations-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Human observations</p>
            <h2 id="plot-observations-title">Field observations for {plot.name}</h2>
            <p>Recent manual checks from agronomists, technicians, and vineyard staff.</p>
          </div>
          <button className="button button--primary" type="button" onClick={onAddObservation}>
            <Plus size={18} aria-hidden="true" />
            Add observation
          </button>
        </div>
        <div className="observation-list observation-list--compact">
          {plotObservations.length > 0 ? (
            plotObservations.slice(0, 3).map((observation) => (
              <FieldObservationCard key={observation.id} observation={observation} onOpen={onOpenObservation} />
            ))
          ) : (
            <EmptyState
              description="Add a vigour check or phytosanitary inspection for this plot during the next field visit."
              icon={ClipboardCheck}
              title="No field observations for this plot"
            />
          )}
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="view-card" aria-labelledby="events-title">
          <div className="section-heading">
            <div>
              <h2 id="events-title">Recent field events</h2>
              <p>Activities recorded for {plot.name}.</p>
            </div>
          </div>
          <div className="panel-list">
            {plotEvents.length > 0 ? (
              plotEvents.map((fieldEvent) => (
                <article className="field-event-item" key={fieldEvent.id}>
                  <div>
                    <strong>{fieldEvent.type}</strong>
                    <span>
                      {fieldEvent.date} at {fieldEvent.time} · {fieldEvent.durationMinutes} min
                    </span>
                  </div>
                  <p>{fieldEvent.notes}</p>
                </article>
              ))
            ) : (
              <EmptyState
                title="No field events"
                description="Record irrigation, sampling, or agronomist observations for this plot."
              />
            )}
          </div>
        </section>

        <section className="view-card" aria-labelledby="sensor-list-title">
          <div className="section-heading">
            <div>
              <h2 id="sensor-list-title">Sensor list</h2>
              <p>Hardware status and last reading for this plot.</p>
            </div>
          </div>
          <div className="sensor-list">
            {plotSensors.map((sensor) => (
              <article className="sensor-item" key={sensor.id}>
                <div>
                  <strong>{sensor.label}</strong>
                  <span>{sensor.type} · Last reading {sensor.lastReading}{sensor.unit}</span>
                  <small>Updated {formatDateTime("2026-06-13T14:35:00+02:00")}</small>
                </div>
                <div className="sensor-item__status">
                  <StatusBadge label={sensor.status} />
                  <span className={sensor.batteryLevel < 20 ? "battery battery--low" : "battery"}>
                    <BatteryLow size={15} aria-hidden="true" />
                    {sensor.batteryLevel}%
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
