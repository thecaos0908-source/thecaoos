import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { storage } from "@/lib/storage";
import { ticketsDb } from "@/lib/db";
import { emailService, EmailData } from "@/lib/emailService";
import { paymentService } from "@/lib/payment";

const useQuery = () => new URLSearchParams(useLocation().search);

const PaymentReturn = () => {
	const navigate = useNavigate();
	const query = useQuery();
	const [finalized, setFinalized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);

	const status = useMemo(() => {
    const qs = query.get('status') || query.get('collection_status');
    return paymentService.mapQueryStatusToPaymentStatus(qs);
  }, [query]);
	const paymentId = query.get('payment_id') || query.get('collection_id') || undefined;

	useEffect(() => {
		const finalize = async () => {
      setChecking(true);
      const raw = localStorage.getItem('chaos-pending-registration');
      const pending = raw ? JSON.parse(raw) as { name: string; email: string } : undefined;

      let approved = status === 'approved';

      // Se veio com payment_id/collection_id, confirma via API
      if (!approved && paymentId) {
        const st = await paymentService.getPaymentStatus(paymentId);
        approved = st === 'approved';
      }

      // Se não temos status nem id, tenta buscar por email e valor (R$40) nas últimas 24h
      if (!approved && pending?.email) {
        try {
          const now = new Date();
          const from = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
          const to = now.toISOString();
          const resp = await paymentService.searchPayments({
            sort: 'date_created',
            criteria: 'desc',
            range: 'date_created',
            begin_date: from,
            end_date: to,
            payer_email: pending.email,
            status: 'approved',
          });
          const results: any[] = resp?.results || [];
          // Checa valor aproximado de 40 (em BRL)
          const match = results.find(r => Math.round(r?.transaction_amount) === 40);
          approved = Boolean(match);
        } catch (_) {
          // ignora erro de busca
        }
      }

      if (!approved) {
        toast.error('Pagamento não aprovado.');
        // descartar dados pendentes se existir
        localStorage.removeItem('chaos-pending-registration');
        setChecking(false);
        // Redireciona automaticamente em 3s para a página inicial
        setCountdown(3);
        const interval = window.setInterval(() => {
          setCountdown((prev) => {
            const next = (prev ?? 1) - 1;
            return next >= 0 ? next : 0;
          });
        }, 1000);
        window.setTimeout(() => {
          window.clearInterval(interval);
          navigate('/');
        }, 3000);
        return;
      }

      if (!pending) {
        toast.error('Nenhuma intenção de compra encontrada.');
        setChecking(false);
        return;
      }

      // Gerar ID e salvar no banco (Firestore se disponível) ou localStorage
      const newId = (Date.now() % 100000).toString().padStart(5, '0');
      const toSave = {
        name: pending.name,
        email: pending.email,
        paid: true,
        token: newId,
        paymentId: paymentId || 'link-fixo',
      } as const;

      let registration: { id: string; name: string; email: string };
      try {
        registration = ticketsDb.isEnabled()
          ? await ticketsDb.save({ id: newId, ...toSave, createdAt: new Date().toISOString() } as any)
          : storage.saveTicket({ name: toSave.name, email: toSave.email, paid: toSave.paid, paymentId: toSave.paymentId } as any);
      } catch (_) {
        // Fallback local em caso de erro no Firestore
        registration = storage.saveTicket({ name: toSave.name, email: toSave.email, paid: toSave.paid, paymentId: toSave.paymentId } as any);
      }

      localStorage.removeItem('chaos-pending-registration');

      try {
        emailService.init();
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
        // segue mesmo sem email
      }

      setFinalized(true);
      setChecking(false);
      toast.success('Pagamento aprovado! Ingresso enviado por email.');
      // Redireciona automaticamente após breve intervalo
      window.setTimeout(() => navigate('/'), 1500);
		};

		finalize();
	}, [status, paymentId]);

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<Card className="border-chaos-wine">
					<CardHeader className="text-center px-4 sm:px-6">
						<CardTitle className="font-bebas text-3xl sm:text-4xl tracking-wider text-foreground">
							STATUS DO PAGAMENTO
						</CardTitle>
					<CardDescription className="text-muted-foreground text-sm sm:text-base">
            {checking ? 'Verificando pagamento...' : (finalized ? 'Pagamento aprovado. Finalizado.' : 'Pagamento não aprovado.')}
					</CardDescription>
					</CardHeader>
					<CardContent className="px-4 sm:px-6">
            {checking ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-6 w-6 border-2 border-chaos-wine border-t-transparent rounded-full animate-spin" />
              </div>
            ) : finalized ? (
              <p className="text-center text-sm sm:text-base text-muted-foreground">Pagamento aprovado! Redirecionando...</p>
            ) : (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="h-10 w-10 rounded-full border-2 border-destructive flex items-center justify-center animate-pulse">
                  <span className="text-destructive font-bold">!</span>
                </div>
                <p className="text-center text-sm sm:text-base text-muted-foreground">
                  Pagamento não aprovado. Redirecionando em {countdown ?? 3}...
                </p>
              </div>
            )}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default PaymentReturn;


