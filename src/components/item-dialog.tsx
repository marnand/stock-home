import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useMutation } from "@/api/hooks";
import type { Item } from "@/api/types";
import { itemService } from "@/api/service/index.service";
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
  quantidade_atual: z.coerce.number().min(0),
  quantidade_minima: z.coerce.number().min(0),
  unidade_medida: z.string().min(1, "Unidade é obrigatória"),
  valor_unitario: z.coerce.number().min(0),
  data_validade: z.string().optional(),
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
  
  const { toast } = useToast();

  // Mutation para criar item
  const createMutation = useMutation<Item, Partial<Item>>(
    (data) => itemService.create(data),
    {
      invalidateQueries: ['items'],
      onSuccess: () => {
        toast({ title: "Sucesso", description: "Item adicionado ao inventário" });
        setOpen(false);
      },
      onError: () => {
        toast({ title: "Erro", description: "Falha ao adicionar item", variant: "destructive" });
      },
    }
  );

  // Mutation para atualizar item
  const updateMutation = useMutation<Item, { id: number | string; data: Partial<Item> }>(
    ({ id, data }) => itemService.update(id, data),
    {
      invalidateQueries: ['items'],
      onSuccess: () => {
        toast({ title: "Sucesso", description: "Item atualizado com sucesso" });
        setOpen(false);
      },
      onError: () => {
        toast({ title: "Erro", description: "Falha ao atualizar item", variant: "destructive" });
      },
    }
  );

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      marca: "",
      categoria: "",
      quantidade_atual: 0,
      quantidade_minima: 1,
      unidade_medida: "un",
      valor_unitario: 0,
      data_validade: "",
    },
  });

  useEffect(() => {
    if (item && open) {
      form.reset({
        nome: item.nome,
        marca: item.marca,
        categoria: item.categoria,
        quantidade_atual: item.quantidade_atual,
        quantidade_minima: item.quantidade_minima,
        unidade_medida: item.unidade_medida,
        valor_unitario: item.valor_unitario,
        data_validade: item.data_validade || "",
      });
    } else if (!item && open) {
      form.reset({
        nome: "",
        marca: "",
        categoria: "",
        quantidade_atual: 1,
        quantidade_minima: 1,
        unidade_medida: "un",
        valor_unitario: 0,
        data_validade: "",
      });
    }
  }, [item, open, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (item) {
      updateMutation.mutate({ id: item.id, data: values });
    } else {
      createMutation.mutate({ 
        ...values, 
        data_validade: values.data_validade || undefined 
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-125">
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
                name="quantidade_atual"
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
                name="quantidade_minima"
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
                name="unidade_medida"
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
                name="valor_unitario"
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
                name="data_validade"
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {item ? "Atualizando..." : "Salvando..."}
                  </>
                ) : (
                  item ? "Atualizar" : "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
