import { SessionForm } from "./SessionForm";

export function SessionFormModal({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Create New Session</h2>
        <SessionForm onCancel={onCancel} />
      </div>
    </div>
  );
}