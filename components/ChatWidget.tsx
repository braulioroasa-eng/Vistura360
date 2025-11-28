import React, { useState, useRef, useEffect } from 'react';
import { streamGeminiResponse } from '../services/geminiService';
import { ChatModelMode, ChatMessage } from '../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatModelMode>(ChatModelMode.STANDARD);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'init-1',
          role: 'model',
          text: "Bienvenido a Vistura360. ¿Buscas Rentar, Comprar o Vender una propiedad hoy?"
        }
      ]);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      // Create a placeholder message for the stream
      const responseId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: responseId, role: 'model', text: '', isThinking: mode === ChatModelMode.THINKING }]);

      const stream = await streamGeminiResponse(userText, mode, history);

      let fullText = '';
      
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === responseId ? { ...msg, text: fullText, isThinking: false } : msg
          )
        );
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "Lo siento, tengo problemas para conectarme a la red en este momento." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      <div 
        className={`pointer-events-auto bg-black border border-zinc-800 rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 overflow-hidden transition-all duration-300 origin-bottom-right transform ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 h-0'}`}
        style={{ maxHeight: '600px', display: isOpen ? 'flex' : 'none' }}
      >
        <div className="flex flex-col w-full h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-vistura-primary to-vistura-accent p-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold">Vistura AI</h3>
              <p className="text-xs text-white/90">Asistente de Propiedades</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Model Selector */}
          <div className="bg-zinc-900 border-b border-zinc-800 p-2 flex justify-center gap-2">
            <button 
              onClick={() => setMode(ChatModelMode.FAST)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${mode === ChatModelMode.FAST ? 'bg-vistura-accent text-white border-vistura-accent' : 'text-zinc-500 border-zinc-700 hover:border-zinc-500'}`}
            >
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Rápido
              </span>
            </button>
            <button 
              onClick={() => setMode(ChatModelMode.STANDARD)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${mode === ChatModelMode.STANDARD ? 'bg-vistura-primary text-white border-vistura-primary' : 'text-zinc-500 border-zinc-700 hover:border-zinc-500'}`}
            >
              Estándar
            </button>
            <button 
              onClick={() => setMode(ChatModelMode.THINKING)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${mode === ChatModelMode.THINKING ? 'bg-purple-600 text-white border-purple-600' : 'text-zinc-500 border-zinc-700 hover:border-zinc-500'}`}
            >
               <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                Pensando
              </span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900/50 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-vistura-primary text-white rounded-br-none shadow-lg shadow-blue-900/20' 
                      : 'bg-zinc-800 text-gray-200 rounded-bl-none border border-zinc-700'
                  }`}
                >
                  {msg.isThinking ? (
                    <div className="flex items-center gap-2 text-vistura-accent">
                      <div className="animate-spin h-3 w-3 border-2 border-vistura-accent border-t-transparent rounded-full"></div>
                      <span className="text-xs font-semibold uppercase tracking-wider">Razonando...</span>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-black border-t border-zinc-800">
            <div className="relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pregunta sobre propiedades..."
                className="w-full bg-zinc-900 text-white pl-4 pr-12 py-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-vistura-primary focus:ring-1 focus:ring-vistura-primary placeholder-zinc-500 text-sm transition-colors"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-vistura-primary rounded-lg text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-vistura-primary hover:bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-500/30 transition-transform duration-200 hover:scale-105 active:scale-95 group relative"
      >
        {!isOpen ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        )}
        
        {/* Notification Dot */}
        {!isOpen && messages.length === 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vistura-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-vistura-accent"></span>
            </span>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;