import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
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
    { name: "UBICACIÓN", path: "/location" },
    { name: "NOSOTROS", path: "/about" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled || !isHome 
        ? "bg-gray-900 shadow-2xl py-4" 
        : "bg-black/20 backdrop-blur-md py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center group gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-inner transform group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-8 h-8 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter group-hover:translate-x-1 transition-transform">
              LUX<span className="text-gray-400">HABITAT</span>
            </h1>
          </Link>

          <div className="flex items-center gap-12">
            <ul className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className={`text-sm font-bold tracking-widest transition-all duration-300 hover:text-white ${
                      location.pathname === link.path ? "text-white border-b-2 border-white pb-1" : "text-gray-300"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Perfil / Login / Registro */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/20 overflow-hidden"
              >
                {user ? (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white font-bold text-xl uppercase">
                    {user.username[0]}
                  </div>
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </button>

              {/* Menú Desplegable */}
              <div className={`absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl py-4 transition-all duration-300 transform origin-top-right ${
                showProfileMenu ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}>
                {user ? (
                  <>
                    <div className="px-6 py-4 border-b border-gray-100 mb-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Usuario</p>
                      <p className="text-gray-900 font-bold truncate">{user.first_name || user.username}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-6 py-3 text-red-600 font-bold hover:bg-red-50 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      onClick={() => setShowProfileMenu(false)}
                      className="block px-6 py-4 text-gray-900 font-bold hover:bg-gray-50 transition-colors"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setShowProfileMenu(false)}
                      className="block px-6 py-4 text-gray-900 font-bold hover:bg-gray-50 transition-colors"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
