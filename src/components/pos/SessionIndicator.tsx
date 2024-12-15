import { useSession } from "@/contexts/SessionContext";
import { Calendar, Clock, MapPin, User } from "lucide-react";

export function SessionIndicator() {
  const { currentSession, currentStaff } = useSession();

  if (!currentSession || !currentStaff) return null;

  return (
    <div className="bg-white border rounded-lg p-3 mb-4 shadow-sm lg:mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-primary truncate">
            {currentSession.name}
          </h2>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{currentSession.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{currentSession.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{currentSession.location}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <User className="w-3 h-3" />
          <span className="font-medium">{currentStaff.name}</span>
        </div>
      </div>
    </div>
  );
}