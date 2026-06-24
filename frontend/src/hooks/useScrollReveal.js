import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Llama este hook dentro de cualquier página o en PageWrapper
// para activar las animaciones data-reveal automáticamente
export default function useScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    // Pequeño delay para que React termine de renderizar el DOM
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('[data-reveal]:not(.is-revealed)');
      if (!elements.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target); // no se vuelve a ocultar
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }, 120);

    return () => clearTimeout(timer);
  }, [location.pathname]); // se re-ejecuta al cambiar de página
}
