import type { LucideIcon } from "lucide-react";
import { Leaf } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function EmptyState({ title, description, icon: Icon = Leaf }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Icon size={26} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
