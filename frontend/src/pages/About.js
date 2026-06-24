import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';
import { useTheme } from '../context/ThemeContext';

/* ─────────────────────────────────────────────────────────────
   FOTOS DEL EQUIPO (estáticas — solo el equipo puede cambiarlas)
   Coloca los archivos en:  frontend/public/team/
     manuel.jpg · daniel.jpg · jonathan.jpg · erik.jpg
   ───────────────────────────────────────────────────────────── */
const TEAM = [
  { nombre: 'Manuel Penagos',  rol: 'Cofundador · Full Stack',        foto: '/team/manuel.jpg'   },
  { nombre: 'Daniel Cardozo',  rol: 'Cofundador · Backend',           foto: '/team/daniel.jpg'   },
  { nombre: 'Jonathan Alban',  rol: 'Cofundador · Frontend',          foto: '/team/jonathan.jpg' },
  { nombre: 'Erik Bello',      rol: 'Cofundador · Diseño & Marca',    foto: '/team/erik.jpg'     },
];

const STATS = [
  { valor: '2026', label: 'Fundación en Ibagué' },
  { valor: '+15',  label: 'Barrios cubiertos' },
  { valor: '24/7', label: 'Acompañamiento' },
  { valor: '100%', label: 'Plataforma digital' },
];

const VALORES = [
  { n: '01', titulo: 'Integridad',  texto: 'Información veraz y verificada en cada publicación. Sin sorpresas, sin letra pequeña.' },
  { n: '02', titulo: 'Excelencia',  texto: 'Obsesión por el detalle: de la fotografía de cada inmueble a cada línea de código.' },
  { n: '03', titulo: 'Cercanía',    texto: 'Contacto directo entre propietarios e interesados. La tecnología acerca, no estorba.' },
];

const IMG = {
  hero:     'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1800&q=80',
  historia1:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80',
  historia2:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80',
  cita:     'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1800&q=80',
};

function MemberCard({ m, txt, cardBd, index }) {
  const [imgError, setImgError] = useState(false);
  const iniciales = m.nombre.split(' ').map(n => n[0]).join('');
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      className="group text-center"
    >
      <div className="relative mx-auto mb-6 overflow-hidden"
        style={{ width: '100%', maxWidth: '250px', aspectRatio: '3/4', border: `1px solid ${cardBd}` }}>
        {!imgError ? (
          <img src={m.foto} alt={m.nombre} onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-[1.04]" />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-serif text-5xl"
            style={{ background: 'rgba(201,168,76,0.07)', color: '#C9A84C' }}>
            {iniciales}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.75), transparent)' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-full transition-all duration-500"
          style={{ background: '#C9A84C' }} />
      </div>
      <h3 className="font-serif text-xl mb-1.5" style={{ color: txt }}>{m.nombre}</h3>
      <p className="text-[10px] font-bold uppercase" style={{ color: '#C9A84C', letterSpacing: '3px' }}>{m.rol}</p>
    </motion.div>
  );
}

