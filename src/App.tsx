import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SessionProvider } from "@/contexts/SessionContext";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Products from "./pages/admin/Products";
import Sessions from "./pages/admin/Sessions";
import Dashboard from "./pages/admin/Dashboard";
import POS from "./pages/cashier/POS";
import Login from "./pages/Login";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <SessionProvider>
              <SidebarProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Layout><Index /></Layout>} />
                  <Route path="/admin/dashboard" element={<Layout requireRole="admin"><Dashboard /></Layout>} />
                  <Route path="/admin/products" element={<Layout requireRole="admin"><Products /></Layout>} />
                  <Route path="/admin/sessions" element={<Layout requireRole="admin"><Sessions /></Layout>} />
                  <Route path="/cashier" element={<Layout requireRole="cashier"><POS /></Layout>} />
                </Routes>
              </SidebarProvider>
            </SessionProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;