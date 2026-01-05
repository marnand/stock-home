import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import { useInventoryStore } from "@/lib/store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  nome: z.string().min(2, "Name must be at least 2 characters"),
  marca: z.string().min(2, "Brand is required"),
  categoria: z.string().min(1, "Category is required"),
  quantidadeAtual: z.coerce.number().min(0),
  quantidadeMinima: z.coerce.number().min(0),
  unidadeMedida: z.string().min(1, "Unit is required"),
  valorUnitario: z.coerce.number().min(0),
  dataValidade: z.string().optional(),
});

export function AddItemDialog() {
  const [open, setOpen] = useState(false);
  const addItem = useInventoryStore((state) => state.addItem);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      marca: "",
      categoria: "",
      quantidadeAtual: 1,
      quantidadeMinima: 1,
      unidadeMedida: "un",
      valorUnitario: 0,
      dataValidade: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addItem({
      ...values,
      dataUltimaCompra: new Date().toISOString(),
    });
    setOpen(false);
    form.reset();
    toast({
      title: "Success",
      description: "Item added to inventory successfully",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl h-12 px-6">
          <Plus className="mr-2 h-5 w-5" /> Add New Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-panel border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Inventory Item</DialogTitle>
          <DialogDescription>
            Add a new item to your stock control list.
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Liquid Soap" {...field} className="bg-white/50 border-gray-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Omo" {...field} className="bg-white/50 border-gray-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/50 border-gray-200">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Alimentos">Food</SelectItem>
                        <SelectItem value="Limpeza">Cleaning</SelectItem>
                        <SelectItem value="Higiene">Hygiene</SelectItem>
                        <SelectItem value="Saúde">Health</SelectItem>
                        <SelectItem value="Outros">Others</SelectItem>
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
                    <FormLabel>Current Qty</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-white/50 border-gray-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantidadeMinima"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Qty</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-white/50 border-gray-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unidadeMedida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/50 border-gray-200">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="un">Unit (un)</SelectItem>
                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                        <SelectItem value="g">Gram (g)</SelectItem>
                        <SelectItem value="L">Liter (L)</SelectItem>
                        <SelectItem value="ml">Milliliter (ml)</SelectItem>
                        <SelectItem value="cx">Box (cx)</SelectItem>
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
                    <FormLabel>Price per Unit</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="bg-white/50 border-gray-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="dataValidade"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Expiry Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-white/50 border-gray-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-6">
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Save Item</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
