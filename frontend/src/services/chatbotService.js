import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const chatbotService = {
  getProperties: async (filters = {}) => {
    try {
      const response = await axios.get(`${API_URL}/properties/`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching properties for chatbot:', error);
      throw error;
    }
  },

  getPlanes: async () => {
    try {
      const response = await axios.get(`${API_URL}/plans/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching planes for chatbot:', error);
      throw error;
    }
  },

  processMessage: async (message, properties = [], planes = []) => {
    const msg = message.toLowerCase();
    
    // Simular retraso de escritura
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Saludos
    if (msg.includes('hola') || msg.includes('buenos días') || msg.includes('buenas tardes')) {
      return {
        text: '¡Hola! Bienvenido a LUXHABITAT. Soy tu asistente virtual de lujo. ¿En qué puedo ayudarte hoy?',
        type: 'bot'
      };
    }

    // Despedidas
    if (msg.includes('adiós') || msg.includes('chao') || msg.includes('gracias')) {
      return {
        text: 'Ha sido un placer ayudarte. En LUXHABITAT estamos para servirte. ¡Que tengas un excelente día!',
        type: 'bot'
      };
    }

    // Planes y precios
    if (msg.includes('plan') || msg.includes('precio') || msg.includes('costo') || msg.includes('pagar')) {
      if (planes.length > 0) {
        const planesList = planes.map(p => `- ${p.name}: $${p.price} (${p.max_properties} inmuebles)`).join('\n');
        return {
          text: `Contamos con excelentes planes para ti:\n${planesList}\n\n¿Te gustaría saber más sobre alguno en específico?`,
          type: 'bot'
        };
      }
      return {
        text: 'Ofrecemos diversos planes: Básico, Profesional y Premium, diseñados para cubrir todas tus necesidades inmobiliarias. Puedes verlos en la sección de planes.',
        type: 'bot'
      };
    }

    // Búsqueda de propiedades
    if (msg.includes('casa') || msg.includes('apartamento') || msg.includes('propiedad') || msg.includes('inmueble') || msg.includes('buscar') || msg.includes('mostrar') || msg.includes('en')) {
      
      let filtered = [...properties];
      
      // Filtrar por tipo
      if (msg.includes('casa')) filtered = filtered.filter(p => p.tipo.toLowerCase() === 'casa');
      if (msg.includes('apartamento')) filtered = filtered.filter(p => p.tipo.toLowerCase() === 'apartamento');
      
      // Filtrar por ciudad (asumiendo que la ciudad se menciona después de "en")
      const words = msg.split(' ');
      const enIndex = words.indexOf('en');
      if (enIndex !== -1 && enIndex < words.length - 1) {
        const ciudad = words[enIndex + 1];
        filtered = filtered.filter(p => p.ciudad.toLowerCase().includes(ciudad));
      }

      // Filtrar por habitaciones
      const roomMatch = msg.match(/(\d+)\s+habitaci/);
      if (roomMatch) {
        const rooms = parseInt(roomMatch[1]);
        filtered = filtered.filter(p => p.habitaciones === rooms);
      }

      // Filtrar por "barato" o "económico"
      if (msg.includes('barato') || msg.includes('económico')) {
        filtered = filtered.sort((a, b) => a.precio - b.precio);
      }
      
      // Filtrar por "premium" o "lujo"
      if (msg.includes('premium') || msg.includes('lujo')) {
        filtered = filtered.filter(p => p.plan_nombre?.toLowerCase() === 'premium' || p.precio > 500000000);
      }

      if (filtered.length > 0) {
        const count = filtered.length;
        const results = filtered.slice(0, 3).map(p => 
          `🏠 ${p.titulo}\n📍 ${p.ciudad}\n💰 $${p.precio.toLocaleString()}\n🛏️ ${p.habitaciones} Hab`
        ).join('\n\n');
        
        return {
          text: `He encontrado ${count} propiedades que coinciden con tu búsqueda. Aquí tienes las mejores opciones:\n\n${results}\n\n¿Deseas ver más detalles de alguna?`,
          type: 'bot',
          data: filtered.slice(0, 3)
        };
      } else {
        return {
          text: 'Lo siento, no encontré propiedades con esos criterios específicos en este momento. ¿Te gustaría intentar con otra ciudad o tipo de propiedad?',
          type: 'bot'
        };
      }
    }

    // Contacto
    if (msg.includes('contacto') || msg.includes('teléfono') || msg.includes('llamar') || msg.includes('escribir')) {
      return {
        text: 'Puedes contactarnos a través de nuestro WhatsApp +57 300 123 4567 o enviarnos un mensaje en la sección de Contacto. Estaremos encantados de atenderte.',
        type: 'bot'
      };
    }

    // Ubicación
    if (msg.includes('donde') || msg.includes('ubicación') || msg.includes('oficina') || msg.includes('dirección')) {
      return {
        text: 'Nuestra oficina principal se encuentra en el sector más exclusivo de la ciudad. También operamos digitalmente en todo el país.',
        type: 'bot'
      };
    }

    // Ayuda genérica
    return {
      text: 'Soy el asistente de LUXHABITAT. Puedo ayudarte a buscar propiedades (ej: "casas en Ibagué"), informarte sobre nuestros planes de publicación o darte información de contacto. ¿Qué necesitas?',
      type: 'bot'
    };
  }
};

export default chatbotService;
