import Navbar from "../components/Navbar";
import backgroundVideo from "../assets/video_1.mp4";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* Video de fondo */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* Capa oscura */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      {/* Navbar */}
      <Navbar />

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-4">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 uppercase tracking-widest">
          Encuentra tu hogar ideal
        </h2>

        <p className="text-lg md:text-2xl mb-8 max-w-3xl">
          Compra, vende o alquila propiedades con la mejor experiencia inmobiliaria.
        </p>

        <button className="border border-white px-8 py-4 rounded-lg text-lg hover:bg-white hover:text-black transition">
          Explorar propiedades
        </button>
      </div>
    </div>
  );
}