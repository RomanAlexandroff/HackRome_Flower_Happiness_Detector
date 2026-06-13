import { CheckCircle2, Loader2, PackageCheck, RefreshCw, UploadCloud } from "lucide-react";
import type { FlywheelSyncState } from "../types/vineyard";
import { StatusBadge } from "./StatusBadge";

type FlywheelSyncStatusProps = {
  state: FlywheelSyncState;
  isSynchronizing: boolean;
  onSynchronize: () => void;
};

const syncLabels: Record<FlywheelSyncState, string> = {
  not_synchronized: "Not synchronized",
  preparing_evidence: "Preparing evidence",
  uploading_artifacts: "Uploading artifacts",
  synchronized: "Synchronized with Flywheel",
};

const syncDescriptions: Record<FlywheelSyncState, string> = {
  not_synchronized: "This evidence package is ready locally and has not been sent to Flywheel.",
  preparing_evidence: "Brainyard is preparing metadata and measurement artifacts.",
  uploading_artifacts: "Artifacts are being uploaded in this frontend simulation.",
  synchronized: "The simulated evidence package is synchronized with Flywheel.",
};

export function FlywheelSyncStatus({ state, isSynchronizing, onSynchronize }: FlywheelSyncStatusProps) {
  const Icon =
    state === "synchronized"
      ? CheckCircle2
      : state === "uploading_artifacts"
        ? UploadCloud
        : state === "preparing_evidence"
          ? PackageCheck
          : RefreshCw;

  return (
    <section className="sync-panel" aria-labelledby="sync-title">
      <div className="sync-panel__header">
        <div className="sync-panel__icon" aria-hidden="true">
          {isSynchronizing ? <Loader2 className="state-card__spinner" size={22} /> : <Icon size={22} />}
        </div>
        <div>
          <h3 id="sync-title">Flywheel synchronization status</h3>
          <StatusBadge label={syncLabels[state]} />
        </div>
      </div>
      <p>{syncDescriptions[state]}</p>
      <button
        className="button button--primary"
        disabled={isSynchronizing || state === "synchronized"}
        type="button"
        onClick={onSynchronize}
      >
        <UploadCloud size={18} aria-hidden="true" />
        Synchronize with Flywheel
      </button>
    </section>
  );
}
