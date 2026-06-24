import { useEffect, useRef } from 'react';
import '../styles/lux-cursor.css';

// No renderizar en dispositivos táctiles
const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches;

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const mousePos  = useRef({ x: 0, y: 0 });
  const ringPos   = useRef({ x: 0, y: 0 });
  const rafRef    = useRef(null);

  useEffect(() => {
    if (isTouchDevice()) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // — Seguimiento del mouse
    const onMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };

    // — El anillo sigue con lerp (efecto de inercia)
    const animateRing = () => {
      const lerp = 0.11;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp;
      ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      rafRef.current = requestAnimationFrame(animateRing);
    };

    // — Hover en elementos interactivos
    const INTERACTIVE = 'a, button, [role="button"], label, select, .cursor-pointer, [onclick]';

    const onEnterInteractive = () => {
      dot.classList.add('is-hovering');
      ring.classList.add('is-hovering');
    };
    const onLeaveInteractive = () => {
      dot.classList.remove('is-hovering');
      ring.classList.remove('is-hovering');
    };

    const bindHoverListeners = () => {
      document.querySelectorAll(INTERACTIVE).forEach((el) => {
        el.removeEventListener('mouseenter', onEnterInteractive);
        el.removeEventListener('mouseleave', onLeaveInteractive);
        el.addEventListener('mouseenter', onEnterInteractive);
        el.addEventListener('mouseleave', onLeaveInteractive);
      });
    };

    // — Click
    const onDown = () => dot.classList.add('is-clicking');
    const onUp   = () => dot.classList.remove('is-clicking');

    // — Ocultar al salir de la ventana
    const onLeaveWindow = () => {
      dot.classList.add('is-hidden');
      ring.classList.add('is-hidden');
    };
    const onEnterWindow = () => {
      dot.classList.remove('is-hidden');
      ring.classList.remove('is-hidden');
    };

    // — Observar cambios del DOM (para nuevas páginas/componentes)
    const observer = new MutationObserver(bindHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('mousemove',   onMove);
    window.addEventListener('mousedown',   onDown);
    window.addEventListener('mouseup',     onUp);
    document.addEventListener('mouseleave', onLeaveWindow);
    document.addEventListener('mouseenter', onEnterWindow);

    bindHoverListeners();
    rafRef.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove',   onMove);
      window.removeEventListener('mousedown',   onDown);
      window.removeEventListener('mouseup',     onUp);
      document.removeEventListener('mouseleave', onLeaveWindow);
      document.removeEventListener('mouseenter', onEnterWindow);
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (isTouchDevice()) return null;

  return (
    <>
      <div ref={dotRef}  className="lux-cursor__dot"  aria-hidden="true" />
      <div ref={ringRef} className="lux-cursor__ring" aria-hidden="true" />
    </>
  );
}
