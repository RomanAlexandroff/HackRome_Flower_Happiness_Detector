import { Database, Settings, UploadCloud } from "lucide-react";

export function SettingsView() {
  return (
    <div className="stack">
      <section className="view-card" aria-labelledby="settings-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Prototype configuration</p>
            <h2 id="settings-title">Settings</h2>
            <p>Brainyard is running locally with mock data for the hackathon demo.</p>
          </div>
          <div className="section-heading__icon" aria-hidden="true">
            <Settings size={26} />
          </div>
        </div>

        <div className="settings-grid">
          <article>
            <Database size={22} aria-hidden="true" />
            <h3>Sensor data source</h3>
            <p>Mock vineyard data is loaded from local TypeScript files through a small service layer.</p>
          </article>
          <article>
            <UploadCloud size={22} aria-hidden="true" />
            <h3>Flywheel synchronization</h3>
            <p>Synchronization states are simulated in the frontend. No token, secret, or real API call is used.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
