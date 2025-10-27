import { Calendar, MapPin, Clock, Music } from "lucide-react";

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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 max-w-7xl mx-auto">
          {info.map((item, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur border border-white/10 p-4 sm:p-5 md:p-6 text-center hover:border-chaos-wine/70 transition-all duration-300 hover:shadow-chaos group transform hover:-translate-y-1 sm:hover:-translate-y-2 rounded-xl"
            >
              <item.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-chaos-silver group-hover:text-chaos-wine transition-colors" />
              <h3 className="font-bebas text-lg sm:text-xl tracking-wider mb-1.5 text-foreground">
                {item.title}
              </h3>
              <p className="text-muted-foreground font-bebas text-base sm:text-lg tracking-wide">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto bg-white/5 backdrop-blur border border-chaos-wine/70 p-6 sm:p-8 shadow-chaos rounded-xl">
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
      </div>
    </section>
  );
};

export default EventInfo;
