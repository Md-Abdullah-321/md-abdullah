interface AdminErrorStateProps {
  message: string;
}

export function AdminErrorState({ message }: AdminErrorStateProps) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
      {message}
    </div>
  );
}
