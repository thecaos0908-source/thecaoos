import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Carousel from "@/components/Carousel";
import EventInfo from "@/components/EventInfo";
import Footer from "@/components/Footer";
import Tickets from "@/components/Tickets";

const Index = () => {
  // Substituído por visualização do Google Maps
  const carouselImages = [
    "https://www.google.com/maps/@-10.942688,-62.6846557,3a,83.7y,323.59h,87.75t/data=!3m8!1e1!3m6!1sCIHM0ogKEICAgIDq85ytOA!2e10!3e11!6shttps:%2F%2Flh3.googleusercontent.com%2Fgpms-cs-s%2FAB8u6HYqBExSf1cDjFQlWccwAwiixY73Q-nuwSfEeQSg8Jh-vdXfKIvEFfTrUdDKPwctz6NTWuAKc92efujF2TYfHCLXyUEjWHBpNrIy0dNLEE_p_ge_c8sRfpjKW9BO9SiV4n_xoCIS%3Dw900-h600-k-no-pi2.249922826664047-ya31.586239506787763-ro0-fo100!7i8704!8i4352?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Evitar pular para #info após refresh por hash na URL */}
      {useEffect(() => {
        if (window.location.hash === '#info') {
          window.history.replaceState(null, '', window.location.pathname);
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
      }, [])}
      <Header />
      <Hero />
      <Tickets />
      
      {/* Carrossel do Local */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-silver">
        <div className="container mx-auto max-w-6xl">
          <Carousel 
            images={carouselImages} 
            title="LOCAL" 
          />
        </div>
      </section>
      
      <EventInfo />
      <Footer />
    </div>
  );
};

export default Index;
