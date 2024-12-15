import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Package2, CalendarDays, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const navigate = useNavigate();

  // Fetch active sessions
  const { data: sessionsData } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .eq('status', 'active');
      return sessions || [];
    },
  });

  // Fetch all products
  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data: products } = await supabase
        .from('products')
        .select('*');
      return products || [];
    },
  });

  // Fetch all staff (profiles)
  const { data: staffData } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*');
      return profiles || [];
    },
  });

  // Calculate total sales from all sessions
  const totalSales = sessionsData?.reduce((total, session) => {
    return total + (session.sales?.reduce((sessionTotal, sale) => 
      sessionTotal + (sale.total || 0), 0) || 0);
  }, 0) || 0;

  // Count products with low stock (less than 10 items)
  const lowStockCount = productsData?.filter(product => 
    product.current_stock < 10
  ).length || 0;

  // Count online staff (this is a placeholder as we don't track online status)
  const onlineStaffCount = staffData?.length || 0;

  // Count pending sessions (those created but not yet started)
  const pendingSessions = sessionsData?.filter(session => 
    session.status === 'active' && session.sales?.length === 0
  ).length || 0;

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome to your business control center
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-background hover:shadow-lg transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Sales</span>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-semibold">${totalSales.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">From all active sessions</p>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-background hover:shadow-lg transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Active Sessions</span>
              <CalendarDays className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-semibold">{sessionsData?.length || 0}</p>
            <p className="text-xs text-muted-foreground">{pendingSessions} pending approval</p>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-background hover:shadow-lg transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Products</span>
              <Package2 className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-semibold">{productsData?.length || 0}</p>
            <p className="text-xs text-muted-foreground">{lowStockCount} low in stock</p>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-background hover:shadow-lg transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Staff Members</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-semibold">{staffData?.length || 0}</p>
            <p className="text-xs text-muted-foreground">{onlineStaffCount} registered</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card 
            className="group p-6 hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-white to-purple-50/50 dark:from-background dark:to-purple-900/10" 
            onClick={() => navigate('/admin/products')}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Package2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Products</h3>
                <p className="text-sm text-muted-foreground">Manage your product inventory</p>
              </div>
            </div>
          </Card>

          <Card 
            className="group p-6 hover:shadow-lg transition-all duration-200 cursor-pointer bg-gradient-to-br from-white to-purple-50/50 dark:from-background dark:to-purple-900/10" 
            onClick={() => navigate('/admin/sessions')}
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Sessions</h3>
                <p className="text-sm text-muted-foreground">Manage your sales sessions</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}