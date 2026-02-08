
import React, { useRef, useState, useEffect } from 'react';
import { analyzeMoodFromFrames } from '../services/geminiService';

const MoodAnalyzer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<string[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode } 
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Kamera başlatılamadı:", err);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const startAnalysis = () => {
    setIsRecording(true);
    setProgress(0);
    framesRef.current = [];
    setResult(null);

    const interval = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        canvasRef.current.width = 320;
        canvasRef.current.height = 240;
        ctx?.drawImage(videoRef.current, 0, 0, 320, 240);
        framesRef.current.push(canvasRef.current.toDataURL('image/jpeg', 0.5));
      }
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          finishRecording();
          return 100;
        }
        return p + (100 / 6); // 6 saniye
      });
    }, 1000);
  };

  const finishRecording = async () => {
    setIsRecording(false);
    setIsLoading(true);
    try {
      const analysis = await analyzeMoodFromFrames(framesRef.current);
      setResult(analysis);
    } catch (e) {
      setResult("Analiz sırasında bir hata oluştu. Lütfen tekrar dene.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[150] flex flex-col p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-white text-3xl transition-transform active:scale-90"><i className="fa-solid fa-chevron-left"></i></button>
        <h2 className="text-white font-black text-xl tracking-tight">Mood Analyzer</h2>
        <button onClick={toggleCamera} className="text-white text-2xl p-2 bg-white/10 rounded-full transition-transform active:scale-90">
          <i className="fa-solid fa-camera-rotate"></i>
        </button>
      </div>

      <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border-2 border-white/20 shadow-2xl mb-6 bg-gray-900">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        
        {isRecording && (
          <div className="absolute top-6 right-6 flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full text-white font-bold animate-pulse shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full"></div> REC
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div className="bg-yellow-400 h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-white/70 text-[10px] font-bold mt-2 text-center uppercase tracking-widest">Kuşunun hareketlerini 6 saniye boyunca kaydet</p>
        </div>
      </div>

      {!isRecording && !isLoading && !result && (
        <button onClick={startAnalysis} className="w-full bg-yellow-400 text-black py-5 rounded-3xl font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
          HALİNİ SORGULA (6sn)
        </button>
      )}

      {isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-bold animate-pulse">AI Görüntüleri Kare Kare Analiz Ediyor...</p>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-[2rem] p-8 animate-in slide-in-from-bottom duration-500 mb-20 shadow-2xl">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
            <i className="fa-solid fa-brain text-purple-600"></i> Analiz Sonucu
          </h3>
          <p className="text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">{result}</p>
          <button onClick={() => setResult(null)} className="mt-8 w-full bg-gray-100 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors">Yeni Analiz Yap</button>
        </div>
      )}
    </div>
  );
};

export default MoodAnalyzer;
