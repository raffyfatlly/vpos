import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SessionHeaderProps {
  onCreateClick: () => void;
}

export function SessionHeader({ onCreateClick }: SessionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-primary">Sessions</h1>
      <Button 
        onClick={onCreateClick}
        className="bg-primary hover:bg-primary/90"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Session
      </Button>
    </div>
  );
}