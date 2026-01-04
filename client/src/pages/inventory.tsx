import { useState } from "react";
import { Layout } from "@/components/layout";
import { useInventoryStore, Item } from "@/lib/store";
import { ItemDialog } from "@/components/item-dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Trash2, Edit, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Inventory() {
  const { items, deleteItem } = useInventoryStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.marca.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (item: Item) => {
    if (item.quantidadeAtual === 0) return "bg-red-500/10 text-red-600 border-red-200";
    if (item.quantidadeAtual <= item.quantidadeMinima) return "bg-orange-500/10 text-orange-600 border-orange-200";
    return "bg-green-500/10 text-green-600 border-green-200";
  };

  const getStatusText = (item: Item) => {
    if (item.quantidadeAtual === 0) return "Esgotado";
    if (item.quantidadeAtual <= item.quantidadeMinima) return "Crítico";
    return "OK";
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Inventário</h2>
            <p className="text-muted-foreground mt-1">Gerencie os itens da sua casa e níveis de estoque.</p>
          </div>
          <Button onClick={() => { setEditingItem(undefined); setIsDialogOpen(true); }} className="gap-2">
            <Plus className="h-5 w-5" /> Adicionar Item
          </Button>
        </div>

        <div className="bg-card rounded-xl p-6 border shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar por nome ou marca..." 
                className="pl-10 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[200px]">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Alimentos">Alimentos</SelectItem>
                  <SelectItem value="Limpeza">Limpeza</SelectItem>
                  <SelectItem value="Higiene">Higiene</SelectItem>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Item</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Qtd Atual</TableHead>
                  <TableHead>Preço Unit.</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Nenhum item encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/10">
                      <TableCell>
                        <div className="font-medium text-foreground">{item.nome}</div>
                        <div className="text-xs text-muted-foreground">{item.marca}</div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{item.categoria}</Badge></TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(item)}>{getStatusText(item)}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{item.quantidadeAtual} {item.unidadeMedida}</TableCell>
                      <TableCell>R$ {item.valorUnitario.toFixed(2)}</TableCell>
                      <TableCell className="font-bold">R$ {(item.quantidadeAtual * item.valorUnitario).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setIsDialogOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="hover:text-red-600" onClick={() => deleteItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <ItemDialog 
        item={editingItem} 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </Layout>
  );
}
