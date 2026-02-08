
import React from 'react';
import { translations, LanguageCode } from '../translations';

interface NotificationsProps {
  onBack: () => void;
  lang: LanguageCode;
}

const Notifications: React.FC<NotificationsProps> = ({ onBack, lang }) => {
  const t = translations[lang];

  const NOTIFICATIONS_DATA = [
    {
      id: 1,
      title: lang === 'tr' ? 'Su Tazeleme Zamanı! 💧' : 'Water Refresh Time! 💧',
      message: lang === 'tr' ? 'Boncuk\'un suyunu kontrol etme vakti.' : 'Time to check the water bowl.',
      time: lang === 'tr' ? 'Şimdi' : 'Now',
      isNew: true,
      icon: 'fa-droplet',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      title: lang === 'tr' ? 'Haftalık Özet 📊' : 'Weekly Summary 📊',
      message: lang === 'tr' ? 'Kuşun bu hafta çok mutluydu!' : 'Your bird was very happy this week!',
      time: '5h',
      isNew: false,
      icon: 'fa-chart-line',
      color: 'bg-green-100 text-green-600'
    }
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 animate-in slide-in-from-left duration-300 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:scale-90 transition-all">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{t.notifications}</h2>
        </div>
        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">{t.all_read}</button>
      </div>

      <div className="space-y-4">
        {NOTIFICATIONS_DATA.map((noti) => (
          <div 
            key={noti.id} 
            className={`p-5 rounded-[2rem] border transition-all cursor-pointer flex gap-4 items-start ${
              noti.isNew ? 'bg-white border-yellow-200 shadow-lg shadow-yellow-400/5' : 'bg-gray-50 border-gray-100 opacity-70'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl ${noti.color}`}>
              <i className={`fa-solid ${noti.icon}`}></i>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-900 leading-tight">{noti.title}</h4>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{noti.time}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{noti.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 rounded-[2.5rem] p-8 text-center space-y-3">
        <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto flex items-center justify-center text-white text-2xl shadow-lg">
          <i className="fa-solid fa-check"></i>
        </div>
        <h3 className="text-xl font-bold text-yellow-900">{t.everything_ok}</h3>
      </div>
    </div>
  );
};

export default Notifications;
