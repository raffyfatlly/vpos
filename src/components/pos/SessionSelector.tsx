import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionContext";
import { Session, SessionStaff } from "@/types/pos";
import { MOCK_SESSIONS } from "@/data/mockData";
import { Calendar, MapPin, User } from "lucide-react";

export function SessionSelector() {
  const { setCurrentSession, setCurrentStaff } = useSession();

  const handleSessionSelect = (session: Session, staff: SessionStaff) => {
    setCurrentSession(session);
    setCurrentStaff(staff);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-primary">Select Session</h2>
        <p className="text-muted-foreground">
          Choose the session and staff member to begin
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {MOCK_SESSIONS.map((session) => (
          <div
            key={session.id}
            className="border rounded-lg p-6 space-y-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-2">
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{session.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{session.date}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-primary">
                ID: {session.id}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4" />
                <span>Select Staff:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {session.staff.map((staff) => (
                  <Button
                    key={staff.id}
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleSessionSelect(session, staff)}
                  >
                    {staff.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}