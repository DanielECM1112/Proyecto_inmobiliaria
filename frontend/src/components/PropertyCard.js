import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './PropertyCard.css';

export default function PropertyCard({ prop }) {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageFailed, setImageFailed] = React.useState(false);

  const imgSrc = (() => {
    if (prop.thumbnail) {
      return prop.thumbnail.startsWith('http') ? prop.thumbnail : `http://localhost:8000${prop.thumbnail}`;
    }
    if (prop.imagenes?.length) {
      const img = prop.imagenes[0].imagen;
      if (img) return img.startsWith('http') ? img : `http://localhost:8000${img}`;
    }
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';
  })();

  const fmt = (p) =>
    Number(p).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageFailed(true);
    setImageLoaded(true);
  };

  return (
    <motion.article
      transition={{ duration: 0.25 }}
      onClick={() => navigate(`/properties/${prop.id}`)}
      className={`group flex flex-col rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 ${
        isDarkMode
          ? 'hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
          : 'hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]'
      }`}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
    >
      {/* Imagen 4:3 */}
      <div className="property-card-image-container">
        {!imageLoaded && !imageFailed && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse" />
        )}
        <img
          src={imageFailed ? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80' : imgSrc}
          alt={prop.titulo}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            !imageLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {/* Overlay hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/properties/${prop.id}`);
            }}
            className="bg-[#C9A84C] text-[#0D0D0D] px-8 py-3 rounded-full text-sm font-bold uppercase tracking-[2px] hover:bg-white transition-all duration-300 shadow-lg"
          >
            Ver propiedad
          </button>
        </div>
        {/* Badge DISPONIBLE */}
        <div className="absolute top-4 left-4 bg-white/90 text-[#0D0D0D] text-[9px] font-bold uppercase tracking-[2px] px-3 py-1 rounded-full">
          DISPONIBLE
        </div>
      </div>

      {/* Cuerpo */}
      <div className="flex flex-col flex-1 p-6">
        <p className="text-[10px] font-bold uppercase tracking-[3px] text-[#C9A84C] mb-2">
          {prop.tipo || 'INMUEBLE'}
        </p>
        <h3
          className="font-serif font-bold text-xl leading-snug truncate mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {prop.titulo}
        </h3>
        <div className="flex items-center gap-1.5 mb-4">
          <FaMapMarkerAlt className="text-[#C9A84C] text-xs flex-shrink-0" />
          <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
            {prop.ubicacion || '—'}
          </span>
        </div>
        <p className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          {fmt(prop.precio)}
        </p>

        {/* Specs */}
        <div className="flex items-center justify-between">
          {[
            { Icon: FaBed,           val: prop.habitaciones, label: 'HAB.' },
            { Icon: FaBath,          val: prop.banos,        label: 'BAÑOS' },
            { Icon: FaRulerCombined, val: prop.area,         label: 'M²' },
          ].map(({ Icon, val, label }, i) => (
            <div
              key={label}
              className={`flex items-center gap-2 ${i > 0 ? 'pl-4 border-l' : ''}`}
              style={i > 0 ? { borderColor: 'var(--card-border)' } : {}}
            >
              <Icon className="text-[#C9A84C] text-sm" />
              <div className="flex flex-col">
                <span className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                  {val ?? '—'}
                </span>
                <span className="text-[9px] uppercase tracking-[1px]" style={{ color: 'var(--text-secondary)' }}>
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
