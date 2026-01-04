import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import { useInventoryStore, Item } from "@/lib/store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  marca: z.string().min(1, "Marca é obrigatória"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  quantidadeAtual: z.coerce.number().min(0),
  quantidadeMinima: z.coerce.number().min(0),
  unidadeMedida: z.string().min(1, "Unidade é obrigatória"),
  valorUnitario: z.coerce.number().min(0),
  dataValidade: z.string().optional(),
});

interface ItemDialogProps {
  item?: Item;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ItemDialog({ item, trigger, open: controlledOpen, onOpenChange: setControlledOpen }: ItemDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;
  
  const { addItem, updateItem } = useInventoryStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      marca: "",
      categoria: "",
      quantidadeAtual: 0,
      quantidadeMinima: 1,
      unidadeMedida: "un",
      valorUnitario: 0,
      dataValidade: "",
    },
  });

  useEffect(() => {
    if (item && open) {
      form.reset({
        nome: item.nome,
        marca: item.marca,
        categoria: item.categoria,
        quantidadeAtual: item.quantidadeAtual,
        quantidadeMinima: item.quantidadeMinima,
        unidadeMedida: item.unidadeMedida,
        valorUnitario: item.valorUnitario,
        dataValidade: item.dataValidade || "",
      });
    } else if (!item && open) {
      form.reset({
        nome: "",
        marca: "",
        categoria: "",
        quantidadeAtual: 1,
        quantidadeMinima: 1,
        unidadeMedida: "un",
        valorUnitario: 0,
        dataValidade: "",
      });
    }
  }, [item, open, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (item) {
      updateItem(item.id, values);
      toast({ title: "Sucesso", description: "Item atualizado com sucesso" });
    } else {
      addItem({ ...values, dataUltimaCompra: new Date().toISOString() });
      toast({ title: "Sucesso", description: "Item adicionado ao inventário" });
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{item ? "Editar Item" : "Adicionar Novo Item"}</DialogTitle>
          <DialogDescription>
            {item ? "Altere as informações do item selecionado." : "Preencha os dados para adicionar um novo item ao estoque."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Nome</FormLabel>
                    <FormControl><Input placeholder="Ex: Sabão Líquido" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl><Input placeholder="Ex: Omo" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Alimentos">Alimentos</SelectItem>
                        <SelectItem value="Limpeza">Limpeza</SelectItem>
                        <SelectItem value="Higiene">Higiene</SelectItem>
                        <SelectItem value="Saúde">Saúde</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantidadeAtual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qtd Atual</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantidadeMinima"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qtd Mínima</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unidadeMedida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Unid." /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="un">Unidade (un)</SelectItem>
                        <SelectItem value="kg">Quilo (kg)</SelectItem>
                        <SelectItem value="L">Litro (L)</SelectItem>
                        <SelectItem value="ml">Mililitro (ml)</SelectItem>
                        <SelectItem value="cx">Caixa (cx)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valorUnitario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Unit.</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="dataValidade"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Validade (Opcional)</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-6">
              <Button type="submit" className="w-full">{item ? "Atualizar" : "Salvar"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
