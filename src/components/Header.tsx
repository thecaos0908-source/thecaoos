import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";

const Header = () => {
  const isScrolled = useScroll();

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? 'transform -translate-y-full opacity-0'
          : 'transform translate-y-0 opacity-100'
      }`}
    >
      <div className="backdrop-blur-md bg-black/30 border-b border-chaos-wine/60">
        <div className="w-full px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Título do evento */}
            <Link to="/" className="flex items-center">
              <h1 className="font-bebas text-2xl sm:text-3xl md:text-4xl tracking-wider text-foreground hover:text-chaos-wine transition-colors duration-300">
                THE CAOS
              </h1>
            </Link>

            {/* Botão Login Administrador */}
            <Link to="/admin/login">
              <Button
                variant="outline"
                className="font-bebas text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-chaos-silver/80 hover:border-chaos-wine hover:bg-chaos-wine hover:text-foreground transition-all duration-300 tracking-wider"
              >
                LOGIN
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
