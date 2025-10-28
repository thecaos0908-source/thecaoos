import TicketCard from "./TicketCard";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const TicketCardReveal = ({ ticket, index }: { ticket: any; index: number }) => {
  const { ref, isVisible } = useScrollReveal(0.1);
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 md:opacity-100 md:translate-y-0 md:scale-100 ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      }`}
      style={{ 
        transitionDelay: `${index * 150}ms`
      }}
    >
      <TicketCard {...ticket} />
    </div>
  );
};

const Tickets = () => {
  const now = new Date();

  // Helper para criar datas no fuso local
  const d = (iso: string) => new Date(iso);

  // Lotes por intervalo de datas
  const lots = [
    {
      title: "LOTE 1",
      start: d('2025-11-10T00:00:00'),
      end: d('2025-11-20T23:59:59'),
      priceNum: 40,
      externalLink: 'https://mpago.la/29mFwjc',
    },
    {
      title: "LOTE 2",
      start: d('2025-11-20T00:00:00'),
      end: d('2025-11-30T23:59:59'),
      priceNum: 60,
      externalLink: 'https://mpago.la/33wXPuR',
    },
    {
      title: "LOTE 3",
      start: d('2025-11-30T00:00:00'),
      end: d('2025-12-19T23:59:59'),
      priceNum: 80,
      externalLink: 'https://mpago.la/1TzZdgV',
    },
  ] as const;

  const testingAllAvailable = false; // desabilitado - usando datas reais

  const getStatus = (start: Date, end: Date): { status: 'esgotado' | 'em breve' | 'disponível'; disabled: boolean; label: string } => {
    if (testingAllAvailable) return { status: 'disponível', disabled: false, label: 'COMPRAR AGORA' };
    // Regra: todos começam "esgotado" por padrão.
    // Se ainda não chegou a data de início -> "em breve".
    // Se agora está dentro do intervalo -> "disponível".
    if (now < start) return { status: 'em breve', disabled: true, label: 'EM BREVE' };
    if (now >= start && now <= end) return { status: 'disponível', disabled: false, label: 'COMPRAR AGORA' };
    return { status: 'esgotado', disabled: true, label: 'ESGOTADO' };
  };

  const tickets = lots.map((lot, idx) => {
    const { status, disabled, label } = getStatus(lot.start, lot.end);
    const highlighted = status === 'disponível';
    return {
      title: lot.title,
      price: `R$ ${lot.priceNum}`,
      description: `${lot.start.toLocaleDateString('pt-BR')} — ${lot.end.toLocaleDateString('pt-BR')}`,
      features: [
        "Entrada garantida",
        "Acesso à área comum",
      ],
      highlighted,
      amount: lot.priceNum,
      status,
      buttonLabel: label,
      disabled,
      buttonClassName: highlighted ? undefined : 'bg-chaos-wine/80 hover:bg-chaos-glow/90 border-2 border-chaos-wine/80 text-foreground',
      externalLink: lot.externalLink,
    };
  });

  return (
    <section id="lotes" className="py-12 sm:py-14 px-4 bg-background scroll-mt-24">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-bebas text-6xl md:text-8xl tracking-wider mb-4 text-foreground">
            LOTES
          </h2>
          
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tickets.map((ticket, index) => (
            <TicketCardReveal key={index} ticket={ticket} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tickets;
