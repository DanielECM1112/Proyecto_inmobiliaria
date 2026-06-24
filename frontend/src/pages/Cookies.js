import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';
import { useTheme } from '../context/ThemeContext';

const SECCIONES = [
  {
    titulo: '¿Qué usamos y por qué?',
    texto: `LuxHabitat no utiliza cookies publicitarias ni de seguimiento de terceros. Para funcionar, la plataforma usa el almacenamiento local de tu navegador (localStorage), una tecnología similar a las cookies que guarda pequeños datos únicamente en tu dispositivo.`,
  },
  {
    titulo: 'Datos que guardamos en tu navegador',
    texto: `Token de sesión: una credencial cifrada (JWT) que mantiene tu sesión iniciada sin pedirte la contraseña en cada página. Datos básicos de tu cuenta: nombre, correo y foto, para mostrarlos en el menú y tu perfil sin consultas innecesarias. Preferencia de tema: si elegiste modo claro u oscuro, lo recordamos. Plan seleccionado: si eliges un plan antes de iniciar sesión, lo guardamos un momento para retomar el proceso justo donde ibas.`,
  },
  {
    titulo: 'Lo que NUNCA guardamos en tu navegador',
    texto: `Tu contraseña no se almacena en el navegador en ningún caso: solo viaja cifrada al momento de iniciar sesión. Tampoco guardamos información financiera ni datos de otros usuarios.`,
  },
  {
    titulo: 'Cookies de terceros',
    texto: `Las imágenes de la plataforma se sirven desde Cloudinary y algunos botones enlazan a servicios externos como WhatsApp; esos servicios pueden aplicar sus propias políticas al visitarlos. LuxHabitat no instala rastreadores de terceros ni comparte tu actividad con anunciantes.`,
  },
  {
    titulo: 'Cómo borrar estos datos',
    texto: `Al cerrar sesión, el token y tus datos de cuenta se eliminan del navegador automáticamente. También puedes borrarlos manualmente desde la configuración de tu navegador ("Borrar datos de navegación → Datos de sitios"). Ten en cuenta que al hacerlo deberás iniciar sesión de nuevo y se restablecerá tu preferencia de tema.`,
  },
];

export default function Cookies() {
  const { isDarkMode } = useTheme();
  const txt    = isDarkMode ? '#F0F0ED' : '#161616';
  const sub    = isDarkMode ? '#A3A39B' : '#55554F';
  const cardBd = isDarkMode ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.10)';

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-500"
        style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />

        <header className="relative pt-44 pb-20 px-6 overflow-hidden" style={{ background: '#0D0D0D' }}>
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)', backgroundSize: '26px 26px' }} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="relative max-w-3xl mx-auto text-center">
            <p className="text-[10px] font-bold uppercase mb-5" style={{ color: '#C9A84C', letterSpacing: '6px' }}>
              Legal
            </p>
            <h1 className="font-serif text-white mb-6" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', fontWeight: 500 }}>
              Política de <em className="italic" style={{ color: '#D4B05E' }}>Cookies</em>
            </h1>
            <div className="h-px w-16 mx-auto mb-6" style={{ background: '#C9A84C' }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Última actualización: junio de 2026
            </p>
          </motion.div>
        </header>

        <main className="flex-1 px-6 py-20">
          <div className="max-w-3xl mx-auto">
            {SECCIONES.map((s, i) => (
              <motion.section
                key={s.titulo}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5 }}
                className="py-10"
                style={{ borderBottom: i < SECCIONES.length - 1 ? `1px solid ${cardBd}` : 'none' }}
              >
                <div className="flex items-baseline gap-5 mb-4">
                  <span className="font-serif text-sm flex-shrink-0" style={{ color: '#C9A84C' }}>
                    0{i + 1}
                  </span>
                  <h2 className="font-serif text-2xl" style={{ color: txt }}>{s.titulo}</h2>
                </div>
                <p className="text-[15px] leading-relaxed pl-9" style={{ color: sub }}>
                  {s.texto}
                </p>
              </motion.section>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
}
