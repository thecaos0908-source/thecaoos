const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-chaos">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-chaos-wine rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chaos-silver rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="relative z-10 text-center px-4">
        <h1 className="font-display text-6xl sm:text-7xl md:text-9xl lg:text-[12rem] xl:text-[16rem] tracking-wider mb-4 text-foreground drop-shadow-[0_0_30px_rgba(139,0,0,0.8)] animate-in fade-in duration-1000">
          THE CAOS
        </h1>
        <p className="font-bebas text-lg sm:text-xl md:text-2xl lg:text-4xl tracking-widest text-chaos-silver mb-6 sm:mb-8 animate-in fade-in duration-1000 delay-300 px-2">
          ONDE O CAOS SE TORNA REALIDADE
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-in fade-in duration-1000 delay-500 max-w-md mx-auto sm:max-w-none">
          <a 
            href="#lotes"
            onClick={(e) => { e.preventDefault(); document.getElementById('lotes')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="font-bebas text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 bg-chaos-wine hover:bg-chaos-glow text-foreground border-2 border-chaos-wine hover:border-chaos-glow transition-all duration-300 shadow-chaos hover:shadow-silver tracking-wider hover:scale-105 transform"
          >
            GARANTIR INGRESSO
          </a>
          <a 
            href="#info"
            onClick={(e) => { e.preventDefault(); document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="font-bebas text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-foreground border-2 border-chaos-silver hover:bg-chaos-silver hover:text-background transition-all duration-300 tracking-wider hover:scale-105 transform"
          >
            MAIS INFORMAÇÕES
          </a>
        </div>
      </div>

    </section>
  );
};

export default Hero;
