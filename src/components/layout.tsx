import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, Bell, Search, User, LogOut, Sun, Moon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useInventoryStore } from "@/lib/store";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Package, label: "Inventário", href: "/inventory" },
  { icon: ShoppingCart, label: "Lista de Compras", href: "/shopping-list" },
  { icon: BarChart3, label: "Análises", href: "/analytics" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useInventoryStore();
  
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user && location !== "/auth") {
      setLocation("/auth");
    }
  }, [user, location, setLocation]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  if (!user && location === "/auth") {
    return <>{children}</>;
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen w-full bg-background font-sans text-foreground transition-all duration-300">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen sidebar-gradient text-white transition-all duration-300 overflow-hidden",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="flex h-full flex-col justify-between py-6">
          <div>
            <div className="mb-10 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary">
                  <Package className="h-5 w-5 text-white" />
                </div>
                {isSidebarOpen && <span className="text-xl font-bold tracking-tight animate-in fade-in slide-in-from-left-2">StockHome</span>}
              </div>
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={cn(
                      "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200 relative group",
                      location === item.href
                        ? "bg-primary/20 text-primary"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {location === item.href && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                    <item.icon className={cn("h-5 w-5 shrink-0", location === item.href ? "text-primary" : "text-gray-400")} />
                    {isSidebarOpen && <span className="animate-in fade-in slide-in-from-left-2">{item.label}</span>}
                  </a>
                </Link>
              ))}
            </nav>
          </div>

          <div className="px-6 space-y-1">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="flex w-full items-center gap-3 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
              {isSidebarOpen && <span className="animate-in fade-in slide-in-from-left-2">{isDark ? "Modo Claro" : "Modo Escuro"}</span>}
            </button>
            <button 
              onClick={() => logout()}
              className="flex w-full items-center gap-3 py-3 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {isSidebarOpen && <span className="animate-in fade-in slide-in-from-left-2">Sair</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "w-full min-h-screen bg-muted/30 transition-all duration-300",
        isSidebarOpen ? "pl-64" : "pl-20"
      )}>
        <header className="floating-header flex h-16 items-center justify-between px-6 mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-4 bg-muted/50 px-4 py-2 rounded-lg w-64 md:w-96">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="bg-transparent border-none text-sm outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user?.nome || 'Usuário'}</p>
                <p className="text-xs text-muted-foreground">Brasil</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                <User className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </header>

        <div className="px-8 pb-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
