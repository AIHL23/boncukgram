
import React, { useState, useEffect } from 'react';
import { AppState, Guide } from './types';
import Dashboard from './components/Dashboard';
import LoginOverlay from './components/LoginOverlay';
import ToolsGrid from './components/ToolsGrid';
import MoodAnalyzer from './components/MoodAnalyzer';
import LiveCall from './components/LiveCall';
import Settings from './components/Settings';
import GuideDetail from './components/GuideDetail';
import { translations, LanguageCode } from './translations';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOCKED);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [lang, setLang] = useState<LanguageCode>(() => {
    return (localStorage.getItem('boncuk_lang') as LanguageCode) || 'tr';
  });

  const t = translations[lang] || translations.tr;

  useEffect(() => {
    if (localStorage.getItem('boncuk_unlocked') === 'true') {
      setAppState(AppState.HOME);
    }
  }, []);

  const handleUnlock = () => {
    localStorage.setItem('boncuk_unlocked', 'true');
    setAppState(AppState.HOME);
  };

  const handleReset = () => {
    localStorage.removeItem('boncuk_unlocked');
    setAppState(AppState.LOCKED);
  };

  const handleLangChange = (newLang: LanguageCode) => {
    setLang(newLang);
    localStorage.setItem('boncuk_lang', newLang);
  };

  const handleGuideOpen = (guide: Guide) => {
    setSelectedGuide(guide);
    setAppState(AppState.GUIDE_DETAIL);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.HOME: 
        return <Dashboard onSeeAll={() => setAppState(AppState.TOOLS)} onGuideClick={handleGuideOpen} lang={lang} />;
      case AppState.TOOLS: 
        return <ToolsGrid lang={lang} />;
      case AppState.MOOD_ANALYZER: 
        return <MoodAnalyzer onBack={() => setAppState(AppState.HOME)} />;
      case AppState.LIVE: 
        return <LiveCall onBack={() => setAppState(AppState.HOME)} />;
      case AppState.SETTINGS: 
        return (
          <Settings 
            onBack={() => setAppState(AppState.HOME)} 
            onReset={handleReset} 
            currentLang={lang} 
            onLangChange={handleLangChange}
          />
        );
      case AppState.GUIDE_DETAIL: 
        return selectedGuide ? <GuideDetail guide={selectedGuide} onBack={() => setAppState(AppState.HOME)} /> : null;
      default: 
        return <Dashboard onSeeAll={() => setAppState(AppState.TOOLS)} onGuideClick={handleGuideOpen} lang={lang} />;
    }
  };

  if (appState === AppState.LOCKED) return <LoginOverlay onUnlock={handleUnlock} />;

  return (
    <div className="min-h-screen bg-white pb-28 select-none">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <div 
          className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
          onClick={() => setAppState(AppState.HOME)}
        >
           <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-white shadow-sm">
             <i className="fa-solid fa-dove"></i>
           </div>
           <h1 className="text-xl font-black tracking-tighter text-gray-900">Boncuk AI</h1>
        </div>
        <div className="flex gap-5 text-gray-400 items-center">
          <button 
            onClick={() => setAppState(AppState.SETTINGS)}
            className={`transition-colors hover:text-gray-900 ${appState === AppState.SETTINGS ? 'text-gray-900' : ''}`}
          >
            <i className="fa-solid fa-gear text-xl"></i>
          </button>
        </div>
      </header>

      <main>{renderContent()}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-gray-100 px-2 py-5 flex justify-around items-center z-[100] shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setAppState(AppState.HOME)} 
          className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${appState === AppState.HOME ? 'text-yellow-500' : 'text-gray-300'}`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${appState === AppState.HOME ? 'bg-yellow-50' : ''}`}>
            <i className="fa-solid fa-house text-lg"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">{t.home}</span>
        </button>
        
        <button 
          onClick={() => setAppState(AppState.TOOLS)} 
          className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${appState === AppState.TOOLS ? 'text-blue-500' : 'text-gray-300'}`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${appState === AppState.TOOLS ? 'bg-blue-50' : ''}`}>
            <i className="fa-solid fa-shapes text-lg"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">{t.library}</span>
        </button>

        <button 
          onClick={() => setAppState(AppState.MOOD_ANALYZER)} 
          className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${appState === AppState.MOOD_ANALYZER ? 'text-orange-500' : 'text-gray-300'}`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${appState === AppState.MOOD_ANALYZER ? 'bg-orange-50' : ''}`}>
            <i className="fa-solid fa-magnifying-glass-chart text-lg"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">{t.mood}</span>
        </button>

        <button 
          onClick={() => setAppState(AppState.LIVE)} 
          className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${appState === AppState.LIVE ? 'text-red-500' : 'text-gray-300'}`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${appState === AppState.LIVE ? 'bg-red-50' : ''}`}>
            <i className="fa-solid fa-video text-lg"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">{t.live_ai}</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
