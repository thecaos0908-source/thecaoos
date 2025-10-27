import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage, TicketRegistration } from "@/lib/storage";
import { ticketsDb } from "@/lib/db";
import { emailService, EmailData } from "@/lib/emailService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, X } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Verificar se está logado
    if (!storage.checkAdminLogin()) {
      navigate("/admin/login");
      return;
    }

    // Inicializa EmailJS para envios manuais
    emailService.init();

    // Carregar dados
    loadTickets();
  }, [navigate]);

  const loadTickets = async () => {
    try {
      const data = ticketsDb.isEnabled() ? await ticketsDb.list() : storage.getTickets();
      setTickets(data);
    } catch (error) {
      // Fallback para storage local se Firestore falhar
      try {
        const local = storage.getTickets();
        setTickets(local);
        toast.warning("Falha no banco. Exibindo dados locais.");
      } catch (_) {
        toast.error("Erro ao carregar dados");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim() || !newEmail.trim() || !newEmail.includes('@')) {
      toast.error("Preencha nome e e-mail válidos");
      return;
    }
    setIsCreating(true);
    try {
      const newId = (Date.now() % 100000).toString().padStart(5, '0');
      const toSave = {
        name: newName.trim(),
        email: newEmail.trim(),
        paid: true,
        token: newId,
        paymentId: 'manual'
      } as const;

      let registration: TicketRegistration;
      try {
        if (ticketsDb.isEnabled()) {
          registration = await ticketsDb.save({ id: newId, ...toSave, createdAt: new Date().toISOString() } as any);
        } else {
          registration = storage.saveTicket({ name: toSave.name, email: toSave.email, paid: toSave.paid, paymentId: toSave.paymentId } as any);
        }
      } catch (_) {
        // Fallback local
        registration = storage.saveTicket({ name: toSave.name, email: toSave.email, paid: toSave.paid, paymentId: toSave.paymentId } as any);
      }

      // Enviar e-mail de confirmação
      try {
        const emailData: EmailData = {
          to_name: registration.name,
          to_email: registration.email,
          ticket_id: registration.id,
          event_name: "THE CAOS",
          event_date: "SÁBADO, 20 DE DEZEMBRO",
          event_time: "16:00 - 05H",
          event_location: "LINHA 52, Mirante da Serra - RO, 76926-000 Chácara ZÉ PASTEL",
        };
        await emailService.sendTicketConfirmation(emailData);
      } catch (_) {
        // segue mesmo se o e-mail falhar
      }

      setNewName("");
      setNewEmail("");
      toast.success("Registro criado com sucesso!");
      await loadTickets();
    } catch (_) {
      toast.error("Erro ao criar registro");
    } finally {
      setIsCreating(false);
    }
  };

  // Filtrar tickets baseado no ID de busca
  const filteredTickets = tickets.filter(ticket => 
    ticket.id.toLowerCase().includes(searchId.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      try {
        const ok = ticketsDb.isEnabled() ? await ticketsDb.remove(id) : storage.deleteTicket(id);
        if (ok) {
          toast.success("Registro excluído com sucesso!");
          loadTickets();
        } else {
          toast.error("Erro ao excluir registro");
        }
      } catch (error) {
        toast.error("Erro ao excluir registro");
      }
    }
  };

  const handleLogout = () => {
    storage.adminLogout();
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-bebas text-2xl text-foreground">CARREGANDO...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:items-center mb-8 gap-4">
          <div className="text-center lg:text-left">
            <h1 className="font-bebas text-4xl sm:text-5xl lg:text-6xl tracking-wider text-foreground">
              ADMINISTRAÇÃO
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Gerenciar registros de ingressos
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              onClick={handleLogout}
              className="font-bebas text-sm sm:text-lg py-2 sm:py-3 bg-chaos-wine hover:bg-chaos-glow text-foreground border-2 border-chaos-wine hover:border-chaos-glow transition-all duration-300 shadow-chaos hover:shadow-silver tracking-wider"
            >
              SAIR
            </Button>
          </div>
        </div>

        {/* Criar registro manual */}
        <div className="mb-6">
          <Card className="border-chaos-silver">
            <CardHeader className="pb-2 px-4 sm:px-6">
              <CardTitle className="font-bebas text-xl sm:text-2xl text-foreground">CRIAR REGISTRO (MANUAL)</CardTitle>
              <CardDescription className="text-muted-foreground">Adicione um ingresso manualmente diretamente no banco de dados</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Nome"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border-chaos-silver focus:border-chaos-wine"
                />
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="border-chaos-silver focus:border-chaos-wine"
                />
                <Button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="font-bebas py-3 bg-chaos-wine hover:bg-chaos-glow text-foreground border-2 border-chaos-wine hover:border-chaos-glow transition-all duration-300 tracking-wider"
                >
                  {isCreating ? 'CRIANDO...' : 'CRIAR REGISTRO'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-1 sm:gap-4 md:gap-6 mb-8">
          <Card className="border-chaos-wine">
            <CardHeader className="text-center pb-1 sm:pb-4 px-1 sm:px-4">
              <CardTitle className="font-bebas text-xs sm:text-2xl text-foreground leading-tight">
                TOTAL DE<br />INGRESSOS
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0 pb-1 sm:pb-4 px-1 sm:px-4">
              <div className="font-bebas text-sm sm:text-4xl text-chaos-wine">
                {tickets.length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-chaos-silver">
            <CardHeader className="text-center pb-1 sm:pb-4 px-1 sm:px-4">
              <CardTitle className="font-bebas text-xs sm:text-2xl text-foreground">
                HOJE
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0 pb-1 sm:pb-4 px-1 sm:px-4">
              <div className="font-bebas text-sm sm:text-4xl text-chaos-silver">
                {tickets.filter(ticket => {
                  const today = new Date().toDateString();
                  return new Date(ticket.createdAt).toDateString() === today;
                }).length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-chaos-wine">
            <CardHeader className="text-center pb-1 sm:pb-4 px-1 sm:px-4">
              <CardTitle className="font-bebas text-xs sm:text-2xl text-foreground leading-tight">
                ÚLTIMO<br />REGISTRO
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0 pb-1 sm:pb-4 px-1 sm:px-4">
              <div className="font-bebas text-xs sm:text-4xl text-chaos-wine">
                {tickets.length > 0 
                  ? new Date(tickets[tickets.length - 1].createdAt).toLocaleDateString('pt-BR')
                  : 'Nenhum'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campo de Busca */}
        <div className="mb-6">
          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chaos-silver" />
              <Input
                type="text"
                placeholder="Buscar por ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full border-chaos-silver focus:border-chaos-wine pl-10 pr-10 font-bebas tracking-wider"
              />
              {searchId && (
                <button
                  onClick={() => setSearchId("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-chaos-silver hover:text-chaos-wine transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchId && (
              <p className="text-xs text-muted-foreground mt-2 font-bebas">
                {filteredTickets.length} resultado(s) encontrado(s)
              </p>
            )}
          </div>
        </div>

        {/* Tabela de registros */}
        <Card className="border-chaos-wine">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="font-bebas text-2xl sm:text-3xl lg:text-4xl tracking-wider text-foreground">
              REGISTROS DE INGRESSOS
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm sm:text-base">
              Lista de todas as pessoas que garantiram ingressos
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-bebas text-xl sm:text-2xl text-muted-foreground">
                  {searchId ? "NENHUM REGISTRO ENCONTRADO COM ESTE ID" : "NENHUM REGISTRO ENCONTRADO"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-chaos-silver">
                      <TableHead className="font-bebas text-sm sm:text-lg text-foreground">ID</TableHead>
                      <TableHead className="font-bebas text-sm sm:text-lg text-foreground">NOME</TableHead>
                      <TableHead className="font-bebas text-sm sm:text-lg text-foreground hidden md:table-cell">E-MAIL</TableHead>
                      <TableHead className="font-bebas text-sm sm:text-lg text-foreground hidden lg:table-cell">DATA</TableHead>
                      <TableHead className="font-bebas text-sm sm:text-lg text-foreground">AÇÕES</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id} className="border-chaos-silver">
                        <TableCell className="font-medium text-foreground text-xs sm:text-sm">
                          {ticket.id}
                        </TableCell>
                        <TableCell className="text-foreground text-sm sm:text-base font-medium">
                          {ticket.name}
                        </TableCell>
                        <TableCell className="text-foreground text-xs sm:text-sm hidden md:table-cell">
                          {ticket.email}
                        </TableCell>
                        <TableCell className="text-foreground text-xs sm:text-sm hidden lg:table-cell">
                          {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleDelete(ticket.id)}
                            variant="destructive"
                            size="sm"
                            className="font-bebas tracking-wider text-xs sm:text-sm"
                          >
                            EXCLUIR
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
