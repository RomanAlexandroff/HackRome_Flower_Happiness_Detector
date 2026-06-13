import type { AlertSeverity, FlywheelSyncState, PlotStatus, SensorStatus } from "../types/vineyard";

type StatusBadgeProps = {
  label: PlotStatus | SensorStatus | AlertSeverity | FlywheelSyncState | string;
};

function getTone(label: string): string {
  const normalized = label.toLowerCase();

  if (
    normalized.includes("healthy") ||
    normalized.includes("online") ||
    normalized.includes("synchronized") ||
    normalized.includes("completed")
  ) {
    return "success";
  }

  if (normalized.includes("water") || normalized.includes("critical") || normalized.includes("offline")) {
    return "critical";
  }

  if (
    normalized.includes("warning") ||
    normalized.includes("battery") ||
    normalized.includes("preparing") ||
    normalized.includes("uploading") ||
    normalized.includes("draft")
  ) {
    return "warning";
  }

  if (normalized.includes("monitoring") || normalized.includes("info") || normalized.includes("review")) {
    return "info";
  }

  return "neutral";
}

export function StatusBadge({ label }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${getTone(label)}`}>{label}</span>;
}
