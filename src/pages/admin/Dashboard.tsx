import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Package2, CalendarDays, TrendingUp, Users, Wallet, QrCode } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Sale } from "@/types/pos";

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

  // Calculate sales by payment method from active sessions
  const salesByMethod = sessionsData?.reduce((total, session) => {
    if (session.status === 'active' && session.sales) {
      session.sales.forEach((sale: Sale) => {
        total[sale.paymentMethod] = (total[sale.paymentMethod] || 0) + sale.total;
        total.total += sale.total;
      });
    }
    return total;
  }, { cash: 0, bayarlah_qr: 0, total: 0 }) || { cash: 0, bayarlah_qr: 0, total: 0 };

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
            <p className="text-2xl font-semibold">RM {salesByMethod.total.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">From active sessions</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-background hover:shadow-lg transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Cash Sales</span>
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-semibold">RM {salesByMethod.cash.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Total cash transactions</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-background hover:shadow-lg transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Bayarlah QR Sales</span>
              <QrCode className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-semibold">RM {salesByMethod.bayarlah_qr.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Total QR transactions</p>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-background hover:shadow-lg transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Active Sessions</span>
              <CalendarDays className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-semibold">{sessionsData?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Pending sessions</p>
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
