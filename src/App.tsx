import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "@/contexts/SessionContext";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SessionProvider>
            <BrowserRouter>
              <Layout />
            </BrowserRouter>
          </SessionProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;