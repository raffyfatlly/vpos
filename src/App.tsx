import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "@/contexts/SessionContext";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import POS from "./pages/cashier/POS";
import Products from "./pages/admin/Products";
import Sessions from "./pages/admin/Sessions";
import Dashboard from "./pages/admin/Dashboard";
import Index from "./pages/Index";

// Create a client outside of the component to avoid recreation on each render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <SidebarProvider>
            <SessionProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admin/dashboard" element={<Layout requireRole="admin"><Dashboard /></Layout>} />
                <Route path="/admin/products" element={<Layout requireRole="admin"><Products /></Layout>} />
                <Route path="/admin/sessions" element={<Layout requireRole="admin"><Sessions /></Layout>} />
                <Route path="/admin/members" element={<Layout requireRole="admin"><Members /></Layout>} />
                <Route path="/cashier" element={<Layout requireRole="cashier"><POS /></Layout>} />
                <Route path="/" element={<Index />} />
              </Routes>
              <Toaster />
            </SessionProvider>
          </SidebarProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;