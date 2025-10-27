import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface TicketCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonClassName?: string;
  amount?: number;
  status?: 'disponível' | 'em breve' | 'esgotado';
  buttonLabel?: string;
  disabled?: boolean;
  externalLink?: string;
}

const TicketCard = ({ title, price, description, features, highlighted = false, buttonClassName, amount, status, buttonLabel, disabled, externalLink }: TicketCardProps) => {
  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
      highlighted ? 'border-chaos-wine/70 shadow-chaos' : 'border-white/10 hover:border-chaos-silver/70'
    } bg-white/5 backdrop-blur rounded-2xl`}
    >
      {highlighted && (
        <div className="absolute top-0 right-0 bg-chaos-wine text-foreground font-bebas text-sm px-4 py-1 tracking-wider">
          DESTAQUE
        </div>
      )}
      {status && (
        <div className={`absolute top-0 left-0 font-bebas text-xs px-3 py-1 tracking-wider border-b border-r rounded-br-md backdrop-blur ${
          status === 'disponível' ? 'bg-chaos-wine/20 text-chaos-wine border-chaos-wine' : status === 'em breve' ? 'bg-chaos-wine/20 text-chaos-wine border-chaos-wine' : 'bg-muted text-muted-foreground border-border'
        }`}>
          {status.toUpperCase()}
        </div>
      )}
      <CardHeader>
        <CardTitle className="font-bebas text-3xl tracking-wider text-foreground">{title}</CardTitle>
        <CardDescription className="font-bebas text-4xl bg-clip-text text-transparent bg-gradient-to-r from-chaos-silver to-chaos-wine tracking-wider">{price}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-chaos-wine mt-1">▸</span>
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {disabled ? (
          <Button 
          className={`w-full font-bebas text-xl tracking-wider ${
            highlighted 
              ? 'bg-chaos-wine hover:bg-chaos-glow border-2 border-chaos-wine text-foreground' 
              : (buttonClassName || 'bg-transparent border-2 border-chaos-silver/70 hover:border-chaos-wine/70 hover:bg-chaos-wine/20')
          }`}
          disabled
        >
          {buttonLabel || 'INDISPONÍVEL'}
        </Button>
        ) : (
          <a href={`/ticket-form?amount=${amount ?? ''}`} className="w-full">
            <Button 
              className={`w-full font-bebas text-xl tracking-wider ${
                highlighted 
                  ? 'bg-chaos-wine hover:bg-chaos-glow border-2 border-chaos-wine text-foreground' 
                  : (buttonClassName || 'bg-transparent border-2 border-chaos-silver/70 hover:border-chaos-wine/70 hover:bg-chaos-wine/20')
              }`}
            >
              {buttonLabel || 'COMPRAR AGORA'}
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default TicketCard;
