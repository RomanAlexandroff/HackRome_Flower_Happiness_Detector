import { PlotCard } from "../components/PlotCard";
import type { Plot } from "../types/vineyard";

type PlotsViewProps = {
  plots: Plot[];
  onSelectPlot: (plotId: string) => void;
};

export function PlotsView({ plots, onSelectPlot }: PlotsViewProps) {
  return (
    <section className="view-card" aria-labelledby="plots-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Vineyard plots</p>
          <h2 id="plots-title">Plots</h2>
          <p>Monitor each field by status, moisture, temperature, and active sensor coverage.</p>
        </div>
      </div>
      <div className="plot-grid plot-grid--wide">
        {plots.map((plot) => (
          <PlotCard key={plot.id} plot={plot} onSelect={onSelectPlot} />
        ))}
      </div>
    </section>
  );
}
