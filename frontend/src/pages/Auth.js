import { useState } from "react";
import { Link } from "react-router-dom";

export default function Auth() {

  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-black flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md p-1 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 shadow-2xl">

        <div className="bg-white/6 backdrop-blur-md rounded-3xl p-10">

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-inner">
              <svg className="w-10 h-10 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-1">
            {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </h1>

          <p className="text-gray-300 text-center mb-6">
            {isLogin ? "Accede para gestionar propiedades y favoritos" : "Regístrate para empezar a publicar"}
          </p>

          <div className="space-y-4">

            {/* Social buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-white/10 text-white py-2 rounded-xl flex items-center justify-center gap-3 hover:bg-white/20 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.2c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.3.2 2.3.2v2.6h-1.3c-1.3 0-1.7.8-1.7 1.6V12H22z"/></svg>
                Iniciar con Google
              </button>
              <button className="w-12 bg-white/10 text-white py-2 rounded-xl flex items-center justify-center hover:bg-white/20 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.2c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.3.2 2.3.2v2.6h-1.3c-1.3 0-1.7.8-1.7 1.6V12H22z"/></svg>
              </button>
            </div>

            <form className="space-y-4" onSubmit={(e)=>e.preventDefault()}>

              {!isLogin && (
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Nombre</label>
                  <input value={name} onChange={e=>setName(e.target.value)} type="text" placeholder="Tu nombre" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30" />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-300 mb-2">Correo</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="correo@gmail.com" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30" />
              </div>

              <div className="relative">
                <label className="block text-sm text-gray-300 mb-2">Contraseña</label>
                <input value={password} onChange={e=>setPassword(e.target.value)} type={showPass?"text":"password"} placeholder="********" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30" />
                <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-9 text-gray-300 hover:text-white">
                  {showPass ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10 10 0 0 1 6.06 6.06"/><path d="M1 1l22 22"/></svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>

              <button type="submit" className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl hover:scale-[1.02] transition-all duration-200">
                {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              </button>

            </form>

            <div className="text-center mt-1">
              <p className="text-gray-300">{isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}</p>
              <button onClick={()=>setIsLogin(!isLogin)} className="mt-2 text-white font-semibold hover:text-gray-200 transition-colors">
                {isLogin ? "Registrarse" : "Iniciar Sesión"}
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="text-gray-400 hover:text-white text-sm">Volver al inicio</Link>
            </div>

          </div>

        </div>

      </div>

    </div>

  );
}