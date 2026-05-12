import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import video3 from "../assets/video3.mp4";
import video4 from "../assets/video4.mp4";
import video5 from "../assets/video5.mp4";

const videos = [video1, video2, video3, video4, video5];

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const handleVideoEnd = () => {
    const nextVideo = (currentVideo + 1) % videos.length;
    setCurrentVideo(nextVideo);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  return (
    <div className="bg-gray-50 flex flex-col min-h-screen">
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
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-black/20 to-black/80 pointer-events-none z-10"></div>
        
        <div className="relative z-30">
          <Navbar />
        </div>

        <div className="relative z-20 flex flex-col justify-center items-center h-full text-center text-white px-8">
          <h1 className="text-6xl md:text-9xl font-black mb-8 uppercase tracking-tighter drop-shadow-2xl">
            LUX<span className="text-gray-300">HABITAT</span>
          </h1>
          <p className="text-xl md:text-3xl mb-12 max-w-3xl font-medium leading-relaxed drop-shadow-lg text-gray-200">
            Tu Hogar de Ensueño <br /> <span className="text-white/80">Comienza con un click.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-8">
            <button 
              onClick={() => navigate('/properties')}
              className="bg-white text-gray-900 px-12 py-6 rounded-2xl text-xl font-black hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-2xl uppercase tracking-widest"
            >
              Ver Propiedades
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="backdrop-blur-md bg-white/10 border-2 border-white/30 text-white px-12 py-6 rounded-2xl text-xl font-black hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 uppercase tracking-widest"
            >
              Conócenos
            </button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-4 text-white/50">
            <span className="text-xs font-bold tracking-[0.5em] uppercase">Scroll</span>
            <div className="w-[2px] h-12 bg-gradient-to-b from-white/50 to-transparent"></div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
