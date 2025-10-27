import { Calendar, MapPin, Clock, Music } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const InfoCardReveal = ({ item, index }: { item: any; index: number }) => {
  const { ref, isVisible } = useScrollReveal(0.1);
  
  return (
    <div
      ref={ref}
      className={`relative z-0 transition-[transform,opacity,border-color,box-shadow,background-color] duration-700 md:opacity-100 md:translate-y-0 md:scale-100 ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      } h-[180px] flex flex-col justify-center bg-white/5 backdrop-blur border border-white/10 p-4 sm:p-5 md:p-6 text-center hover:border-chaos-wine hover:shadow-chaos hover:z-10 group transform hover:-translate-y-1 sm:hover:-translate-y-2 rounded-xl overflow-hidden`}
      style={{ 
        transitionDelay: `${index * 100}ms`
      }}
    >
      <item.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-chaos-silver group-hover:text-chaos-wine transition-colors" />
      <h3 className="font-bebas text-lg sm:text-xl tracking-wider mb-1.5 text-foreground">
        {item.title}
      </h3>
      <p className="text-muted-foreground font-bebas text-base sm:text-lg tracking-wide">
        {item.detail}
      </p>
    </div>
  );
};

const AboutEventReveal = () => {
  const { ref, isVisible } = useScrollReveal(0.1);
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 md:opacity-100 md:translate-y-0 md:scale-100 ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      } mt-12 sm:mt-16 max-w-4xl mx-auto bg-white/5 backdrop-blur border border-chaos-wine/70 p-6 sm:p-8 shadow-chaos rounded-xl`}
    >
      <h3 className="font-bebas text-2xl sm:text-3xl tracking-wider mb-4 text-foreground text-center">
        SOBRE O EVENTO
      </h3>
      <p className="text-muted-foreground text-center leading-relaxed mb-6 text-sm sm:text-base">
        THE CAOS é mais do que uma festa - é um evento especial onde o imprevisível reina e cada momento vira uma explosão de liberdade. Prepare-se para uma noite intensa, onde o caos se transforma em arte.
      </p>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
        <span className="font-bebas text-xs sm:text-sm tracking-wider px-3 sm:px-4 py-2 bg-chaos-wine/20 border border-chaos-wine/70 text-foreground rounded-md">
          +18 ANOS
        </span>
      </div>
    </div>
  );
};

const EventInfo = () => {
  const info = [
    {
      icon: Calendar,
      title: "DATA",
      detail: "SÁBADO, 20 DE DEZEMBRO"
    },
    {
      icon: Clock,
      title: "HORÁRIO",
      detail: "16:00 - 05H"
    },
    {
      icon: MapPin,
      title: "LOCAL",
      detail: "LINHA 52, Mirante da Serra - RO, 76926-000 Chácara ZÉ PASTEL"
    },
    {
      icon: Music,
      title: "ATRAÇÕES",
      detail: "DJ ANDERSON AO VIVO"
    }
  ];

  return (
    <section id="info" className="pt-12 pb-8 sm:pt-16 sm:pb-10 lg:pt-20 lg:pb-12 px-4 bg-gradient-silver scroll-mt-24">
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-bebas text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-wider mb-4 text-center text-foreground leading-[1.05]">
            INFORMAÇÕES
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-14 max-w-7xl mx-auto">
          {info.map((item, index) => (
            <InfoCardReveal key={index} item={item} index={index} />
          ))}
        </div>

        <AboutEventReveal />
      </div>
    </section>
  );
};

export default EventInfo;
