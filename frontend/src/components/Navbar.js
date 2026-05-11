import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const handleNavClick = (e, section) => {
    e.preventDefault();
    if (isHome) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.location.href = "/#" + section;
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 ${
      scrolled || !isHome 
        ? "bg-gray-900 shadow-lg py-4" 
        : "bg-black/50 backdrop-blur-md py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              Inmobiliaria
            </h1>
          </Link>

          <ul className="flex items-center gap-10">
            <li>
              <Link 
                to="/" 
                className="text-xl font-semibold text-white hover:text-gray-300 transition duration-300"
              >
                Inicio
              </Link>
            </li>
            <li>
              <a 
                href="#services" 
                onClick={(e) => handleNavClick(e, "services")}
                className="text-xl font-semibold text-white hover:text-gray-300 transition duration-300"
              >
                Servicios
              </a>
            </li>
            <li>
              <a 
                href="#properties" 
                onClick={(e) => handleNavClick(e, "properties")}
                className="text-xl font-semibold text-white hover:text-gray-300 transition duration-300"
              >
                Propiedades
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                onClick={(e) => handleNavClick(e, "about")}
                className="text-xl font-semibold text-white hover:text-gray-300 transition duration-300"
              >
                Nosotros
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                onClick={(e) => handleNavClick(e, "contact")}
                className="text-xl font-semibold text-white hover:text-gray-300 transition duration-300"
              >
                Contacto
              </a>
            </li>
            {user ? (
              <>
                <li className="text-xl font-semibold text-gray-200 ml-4">
                  Hola, {user.first_name || user.username}
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition duration-300 text-lg"
                  >
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-300 text-lg"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition duration-300 text-lg"
                  >
                    Registro
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
