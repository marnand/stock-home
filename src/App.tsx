import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard, PublicGuard } from "@/components/auth-guard";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import ShoppingList from "@/pages/shopping-list";
import Analytics from "@/pages/analytics";
import AuthPage from "@/pages/auth";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";

function Router() {
  return (
    <Switch>
      {/* Rotas públicas (login/registro) */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/login">
        <PublicGuard>
          <LoginPage />
        </PublicGuard>
      </Route>
      <Route path="/register">
        <PublicGuard>
          <RegisterPage />
        </PublicGuard>
      </Route>
      
      {/* Rotas protegidas */}
      <Route path="/">
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      </Route>
      <Route path="/inventory">
        <AuthGuard>
          <Inventory />
        </AuthGuard>
      </Route>
      <Route path="/shopping-list">
        <AuthGuard>
          <ShoppingList />
        </AuthGuard>
      </Route>
      <Route path="/analytics">
        <AuthGuard>
          <Analytics />
        </AuthGuard>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
