import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function SectionHeader({
  overline,          // texto dorado pequeño encima: "Nuestro Catálogo"
  title,             // título principal (Playfair): "Propiedades de Lujo"
  subtitle,          // párrafo debajo — opcional
  align = 'left',    // 'left' | 'center'
  light = false,     // true si la sección tiene fondo oscuro
}) {
  const { isDarkMode } = useTheme();
  const centered = align === 'center';

  return (
    <div
      data-reveal="fade-up"
      style={{ textAlign: centered ? 'center' : 'left', marginBottom: '4rem' }}
    >
      {overline && (
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          letterSpacing: 'var(--tracking-widest)',
          textTransform: 'uppercase',
          color: '#C9A84C',
          marginBottom: '14px',
        }}>
          {overline}
        </p>
      )}

      <h2 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 'var(--text-4xl)',
        fontWeight: 600,
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
        color: light ? '#FAFAF7' : (isDarkMode ? '#FAFAF7' : '#0D0D0D'),
        margin: 0,
      }}>
        {title}
      </h2>

      {/* Línea dorada */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: centered ? 'center' : 'flex-start',
        gap: '8px',
        margin: '20px 0',
      }}>
        <div style={{
          width: '48px', height: '2px',
          background: 'var(--gradient-gold)',
          borderRadius: '2px',
          boxShadow: '0 0 10px rgba(201,168,76,0.5)',
        }} />
        <div style={{
          width: '96px', height: '2px',
          background: isDarkMode
            ? 'rgba(201,168,76,0.15)'
            : 'rgba(201,168,76,0.20)',
          borderRadius: '2px',
        }} />
      </div>

      {subtitle && (
        <p
          data-reveal="fade-up"
          data-reveal-delay="200"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'var(--text-lg)',
            fontWeight: 400,
            lineHeight: 1.75,
            color: light
              ? 'rgba(250,250,247,0.7)'
              : isDarkMode
              ? 'rgba(250,250,247,0.6)'
              : 'rgba(13,13,13,0.6)',
            maxWidth: '560px',
            margin: centered ? '0 auto' : '0',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
