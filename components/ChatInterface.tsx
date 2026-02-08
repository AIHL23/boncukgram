
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getGeminiResponse } from '../services/geminiService';

interface ChatInterfaceProps {
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Selam! Ben Boncuk Danışmanı. Kuşun hakkında ne merak ediyorsun? İstersen bir fotoğrafını gönder, analiz edeyim!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const currentInput = input;
    const currentImage = selectedImage;

    const userMessage: ChatMessage = {
      role: 'user',
      text: currentInput,
      imageUrl: currentImage || undefined
    };

    // UI'da hemen göster
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const prompt = currentInput;
      // Mevcut mesajlar listesini geçmiş olarak gönder (son mesaj hariç çünkü onu ayrı yolluyoruz)
      const response = await getGeminiResponse(messages, prompt, currentImage || undefined);
      
      setMessages(prev => [...prev, { role: 'model', text: response || 'Üzgünüm, şu an yanıt veremiyorum.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Bir hata oluştu, lütfen tekrar dene.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white sm:my-4 sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header with improved Back Button */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-all group active:scale-95"
          >
            <i className="fa-solid fa-house text-lg"></i>
            <span className="font-bold text-sm hidden sm:inline">Ana Sayfaya Dön</span>
          </button>
          <div className="w-px h-6 bg-white/20 mx-2 hidden sm:block"></div>
          <div>
            <h3 className="font-black text-lg leading-tight">BONCUK AI</h3>
            <p className="text-[10px] font-bold text-green-200 uppercase tracking-widest">Sohbet Geçmişi Aktif</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold opacity-80">Uzman Modu</p>
            <p className="text-[10px] opacity-60">Fotoğraf Analizi Açık</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
            <i className="fa-solid fa-robot text-xl"></i>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm border ${
              m.role === 'user' 
              ? 'bg-green-600 text-white rounded-tr-none border-green-700' 
              : 'bg-white text-gray-800 rounded-tl-none border-gray-200'
            }`}>
              {m.imageUrl && (
                <div className="mb-3 overflow-hidden rounded-xl border-2 border-white/20 shadow-lg">
                  <img src={m.imageUrl} alt="Analysis" className="max-h-64 object-cover w-full" />
                </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed font-medium">{m.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-2 items-center">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-xs font-bold text-gray-400">Boncuk önceki mesajları hatırlıyor...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {selectedImage && (
        <div className="px-4 py-3 bg-yellow-50 border-t border-yellow-100 flex items-center justify-between animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={selectedImage} className="w-14 h-14 rounded-xl object-cover border-2 border-yellow-400 shadow-md" alt="Preview" />
              <div className="absolute -top-1 -right-1 bg-yellow-400 text-[10px] px-1 rounded-md font-bold text-yellow-900">FOTO</div>
            </div>
            <span className="text-sm font-bold text-yellow-800 tracking-tight">Kuşunuzu analiz etmeye hazır mısınız?</span>
          </div>
          <button 
            onClick={() => setSelectedImage(null)} 
            className="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleImageChange}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 text-gray-500 hover:text-green-600 hover:bg-green-50 hover:border-green-200 transition-all flex items-center justify-center text-xl group"
          title="Fotoğraf Ekle"
        >
          <i className="fa-solid fa-image group-hover:scale-110 transition-transform"></i>
        </button>
        
        <div className="flex-1 relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Mesajınızı buraya yazın..."
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <button 
          onClick={handleSend}
          disabled={isLoading || (!input.trim() && !selectedImage)}
          className="w-12 h-12 rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-lg hover:bg-green-700 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:grayscale disabled:scale-100 transition-all"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
