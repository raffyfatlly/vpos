import { SessionCard } from "./SessionCard";

export function NoActiveSessions() {
  return (
    <SessionCard
      title="No Active Sessions"
      description="There are no active sessions available. Please contact an administrator to create or activate a session."
    />
  );
}