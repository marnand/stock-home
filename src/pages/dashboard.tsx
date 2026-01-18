import { Layout } from "@/components/layout";
import { ItemDialog } from "@/components/item-dialog";
import { itemService } from "@/api/service/index.service";
import { useQuery } from "@/api/hooks";
import type { Item } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingDown, Package, DollarSign, Plus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const chartData = [
  { name: 'Jan', value: 1200 },
  { name: 'Fev', value: 1100 },
  { name: 'Mar', value: 1400 },
  { name: 'Abr', value: 1800 },
  { name: 'Mai', value: 1500 },
  { name: 'Jun', value: 1700 },
  { name: 'Jul', value: 1600 },
];

export default function Dashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = useQuery(
    ['items'],
    () => itemService.getAll(1, 100)
  );

  const items = data?.data || [];

  // Calcular valores derivados com useMemo
  const { totalValue, criticalItems, expiringItems, totalItemsCount } = useMemo(() => {
    const total = items.reduce((acc: number, item: Item) => 
      acc + (item.quantidade_atual * item.valor_unitario), 0
    );
    
    const critical = items.filter((item: Item) => 
      item.quantidade_atual <= item.quantidade_minima
    );
    
    const expiring = items.filter((item: Item) => {
      if (!item.data_validade) return false;
      const daysUntilExpiry = Math.ceil(
        (new Date(item.data_validade).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
    });
    
    const count = items.reduce((acc: number, item: Item) => 
      acc + item.quantidade_atual, 0
    );

    return { 
      totalValue: total, 
      criticalItems: critical, 
      expiringItems: expiring, 
      totalItemsCount: count 
    };
  }, [items]);

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-5 w-64 mt-2" />
            </div>
            <Skeleton className="h-11 w-32" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-7">
            <Skeleton className="md:col-span-4 h-80" />
            <Skeleton className="md:col-span-3 h-80" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Olá, Valentina</h2>
            <p className="text-muted-foreground mt-1">Veja como está o estoque da sua casa hoje.</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2 h-11 px-6 shadow-md shadow-primary/20">
            <Plus className="h-5 w-5" /> Novo Item
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total de Itens" value={totalItemsCount} icon={Package} />
          <MetricCard title="Estoque Crítico" value={criticalItems.length} icon={AlertCircle} />
          <MetricCard title="Valor Total" value={`R$ ${totalValue.toFixed(2)}`} icon={DollarSign} />
          <MetricCard title="Vencendo Breve" value={expiringItems.length} icon={TrendingDown} />
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-4 p-6 border-none shadow-sm dark:bg-card/40">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Tendência de Gastos</CardTitle>
            </CardHeader>
            <CardContent className="h-75 px-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(190 90% 40%)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="hsl(190 90% 40%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(190 90% 40%)" strokeWidth={3} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 p-6 border-none shadow-sm dark:bg-card/40">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Alertas de Reposição</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-4">
                {criticalItems.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Tudo em ordem!</p>}
                {criticalItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-2 w-2 rounded-full animate-pulse", item.quantidade_atual === 0 ? "bg-red-500" : "bg-orange-500")} />
                      <div>
                        <p className="text-sm font-medium">{item.nome}</p>
                        <p className="text-xs text-muted-foreground">{item.marca}</p>
                      </div>
                    </div>
                    <div className={cn("text-right font-bold text-sm", item.quantidade_atual === 0 ? "text-red-500" : "text-orange-500")}>
                      {item.quantidade_atual} {item.unidade_medida}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ItemDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </Layout>
  );
}

function MetricCard({ title, value, icon: Icon }: any) {
  return (
    <Card className={cn("p-4 border-none shadow-sm transition-transform hover:scale-[1.02] bg-cyan-700 text-white")}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium opacity-80">{title}</p>
        <div className="p-2 rounded-lg bg-white/20 dark:bg-black/20"><Icon className="h-4 w-4" /></div>
      </div>
      <div className="mt-4"><h3 className="text-2xl font-bold">{value}</h3></div>
    </Card>
  );
}
