import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (storage.adminLogin(password)) {
        toast.success("Login realizado com sucesso!");
        navigate("/admin");
      } else {
        toast.error("Senha incorreta");
      }
    } catch (error) {
      toast.error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-chaos-wine">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardTitle className="font-bebas text-3xl sm:text-4xl tracking-wider text-foreground">
              LOGIN ADMINISTRADOR
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm sm:text-base">
              Acesso restrito para administradores
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium text-sm sm:text-base">
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                  className="border-chaos-silver focus:border-chaos-wine"
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full font-bebas text-base sm:text-lg py-3 bg-chaos-wine hover:bg-chaos-glow text-foreground border-2 border-chaos-wine hover:border-chaos-glow transition-all duration-300 shadow-chaos hover:shadow-silver tracking-wider"
                >
                  {isLoading ? "ENTRANDO..." : "ENTRAR"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full font-bebas text-base sm:text-lg py-3 border-2 border-chaos-silver hover:bg-chaos-silver hover:text-background transition-all duration-300 tracking-wider"
                >
                  VOLTAR
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
