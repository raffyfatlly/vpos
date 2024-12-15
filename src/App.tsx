import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SessionProvider } from "@/contexts/SessionContext";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Products from "./pages/admin/Products";
import Sessions from "./pages/admin/Sessions";
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
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/admin/products" element={<Layout><Products /></Layout>} />
                <Route path="/admin/sessions" element={<Layout><Sessions /></Layout>} />
                <Route path="/cashier" element={<Layout><POS /></Layout>} />
              </Routes>
            </SessionProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;