import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionContext";
import { Session, SessionStaff } from "@/types/pos";
import { MOCK_SESSIONS } from "@/data/mockData";

export function SessionSelector() {
  const { setCurrentSession, setCurrentStaff } = useSession();

  const handleSessionSelect = (session: Session) => {
    setCurrentSession(session);
  };

  const handleStaffSelect = (staff: SessionStaff) => {
    setCurrentStaff(staff);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select Session</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {MOCK_SESSIONS.map((session) => (
          <div key={session.id} className="border rounded-lg p-4 space-y-4">
            <div>
              <h3 className="font-medium">{session.name}</h3>
              <p className="text-sm text-muted-foreground">
                {session.date} - {session.location}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Select Staff:</p>
              <div className="flex gap-2">
                {session.staff.map((staff) => (
                  <Button
                    key={staff.id}
                    variant="outline"
                    onClick={() => {
                      handleSessionSelect(session);
                      handleStaffSelect(staff);
                    }}
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