import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: username,
          password: password,
        });
        if (error) throw error;
        toast({
          title: "Sign up successful",
          description: "Please check your email to verify your account",
        });
      } else {
        await login(username, password);
        // Get the user's role from the profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (profile) {
          // Redirect based on role
          if (profile.role === 'admin' || profile.role === 'both') {
            navigate("/admin/dashboard", { replace: true });
          } else if (profile.role === 'cashier') {
            navigate("/cashier", { replace: true });
          }
        }
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-1">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isSignUp
              ? "Sign up to get started"
              : "Sign in to your account"}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="username"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            {isSignUp ? "Sign up" : "Sign in"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}