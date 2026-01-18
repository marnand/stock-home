import { Layout } from "@/components/layout";
import { itemService } from "@/api/service/index.service";
import { useQuery } from "@/api/hooks";
import type { Item } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Analytics() {
  // Buscar itens via API
  const { data, isLoading } = useQuery(
    ['items'],
    () => itemService.getAll(1, 100)
  );

  const items = data?.data || [];

  // Calcular valores derivados com useMemo
  const { categoryData, topItems, totalValue } = useMemo(() => {
    // Dados por categoria
    const catData = items.reduce((acc: { name: string; value: number }[], item: Item) => {
      const existing = acc.find(c => c.name === item.categoria);
      if (existing) {
        existing.value += item.quantidade_atual * item.valor_unitario;
      } else {
        acc.push({ name: item.categoria, value: item.quantidade_atual * item.valor_unitario });
      }
      return acc;
    }, []);

    // Top 5 itens mais caros no estoque
    const top = [...items]
      .sort((a: Item, b: Item) => (b.quantidade_atual * b.valor_unitario) - (a.quantidade_atual * a.valor_unitario))
      .slice(0, 5)
      .map((i: Item) => ({ name: i.nome, valor: i.quantidade_atual * i.valor_unitario }));

    // Valor total
    const total = items.reduce((acc: number, item: Item) => 
      acc + (item.quantidade_atual * item.valor_unitario), 0
    );

    return { categoryData: catData, topItems: top, totalValue: total };
  }, [items]);

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-8">
          <div>
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-5 w-72 mt-2" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Análises</h2>
          <p className="text-muted-foreground mt-1">Visão detalhada do seu investimento e consumo.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Distribuição por Categoria */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Investimento por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="h-75 px-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Itens */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Top 5 Itens (Maior Valor)</CardTitle>
            </CardHeader>
            <CardContent className="h-75 px-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topItems} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                  <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                  <Bar dataKey="valor" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Resumo Rápido */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Valor Total em Estoque</p>
              <h3 className="text-2xl font-bold mt-2 text-primary">R$ {totalValue.toFixed(2)}</h3>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Categorias Ativas</p>
              <h3 className="text-2xl font-bold mt-2 text-emerald-600">{categoryData.length}</h3>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Itens Cadastrados</p>
              <h3 className="text-2xl font-bold mt-2 text-amber-600">{items.length}</h3>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
