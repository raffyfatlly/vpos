import { useSession } from "@/contexts/SessionContext";
import { Calendar, MapPin } from "lucide-react";

export function SessionIndicator() {
  const { currentSession, currentStaff } = useSession();

  if (!currentSession || !currentStaff) return null;

  return (
    <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-primary">
            {currentSession.name}
          </h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{currentSession.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{currentSession.location}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">Logged in as:</div>
          <div className="text-sm text-muted-foreground">{currentStaff.name}</div>
        </div>
      </div>
    </div>
  );
}