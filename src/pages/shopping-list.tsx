import { useState } from "react";
import { Layout } from "@/components/layout";
import { useInventoryStore } from "@/lib/store";
import { ShoppingBasket, Check, Trash2, AlertTriangle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ItemDialog } from "@/components/item-dialog";
import { cn } from "@/lib/utils";

export default function ShoppingList() {
  const { items, updateItem } = useInventoryStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const shoppingItems = items.filter(item => item.quantidadeAtual <= item.quantidadeMinima);
  
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFinishShopping = () => {
    checkedItems.forEach(id => {
      const item = items.find(i => i.id === id);
      if (item) {
        updateItem(id, { 
          quantidadeAtual: item.quantidadeMinima * 2,
          dataUltimaCompra: new Date().toISOString()
        });
      }
    });
    setCheckedItems([]);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Lista de Compras</h2>
            <p className="text-muted-foreground mt-1">Itens que precisam de reposição imediata.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Cadastrar Novo
            </Button>
            <Button 
              disabled={checkedItems.length === 0}
              onClick={handleFinishShopping}
              className="gap-2"
            >
              <Check className="h-4 w-4" /> Marcar como Comprado ({checkedItems.length})
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {shoppingItems.length === 0 ? (
            <Card className="border-dashed py-12 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingBasket className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg">Seu estoque está em dia!</h3>
              <p className="text-muted-foreground">Não há itens necessitando reposição no momento.</p>
              <Button variant="link" onClick={() => setIsDialogOpen(true)} className="mt-2">
                Deseja cadastrar algo novo?
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shoppingItems.map((item) => (
                <Card key={item.id} className={cn(
                  "relative overflow-hidden transition-all border-l-4",
                  item.quantidadeAtual === 0 ? "border-l-red-500" : "border-l-orange-500",
                  checkedItems.includes(item.id) ? "opacity-60 bg-muted/50" : "hover:shadow-md"
                )}>
                  <CardHeader className="pb-2 flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground">{item.marca}</p>
                    </div>
                    <Checkbox 
                      checked={checkedItems.includes(item.id)}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="h-5 w-5 rounded-md"
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">{item.categoria}</Badge>
                      {item.quantidadeAtual === 0 && (
                        <Badge className="bg-red-500 hover:bg-red-600">Esgotado</Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Status</p>
                        <div className={cn(
                          "flex items-center gap-1 text-sm font-medium",
                          item.quantidadeAtual === 0 ? "text-red-600" : "text-orange-600"
                        )}>
                          <AlertTriangle className="h-3 w-3" />
                          {item.quantidadeAtual} / {item.quantidadeMinima} {item.unidadeMedida}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Preço Unit.</p>
                        <p className="font-bold">R$ {item.valorUnitario.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <ItemDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </Layout>
  );
}