export default function About() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const txt    = isDarkMode ? '#F0F0ED' : '#161616';
  const sub    = isDarkMode ? '#A0A098' : '#5A5A54';
  const cardBd = isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)';
  const card   = isDarkMode ? '#141414' : '#FFFFFF';

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-500"
        style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />

        {/* ══ HERO con imagen ══ */}
        <header className="relative h-[68vh] min-h-[520px] flex items-center justify-center overflow-hidden">
          <img src={IMG.hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.55), rgba(10,10,10,0.65))' }} />
          <motion.div
            initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="relative z-10 max-w-3xl mx-auto text-center px-6"
          >
            <p className="text-[10px] font-bold uppercase mb-6" style={{ color: '#D4B05E', letterSpacing: '7px' }}>
              Nuestra historia · Ibagué, Tolima
            </p>
            <h1 className="font-serif text-white mb-7" style={{ fontSize: 'clamp(2.8rem, 6.4vw, 4.8rem)', fontWeight: 500, lineHeight: 1.08 }}>
              El equipo detrás de{' '}
              <em className="italic" style={{ color: '#D4B05E' }}>LuxHabitat</em>
            </h1>
            <div className="h-px w-16 mx-auto mb-7" style={{ background: '#C9A84C' }} />
            <p className="text-base md:text-lg font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Nacimos con una convicción: encontrar o vender un hogar en Ibagué
              merecía una experiencia a la altura de las propiedades que ofrecemos.
            </p>
          </motion.div>
          <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: 'rgba(201,168,76,0.4)' }} />
        </header>

        {/* ══ STATS ══ */}
        <section className="px-6 -mt-14 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4"
            style={{ background: card, border: `1px solid ${cardBd}`, borderTop: '1px solid rgba(201,168,76,0.45)', boxShadow: '0 18px 50px rgba(0,0,0,0.18)' }}
          >
            {STATS.map((s, i) => (
              <div key={s.label} className="py-9 px-4 text-center"
                style={{ borderLeft: i > 0 ? `1px solid ${cardBd}` : 'none' }}>
                <p className="font-serif text-3xl md:text-4xl mb-2" style={{ color: '#C9A84C' }}>{s.valor}</p>
                <p className="text-[10px] font-bold uppercase" style={{ color: sub, letterSpacing: '2px' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ══ HISTORIA: collage + texto ══ */}
        <section className="px-6 py-28">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Collage de 2 imágenes */}
            <motion.div
              initial={{ opacity: 0, x: -26 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="relative h-[460px] md:h-[520px]"
            >
              <img src={IMG.historia1} alt="Interior de lujo"
                className="absolute top-0 left-0 w-[72%] h-[78%] object-cover"
                style={{ border: `1px solid ${cardBd}` }} />
              <img src={IMG.historia2} alt="Detalle arquitectónico"
                className="absolute bottom-0 right-0 w-[52%] h-[55%] object-cover"
                style={{ border: '4px solid var(--bg-primary)', boxShadow: '0 22px 50px rgba(0,0,0,0.25)' }} />
              <div className="absolute -bottom-4 left-6 font-serif italic text-7xl select-none"
                style={{ color: 'rgba(201,168,76,0.22)' }}>L.</div>
            </motion.div>

            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, x: 26 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}
            >
              <p className="text-[10px] font-bold uppercase mb-5" style={{ color: '#C9A84C', letterSpacing: '5px' }}>
                Quiénes somos
              </p>
              <h2 className="font-serif mb-7" style={{ color: txt, fontSize: 'clamp(1.9rem, 3.6vw, 2.7rem)', lineHeight: 1.15 }}>
                Una idea local con estándar internacional
              </h2>
              <div className="space-y-5 text-[15px] leading-relaxed" style={{ color: sub }}>
                <p>
                  LuxHabitat nació en 2026 en Ibagué como respuesta a una pregunta
                  simple: ¿por qué publicar o buscar una propiedad tenía que sentirse
                  anticuado? Decidimos construir la plataforma que nosotros mismos
                  hubiéramos querido usar.
                </p>
                <p>
                  Somos un equipo de cuatro fundadores que cubre todo el ciclo del
                  producto: desarrollo, diseño, datos y experiencia. Cada propiedad
                  publicada, cada plan y cada detalle visual pasa por nuestras manos.
                </p>
                <p>
                  Hoy conectamos propietarios e interesados de manera directa, con
                  publicaciones cuidadas, planes a la medida y un acompañamiento
                  cercano en cada paso.
                </p>
              </div>
              <button
                onClick={() => navigate('/properties')}
                className="mt-9 px-9 py-4 text-[11px] font-bold uppercase transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: '#C9A84C', color: '#0D0D0D', letterSpacing: '3px' }}
              >
                Conoce nuestras propiedades
              </button>
            </motion.div>
          </div>
        </section>

        {/* ══ CITA con imagen de fondo ══ */}
        <section className="relative py-32 px-6 overflow-hidden">
          <img src={IMG.cita} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.72)' }} />
          <motion.blockquote
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 1 }}
            className="relative z-10 max-w-3xl mx-auto text-center"
          >
            <span className="font-serif text-6xl block mb-2" style={{ color: '#C9A84C' }}>“</span>
            <p className="font-serif italic text-white leading-snug"
              style={{ fontSize: 'clamp(1.5rem, 3.4vw, 2.3rem)' }}>
              No solo publicamos propiedades; construimos el lugar donde
              empieza la búsqueda de un hogar.
            </p>
            <footer className="mt-7 text-[10px] font-bold uppercase" style={{ color: '#D4B05E', letterSpacing: '4px' }}>
              Equipo fundador — LuxHabitat
            </footer>
          </motion.blockquote>
        </section>

        {/* ══ EQUIPO ══ */}
        <section className="px-6 py-28">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[10px] font-bold uppercase mb-4" style={{ color: '#C9A84C', letterSpacing: '5px' }}>
                El equipo fundador
              </p>
              <h2 className="font-serif text-3xl md:text-4xl mb-5" style={{ color: txt }}>
                Cuatro perfiles, una sola visión
              </h2>
              <p className="max-w-xl mx-auto text-sm leading-relaxed" style={{ color: sub }}>
                Desarrollo, diseño y estrategia bajo el mismo techo: así garantizamos
                que cada detalle de LuxHabitat tenga un responsable con nombre propio.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
              {TEAM.map((m, i) => (
                <MemberCard key={m.nombre} m={m} txt={txt} cardBd={cardBd} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ══ VALORES ══ */}
        <section className="px-6 pb-28">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3"
            style={{ borderTop: `1px solid ${cardBd}`, borderBottom: `1px solid ${cardBd}` }}>
            {VALORES.map((v, i) => (
              <motion.div
                key={v.titulo}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}
                className="px-8 py-12 text-center md:text-left"
                style={{ borderLeft: i > 0 ? `1px solid ${cardBd}` : 'none' }}
              >
                <span className="font-serif text-sm" style={{ color: '#C9A84C' }}>{v.n}</span>
                <h3 className="font-serif text-xl mt-2 mb-3" style={{ color: txt }}>{v.titulo}</h3>
                <p className="text-sm leading-relaxed" style={{ color: sub }}>{v.texto}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══ CTA FINAL ══ */}
        <section className="px-6 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl mb-4" style={{ color: txt }}>
              ¿Tienes una propiedad para el mundo?
            </h2>
            <p className="text-sm mb-9" style={{ color: sub }}>
              Publícala en minutos y deja que los interesados lleguen a ti.
            </p>
            <button
              onClick={() => navigate('/planes')}
              className="px-10 py-4 text-[12px] font-bold uppercase transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: 'transparent', color: '#C9A84C', border: '1px solid #C9A84C', letterSpacing: '3px' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#C9A84C'; e.currentTarget.style.color = '#0D0D0D'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C9A84C'; }}
            >
              Publicar mi propiedad
            </button>
          </motion.div>
        </section>

        <Footer />
      </div>
    </PageWrapper>
  );
}