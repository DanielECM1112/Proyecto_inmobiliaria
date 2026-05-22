import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { MdWbSunny, MdNightlightRound } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowProfileMenu(false);
    navigate("/");
  };

  const navLinks = [
    { name: "INICIO", path: "/" },
    { name: "PROPIEDADES", path: "/properties" },
    { name: "PUBLICA TU PROPIEDAD", path: "/publish" },
    { name: "UBICACIÓN", path: "/location" },
    { name: "NOSOTROS", path: "/about" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 backdrop-blur-2xl ${
      scrolled || !isHome 
        ? isDarkMode
          ? "bg-gradient-to-r from-primary-dark via-blue-950/30 to-primary-dark border-b border-white/5 shadow-2xl shadow-black/20 py-4"
          : "bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200/50 shadow-xl shadow-slate-400/5 py-4"
        : "bg-gradient-to-b from-black/50 via-black/20 to-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center group gap-3 flex-shrink-0">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 ${
              scrolled || !isHome 
                ? "bg-blue-600 shadow-lg shadow-blue-500/20" 
                : "bg-white/20 backdrop-blur-md border border-white/30"
            }`}>
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h1 className={`text-2xl lg:text-3xl font-serif font-bold tracking-tight group-hover:translate-x-1 transition-all duration-300 ${
              scrolled || !isHome 
                ? isDarkMode ? "text-white" : "text-slate-900" 
                : "text-white"
            }`}>
              LUX<span className={`${
                scrolled || !isHome 
                  ? isDarkMode ? "text-blue-500" : "text-blue-600" 
                  : "text-gray-300"
              } font-light transition-colors duration-500`}>HABITAT</span>
            </h1>
          </Link>

          <div className="flex items-center gap-2 md:gap-8">
            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className={`text-xs font-bold tracking-widest transition-all duration-300 pb-2 border-b-2 ${
                      scrolled || !isHome
                        ? isDarkMode
                          ? location.pathname === link.path 
                            ? "text-blue-500 border-blue-500" 
                            : "text-gray-400 border-transparent hover:text-blue-400 hover:border-blue-400/50"
                          : location.pathname === link.path
                            ? "text-blue-600 border-blue-600"
                            : "text-slate-600 border-transparent hover:text-blue-600 hover:border-blue-600/50"
                        : location.pathname === link.path
                          ? "text-white border-white"
                          : "text-gray-200 border-transparent hover:text-white hover:border-gray-300"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* THEME TOGGLE - Premium Design */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-3 rounded-full transition-all duration-300 group overflow-hidden ${
                scrolled || !isHome
                  ? isDarkMode
                    ? "bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-blue-400 hover:shadow-lg hover:shadow-blue-500/20 border border-blue-500/30 shadow-md"
                    : "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 hover:shadow-lg hover:shadow-blue-200/50 border border-blue-200 shadow-md hover:border-blue-300"
                  : "bg-white/20 backdrop-blur-md text-white hover:bg-white/30 hover:shadow-xl border border-white/30 shadow-lg"
              }`}
              title={isDarkMode ? "Cambiar a modo claro (SOL)" : "Cambiar a modo oscuro (LUNA)"}
              aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {/* Animated background glow */}
              <motion.div
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  isDarkMode 
                    ? "bg-blue-500/0 group-hover:bg-blue-500/10" 
                    : "bg-blue-500/0 group-hover:bg-blue-400/5"
                }`}
                animate={{ scale: isDarkMode ? 1 : 1 }}
              />
              
              <motion.div
                key={isDarkMode ? 'dark' : 'light'}
                initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 10 }}
                className="relative z-10"
              >
                {isDarkMode ? 
                  <MdWbSunny className="text-2xl" /> 
                  : 
                  <MdNightlightRound className="text-2xl" />
                }
              </motion.div>
            </motion.button>

            {/* Profile / Login / Register */}
            <div className="relative" ref={menuRef}>
              <motion.button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500 border-2 overflow-hidden font-semibold ${
                  scrolled || !isHome
                    ? isDarkMode
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                      : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-900"
                    : "bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30 text-white"
                }`}
              >
                {user ? (
                  <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg uppercase">
                    {user.username?.[0] || 'U'}
                  </div>
                ) : (
                  <FaUserCircle className="text-2xl" />
                )}
              </motion.button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className={`absolute right-0 mt-4 w-72 rounded-2xl shadow-2xl border p-5 z-50 overflow-hidden backdrop-blur-xl transition-all duration-500 ${
                      isDarkMode
                        ? "bg-midnight-DEFAULT/98 border-white/10 shadow-black/40"
                        : "bg-white/98 border-slate-200 shadow-slate-300/20"
                    }`}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                    {user ? (
                      <div className="space-y-2">
                        <div className={`px-4 py-4 border-b ${
                          isDarkMode ? "border-white/5" : "border-slate-200/50"
                        }`}>
                          <p className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${
                            isDarkMode ? "text-gray-500" : "text-slate-500"
                          }`}>
                            Bienvenido
                          </p>
                          <p className={`text-lg font-bold truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            {user.first_name} {user.last_name}
                          </p>
                          <p className={`text-xs truncate mt-1 ${isDarkMode ? "text-gray-400" : "text-slate-600"}`}>
                            {user.email}
                          </p>
                        </div>
                        <motion.button 
                          onClick={() => { navigate('/admin'); setShowProfileMenu(false); }}
                          whileHover={{ x: 4, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.05)' }}
                          className={`w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                            isDarkMode
                              ? "text-gray-300"
                              : "text-slate-800"
                          }`}
                        >
                          🔧 Panel Admin
                        </motion.button>
                        <motion.button 
                          onClick={handleLogout}
                          whileHover={{ x: 4, backgroundColor: 'rgba(239,68,68,0.1)' }}
                          className="w-full text-left px-4 py-3 text-sm font-bold rounded-xl text-red-500 transition-all duration-300"
                        >
                          🚪 Cerrar Sesión
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <motion.button 
                          onClick={() => { navigate('/login'); setShowProfileMenu(false); }}
                          whileHover={{ scale: 1.02 }}
                          className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20"
                        >
                          Iniciar Sesión
                        </motion.button>
                        <motion.button 
                          onClick={() => { navigate('/register'); setShowProfileMenu(false); }}
                          whileHover={{ scale: 1.02 }}
                          className={`w-full py-4 rounded-xl font-bold text-sm border transition-all duration-300 ${
                            isDarkMode 
                              ? "border-white/10 text-white hover:bg-white/5" 
                              : "border-slate-300 text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          Registrarse
                        </motion.button>
                      </div>
                    )}
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
