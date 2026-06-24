import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageWrapper from '../components/PageWrapper';
import { useTheme } from '../context/ThemeContext';

const SECCIONES = [
  {
    titulo: 'Objeto de la plataforma',
    texto: `LuxHabitat es una plataforma web para la publicación y consulta de inmuebles en Ibagué, Tolima (Colombia). Permite a los usuarios registrados publicar propiedades bajo distintos planes y a los visitantes explorarlas y contactar directamente a los propietarios. LuxHabitat es un proyecto formativo desarrollado por aprendices del SENA; su uso tiene fines académicos y demostrativos.`,
  },
  {
    titulo: 'Registro y cuentas de usuario',
    texto: `Para publicar propiedades es necesario crear una cuenta con información veraz: nombre, correo electrónico y contraseña. El usuario es responsable de la confidencialidad de sus credenciales y de toda actividad realizada desde su cuenta. El registro está dirigido a personas mayores de edad. El equipo administrador puede suspender cuentas que publiquen información falsa o hagan uso indebido de la plataforma.`,
  },
  {
    titulo: 'Publicación de propiedades',
    texto: `El usuario declara que la información y las fotografías que publica son reales, le pertenecen o cuenta con autorización para usarlas. Cada plan determina la cantidad de fotos y los días de visibilidad de la publicación; al vencer ese plazo, la propiedad deja de mostrarse en el listado público. El administrador es el encargado de editar o retirar publicaciones: si necesitas corregir tu propiedad, puedes solicitarlo desde la sección de Soporte de tu perfil.`,
  },
  {
    titulo: 'Planes y pagos',
    texto: `LuxHabitat ofrece un plan gratuito y planes de pago con mayores beneficios. Por tratarse de un proyecto académico, los pagos se procesan a través de una pasarela en modo de pruebas (sandbox): no se realizan cobros reales ni se solicita información financiera verdadera. Los precios mostrados son de referencia.`,
  },
  {
    titulo: 'Propiedad intelectual',
    texto: `El diseño, el código y la marca LuxHabitat pertenecen al equipo desarrollador del proyecto. Las fotografías y descripciones de cada inmueble pertenecen a quien las publica. No está permitido copiar, extraer o reutilizar el contenido de la plataforma sin autorización.`,
  },
  {
    titulo: 'Limitación de responsabilidad',
    texto: `LuxHabitat actúa únicamente como un espacio de publicación: no es parte de las negociaciones, visitas, promesas de compraventa ni transacciones entre usuarios. Recomendamos verificar siempre la información del inmueble y la identidad del propietario antes de cualquier acuerdo.`,
  },
  {
    titulo: 'Cambios y contacto',
    texto: `Estos términos pueden actualizarse para reflejar mejoras de la plataforma; la fecha de la última actualización se indica en esta página. Para dudas o solicitudes escríbenos a manuelestiven2006@gmail.com.`,
  },
];

export default function Terms() {
  const { isDarkMode } = useTheme();
  const txt    = isDarkMode ? '#F0F0ED' : '#161616';
  const sub    = isDarkMode ? '#A3A39B' : '#55554F';
  const cardBd = isDarkMode ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.10)';

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col font-sans transition-colors duration-500"
        style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />

        {/* Cabecera editorial */}
        <header className="relative pt-44 pb-20 px-6 overflow-hidden" style={{ background: '#0D0D0D' }}>
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)', backgroundSize: '26px 26px' }} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="relative max-w-3xl mx-auto text-center">
            <p className="text-[10px] font-bold uppercase mb-5" style={{ color: '#C9A84C', letterSpacing: '6px' }}>
              Legal
            </p>
            <h1 className="font-serif text-white mb-6" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', fontWeight: 500 }}>
              Términos &amp; <em className="italic" style={{ color: '#D4B05E' }}>Condiciones</em>
            </h1>
            <div className="h-px w-16 mx-auto mb-6" style={{ background: '#C9A84C' }} />
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Última actualización: junio de 2026
            </p>
          </motion.div>
        </header>

        {/* Contenido */}
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
