
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { encode, decode, decodeAudioData } from '../services/geminiService';

interface LiveCallProps {
  onBack: () => void;
}

const LiveCall: React.FC<LiveCallProps> = ({ onBack }) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [statusText, setStatusText] = useState('SİSTEM HAZIR');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isLoading, setIsLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const outAudioCtxRef = useRef<AudioContext | null>(null);
  const frameIntervalRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);

  const cleanup = () => {
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    if (sessionRef.current) try { sessionRef.current.close(); } catch(e){}
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    if (outAudioCtxRef.current) outAudioCtxRef.current.close().catch(() => {});
    setSessionActive(false);
    setIsLoading(false);
  };

  const startVision = async () => {
    setIsLoading(true);
    setStatusText("KALİBRE EDİLİYOR...");
    
    try {
      // 1. Kamera ve Mikrofon Hazırlığı
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // 2. Ses Context'leri
      audioCtxRef.current = new AudioContext({ sampleRate: 16000 });
      outAudioCtxRef.current = new AudioContext({ sampleRate: 24000 });

      // 3. AI Bağlantısı (VITE_API_KEY öncelikli erişim)
      const apiKey = (import.meta as any).env?.VITE_API_KEY || (process as any).env?.API_KEY;
      if (!apiKey) throw new Error("API Key bulunamadı.");

      const ai = new GoogleGenAI({ apiKey });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setSessionActive(true);
            setIsLoading(false);
            setStatusText("ANALİZ AKTİF");
            
            // Audio Girdi Akışı
            const source = audioCtxRef.current!.createMediaStreamSource(stream);
            const processor = audioCtxRef.current!.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const input = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(input.length);
              for (let i = 0; i < input.length; i++) int16[i] = input[i] * 32768;
              const pcm = encode(new Uint8Array(int16.buffer));
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: pcm, mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(processor);
            processor.connect(audioCtxRef.current!.destination);

            // Görsel Akış
            frameIntervalRef.current = setInterval(() => {
              if (videoRef.current && canvasRef.current && videoRef.current.readyState >= 2) {
                const ctx = canvasRef.current.getContext('2d');
                canvasRef.current.width = 640;
                canvasRef.current.height = 480;
                ctx?.drawImage(videoRef.current, 0, 0, 640, 480);
                const base64 = canvasRef.current.toDataURL('image/jpeg', 0.85).split(',')[1];
                sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'image/jpeg' } }));
              }
            }, 600);
          },
          onmessage: async (msg) => {
            const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio && outAudioCtxRef.current) {
              setIsAiSpeaking(true);
              const buffer = await decodeAudioData(decode(audio), outAudioCtxRef.current, 24000, 1);
              const source = outAudioCtxRef.current.createBufferSource();
              source.buffer = buffer;
              source.connect(outAudioCtxRef.current.destination);
              const start = Math.max(outAudioCtxRef.current.currentTime, nextStartTimeRef.current);
              source.start(start);
              nextStartTimeRef.current = start + buffer.duration;
              source.onended = () => setIsAiSpeaking(false);
            }
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: `Sen 'Boncuk Vision' adlı bir AI analiz sistemisin. Kuşu analiz et ve samimi cevaplar ver.`
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      cleanup();
    }
  };

  const switchCamera = async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (sessionActive) {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: nextMode, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = newStream;
      if (videoRef.current) videoRef.current.srcObject = newStream;
    }
  };

  useEffect(() => { return () => cleanup(); }, []);

  return (
    <div className="fixed inset-0 bg-black z-[250] flex flex-col overflow-hidden font-mono">
      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 border-[15px] border-white/5">
        <div className="absolute top-10 left-10 space-y-1">
          <p className="text-yellow-400 text-[10px] font-black tracking-[0.3em] uppercase">BONCUK_VISION_V3</p>
          <p className="text-white/20 text-[8px] font-bold">MODE: SPATIAL_MAPPING | AI: ACTIVE</p>
        </div>

        <div className="absolute top-10 right-10 text-right">
          <div className="flex items-center gap-2 justify-end">
            <div className={`w-2 h-2 rounded-full ${sessionActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <p className="text-white text-[10px] font-bold uppercase tracking-widest">{statusText}</p>
          </div>
        </div>

        {sessionActive && !isAiSpeaking && (
          <div className="absolute inset-x-0 top-0 h-[2px] bg-yellow-400/30 shadow-[0_0_15px_rgba(250,204,21,0.4)] animate-[scan_4s_linear_infinite]"></div>
        )}
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative bg-gray-950">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className={`w-full h-full object-cover transition-opacity duration-700 ${sessionActive ? 'opacity-100' : 'opacity-30'}`} 
        />
        <canvas ref={canvasRef} className="hidden" />

        {isAiSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center bg-yellow-400/5 backdrop-blur-[1px]">
             <div className="flex gap-1.5 h-16 items-center">
               {[...Array(12)].map((_, i) => (
                 <div key={i} className="w-1 bg-yellow-400 rounded-full animate-wave" style={{ animationDelay: `${i * 0.08}s` }}></div>
               ))}
             </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-10 z-30">
        <button 
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {sessionActive && (
          <button 
            onClick={switchCamera}
            className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
          >
            <i className="fa-solid fa-camera-rotate"></i>
          </button>
        )}
      </div>

      {/* Large Start Button / Intro Screen */}
      {!sessionActive && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-10">
          <div className="relative mb-16">
            <div className="absolute inset-0 bg-yellow-400/20 blur-[100px] rounded-full animate-pulse"></div>
            <div className="w-32 h-32 rounded-[2.5rem] border-2 border-yellow-400/30 flex items-center justify-center text-yellow-400 text-5xl">
              <i className="fa-solid fa-dove"></i>
            </div>
          </div>

          <div className="text-center space-y-4 mb-12">
            <h2 className="text-white text-3xl font-black tracking-[-0.05em] uppercase italic">BONCUK VISION</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] max-w-xs leading-relaxed">
              Mekansal Haritalama ve <br/> Gerçek Zamanlı Kuş Analizi
            </p>
          </div>

          <button 
            onClick={startVision}
            disabled={isLoading}
            className="group relative w-full max-w-xs"
          >
            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-yellow-400 text-black py-6 rounded-2xl font-black text-xl tracking-tighter flex items-center justify-center gap-4 transition-transform active:scale-95 disabled:opacity-50">
              {isLoading ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  BAĞLANILIYOR...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-play"></i>
                  SİSTEMİ BAŞLAT
                </>
              )}
            </div>
          </button>
          
          <button onClick={onBack} className="mt-8 text-white/20 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white/50 transition-colors">Vazgeç</button>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes wave {
          0%, 100% { height: 10px; opacity: 0.3; }
          50% { height: 50px; opacity: 1; }
        }
        .animate-wave { animation: wave 0.8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default LiveCall;
