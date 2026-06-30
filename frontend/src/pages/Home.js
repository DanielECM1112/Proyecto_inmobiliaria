import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import video5 from "../assets/video5.mp4";
import { getUserPlanStatus } from "../admin/adminService";
import api from "../services/api";

const videos = [video1, video2, video5];

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [user, setUser] = useState(null);
  const [planStatus, setPlanStatus] = useState(null);
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }

    // Listen for user updated event
    const handleUserUpdated = (event) => {
      if (event.detail) {
        setUser(event.detail);
        localStorage.setItem('user', JSON.stringify(event.detail));
      }
    };
    window.addEventListener('userUpdated', handleUserUpdated);

    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 8000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('userUpdated', handleUserUpdated);
    };
  }, []);

  const handlePublishClick = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login?redirect=/planes');
      return;
    }
    
    try {
      const status = await getUserPlanStatus();
      setPlanStatus(status);
      
      if (status.propiedades_disponibles <= 0 && !status.es_admin) {
        setShowLimitMessage(true);
        return;
      }
      
      // Si tiene plan activo, usar ese
      if (status.plan_id) {
        // Obtenemos los detalles del plan
        const planesResponse = await api.get('/admin/plans/');
        const plan = planesResponse.data.find(p => p.id === status.plan_id);
        if (plan) {
          navigate(`/publish?planId=${plan.id}&planNombre=${encodeURIComponent(plan.name)}&maxFotos=${plan.max_photos}`);
        } else {
          navigate('/planes');
        }
      } else {
        // Si no tiene plan, ir a la página de planes
        navigate('/planes');
      }
    } catch (error) {
      console.error('Error al verificar estado del plan:', error);
      navigate('/login?redirect=/planes');
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen transition-colors duration-500 font-sans"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <Navbar />

      {/* ── HERO: el video es el protagonista ── */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        {/* Video slider (intacto, sin marcadores) */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.video
              key={currentVideo}
              src={videos[currentVideo]}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </AnimatePresence>

          {/* Oscurecido cinematográfico mínimo — igual en ambos temas */}
          <div className="absolute inset-0 z-[1] bg-black/25" />
          <div
            className="absolute inset-x-0 top-0 z-[1] h-40"
            style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 z-[1] h-40"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }}
          />
        </div>

        {/* Contenido editorial — centrado */}
        <div className="relative z-10 h-full w-full flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.3 }}
            className="max-w-4xl text-center"
          >
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="text-[11px] font-bold uppercase mb-7"
              style={{ color: "#D4B05E", letterSpacing: "7px" }}
            >
              Inmobiliaria de lujo · Ibagué, Colombia
            </motion.p>

            {/* Titular serif */}
            <h1
              className="font-serif text-white leading-[1.06] mb-8"
              style={{
                fontSize: "clamp(2.9rem, 7.2vw, 5.8rem)",
                fontWeight: 500,
                textShadow: "0 2px 36px rgba(0,0,0,0.5)",
                letterSpacing: "-0.01em",
              }}
            >
              Redefiniendo el{" "}
              <em className="italic font-normal" style={{ color: "#D4B05E" }}>
                lujo
              </em>{" "}
              inmobiliario
            </h1>

            {/* Regla dorada centrada */}
            <div className="h-px w-16 mb-8 mx-auto" style={{ background: "#C9A84C" }} />

            {/* Subtítulo sobrio */}
            <p
              className="text-base md:text-lg font-light max-w-xl mx-auto mb-12 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              Exclusividad, distinción e inversión en las propiedades
              más selectas de la ciudad.
            </p>

            {/* CTAs editoriales */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/properties")}
                className="px-10 py-4 text-[12px] font-bold uppercase transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "#C9A84C", color: "#0D0D0D", letterSpacing: "3px" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#D4A853")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#C9A84C")}
              >
                Explorar propiedades
              </button>
              <button
                onClick={handlePublishClick}
                className="px-10 py-4 text-[12px] font-bold uppercase transition-all duration-300"
                style={{
                  background: "transparent",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.7)",
                  letterSpacing: "3px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.color = "#0D0D0D";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
              >
                Publicar ahora
              </button>
            </div>

            {/* Mensaje de límite */}
            <AnimatePresence>
              {showLimitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 max-w-2xl mx-auto p-6 rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4">
                    <FaExclamationTriangle size={32} style={{ color: "#f87171", flexShrink: 0 }} />
                    <div className="flex-1">
                      <h4 className="text-lg font-serif font-bold mb-2" style={{ color: "#f87171" }}>
                        ¡Has alcanzado el límite de propiedades!
                      </h4>
                      <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.8)" }}>
                        Ya has usado todas las propiedades disponibles de tu plan. Para seguir publicando, actualiza tu plan a uno con más capacidad.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate("/planes")}
                          className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-[2px] rounded-full transition-all hover:opacity-90"
                          style={{ background: "#C9A84C", color: "#0D0D0D" }}
                        >
                          Ver Planes
                        </button>
                        <button
                          onClick={() => setShowLimitMessage(false)}
                          className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-[2px] rounded-full transition-all hover:opacity-90"
                          style={{ background: "transparent", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.3)" }}
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Filo dorado de cierre */}
        <div
          className="absolute bottom-0 inset-x-0 z-[2] h-px"
          style={{ background: "rgba(201,168,76,0.35)" }}
        />
      </section>

      <Footer />
    </div>
  );
}
