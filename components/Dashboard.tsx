
import React from 'react';
import { translations, LanguageCode } from '../translations';
import { GUIDES } from '../constants';
import { Guide } from '../types';

interface DashboardProps {
  onSeeAll?: () => void;
  onGuideClick?: (guide: Guide) => void;
  lang: LanguageCode;
}

const Dashboard: React.FC<DashboardProps> = ({ onSeeAll, onGuideClick, lang }) => {
  const t = translations[lang];

  // Dashboard'da gösterilecek olan rehberler (id'ye göre filtreleme yapabiliriz)
  const featuredGuides = GUIDES.filter(g => g.id === 'konusma' || g.id === 'tuy-dokumu');

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 pb-32">
      <section className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[2.5rem] p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">{t.welcome} 🐦</h2>
          <p className="opacity-90 font-medium leading-relaxed">
            {t.dashboard_desc}
          </p>
        </div>
        <i className="fa-solid fa-dove absolute -bottom-4 -right-4 text-9xl opacity-10 rotate-12"></i>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-100 p-5 rounded-[2rem] space-y-2">
          <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
            <i className="fa-solid fa-cloud-sun"></i>
          </div>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{t.weather}</p>
          <p className="text-blue-900 font-black text-lg">{t.room_temp}</p>
          <p className="text-blue-700 text-[10px] font-bold">{t.ideal_temp}</p>
        </div>
        <div className="bg-green-50 border border-green-100 p-5 rounded-[2rem] space-y-2">
          <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center text-white">
            <i className="fa-solid fa-heart-pulse"></i>
          </div>
          <p className="text-xs font-bold text-green-600 uppercase tracking-widest">{t.health_status}</p>
          <p className="text-green-900 font-black text-lg">{t.stable}</p>
          <p className="text-green-700 text-[10px] font-bold">{lang === 'tr' ? 'Durum mükemmel!' : 'Status perfect!'}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-black text-gray-800">{t.popular_guides}</h3>
          <button onClick={onSeeAll} className="text-xs font-bold text-orange-500 uppercase cursor-pointer hover:underline">
            {t.see_all}
          </button>
        </div>
        <div className="space-y-3">
          {featuredGuides.map((guide) => (
            <div 
              key={guide.id} 
              onClick={() => onGuideClick?.(guide)}
              className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-3xl hover:border-yellow-300 active:scale-[0.98] transition-all cursor-pointer shadow-sm group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${guide.id === 'konusma' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                <i className={`fa-solid ${guide.icon}`}></i>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">
                  {lang === 'tr' ? guide.title : (guide.id === 'konusma' ? 'First Word Training' : 'Handling Molting')}
                </h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase">AI Expert • {guide.likes} Likes</p>
              </div>
              <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-yellow-500 transition-colors"></i>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <span className="bg-yellow-400 text-black text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter">{t.bird_tip}</span>
          <p className="text-lg font-medium italic leading-relaxed">
            {lang === 'tr' 
              ? '"Muhabbet kuşları aynalardaki yansımalarını başka bir kuş sanabilirler. En iyisi gerçek bir arkadaş!"' 
              : '"Budgies might think their reflection is another bird. Best to have a real companion!"'}
          </p>
        </div>
        <i className="fa-solid fa-lightbulb absolute -top-8 -right-8 text-9xl opacity-5"></i>
      </div>
    </div>
  );
};

export default Dashboard;
