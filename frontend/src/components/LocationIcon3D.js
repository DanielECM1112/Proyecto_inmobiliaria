export default function LocationIcon3D({ className = "" }) {
  return (
    <div className={`relative w-32 h-40 ${className}`}>
      {/* Base 3D */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-violet-600/90 to-violet-800/90 rounded-full blur-lg animate-pulse"></div>
      
      {/* Pino 3D con animación de flotación */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-28 transform-style-3d location-icon-float">
        {/* Frente del pino */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-violet-400 via-violet-600 to-violet-900 rounded-t-full rounded-b-[3rem] shadow-2xl shadow-violet-900/60 transform perspective-1000 rotateX(-15deg)">
          {/* Centro del pino */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-white to-gray-200 rounded-full shadow-xl animate-bounce"></div>
        </div>
        
        {/* Sombra derecha del pino */}
        <div className="absolute top-0 left-2 w-full h-full bg-gradient-to-b from-violet-700 via-violet-800 to-violet-950 rounded-t-full rounded-b-[3rem] transform perspective-1000 rotateX(-15deg) rotateY(20deg) translateZ(-8px) opacity-85"></div>
        
        {/* Sombra izquierda del pino */}
        <div className="absolute top-0 left-[-2px] w-full h-full bg-gradient-to-b from-violet-500 via-violet-600 to-violet-800 rounded-t-full rounded-b-[3rem] transform perspective-1000 rotateX(-15deg) rotateY(-20deg) translateZ(-8px) opacity-70"></div>
      </div>
      
      {/* Efecto de brillo superior */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-b from-white/70 to-transparent rounded-full blur-2xl animate-pulse"></div>
    </div>
  );
}
