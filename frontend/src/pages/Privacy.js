import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';
import { useTheme } from '../context/ThemeContext';

const SECCIONES = [
  {
    titulo: 'Responsable del tratamiento',
    texto: `El tratamiento de los datos personales de LuxHabitat está a cargo del equipo desarrollador del proyecto (aprendices SENA — Ibagué, Tolima, Colombia). Canal de contacto para temas de datos personales: manuelestiven2006@gmail.com.`,
  },
  {
    titulo: 'Datos que recolectamos',
    texto: `Al crear una cuenta: nombre, correo electrónico y contraseña (almacenada cifrada). De forma opcional, en tu perfil: teléfono, ciudad y foto de perfil. Al publicar una propiedad: la información del inmueble, sus fotografías y los datos de contacto que decides mostrar (nombre, teléfono y correo del contacto). No solicitamos documentos de identidad ni información financiera real.`,
  },
  {
    titulo: 'Para qué usamos tus datos',
    texto: `Para crear y administrar tu cuenta, mostrar tus publicaciones, permitir que los interesados te contacten por los medios que registraste (WhatsApp, llamada o correo), brindarte soporte y mantener la seguridad de la plataforma. No usamos tus datos para publicidad ni los vendemos o compartimos con terceros.`,
  },
  {
    titulo: 'Dónde se almacenan',
    texto: `La información de cuentas y propiedades se guarda en la base de datos del proyecto (MySQL). Las imágenes se alojan en Cloudinary, un servicio especializado de almacenamiento de imágenes en la nube. Las contraseñas nunca se guardan en texto plano: se almacenan con algoritmos de cifrado estándar de Django.`,
  },
  {
    titulo: 'Tus derechos (Ley 1581 de 2012)',
    texto: `De acuerdo con el régimen colombiano de protección de datos personales, puedes conocer, actualizar, rectificar y solicitar la supresión de tus datos, así como revocar la autorización para su tratamiento. Puedes actualizar tu información directamente desde tu perfil o escribirnos al correo de contacto para cualquier solicitud; te responderemos a la brevedad.`,
  },
  {
    titulo: 'Conservación y seguridad',
    texto: `Conservamos tus datos mientras tu cuenta esté activa o mientras sean necesarios para los fines descritos. Aplicamos medidas razonables de seguridad (autenticación con tokens, cifrado de contraseñas y control de acceso por roles). Por tratarse de un proyecto académico, recomendamos no registrar información sensible.`,
  },
];

export default function Privacy() {
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
              Política de <em className="italic" style={{ color: '#D4B05E' }}>Privacidad</em>
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
