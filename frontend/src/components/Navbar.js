import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaCrown } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const getAvatarUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return `http://localhost:8000${path}`;
};

const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IconMoon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const isHome = location.pathname === "/";

  // ── Sólido en todas las páginas menos Home sin scroll ──
  const isSolid = !isHome || scrolled;

  // Función para cargar usuario
  const cargarUsuario = () => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parseando user:", e);
      }
    }
  };

  useEffect(() => {
    cargarUsuario();
  }, []);

  useEffect(() => {
    cargarUsuario();
  }, [location.pathname]);

  useEffect(() => {
    const handleStorage = () => {
      cargarUsuario();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const handleUserUpdate = (e) => {
      if (e.detail) setUser(e.detail);
    };
    window.addEventListener('userUpdated', handleUserUpdate);
    return () => window.removeEventListener('userUpdated', handleUserUpdate);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowProfileMenu(false);
    navigate("/");
  };

  const navLinks = [
    { name: "INICIO",      path: "/"           },
    { name: "PROPIEDADES", path: "/properties" },
    { name: "PLANES",      path: "/planes"     },
    { name: "DESCUBRE",    path: "/location"   },
    { name: "NOSOTROS",    path: "/about"      },
  ];

  const initial = (user?.nombre?.[0] || user?.email?.[0] || "U").toUpperCase();

  // Colores del dropdown
  const dd = {
    bg:         isDarkMode ? '#181818' : '#FFFFFF',
    border:     isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    divider:    isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
    itemHover:  isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    textMain:   isDarkMode ? '#F0F0ED' : '#0D0D0D',
    textMuted:  isDarkMode ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.40)',
    iconColor:  isDarkMode ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)',
    shadow:     isDarkMode
      ? '0 24px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(201,168,76,0.08)'
      : '0 24px 60px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.06)',
  };

  return (
    <nav
      style={{
        /* Sobre el video: TOTALMENTE transparente — el video se ve limpio.
           La legibilidad la da el degradado superior del propio hero. */
        background: isSolid
          ? isDarkMode
            ? 'rgba(13,13,13,0.97)'
            : 'rgba(250,250,247,0.96)'
          : 'transparent',
        backdropFilter:       isSolid ? 'blur(18px)' : 'none',
        WebkitBackdropFilter: isSolid ? 'blur(18px)' : 'none',
        borderBottom: isSolid
          ? isDarkMode
            ? '1px solid rgba(201,168,76,0.14)'
            : '1px solid rgba(201,168,76,0.25)'
          : '1px solid transparent',
        boxShadow: 'none',
        transition: 'background 0.45s ease, backdrop-filter 0.45s, border-color 0.45s',
      }}
      className="fixed top-0 left-0 right-0 z-50 py-5 px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center">

          {/* LOGO — wordmark tipográfico, sin caja ni icono */}
          <Link to="/" className="flex items-baseline gap-0 flex-shrink-0 group">
            <span
              className="font-serif text-[1.55rem] lg:text-[1.75rem] font-bold tracking-[0.02em] transition-colors duration-500"
              style={{
                color: isSolid ? (isDarkMode ? '#F5F0E8' : '#141414') : '#FFFFFF',
                textShadow: !isSolid ? '0 1px 10px rgba(0,0,0,0.5)' : 'none',
              }}
            >
              LUX
            </span>
            <span
              className="font-serif text-[1.55rem] lg:text-[1.75rem] font-light tracking-[0.06em] transition-colors duration-500"
              style={{
                color: !isSolid ? 'rgba(255,255,255,0.85)' : '#C9A84C',
                textShadow: !isSolid ? '0 1px 10px rgba(0,0,0,0.5)' : 'none',
              }}
            >
              HABITAT
            </span>
            {/* Punto dorado de marca */}
            <span
              className="ml-1.5 mb-1 w-1.5 h-1.5 rounded-full self-end transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: '#C9A84C', opacity: 0.9 }}
            />
          </Link>

          <div className="flex items-center gap-2 md:gap-8">

            {/* LINKS */}
            <ul className="hidden lg:flex items-center gap-9">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      style={{
                        textShadow: !isSolid ? '0 1px 8px rgba(0,0,0,0.8)' : 'none',
                        letterSpacing: '2.5px',
                        color: isSolid
                          ? isActive
                            ? '#C9A84C'
                            : isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(20,20,20,0.7)'
                          : isActive ? '#FFFFFF' : 'rgba(255,255,255,0.8)',
                        borderBottom: isActive
                          ? '1px solid #C9A84C'
                          : '1px solid transparent',
                        transition: 'color 0.3s, border-color 0.3s',
                      }}
                      className="text-[11px] font-bold pb-1.5 hover:!text-[#C9A84C]"
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* BOTÓN USUARIO */}
            <div className="relative" ref={menuRef}>
              <button
                  onClick={() => {
                    if (user) setShowProfileMenu(!showProfileMenu);
                    else navigate("/login");
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 relative"
                  style={{
                    border: isSolid
                      ? user?.plan_activo?.name === 'Premium' 
                        ? '2px solid #FFD700' 
                        : '1px solid rgba(201,168,76,0.55)'
                      : '1px solid rgba(255,255,255,0.65)',
                    background: 'transparent',
                    color: isSolid
                      ? (isDarkMode ? 'rgba(255,255,255,0.75)' : 'rgba(20,20,20,0.7)')
                      : '#FFFFFF',
                    boxShadow: user?.plan_activo?.name === 'Premium' ? '0 0 10px rgba(255,215,0,0.5)' : 'none'
                  }}
                >
                  {user ? (
                    user?.avatar ? (
                      <img src={getAvatarUrl(user.avatar)} alt="avatar"
                        className="w-full h-full object-cover" />
                    ) : (
                      <span
                        className="font-serif font-bold text-[15px]"
                        style={{ color: '#C9A84C' }}
                      >
                        {initial}
                      </span>
                    )
                  ) : (
                    <FaUserCircle className="text-lg" />
                  )}
                  {/* Small crown for Premium users */}
                  {user?.plan_activo?.name === 'Premium' && (
                    <div className="absolute -top-1 -right-1 text-sm animate-pulse">
                      <FaCrown style={{ color: '#FFD700', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
                    </div>
                  )}
                </button>

              {/* DROPDOWN */}
              <AnimatePresence>
                {showProfileMenu && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginTop: '12px',
                      width: '300px',
                      borderRadius: '24px',
                      zIndex: 50,
                      overflow: 'hidden',
                      background: dd.bg,
                      border: `1px solid ${dd.border}`,
                      boxShadow: dd.shadow,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {/* ── HEADER: avatar centrado ── */}
                    <div style={{
                      padding: '28px 20px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '10px',
                      background: isDarkMode
                        ? 'linear-gradient(160deg, rgba(201,168,76,0.09) 0%, transparent 70%)'
                        : 'linear-gradient(160deg, rgba(201,168,76,0.07) 0%, transparent 70%)',
                    }}>
                      {/* Avatar circular grande */}
                      <div style={{ position: 'relative' }}>
                        {user?.avatar ? (
                          <img
                            src={getAvatarUrl(user.avatar)}
                            alt="avatar"
                            style={{
                              width: '72px', height: '72px',
                              borderRadius: '50%', objectFit: 'cover',
                              border: '2px solid rgba(201,168,76,0.6)',
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '72px', height: '72px',
                            borderRadius: '50%',
                            background: '#181818',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#C9A84C', fontWeight: 700, fontSize: '26px',
                            fontFamily: "'Playfair Display', serif",
                            border: '2px solid rgba(201,168,76,0.6)',
                          }}>
                            {initial}
                          </div>
                        )}
                        {/* Punto online */}
                        <div style={{
                          position: 'absolute', bottom: '3px', right: '3px',
                          width: '11px', height: '11px', borderRadius: '50%',
                          background: '#4ade80',
                          border: `2px solid ${dd.bg}`,
                        }} />
                      </div>

                      {/* Nombre */}
                      <div style={{ textAlign: 'center' }}>
                        <p style={{
                          fontSize: '17px', fontWeight: 700,
                          color: dd.textMain, lineHeight: 1.2,
                          fontFamily: "'Playfair Display', serif",
                          letterSpacing: '-0.02em',
                        }}>
                          {user?.nombre || user?.email?.split("@")[0] || "Usuario"}
                        </p>
                        <p style={{
                          fontSize: '12px', marginTop: '4px',
                          color: dd.textMuted,
                        }}>
                          {user?.email}
                        </p>
                        {/* Badge rol */}
                        <span style={{
                          display: 'inline-block', marginTop: '8px',
                          fontSize: '9px', fontWeight: 700,
                          letterSpacing: '0.2em', textTransform: 'uppercase',
                          padding: '4px 12px',
                          color: '#C9A84C',
                          border: '1px solid rgba(201,168,76,0.4)',
                        }}>
                          {(user?.rol === 'admin' || user?.is_staff) ? 'Administrador' : 'Usuario'}
                        </span>
                        {/* Badge plan */}
                        {user?.plan_activo && (
                          <span style={{
                            display: 'inline-block', marginTop: '6px',
                            fontSize: '9px', fontWeight: 700,
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                            padding: '4px 12px',
                            color: user.plan_activo.name === 'Premium' ? '#0D0D0D' : '#C9A84C',
                            background: user.plan_activo.name === 'Premium' ? '#C9A84C' : 'transparent',
                            border: `1px solid ${user.plan_activo.name === 'Premium' ? '#C9A84C' : 'rgba(201,168,76,0.4)'}`,
                          }}>
                            {user.plan_activo.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', background: dd.divider, margin: '0 16px' }} />

                    {/* ── MENÚ ÍTEMS ── */}
                    <div style={{ padding: '10px 10px 6px' }}>

                      {/* Mi Perfil */}
                      <motion.button
                        onClick={() => { navigate("/profile"); setShowProfileMenu(false); }}
                        whileHover={{ x: 2 }}
                        onMouseEnter={e => e.currentTarget.style.background = dd.itemHover}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center',
                          gap: '14px', padding: '12px 14px', borderRadius: '14px',
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          transition: 'background 0.18s', textAlign: 'left',
                        }}
                      >
                        <span style={{ color: dd.iconColor, flexShrink: 0, display: 'flex' }}>
                          <IconUser />
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: dd.textMain }}>
                          Mi Perfil
                        </span>
                      </motion.button>

                      {/* Panel de Admin (solo para admins) */}
                      {(user?.is_staff || user?.rol === 'admin') && (
                        <motion.button
                          onClick={() => { 
                            window.open('/admin/', '_blank');
                            setShowProfileMenu(false); 
                          }}
                          whileHover={{ x: 2 }}
                          onMouseEnter={e => e.currentTarget.style.background = dd.itemHover}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center',
                            gap: '14px', padding: '12px 14px', borderRadius: '14px',
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            transition: 'background 0.18s', textAlign: 'left',
                          }}
                        >
                          <span style={{ color: '#C9A84C', flexShrink: 0, display: 'flex' }}>
                            <IconUser />
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: dd.textMain }}>
                            Panel de Admin
                          </span>
                        </motion.button>
                      )}

                      {/* Modo Oscuro — con el ThemeToggle original */}
                      <div style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        gap: '14px', padding: '10px 14px', borderRadius: '14px',
                      }}>
                        <span style={{ color: dd.iconColor, flexShrink: 0, display: 'flex' }}>
                          <IconMoon />
                        </span>
                        <span style={{
                          flex: 1, fontSize: '14px', fontWeight: 500, color: dd.textMain,
                        }}>
                          {isDarkMode ? 'Modo Oscuro' : 'Modo Claro'}
                        </span>
                        {/* Toggle sol/luna original */}
                        <ThemeToggle />
                      </div>

                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', background: dd.divider, margin: '0 16px' }} />

                    {/* Cerrar sesión */}
                    <div style={{ padding: '6px 10px 10px' }}>
                      <motion.button
                        onClick={handleLogout}
                        whileHover={{ x: 2 }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,82,82,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center',
                          gap: '14px', padding: '12px 14px', borderRadius: '14px',
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          transition: 'background 0.18s', textAlign: 'left',
                        }}
                      >
                        <span style={{ color: '#E05252', flexShrink: 0, display: 'flex' }}>
                          <IconLogout />
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#E05252' }}>
                          Cerrar Sesión
                        </span>
                      </motion.button>
                    </div>

                    {/* Footer legal */}
                    <div style={{
                      padding: '10px 20px 16px',
                      borderTop: `1px solid ${dd.divider}`,
                      display: 'flex', justifyContent: 'center', gap: '12px',
                    }}>
                      {[
                        { label: 'Privacidad', to: '/privacy' },
                        { label: 'Términos',   to: '/terms'   },
                      ].map(({ label, to }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setShowProfileMenu(false)}
                          style={{
                            fontSize: '11px', color: dd.textMuted,
                            textDecoration: 'none', transition: 'color 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                          onMouseLeave={e => e.currentTarget.style.color = dd.textMuted}
                        >
                          {label}
                        </Link>
                      ))}
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
