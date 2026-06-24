import React from 'react';

const ChatMessage = ({ message }) => {
  const isBot = message.type === 'bot';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-fadeIn`}>
      <div className={`max-w-[80%] p-3 rounded-2xl shadow-lg ${
        isBot 
          ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-tl-none' 
          : 'bg-gradient-to-r from-[#003366] to-[#001a33] text-white border border-blue-400/30 rounded-tr-none'
      }`}>
        <div className="flex items-center mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
            {isBot ? 'LuxHabitat AI' : 'Tú'}
          </span>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.text}
        </p>
        
        {isBot && message.data && message.data.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.data.map((item, idx) => (
              <div key={idx} className="p-2 bg-black/30 rounded-lg border border-gold/20 hover:border-gold/50 transition-colors cursor-pointer">
                <p className="text-xs font-semibold text-gold-400">{item.titulo}</p>
                <p className="text-[10px] opacity-70">${item.precio.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
        
        <span className="text-[9px] opacity-40 block mt-1 text-right">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
