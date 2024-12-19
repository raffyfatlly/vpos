import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSessions } from "@/hooks/useSessions";

export function SessionForm({ onCancel }: { onCancel: () => void }) {
  const [formData, setFormData] = useState({
    location: "",
    date: "",
  });

  const { createSession } = useSessions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createSession.mutateAsync(formData);
      onCancel();
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="location" className="text-sm font-medium">
          Location
        </label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="date" className="text-sm font-medium">
          Date
        </label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={createSession.isPending}
        >
          {createSession.isPending ? "Creating..." : "Create Session"}
        </Button>
      </div>
    </form>
  );
}