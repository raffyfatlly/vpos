import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package2, CalendarDays } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/products')}>
          <div className="flex items-center space-x-4">
            <Package2 className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-medium">Products</h2>
              <p className="text-muted-foreground">Manage your product inventory</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/sessions')}>
          <div className="flex items-center space-x-4">
            <CalendarDays className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-medium">Sessions</h2>
              <p className="text-muted-foreground">Manage your sales sessions</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}