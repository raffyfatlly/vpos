import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MOCK_SESSIONS } from "@/data/mockData";
import { useSession } from "@/contexts/SessionContext";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const { currentSession } = useSession();

  useEffect(() => {
    // Generate mock sales data for demonstration
    const mockSalesData = MOCK_SESSIONS.map(session => ({
      name: session.name,
      sales: Math.floor(Math.random() * 5000),
      products: session.products.length,
    }));
    setSalesData(mockSalesData);

    // Generate mock product sales data
    const mockProductData = MOCK_SESSIONS.flatMap(session => 
      session.products.map(product => ({
        name: product.name,
        value: Math.floor(Math.random() * 100),
      }))
    ).reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.name);
      if (existing) {
        existing.value += curr.value;
      } else {
        acc.push(curr);
      }
      return acc;
    }, [] as any[]);
    setProductData(mockProductData);
  }, []);

  const totalSales = salesData.reduce((acc, curr) => acc + curr.sales, 0);
  const totalProducts = MOCK_SESSIONS.reduce((acc, session) => acc + session.products.length, 0);
  const averageSales = totalSales / (salesData.length || 1);

  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Sales Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Sales</h3>
          <p className="text-2xl font-bold">RM {totalSales.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Average Sales per Session</h3>
          <p className="text-2xl font-bold">RM {averageSales.toFixed(2)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Products</h3>
          <p className="text-2xl font-bold">{totalProducts}</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Sales by Session</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Product Sales Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {currentSession && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Current Session: {currentSession.name}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Products Available</h3>
              <p className="text-xl font-bold">{currentSession.products.length}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Staff Members</h3>
              <p className="text-xl font-bold">{currentSession.staff.length}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}