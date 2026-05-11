import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const properties = [
  {
    id: 1,
    title: "Casa Moderna con Piscina",
    location: "Bogotá, Colombia",
    price: "$850,000,000",
    beds: 4,
    baths: 3,
    area: "320 m²",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Apartamento en el Centro",
    location: "Medellín, Colombia",
    price: "$420,000,000",
    beds: 3,
    baths: 2,
    area: "180 m²",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Villa de Lujo Frente al Mar",
    location: "Cartagena, Colombia",
    price: "$1,500,000,000",
    beds: 5,
    baths: 4,
    area: "450 m²",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Penthouse Exclusivo",
    location: "Barranquilla, Colombia",
    price: "$980,000,000",
    beds: 4,
    baths: 4,
    area: "280 m²",
    image: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80"
  }
];

export default function Properties() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Nuestras Propiedades</h1>
            <p className="text-xl text-gray-600">Encuentra el espacio perfecto para tu estilo de vida</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {properties.map((prop) => (
              <div key={prop.id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="relative h-72">
                  <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-bold">
                    Destacado
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{prop.title}</h3>
                  <p className="text-gray-500 flex items-center gap-2 mb-6">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {prop.location}
                  </p>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-black text-gray-900">{prop.price}</span>
                  </div>
                  <div className="flex gap-4 py-6 border-t border-gray-100">
                    <div className="flex-1 text-center">
                      <span className="block text-xl font-bold text-gray-900">{prop.beds}</span>
                      <span className="text-sm text-gray-500 uppercase tracking-wider">Hab.</span>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="block text-xl font-bold text-gray-900">{prop.baths}</span>
                      <span className="text-sm text-gray-500 uppercase tracking-wider">Baños</span>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="block text-xl font-bold text-gray-900">{prop.area}</span>
                      <span className="text-sm text-gray-500 uppercase tracking-wider">Área</span>
                    </div>
                  </div>
                  <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors mt-4">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
