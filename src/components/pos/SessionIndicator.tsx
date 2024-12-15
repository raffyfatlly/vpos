import { useSession } from "@/contexts/SessionContext";
import { Calendar, Clock, MapPin, User } from "lucide-react";

export function SessionIndicator() {
  const { currentSession, currentStaff } = useSession();

  if (!currentSession || !currentStaff) return null;

  return (
    <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">
            {currentSession.name}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{currentSession.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{currentSession.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{currentSession.location}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4" />
          <span className="font-medium">{currentStaff.name}</span>
        </div>
      </div>
    </div>
  );
}