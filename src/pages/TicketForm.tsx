import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { storage } from "@/lib/storage";
import { ticketsDb } from "@/lib/db";
import { paymentService } from "@/lib/payment";
import { emailService, EmailData } from "@/lib/emailService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const TicketForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const location = useLocation();
  const [isLoadingPix, setIsLoadingPix] = useState(false);
  const [isLoadingCard, setIsLoadingCard] = useState(false);
  const [isAwaitingPix, setIsAwaitingPix] = useState(false);
  const [pixPaymentId, setPixPaymentId] = useState<string | null>(null);
  const [pixQrBase64, setPixQrBase64] = useState<string | null>(null);
  const [pixCode, setPixCode] = useState<string | null>(null);
  const pollingRef = useRef<number | null>(null);
  const [pixApproved, setPixApproved] = useState(false);

  // Inicializar EmailJS quando o componente carregar
  useEffect(() => {
    emailService.init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingPix(true);

    console.log('Formulário submetido com dados:', formData);

    try {
      // Validar dados
      if (!formData.name.trim() || !formData.email.trim()) {
        console.log('Erro: Campos vazios');
        toast.error("Por favor, preencha todos os campos");
        setIsLoadingPix(false);
        return;
      }

      if (!formData.email.includes("@")) {
        console.log('Erro: Email inválido');
        toast.error("Por favor, insira um e-mail válido");
        setIsLoadingPix(false);
        return;
      }

      // Criar pagamento PIX com QR
      let pix;
      try {
        pix = await paymentService.createPixPayment({
          amount: (() => {
            const params = new URLSearchParams(location.search);
            const a = Number(params.get('amount') || '40');
            return Number.isFinite(a) && a > 0 ? a : 40;
          })(),
          description: "Ingresso THE CAOS",
          payerEmail: formData.email.trim(),
          payerFirstName: formData.name.trim()
        });
      } catch (err) {
        throw err;
      }

      const qrBase64 = pix.point_of_interaction?.transaction_data?.qr_code_base64 || null;
      const qrCode = pix.point_of_interaction?.transaction_data?.qr_code || null;
      setPixQrBase64(qrBase64);
      setPixCode(qrCode);
      setPixPaymentId(pix.id);
      setIsAwaitingPix(true);

      // Iniciar polling do status até aprovar
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
      }
      pollingRef.current = window.setInterval(async () => {
        if (!pix.id) return;
        const status = await paymentService.getPaymentStatus(pix.id);
        if (status === 'approved') {
          if (pollingRef.current) window.clearInterval(pollingRef.current);

          // Gerar ID (para DB) e manter token == id
          const newId = (Date.now() % 100000).toString().padStart(5, '0');

          // Salvar ticket como pago (DB se disponível)
          const toSave = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            paid: true,
            token: newId,
            paymentId: pix.id
          } as const;

          let registration;
          try {
            registration = ticketsDb.isEnabled()
              ? await ticketsDb.save({ id: newId, ...toSave, createdAt: new Date().toISOString() } as any)
              : storage.saveTicket({ name: toSave.name, email: toSave.email, paid: toSave.paid, paymentId: toSave.paymentId } as any);
          } catch (e) {
            // Fallback para localStorage se Firestore falhar
            registration = storage.saveTicket({ name: toSave.name, email: toSave.email, paid: toSave.paid, paymentId: toSave.paymentId } as any);
          }

          // Enviar email com token
          try {
            const emailData: EmailData = {
              to_name: registration.name,
              to_email: registration.email,
              ticket_id: registration.id,
              event_name: "THE CAOS",
              event_date: "SÁBADO, 20 DE DEZEMBRO",
              event_time: "16:00 - 05H",
              event_location: "LINHA 52, Mirante da Serra - RO, 76926-000 Chácara ZÉ PASTEL"
            };
            await emailService.sendTicketConfirmation(emailData);
          } catch (_) {
            // segue mesmo sem email
          }

          setPixApproved(true);
          toast.success(
            <div>
              <div className="font-bold">Pagamento aprovado!</div>
              <div className="text-sm">Token enviado por e-mail.</div>
            </div>
          );
          // Pequeno delay para destacar a mudança de borda antes de sair
          window.setTimeout(() => {
            navigate("/");
          }, 1200);
        }
      }, 3000);
    } catch (error: any) {
      toast.error(`Erro ao processar solicitação: ${error?.message || 'tente novamente'}`);
    } finally {
      setIsLoadingPix(false);
    }
  };

  const handlePayWithCard = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Por favor, insira um e-mail válido");
      return;
    }

    try {
      setIsLoadingCard(true);
      const origin = window.location.origin;
      const isHttps = origin.startsWith('https://');

      // Guardar intenção para pós-retorno
      localStorage.setItem('chaos-pending-registration', JSON.stringify({
        name: formData.name.trim(),
        email: formData.email.trim(),
      }));

      if (isHttps) {
        // Produção/HTTPS: usar preferência com back_urls e auto_return
        const returnUrl = `${origin}/payment-return`;
        const pref = await paymentService.createCardPreference({
          itemTitle: "Ingresso THE CAOS",
          itemQuantity: 1,
          itemUnitPrice: (() => {
            const params = new URLSearchParams(location.search);
            const a = Number(params.get('amount') || '40');
            return Number.isFinite(a) && a > 0 ? a : 40;
          })(),
          payerEmail: formData.email.trim(),
          returnUrl
        });
        const redirectUrl = pref.init_point || pref.sandbox_init_point;
        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }
        throw new Error('Preferência criada sem URL de redirecionamento');
      } else {
        // Dev/local: fallback para link fixo
        window.location.href = 'https://mpago.la/1rmTuCz';
        return;
      }
    } catch (err: any) {
      toast.error(`Erro ao iniciar pagamento: ${err?.message || 'tente novamente'}`);
    } finally {
      setIsLoadingCard(false);
    }
  };

  // Limpeza do polling ao desmontar
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
      }
    };
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-chaos-wine">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardTitle className="font-bebas text-3xl sm:text-4xl tracking-wider text-foreground">
              GARANTIR INGRESSO
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm sm:text-base">
              Preencha seus dados para garantir seu ingresso
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (
                    !isLoadingCard &&
                    formData.name.trim() &&
                    formData.email.trim() &&
                    formData.email.includes("@")
                  ) {
                    handlePayWithCard();
                  }
                }
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium text-sm sm:text-base">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                  className="border-chaos-silver focus:border-chaos-wine"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium text-sm sm:text-base">
                  E-mail
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  className="border-chaos-silver focus:border-chaos-wine"
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  onClick={handlePayWithCard}
                  disabled={
                    isLoadingCard ||
                    !formData.name.trim() ||
                    !formData.email.trim() ||
                    !formData.email.includes("@")
                  }
                  className="w-full font-bebas text-base sm:text-lg py-3 bg-chaos-wine hover:bg-chaos-glow text-foreground border-2 border-chaos-wine hover:border-chaos-glow transition-all duration-300 shadow-chaos hover:shadow-silver tracking-wider"
                >
                  {isLoadingCard ? "PROCESSANDO..." : "PAGAR AGORA"}
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

export default TicketForm;
