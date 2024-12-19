import { Session } from "@/types/pos";
import { SessionFormFields } from "./SessionFormFields";
import { nanoid } from 'nanoid';

interface SessionFormModalProps {
  session?: Session;
  onSubmit: (sessionData: any) => void;
  onCancel: () => void;
}

export function SessionFormModal({ session, onSubmit, onCancel }: SessionFormModalProps) {
  const handleSubmit = async (formData: { location: string; date: string }) => {
    const sessionId = `S${Date.now()}-${nanoid(6).toUpperCase()}`;
    const sessionData = {
      id: sessionId,
      name: sessionId,
      location: formData.location,
      date: formData.date,
      status: "active",
      created_at: new Date().toISOString(),
    };

    onSubmit(sessionData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {session ? "Edit Session" : "Create Session"}
        </h2>
        <SessionFormFields
          initialData={session}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}