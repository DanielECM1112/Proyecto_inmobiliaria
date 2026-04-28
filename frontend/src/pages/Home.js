import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-6">
          ¡Bienvenido a Tu Próximo Hogar! 🏠
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          En nuestra Inmobiliaria, hacemos que encontrar la casa de tus sueños sea una experiencia bien bacana. 
          Explora las mejores propiedades con la confianza y el respaldo que te mereces.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-blue-600 mb-2">Venta</h3>
            <p className="text-gray-500">Encuentra casas, apartamentos y más.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-blue-600 mb-2">Alquiler</h3>
            <p className="text-gray-500">Opciones flexibles para cada estilo de vida.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-blue-600 mb-2">Asesoría</h3>
            <p className="text-gray-500">Te acompañamos en todo el proceso.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
