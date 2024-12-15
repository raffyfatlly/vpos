import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar } from "lucide-react";
import { Session } from "@/types/pos";

interface SessionOptionProps {
  session: Session;
}

export function SessionOption({ session }: SessionOptionProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="font-medium">{session.name}</span>
        <Badge variant="default">
          <Clock className="w-3 h-3 mr-1" />
          active
        </Badge>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{session.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{session.date}</span>
        </div>
      </div>
    </div>
  );
}