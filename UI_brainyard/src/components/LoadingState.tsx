import { Loader2 } from "lucide-react";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "Loading vineyard data..." }: LoadingStateProps) {
  return (
    <div className="state-card" role="status" aria-live="polite">
      <Loader2 className="state-card__spinner" size={28} aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
