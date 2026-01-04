import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useInventoryStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Package } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [, setLocation] = useLocation();
  const login = useInventoryStore((state) => state.login);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nome: "", email: "", password: "" },
  });

  function onLogin(values: z.infer<typeof loginSchema>) {
    // Simulação de login
    login(values.email, "Usuário Mock");
    setLocation("/");
  }

  function onRegister(values: z.infer<typeof registerSchema>) {
    // Simulação de registro
    login(values.email, values.nome);
    setLocation("/");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 p-4 font-sans">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <Package className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">StockHome</h1>
          <p className="text-muted-foreground">Sua despensa inteligente em um só lugar.</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>{isLogin ? "Entrar" : "Criar Conta"}</CardTitle>
            <CardDescription>
              {isLogin 
                ? "Entre com suas credenciais para acessar seu estoque." 
                : "Preencha os dados abaixo para começar a organizar sua casa."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLogin ? (
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl><Input placeholder="exemplo@email.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-11">Entrar</Button>
                </form>
              </Form>
            ) : (
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl><Input placeholder="Seu nome completo" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl><Input placeholder="exemplo@email.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-11">Criar Conta</Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="link" 
              className="w-full text-sm" 
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Não tem uma conta? Crie uma agora" : "Já tem uma conta? Entre aqui"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
