import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import video3 from "../assets/video3.mp4";
import video4 from "../assets/video4.mp4";
import video5 from "../assets/video5.mp4";

const videos = [video1, video2, video3, video4, video5];

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleVideoEnd = () => {
    const nextVideo = (currentVideo + 1) % videos.length;
    setCurrentVideo(nextVideo);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  const properties = [
    {
      id: 1,
      title: "Casa Moderna con Piscina",
      location: "Bogotá, Colombia",
      price: "$850,000,000",
      beds: 4,
      baths: 3,
      area: "320 m²"
    },
    {
      id: 2,
      title: "Apartamento en el Centro",
      location: "Medellín, Colombia",
      price: "$420,000,000",
      beds: 3,
      baths: 2,
      area: "180 m²"
    },
    {
      id: 3,
      title: "Villa de Lujo Frente al Mar",
      location: "Cartagena, Colombia",
      price: "$1,500,000,000",
      beds: 5,
      baths: 4,
      area: "450 m²"
    }
  ];

  const services = [
    {
      title: "Compra de Propiedades",
      description: "Encuentra la propiedad de tus sueños con nuestra amplia selección de inmuebles en las mejores ubicaciones del país."
    },
    {
      title: "Venta de Inmuebles",
      description: "Vende tu propiedad al mejor precio con nuestro equipo de expertos y amplia red de compradores potenciales."
    },
    {
      title: "Alquileres",
      description: "Encuentra opciones de alquiler que se adapten a tus necesidades y presupuesto con total transparencia."
    },
    {
      title: "Asesoría Inmobiliaria",
      description: "Recibe orientación profesional en cada paso del proceso de compra, venta o alquiler de tu propiedad."
    },
    {
      title: "Tasaciones",
      description: "Obtén una valoración precisa de tu propiedad con nuestros expertos tasadores certificados."
    },
    {
      title: "Gestión Documental",
      description: "Nos encargamos de toda la tramitación legal y documental para tu total tranquilidad y seguridad."
    }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Compradora",
      text: "La mejor experiencia inmobiliaria que he tenido. El equipo fue profesional, atento y me ayudó a encontrar la casa perfecta para mi familia."
    },
    {
      name: "Carlos Rodríguez",
      role: "Vendedor",
      text: "Vendí mi propiedad en tiempo record y a un precio excelente. Recomiendo totalmente los servicios de esta inmobiliaria."
    },
    {
      name: "Ana Martínez",
      role: "Arrendataria",
      text: "El proceso de alquiler fue muy sencillo y transparente. Siempre estuvieron disponibles para resolver mis dudas."
    }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-100">
      {/* Botón volver arriba */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl z-40 transition-all duration-300 ${
          scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        ↑
      </button>

      {/* Sección Hero con Videos */}
      <div className="relative h-screen w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={videos[currentVideo]}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnd}
          className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        <div className="relative z-20">
          <Navbar />
        </div>
        <div className="relative z-20 flex flex-col justify-center items-center h-full text-center text-white px-4">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 uppercase tracking-wider drop-shadow-2xl">
            Encuentra tu hogar ideal
          </h1>
          <p className="text-xl md:text-3xl mb-10 max-w-4xl leading-relaxed drop-shadow-lg">
            Compra, vende y alquila propiedades premium con la mejor experiencia inmobiliaria.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => scrollToSection('properties')}
              className="bg-white text-gray-900 px-12 py-5 rounded-xl text-xl font-bold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Explorar propiedades
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="border-3 border-white text-white px-12 py-5 rounded-xl text-xl font-bold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
            >
              Contáctanos
            </button>
          </div>
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="text-4xl">↓</div>
          </div>
        </div>
      </div>

      {/* Sección Servicios */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">Nuestros Servicios</h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ofrecemos un completo portafolio de servicios inmobiliarios para satisfacer todas tus necesidades
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-10 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-gray-200 hover:border-gray-400"
              >
                <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                  <span className="text-white text-3xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-5">{service.title}</h3>
                <p className="text-lg text-gray-700 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Propiedades Destacadas */}
      <section id="properties" className="py-24 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">Propiedades Destacadas</h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Descubre nuestra selección de propiedades exclusivas en las mejores ubicaciones
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {properties.map((property) => (
              <div 
                key={property.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 group"
              >
                <div className="h-72 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center relative overflow-hidden">
                  <div className="text-white text-8xl font-light group-hover:scale-110 transition-transform duration-500">
                    Inmueble
                  </div>
                  <div className="absolute top-6 right-6 bg-gray-900 text-white px-6 py-2 rounded-xl font-bold text-lg">
                    Destacado
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{property.title}</h3>
                  <p className="text-xl text-gray-600 mb-5 flex items-center gap-3">
                    <span className="text-2xl">📍</span> {property.location}
                  </p>
                  <p className="text-4xl font-extrabold text-gray-900 mb-8">{property.price}</p>
                  <div className="flex gap-8 pt-6 border-t-2 border-gray-200">
                    <div className="flex items-center gap-3 text-xl text-gray-700 font-semibold">
                      {property.beds} Habitaciones
                    </div>
                    <div className="flex items-center gap-3 text-xl text-gray-700 font-semibold">
                      {property.baths} Baños
                    </div>
                    <div className="flex items-center gap-3 text-xl text-gray-700 font-semibold">
                      {property.area}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <button className="bg-gray-900 text-white px-16 py-6 rounded-2xl text-2xl font-bold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              Ver todas las propiedades
            </button>
          </div>
        </div>
      </section>

      {/* Sección Sobre Nosotros */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-8">Sobre Nosotros</h2>
              <p className="text-2xl text-gray-700 mb-8 leading-relaxed">
                Somos una inmobiliaria con más de 15 años de experiencia en el mercado, comprometida en brindar un servicio excepcional a nuestros clientes.
              </p>
              <p className="text-2xl text-gray-700 mb-12 leading-relaxed">
                Nuestro equipo de profesionales está dedicado a ayudarte a encontrar la propiedad perfecta, ya sea para comprar, vender o alquilar.
              </p>
              <div className="grid grid-cols-3 gap-10 mb-10">
                <div className="text-center p-8 bg-gray-50 rounded-2xl border-2 border-gray-200">
                  <div className="text-6xl font-extrabold text-gray-900 mb-3">500+</div>
                  <div className="text-xl font-semibold text-gray-700">Propiedades</div>
                </div>
                <div className="text-center p-8 bg-gray-50 rounded-2xl border-2 border-gray-200">
                  <div className="text-6xl font-extrabold text-gray-900 mb-3">2000+</div>
                  <div className="text-xl font-semibold text-gray-700">Clientes Satisfechos</div>
                </div>
                <div className="text-center p-8 bg-gray-50 rounded-2xl border-2 border-gray-200">
                  <div className="text-6xl font-extrabold text-gray-900 mb-3">15+</div>
                  <div className="text-xl font-semibold text-gray-700">Años de Experiencia</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="h-80 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center shadow-2xl">
                <div className="text-white text-6xl font-light text-center p-8">Equipo Profesional</div>
              </div>
              <div className="h-80 bg-gradient-to-br from-gray-800 to-black rounded-3xl flex items-center justify-center shadow-2xl mt-16">
                <div className="text-white text-6xl font-light text-center p-8">Visión y Valores</div>
              </div>
              <div className="h-80 bg-gradient-to-br from-gray-600 to-gray-800 rounded-3xl flex items-center justify-center shadow-2xl -mt-16">
                <div className="text-white text-6xl font-light text-center p-8">Compromiso Total</div>
              </div>
              <div className="h-80 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl flex items-center justify-center shadow-2xl">
                <div className="text-white text-6xl font-light text-center p-8">Excelencia en Servicio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Testimonios */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6">Lo que dicen nuestros clientes</h2>
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              La satisfacción de nuestros clientes es nuestra prioridad
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="text-7xl text-gray-900 mb-8">"</div>
                <p className="text-xl text-gray-700 mb-10 leading-relaxed italic">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-6 pt-6 border-t-2 border-gray-200">
                  <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-white text-3xl font-extrabold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-xl text-gray-600 font-semibold">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Contacto */}
      <section id="contact" className="py-24 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">Contáctanos</h2>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Estamos listos para ayudarte en tu proceso inmobiliario
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-white p-12 rounded-3xl shadow-2xl">
              <h3 className="text-4xl font-extrabold text-gray-900 mb-10">Envíanos un mensaje</h3>
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xl font-semibold text-gray-700 mb-4">Nombre</label>
                    <input 
                      type="text" 
                      className="w-full px-8 py-5 text-xl border-3 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-xl font-semibold text-gray-700 mb-4">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-8 py-5 text-xl border-3 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xl font-semibold text-gray-700 mb-4">Teléfono</label>
                  <input 
                    type="tel" 
                    className="w-full px-8 py-5 text-xl border-3 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300"
                    placeholder="+57 300 123 4567"
                  />
                </div>
                <div>
                  <label className="block text-xl font-semibold text-gray-700 mb-4">Mensaje</label>
                  <textarea 
                    rows="6"
                    className="w-full px-8 py-5 text-xl border-3 border-gray-200 rounded-2xl focus:border-gray-900 focus:outline-none transition-all duration-300 resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gray-900 text-white px-10 py-6 rounded-2xl text-2xl font-bold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  Enviar mensaje
                </button>
              </form>
            </div>
            <div className="space-y-10">
              <div className="bg-white p-12 rounded-3xl shadow-2xl">
                <h3 className="text-4xl font-extrabold text-gray-900 mb-10">Información de contacto</h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-6 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300">
                    <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                      Dir
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">Dirección</h4>
                      <p className="text-xl text-gray-700">Calle Principal 123, Bogotá, Colombia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300">
                    <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                      Tel
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">Teléfono</h4>
                      <p className="text-xl text-gray-700">+57 300 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300">
                    <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                      Mail
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">Email</h4>
                      <p className="text-xl text-gray-700">info@inmobiliaria.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300">
                    <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                      Hor
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">Horario de atención</h4>
                      <p className="text-xl text-gray-700">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                      <p className="text-xl text-gray-700">Sábados: 9:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-black p-12 rounded-3xl text-white shadow-2xl">
                <h3 className="text-4xl font-extrabold mb-6">¿Listo para empezar?</h3>
                <p className="text-2xl mb-10 text-gray-300 leading-relaxed">
                  Contáctanos hoy mismo y encuentra la propiedad de tus sueños
                </p>
                <button className="bg-white text-gray-900 px-10 py-6 rounded-2xl text-2xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                  Llámanos ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div>
              <h3 className="text-4xl font-extrabold mb-8">Inmobiliaria</h3>
              <p className="text-xl text-gray-400 leading-relaxed">
                Tu socio de confianza en el mercado inmobiliario. Encuentra, vende o alquila tu propiedad con nosotros.
              </p>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-8">Enlaces rápidos</h4>
              <ul className="space-y-4">
                <li><a href="#services" className="text-xl text-gray-400 hover:text-white transition-colors duration-300">Servicios</a></li>
                <li><a href="#properties" className="text-xl text-gray-400 hover:text-white transition-colors duration-300">Propiedades</a></li>
                <li><a href="#about" className="text-xl text-gray-400 hover:text-white transition-colors duration-300">Sobre nosotros</a></li>
                <li><a href="#contact" className="text-xl text-gray-400 hover:text-white transition-colors duration-300">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-8">Servicios</h4>
              <ul className="space-y-4">
                <li><span className="text-xl text-gray-400">Compra de propiedades</span></li>
                <li><span className="text-xl text-gray-400">Venta de inmuebles</span></li>
                <li><span className="text-xl text-gray-400">Alquileres</span></li>
                <li><span className="text-xl text-gray-400">Asesoría inmobiliaria</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-2xl font-bold mb-8">Síguenos</h4>
              <div className="flex gap-5">
                <a href="#" className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-2xl font-bold hover:bg-gray-700 transition-all duration-300 transform hover:scale-110">FB</a>
                <a href="#" className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-2xl font-bold hover:bg-gray-700 transition-all duration-300 transform hover:scale-110">IG</a>
                <a href="#" className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-2xl font-bold hover:bg-gray-700 transition-all duration-300 transform hover:scale-110">TW</a>
                <a href="#" className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-2xl font-bold hover:bg-gray-700 transition-all duration-300 transform hover:scale-110">YT</a>
              </div>
            </div>
          </div>
          <div className="border-t-2 border-gray-800 pt-12 text-center">
            <p className="text-xl text-gray-400">
              © 2024 Inmobiliaria. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
