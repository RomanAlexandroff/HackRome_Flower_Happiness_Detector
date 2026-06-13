import {
  Activity,
  ClipboardList,
  Database,
  Droplets,
  FlaskConical,
  NotebookPen,
} from "lucide-react";
import type { Activity as ActivityRecord } from "../types/vineyard";
import { formatDateTime } from "../utils/formatters";

type ActivityItemProps = {
  activity: ActivityRecord;
};

const activityIcons = {
  irrigation: Droplets,
  import: Database,
  note: NotebookPen,
  study: FlaskConical,
  event: ClipboardList,
};

export function ActivityItem({ activity }: ActivityItemProps) {
  const Icon = activityIcons[activity.type] ?? Activity;

  return (
    <article className="activity-item">
      <div className="activity-item__icon" aria-hidden="true">
        <Icon size={18} />
      </div>
      <div>
        <h3>{activity.title}</h3>
        <p>{activity.description}</p>
        <time dateTime={activity.timestamp}>{formatDateTime(activity.timestamp)}</time>
      </div>
    </article>
  );
}
