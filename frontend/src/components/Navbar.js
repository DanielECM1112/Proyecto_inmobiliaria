import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-20 bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">
          Inmobiliaria
        </h1>

        <ul className="flex gap-6 text-white font-medium">
          <li>
            <Link to="/" className="hover:text-blue-400 transition">
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/registro"
              className="border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition"
            >
              Registro
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
