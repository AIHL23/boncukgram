
import React, { useState } from 'react';
import { translations, LanguageCode } from '../translations';

interface SettingsProps {
  onBack: () => void;
  onReset: () => void;
  currentLang: LanguageCode;
  onLangChange: (lang: LanguageCode) => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack, onReset, currentLang, onLangChange }) => {
  const t = translations[currentLang];
  
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('boncuk_user_name') || (currentLang === 'tr' ? 'Boncuk Dostu' : 'Bird Friend');
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName);
      localStorage.setItem('boncuk_user_name', tempName);
      setIsEditingName(false);
    }
  };

  const supportContent: Record<string, { title: string, content: string }> = {
    [t.about]: {
      title: t.about,
      content: currentLang === 'tr' 
        ? 'Boncukgram, muhabbet kuşu sahiplerinin kuşlarını daha iyi anlaması için geliştirilmiş bir platformdur.' 
        : 'Boncukgram is a platform developed for bird owners to understand their birds better.'
    },
    [t.terms]: {
      title: t.terms,
      content: currentLang === 'tr'
        ? 'Bu uygulama eğitim amaçlıdır. Veteriner tavsiyesi yerine geçmez.'
        : 'This app is for educational purposes. It does not replace veterinary advice.'
    },
    [t.privacy]: {
      title: t.privacy,
      content: currentLang === 'tr'
        ? 'Verileriniz yerel olarak saklanır. Gizliliğiniz bizim için önemlidir.'
        : 'Your data is stored locally. Your privacy is important to us.'
    },
    [t.contact]: {
      title: t.contact,
      content: 'Instagram: @boncugundunyasi2 | E-mail: boncukgram@gmail.com'
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right duration-300 pb-32">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:scale-90 transition-all">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{t.settings}</h2>
      </div>

      <div className="space-y-6">
        <section className="bg-gray-50 rounded-[2.5rem] p-6 space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">{t.profile_settings}</h3>
          <div className="bg-white rounded-3xl p-4 flex items-center gap-4 border border-gray-100">
            <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-white text-2xl shadow-sm">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="flex-1 overflow-hidden">
              {isEditingName ? (
                <div className="flex gap-2 w-full">
                  <input 
                    type="text" 
                    value={tempName} 
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full bg-white border-2 border-yellow-400 rounded-xl px-3 py-1.5 text-base font-bold text-gray-900 focus:outline-none shadow-inner"
                    autoFocus
                  />
                  <button onClick={handleSaveName} className="text-green-500 text-xl px-2"><i className="fa-solid fa-check"></i></button>
                </div>
              ) : (
                <div className="truncate">
                  <h4 className="font-bold text-gray-800 text-lg leading-tight">{userName}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {Math.floor(Math.random() * 99999)}</p>
                </div>
              )}
            </div>
            {!isEditingName && (
              <button 
                onClick={() => setIsEditingName(true)}
                className="text-xs font-black text-yellow-600 uppercase bg-yellow-50 px-3 py-2.5 rounded-xl hover:bg-yellow-100 transition-colors whitespace-nowrap"
              >
                {t.edit}
              </button>
            )}
          </div>
        </section>

        <section className="bg-gray-50 rounded-[2.5rem] p-6 space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">{t.preferences}</h3>
          
          <div className="bg-white rounded-3xl p-5 flex items-center justify-between border border-gray-100 relative group overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-language"></i>
              </div>
              <span className="font-bold text-gray-700">{t.app_language}</span>
            </div>
            <select 
              value={currentLang}
              onChange={(e) => onLangChange(e.target.value as LanguageCode)}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            >
              <option value="tr">Türkçe (TR)</option>
              <option value="en">English (EN)</option>
              <option value="de">Deutsch (DE)</option>
            </select>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-gray-400 uppercase">{currentLang}</span>
              <i className="fa-solid fa-chevron-down text-[10px] text-gray-300"></i>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 rounded-[2.5rem] p-6 space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">{t.support}</h3>
          <div className="space-y-2">
            {Object.keys(supportContent).map((item, i) => (
              <button 
                key={i} 
                onClick={() => setActiveModal(item)}
                className="w-full bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-100 hover:border-yellow-200 transition-colors"
              >
                <span className="font-bold text-gray-600">{item}</span>
                <i className="fa-solid fa-chevron-right text-gray-200 text-xs"></i>
              </button>
            ))}
          </div>
        </section>

        <section className="p-2 space-y-4">
          <button 
            onClick={() => { if(confirm(currentLang === 'tr' ? 'Veriler temizlensin mi?' : 'Clear all data?')) onReset(); }}
            className="w-full py-5 rounded-3xl border-2 border-red-100 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-50 transition-colors flex items-center justify-center gap-3"
          >
            <i className="fa-solid fa-power-off"></i>
            {t.logout}
          </button>
        </section>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 space-y-6 shadow-2xl scale-in-center">
            <div className="flex justify-between items-center border-b border-gray-50 pb-4">
              <h4 className="text-xl font-black text-gray-900">{supportContent[activeModal].title}</h4>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-black"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <p className="text-gray-600 leading-relaxed font-medium">
              {supportContent[activeModal].content}
            </p>
            <button 
              onClick={() => setActiveModal(null)}
              className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
            >
              {t.understand}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
