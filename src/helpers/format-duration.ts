export const formatDuration = (seconds: number, showSeconds = true) => {
  if (!seconds || seconds <= 0) return "0m";

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return showSeconds ? `${mins}m ${secs}s` : `${Math.ceil(seconds / 60)} min`;
};