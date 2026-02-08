
import React, { useState } from 'react';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from '../constants';

interface LoginOverlayProps {
  onUnlock: () => void;
}

const LoginOverlay: React.FC<LoginOverlayProps> = ({ onUnlock }) => {
  const [hasClickedFollow, setHasClickedFollow] = useState(false);

  const handleFollowClick = () => {
    window.open(INSTAGRAM_URL, '_blank');
    setHasClickedFollow(true);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-yellow-300 via-green-200 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center space-y-6 transform animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-yellow-400">
              <i className="fa-solid fa-dove text-5xl text-yellow-600"></i>
            </div>
            <div className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
              <i className="fa-solid fa-lock text-xs"></i>
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-yellow-900 leading-tight">Boncuk'un Dünyasına Hoş Geldin!</h2>
        <p className="text-gray-600 text-sm">
          Sitemize giriş yapabilmek için <strong>@{INSTAGRAM_HANDLE}</strong> sayfamızı takip etmen gerekiyor. Takip ettikten sonra tüm özellikler açılacaktır.
        </p>

        <div className="space-y-4">
          <button 
            onClick={handleFollowClick}
            className={`flex items-center justify-center gap-3 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-all text-lg ${hasClickedFollow ? 'ring-4 ring-green-400' : ''}`}
          >
            <i className="fa-brands fa-instagram text-2xl"></i>
            Instagram'da Takip Et
          </button>

          <button 
            onClick={onUnlock}
            disabled={!hasClickedFollow}
            className={`w-full font-bold py-4 rounded-xl shadow-md transition-all text-lg ${
              hasClickedFollow 
              ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer translate-y-0' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed grayscale'
            }`}
          >
            {hasClickedFollow ? 'Takip Ettim, İçeri Gir! ✅' : 'Önce Takip Etmelisin'}
          </button>
        </div>

        <p className="text-xs text-gray-400 italic">
          Giriş yaptıktan sonra bu cihazda bir daha bu ekranı görmeyeceksin.
        </p>
      </div>
    </div>
  );
};

export default LoginOverlay;
