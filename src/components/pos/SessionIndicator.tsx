import { useSession } from "@/contexts/SessionContext";
import { Calendar, MapPin, User } from "lucide-react";

export function SessionIndicator() {
  const { currentSession, currentStaff } = useSession();

  if (!currentSession || !currentStaff) return null;

  return (
    <div className="w-full bg-primary/5 py-2">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">{currentSession.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{currentSession.date}</span>
              </div>
            </div>
            <h2 className="text-xs sm:text-sm font-medium text-primary">
              Session ID: {currentSession.id}
            </h2>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-primary/10 rounded-full">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="font-medium text-xs sm:text-sm text-primary">
              {currentStaff.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}