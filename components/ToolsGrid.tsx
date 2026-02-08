
import React, { useState } from 'react';
import { getExpertResponse } from '../services/geminiService';

const CATEGORIES = [
  { 
    name: 'Beslenme & Diyet', 
    icon: 'fa-seedling', 
    description: 'En sağlıklı tohumlar ve meyve karışımları.',
    tools: [
      { name: 'Gıda Güvenliği', info: 'Kuşun yediği her şeyin toksik olup olmadığını kontrol eder.' },
      { name: 'Yasaklı Gıdalar', info: 'Avokado, çikolata ve kafein gibi ölümcül gıdaların tam listesi.' },
      { name: 'Mama Tarifleri', info: 'Evde yapabileceğiniz yumurta maması ve sebze karışımları.' },
      { name: 'Vitamin Dengesi', info: 'Tüy dökümü ve üreme döneminde gerekli takviyeler.' },
      { name: 'Su Kalitesi', info: 'İçme suyu temizliği ve suluk hijyeni rehberi.' },
      { name: 'Ağırlık Takibi', info: 'Kuşun zayıf mı yoksa aşırı kilolu mu olduğunu anlama.' }
    ] 
  },
  { 
    name: 'Sağlık & İlkyardım', 
    icon: 'fa-stethoscope', 
    description: 'Hastalık belirtileri ve acil müdahale.',
    tools: [
      { name: 'Dışkı Analizi', info: 'Dışkı rengi ve kıvamına göre sağlık taraması.' },
      { name: 'Tüy Dökümü', info: 'Mevsimsel ve stres kaynaklı tüy dökümü farkı.' },
      { name: 'Gaga & Tırnak', info: 'Gaga uzaması ve güvenli tırnak kesimi teknikleri.' },
      { name: 'Solunum Takibi', info: 'Kuyruk sallama ve hırıltılı nefes analizi.' },
      { name: 'Bit & Parazit', info: 'Dış parazit tespiti ve doğal çözüm yolları.' },
      { name: 'Göz Sağlığı', info: 'Kızarıklık, şişlik ve akıntı kontrolü.' }
    ] 
  },
  { 
    name: 'Davranış & Eğitim', 
    icon: 'fa-brain', 
    description: 'Konuşturma ve ele alıştırma teknikleri.',
    tools: [
      { name: 'Ele Alıştırma', info: 'Avucunuza korkmadan gelmesi için 5 adım.' },
      { name: 'Konuşma Dersleri', info: 'Kelime tekrarları ve ses tonu stratejileri.' },
      { name: 'Isırma Sorunu', info: 'Agresif davranışların kökeni ve çözüm yolları.' },
      { name: 'Korku Analizi', info: 'Ani hareketlerden ürken kuşlar için güven terapisi.' },
      { name: 'Tuvalet Eğitimi', info: 'Kafes dışında belirli yerlere yapma eğitimi.' },
      { name: 'Zeka Oyunları', info: 'Problem çözme yeteneğini geliştiren aktiviteler.' }
    ] 
  },
  { 
    name: 'Yaşam Alanı', 
    icon: 'fa-house', 
    description: 'Kafes düzeni ve oda güvenliği.',
    tools: [
      { name: 'Kafes Konumu', info: 'Cereyan, güneş ışığı ve gürültü dengesi.' },
      { name: 'Tünek Seçimi', info: 'Ayak sağlığı için ahşap ve doğal dal tünekler.' },
      { name: 'Oyuncak Güvenliği', info: 'Boyalı ve tehlikeli parça içeren oyuncak tespiti.' },
      { name: 'Oda Güvenliği', info: 'Açık pencereler, saksı bitkileri ve mutfak tehlikeleri.' },
      { name: 'Aydınlatma', info: 'UV ışığı ihtiyacı ve uyku düzeni için karanlık süresi.' },
      { name: 'Hijyen Planı', info: 'Kafes ve ekipman temizliği periyotları.' }
    ] 
  },
  {
    name: 'Üretim & Yavru',
    icon: 'fa-egg',
    description: 'Eş seçimi ve yavru bakımı.',
    tools: [
      { name: 'Eş Seçimi', info: 'Uyumlu çiftlerin belirlenmesi ve yaş faktörü.' },
      { name: 'Yuvalık Hazırlığı', info: 'Doğru yuvalık tipi ve taban malzemesi seçimi.' },
      { name: 'Kuluçka Takibi', info: 'Yumurta doluluk kontrolü ve kuluçka süreci.' },
      { name: 'Yavru Besleme', info: 'Anne bakımı yetersizse elle besleme teknikleri.' },
      { name: 'Cinsiyet Ayrımı', info: 'Cere rengi ve davranışlara göre cinsiyet tespiti.' },
      { name: 'Bilezik Takma', info: 'Yavrulara kayıt için bilezik takma zamanı.' }
    ]
  },
  {
    name: 'Psikoloji & Sosyal',
    icon: 'fa-masks-theater',
    description: 'Kuşunuzun ruh dünyasını anlayın.',
    tools: [
      { name: 'Yalnızlık Belirtisi', info: 'Kendi tüylerini yolma ve depresyon analizi.' },
      { name: 'Kıskançlık', info: 'Yeni bir kuş veya ev halkına karşı tepkiler.' },
      { name: 'Mutluluk İşaretleri', info: 'Gaga gıcırdatma ve neşeli şarkılar.' },
      { name: 'Stres Kaynakları', info: 'Evdeki gürültü, ani ışık değişimleri ve çözümler.' },
      { name: 'Oyun İhtiyacı', info: 'Günlük ne kadar ilgi ve oyun bekler?' },
      { name: 'Uyku Düzeni', info: 'Kuşların neden 10-12 saat karanlığa ihtiyacı var?' }
    ]
  }
];

