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
} from "recharts";
import { MOCK_SESSIONS } from "@/data/mockData";

export default function Dashboard() {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const mockSalesData = MOCK_SESSIONS.map(session => ({
      name: session.name,
      sales: Math.floor(Math.random() * 5000), // Mock sales data
    }));
    setSalesData(mockSalesData);
  }, []);

  const totalSales = salesData.reduce((acc, curr) => acc + curr.sales, 0);
  const averageSales = totalSales / (salesData.length || 1);

  return (
    <div className="container mx-auto p-6 space-y-6">
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
          <h3 className="text-sm font-medium text-muted-foreground">Active Sessions</h3>
          <p className="text-2xl font-bold">{MOCK_SESSIONS.length}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Sales by Session</h2>
        <div className="h-[400px]">
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
    </div>
  );
}