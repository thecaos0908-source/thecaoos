import { Instagram, Mail } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const Footer = () => {
  const { ref, isVisible } = useScrollReveal(0.1);
  
  return (
    <footer className="relative py-10 sm:py-14 px-4">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
      <div className="container mx-auto">
        <div 
          ref={ref}
          className={`transition-all duration-700 md:opacity-100 md:translate-y-0 md:scale-100 ${
            isVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-8 scale-95'
          } flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8`}
        >
          <div className="text-center md:text-left">
            <h3 className="font-bebas text-3xl sm:text-4xl tracking-wider text-foreground mb-2">
              THE CAOS
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base animate-blink-color">
              Onde o caos se torna realidade
            </p>
          </div>

          <div className="flex gap-4 sm:gap-6">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 bg-card/50 backdrop-blur border border-white/10 hover:border-chaos-wine/70 hover:bg-chaos-wine/80 transition-all duration-300 flex items-center justify-center group rounded-lg"
            >
              <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-chaos-silver group-hover:text-foreground" />
            </a>
            <a 
              href="mailto:thecaos0908@gmail.com" 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-card/50 backdrop-blur border border-white/10 hover:border-chaos-wine/70 hover:bg-chaos-wine/80 transition-all duration-300 flex items-center justify-center group rounded-lg"
            >
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-chaos-silver group-hover:text-foreground" />
            </a>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10 text-center text-muted-foreground text-xs sm:text-sm">
          <p>© 2025 THE CAOS. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
