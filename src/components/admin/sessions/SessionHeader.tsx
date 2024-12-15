import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SessionHeaderProps {
  onCreateClick: () => void;
}

export function SessionHeader({ onCreateClick }: SessionHeaderProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-primary">Sessions</h1>
      <Button 
        onClick={onCreateClick}
        className="bg-primary hover:bg-primary-hover w-full md:w-auto"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Session
      </Button>
    </div>
  );
}