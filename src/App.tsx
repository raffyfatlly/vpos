import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import POS from "./pages/cashier/POS";
import Products from "./pages/admin/Products";
import Sessions from "./pages/admin/Sessions";
import Dashboard from "./pages/admin/Dashboard";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <SidebarProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/admin/dashboard" element={<Layout requireRole="admin"><Dashboard /></Layout>} />
              <Route path="/admin/products" element={<Layout requireRole="admin"><Products /></Layout>} />
              <Route path="/admin/sessions" element={<Layout requireRole="admin"><Sessions /></Layout>} />
              <Route path="/cashier" element={<Layout requireRole="cashier"><POS /></Layout>} />
              <Route path="/" element={<Layout><Dashboard /></Layout>} />
            </Routes>
            <Toaster />
          </SidebarProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;