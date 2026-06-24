import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function MagneticButton({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost'
  size = 'md',         // 'sm' | 'md' | 'lg'
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({
      x: (e.clientX - cx) * 0.28,
      y: (e.clientY - cy) * 0.28,
    });
  };

  const handleMouseLeave = () => {
    setPos({ x: 0, y: 0 });
    setHovered(false);
  };

  const sizes = {
    sm: { padding: '10px 26px', fontSize: '0.75rem' },
    md: { padding: '16px 42px', fontSize: '0.825rem' },
    lg: { padding: '20px 56px', fontSize: '0.9rem'  },
  };

  const variants = {
    primary: {
      background: hovered
        ? 'linear-gradient(135deg, #D4A853 0%, #E5C158 50%, #D4A853 100%)'
        : 'var(--gradient-gold)',
      color: '#0D0D0D',
      border: 'none',
      fontWeight: 700,
      boxShadow: hovered
        ? 'var(--shadow-gold-strong)'
        : 'var(--shadow-gold)',
    },
    secondary: {
      background: hovered ? 'rgba(201,168,76,0.08)' : 'transparent',
      color: hovered ? '#E5C158' : '#C9A84C',
      border: '1.5px solid #C9A84C',
      fontWeight: 600,
      boxShadow: hovered ? '0 0 0 3px rgba(201,168,76,0.15)' : 'none',
    },
    ghost: {
      background: hovered ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.06)',
      color: '#C9A84C',
      border: '1px solid rgba(201,168,76,0.25)',
      fontWeight: 600,
      boxShadow: 'none',
    },
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 280, damping: 18, mass: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className={`btn-shimmer ${className}`}
      style={{
        ...sizes[size],
        ...variants[variant],
        borderRadius: '12px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        fontFamily: "'Inter', sans-serif",
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'background 0.3s, color 0.3s, box-shadow 0.3s, border-color 0.3s',
        willChange: 'transform',
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
