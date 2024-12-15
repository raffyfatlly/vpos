import { useSession } from "@/contexts/SessionContext";
import { Calendar, Clock, MapPin, User } from "lucide-react";

export function SessionIndicator() {
  const { currentSession, currentStaff } = useSession();

  if (!currentSession || !currentStaff) return null;

  return (
    <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-primary">
              {currentSession.name}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{currentSession.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{currentSession.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{currentSession.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
            <User className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm text-primary">{currentStaff.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}