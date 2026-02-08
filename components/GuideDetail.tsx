
import React from 'react';
import { Guide } from '../types';

interface GuideDetailProps {
  guide: Guide;
  onBack: () => void;
}

const GuideDetail: React.FC<GuideDetailProps> = ({ guide, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 pb-32 animate-in slide-in-from-right duration-300">
      <button 
        onClick={onBack}
        className="mb-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:scale-90 transition-all"
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 space-y-6">
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-sm ${guide.id === 'konusma' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
            <i className={`fa-solid ${guide.icon}`}></i>
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">{guide.title}</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Rehber • {guide.likes} Kişi Beğendi</p>
          </div>
        </div>
        
        <div className="h-0.5 w-full bg-gray-50 rounded-full"></div>
        
        <p className="text-lg text-gray-500 italic font-medium leading-relaxed">
          {guide.description}
        </p>

        <div className="prose prose-lg text-gray-700 pt-2">
          <p className="whitespace-pre-wrap leading-loose font-medium">
            {guide.content}
          </p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-3xl border border-yellow-100 mt-12 flex items-start gap-4">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-white flex-shrink-0">
            <i className="fa-solid fa-lightbulb"></i>
          </div>
          <div>
            <h4 className="font-bold text-yellow-900 mb-1">Boncuk'un Altın Kuralı</h4>
            <p className="text-yellow-800 text-sm font-medium">Bu süreçte kuşuna ödül maması vermeyi ve her başarıyı sevgiyle karşılamayı unutma!</p>
          </div>
        </div>

        <button 
          onClick={onBack}
          className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all mt-4"
        >
          Tamam, Anladım
        </button>
      </div>
    </div>
  );
};

export default GuideDetail;