const ToolsGrid: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<{name: string, info: string} | null>(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToolAction = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await getExpertResponse(selectedTool!.name, query);
      setResult(response);
    } catch (e) {
      setResult("Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto pb-32 space-y-8">
      {!selectedTool && (
        <>
          <header className="space-y-2 px-2">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">AI Kütüphanesi</h2>
            <p className="text-gray-500 font-medium italic text-sm">242+ profesyonel modül ile her soruna çözüm.</p>
          </header>

          <div className="space-y-10">
            {CATEGORIES.map((cat, i) => (
              <section key={i} className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-12 h-12 bg-yellow-400 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg">
                    <i className={`fa-solid ${cat.icon}`}></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{cat.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {cat.tools.map((tool, j) => (
                    <button 
                      key={j} 
                      onClick={() => setSelectedTool(tool)}
                      className="bg-white border border-gray-100 p-5 rounded-[2rem] text-left hover:border-yellow-400 transition-all shadow-sm active:scale-95 group"
                    >
                      <span className="text-sm font-black text-gray-800 block mb-2 group-hover:text-yellow-600 transition-colors">{tool.name}</span>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Detayları Gör</span>
                        <i className="fa-solid fa-arrow-right text-[10px] text-gray-200 group-hover:text-yellow-400"></i>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h5 className="text-2xl font-black mb-3">Aradığını Bulamadın mı?</h5>
              <p className="opacity-80 font-medium text-sm leading-relaxed mb-6">
                Boncuk AI 200'den fazla parametreyi biliyor. Sadece sorunu yaz ve analiz etmesini bekle.
              </p>
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-sm active:scale-95 transition-all">
                ÖZEL DANIŞMANA SOR
              </button>
            </div>
            <i className="fa-solid fa-magnifying-glass-plus absolute -bottom-6 -right-6 text-9xl opacity-10"></i>
          </div>
        </>
      )}

      {selectedTool && (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 space-y-6 animate-in zoom-in duration-300 shadow-2xl">
          <button 
            onClick={() => { setSelectedTool(null); setResult(null); setQuery(''); }} 
            className="flex items-center gap-2 text-gray-400 font-bold text-sm hover:text-black transition-colors"
          >
            <i className="fa-solid fa-chevron-left"></i> Kütüphaneye Dön
          </button>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-yellow-400 rounded-3xl flex items-center justify-center text-2xl text-black shadow-lg">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">{selectedTool.name}</h3>
                <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest">AI Uzman Modülü</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Genel Bilgi</h4>
              <p className="text-gray-700 font-medium leading-relaxed">{selectedTool.info}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-800 px-1">Özel Sorunu Sorun</h4>
            <textarea 
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-3xl p-6 text-gray-800 focus:ring-4 focus:ring-yellow-100 outline-none h-40 transition-all font-medium placeholder:text-gray-300"
              placeholder={`Örn: "Kuşumda ${selectedTool.name.toLowerCase()} belirtileri görüyorum, ne yapmalıyım?"`}
            />
            
            <button 
              onClick={handleToolAction} 
              disabled={loading || !query.trim()} 
              className="w-full bg-black text-white py-6 rounded-3xl font-black text-xl shadow-xl active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  AI DÜŞÜNÜYOR...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  UZMANA SORGULA
                </>
              )}
            </button>
          </div>

          {result && (
            <div className="mt-8 bg-green-50 border border-green-100 p-8 rounded-[2rem] shadow-sm animate-in slide-in-from-bottom duration-500">
              <div className="flex items-center gap-3 mb-4">
                <i className="fa-solid fa-circle-check text-green-600"></i>
                <h4 className="font-black text-green-700 uppercase text-xs tracking-widest">AI ANALİZİ</h4>
              </div>
              <p className="text-gray-800 leading-loose font-medium whitespace-pre-wrap">{result}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolsGrid;
