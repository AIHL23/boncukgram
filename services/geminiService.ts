
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// Vite projelerinde istemci tarafındaki değişkenlere import.meta.env üzerinden erişilir.
const getApiKey = () => {
  return (import.meta as any).env?.VITE_API_KEY || (process as any).env?.API_KEY;
};

export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const analyzeMoodFromFrames = async (frames: string[]) => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const parts: any[] = frames.map(f => ({
    inlineData: {
      mimeType: 'image/jpeg',
      data: f.split(',')[1] || f
    }
  }));

  parts.push({ 
    text: "Bu 6 saniyelik görüntü sekansını analiz et. Kuşun vücut diline, kanat hareketlerine ve duruşuna bakarak psikolojik durumunu detaylıca Türkçe açıkla." 
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      systemInstruction: "Sen profesyonel bir kuş davranış bilimcisisin."
    }
  });

  return response.text || "Analiz sonucu alınamadı.";
};

export const getExpertResponse = async (toolName: string, query: string, imageBase64?: string) => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const parts: any[] = [];
  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64.split(',')[1] || imageBase64
      }
    });
  }
  parts.push({ text: `Araç: ${toolName}. Soru: ${query}` });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      systemInstruction: `Sen Boncukgram AI uzmanısın. Uzmanlık alanın: ${toolName}. Samimi ve bilimsel cevaplar ver.`
    }
  });

  return response.text || "Üzgünüm, şu an yanıt veremiyorum.";
};

export const getGeminiResponse = async (history: ChatMessage[], prompt: string, imageBase64?: string) => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const contents = history.map(m => ({
    role: m.role,
    parts: [
      ...(m.imageUrl ? [{ inlineData: { mimeType: 'image/jpeg', data: m.imageUrl.split(',')[1] || m.imageUrl } }] : []),
      { text: m.text }
    ]
  }));

  const userParts: any[] = [];
  if (imageBase64) {
    userParts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64.split(',')[1] || imageBase64
      }
    });
  }
  userParts.push({ text: prompt });
  contents.push({ role: 'user', parts: userParts });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents,
    config: {
      systemInstruction: "Sen Boncuk Danışmanı adında kuş uzmanı bir AI asistanısın."
    }
  });

  return response.text || "Yanıt oluşturulamadı.";
};

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
