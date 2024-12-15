import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;