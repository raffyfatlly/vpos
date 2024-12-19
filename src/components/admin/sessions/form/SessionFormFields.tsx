import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Session } from "@/types/pos";

interface SessionFormFieldsProps {
  initialData?: Session;
  onSubmit: (formData: { location: string; date: string }) => void;
  onCancel: () => void;
}

export function SessionFormFields({ initialData, onSubmit, onCancel }: SessionFormFieldsProps) {
  const [formData, setFormData] = useState({
    location: "",
    date: "",
  });

  useEffect(() => {
    if (initialData) {
      const [day, month, year] = (initialData.date || '').split('-');
      const formattedDate = day && month && year ? `${year}-${month}-${day}` : '';
      
      setFormData({
        location: initialData.location || "",
        date: formattedDate,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [year, month, day] = formData.date.split('-');
    const formattedDate = `${day}-${month}-${year}`;
    
    onSubmit({
      ...formData,
      date: formattedDate,
    });
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
        <Button type="submit">
          {initialData ? "Update Session" : "Create Session"}
        </Button>
      </div>
    </form>
  );
}