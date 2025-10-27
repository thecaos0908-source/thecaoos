import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  images: string[];
  title?: string;
}

const Carousel = ({ images, title }: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const isGoogleMapsUrl = (url: string): boolean => {
    const lower = url.toLowerCase();
    return (
      lower.includes('google.com/maps') ||
      lower.includes('maps.app.goo.gl') ||
      lower.includes('goo.gl/maps')
    );
  };

  const toStreetViewEmbed = (url: string): string => {
    try {
      // Try to extract lat/lng and view params from the /@lat,lng,3a,... pattern
      const atPattern = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?),3a[^,]*,(?:[^,]*,)?(?:(\d+(?:\.\d+)?)h)?(?:,(\d+(?:\.\d+)?)t)?/i;
      const atMatch = url.match(atPattern);

      let lat: string | null = null;
      let lng: string | null = null;
      let heading: string | null = null; // degrees
      let pitch: string | null = null;   // degrees

      if (atMatch) {
        lat = atMatch[1];
        lng = atMatch[2];
        heading = atMatch[3] || null;
        pitch = atMatch[4] || null;
      }

      // Fallback: look for explicit query params if needed
      if ((!lat || !lng) && url.includes('?')) {
        const q = new URL(url);
        const ll = q.searchParams.get('cbll');
        if (ll && ll.includes(',')) {
          const [la, ln] = ll.split(',');
          lat = la;
          lng = ln;
        }
      }

      // If we don't have coords, return the original (may still render if allowed)
      if (!lat || !lng) return url;

      const headingNum = heading ? Number(heading) : 0;
      const pitchNum = pitch ? Number(pitch) : 0;

      // Use legacy Street View embed endpoint that doesn't require API key
      // cbp format: 11,heading,0,pitch,0
      const cbp = `11,${isFinite(headingNum) ? headingNum : 0},0,${isFinite(pitchNum) ? pitchNum : 0},0`;
      return `https://www.google.com/maps?layer=c&cbll=${lat},${lng}&cbp=${cbp}&output=svembed`;
    } catch {
      return url;
    }
  };

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  if (images.length === 0) {
    return (
      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground font-bebas">Nenhuma imagem disponível</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-bebas text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-wider mb-4 text-center text-foreground leading-tight">
            {title}
          </h2>
        </div>
      )}
      
      <div className="relative">
        <div className="overflow-hidden rounded-xl border border-white/10 backdrop-blur" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0">
                <div className="relative w-full h-64 sm:h-80 md:h-96">
                  {isGoogleMapsUrl(image) ? (
                    <>
                      <iframe
                        src={toStreetViewEmbed(image)}
                        title={`Mapa ${index + 1}`}
                        className="w-full h-full"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      <a
                        href={image}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute bottom-3 right-3 z-10 text-xs sm:text-sm bg-black/60 text-white px-2 py-1 rounded hover:bg-black/80 transition-colors"
                      >
                        Abrir no Google Maps
                      </a>
                    </>
                  ) : (
                    <img
                      src={image}
                      alt={`Imagem ${index + 1} do local`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {!isGoogleMapsUrl(image) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de navegação */}
        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 backdrop-blur"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 backdrop-blur"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicadores */}
        {scrollSnaps.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex 
                    ? 'bg-chaos-wine w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Carousel;
