import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Sparkles, ArrowRightLeft, Languages, ChevronDown, Copy, Check, Image as ImageIcon, X } from 'lucide-react';

const dlcts_names: Record<string, string> = {
  sorani: "سۆرانی",
  kurmanji: "Kurmancî",
  hawrami: "هەورامی",
  zazaki: "Zazakî",
  luri: "لوڕی",
  badini: "بادینی",
  arabic: "عەرەبی",
  english: "English"
};

const dlcts_keys = Object.keys(dlcts_names);

export default function App() {
  const [uiLang, setUiLang] = useState<'سۆرانی' | 'Kurmancî' | 'بادینی' | 'عەرەبی' | 'English'>('سۆرانی');
  const [isUiLangOpen, setIsUiLangOpen] = useState(false);

  const is_rtl = uiLang === 'سۆرانی' || uiLang === 'عەرەبی' || uiLang === 'بادینی';
  const direction = is_rtl ? 'rtl' : 'ltr';

  const ui_text: Record<string, { from: string, to: string, btn_tr: string }> = {
    'سۆرانی': {
      from: "لە:",
      to: "بۆ:",
      btn_tr: "وەرگێڕان"
    },
    'Kurmancî': {
      from: "Ji:",
      to: "Bo:",
      btn_tr: "Wergêran"
    },
    'بادینی': {
      from: "ژ:",
      to: "بۆ:",
      btn_tr: "وەرگێڕان"
    },
    'عەرەبی': {
      from: "من:",
      to: "إلى:",
      btn_tr: "ترجمة"
    },
    'English': {
      from: "From:",
      to: "To:",
      btn_tr: "Translate"
    }
  };

  const L = ui_text[uiLang];

  return (
    <div className="w-full h-screen bg-[#0A0D10] flex flex-col items-center justify-center font-['Vazirmatn',_sans-serif]" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #111A20 0%, transparent 70%)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[450px] h-[100dvh] sm:h-[720px] bg-white/5 backdrop-blur-[40px] sm:border border-white/10 sm:rounded-[40px] flex flex-col shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] relative overflow-hidden" 
        style={{ direction }}
      >
        
        {/* Header */}
        <div className="px-6 pt-6 flex justify-between items-start relative z-20 w-full shrink-0">
          <div className="w-[100px]">
             {/* UI Language Switcher */}
            <div className="relative inline-block" style={{ direction: 'ltr' }}>
              <div 
                onClick={() => setIsUiLangOpen(!isUiLangOpen)}
                className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all rounded-full px-3 py-1.5 flex items-center gap-1.5 text-white/80 hover:text-white text-[11px] font-medium cursor-pointer shadow-sm"
              >
                <Languages className="w-3.5 h-3.5 opacity-80" />
                <span>{uiLang}</span>
                <ChevronDown className={`w-3 h-3 opacity-60 transition-transform ${isUiLangOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {isUiLangOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setIsUiLangOpen(false)}></div>
              )}
              
              <AnimatePresence>
                {isUiLangOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 min-w-[110px] z-30 bg-[#1E1A2D]/90 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                  >
                    {['سۆرانی', 'Kurmancî', 'بادینی', 'عەرەبی', 'English'].map(opt => (
                      <div 
                        key={opt}
                        onClick={() => { setUiLang(opt as any); setIsUiLangOpen(false); }}
                        className={`px-4 py-2 cursor-pointer text-center text-xs transition-colors ${uiLang === opt ? 'bg-[#FABC13]/20 text-[#FABC13] font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                      >
                        {opt}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-16 h-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.1)] relative overflow-hidden group shrink-0"
          >
             <div className="absolute inset-0 bg-gradient-to-tr from-[#ED2024]/30 via-[#FABC13]/30 to-[#279948]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <img src="/khani.png" alt="Khani Logo" className="w-12 h-12 object-contain drop-shadow-md relative z-10 rounded-full" />
          </motion.div>

          <div className="w-[100px]"></div>
        </div>

        <div className="px-6 mt-4 relative z-10 w-full shrink-0">
          <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#ED2024]/30 via-[#FABC13]/30 to-[#279948]/30 opacity-40 blur-lg animate-pulse"></div>
            <div className="relative px-4 py-3 flex items-center justify-center text-center">
              <span className="text-white/90 text-sm font-semibold tracking-wide drop-shadow-md">
                فێرگەی خانی <span className="text-[#FABC13] opacity-90 mx-1">_بەمزوانە بەردەست دەبێت_</span>
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 mt-4 flex-1 overflow-y-auto custom-scrollbar relative z-10 pb-8 flex flex-col">
          <div className="flex-1 flex flex-col justify-start">
            <TranslateTab L={L} />
          </div>
        </div>

        {/* Footer */}
        <div className="pb-6 text-center relative z-10 shrink-0">
          <span className="text-white/30 text-[10px] tracking-widest uppercase font-medium flex justify-center items-center gap-2">
            I_KURD <span className="w-1 h-1 rounded-full bg-white/30"></span> v1.9
          </span>
        </div>

        {/* Decorative Glass Blobs - Kurdish Colors */}
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#ED2024]/15 rounded-full blur-[80px] pointer-events-none"></motion.div>
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute top-20 -right-20 w-72 h-72 bg-[#279948]/15 rounded-full blur-[80px] pointer-events-none"></motion.div>
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute top-[40%] left-1/4 w-48 h-48 bg-[#FABC13]/10 rounded-full blur-[60px] pointer-events-none"></motion.div>
      </motion.div>
    </div>
  );
}

function GlassSelect({ value, onChange, options }: { value: string, onChange: (v: string) => void, options: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative flex-1">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-transparent py-3 text-white/90 font-semibold cursor-pointer text-center flex items-center justify-center gap-1.5"
      >
        <span>{value}</span>
        <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)}></div>
      )}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-30 min-w-[130px] bg-[rgba(30,20,50,0.8)] backdrop-blur-3xl border border-white/20 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            <div className="max-h-56 overflow-y-auto custom-scrollbar flex flex-col py-2">
              {options.map(opt => (
                <div 
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                  className={`px-4 py-3 cursor-pointer text-center text-sm transition-all ${value === opt ? 'bg-white/20 text-white font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                >
                  {opt}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TranslateTab({ L }: { L: any }) {
  const [src, setSrc] = useState('سۆرانی');
  const [trg, setTrg] = useState('Kurmancî');
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTranslate = async () => {
    if (!text.trim() && !image) return;
    setLoading(true);
    setResult('');
    setCopied(false);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: image ? 'image' : 'translate', src, trg, text, image })
      });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch (e: any) {
      setResult('Error: ' + e.message);
    }
    setLoading(false);
  };

  const swapLanguages = () => {
    setSrc(trg);
    setTrg(src);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center gap-3 bg-white/5 p-2 rounded-[2rem] backdrop-blur-sm border border-white/10 relative z-20 shadow-inner">
        <GlassSelect 
          value={src} 
          onChange={setSrc} 
          options={Object.values(dlcts_names)} 
        />
        
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={swapLanguages}
          className="w-12 h-12 shrink-0 bg-white/10 rounded-full flex items-center justify-center border border-white/20 text-white/80 hover:text-white shadow-md z-10 hover:bg-white/20 transition-colors"
        >
           <ArrowRightLeft className="w-5 h-5" />
        </motion.button>
        
        <GlassSelect 
          value={trg} 
          onChange={setTrg} 
          options={Object.values(dlcts_names)} 
        />
      </div>

      <div className="relative group flex flex-col bg-white/5 hover:bg-white/[0.08] focus-within:bg-white/10 backdrop-blur-xl border border-white/10 focus-within:border-[#FABC13]/40 rounded-3xl transition-all shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-10 p-2 overflow-hidden">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full h-32 p-3 text-white/90 text-sm md:text-base focus:outline-none resize-none text-start bg-transparent placeholder:text-white/30"
          placeholder="..."
        />
        
        {image && (
          <div className="px-3 pb-3">
            <div className="relative inline-block border border-white/10 rounded-xl overflow-hidden group/image">
               <img src={image} alt="Upload preview" className="h-20 object-cover opacity-90" />
               <button 
                 onClick={removeImage}
                 className="absolute top-1 right-1 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 backdrop-blur-md transition-colors"
               >
                 <X className="w-3 h-3" />
               </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center px-3 pb-2 pt-1">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-white/50 hover:text-white/90 transition-colors p-1.5 rounded-full hover:bg-white/10"
            title="Upload image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#ED2024]/0 via-[#FABC13]/0 to-[#279948]/0 opacity-0 group-focus-within:opacity-20 blur-xl transition-all duration-700 rounded-3xl pointer-events-none"></div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleTranslate}
        disabled={loading || (!text.trim() && !image)}
        className="w-full h-14 bg-gradient-to-r from-white/10 via-white/15 to-white/10 hover:from-white/20 hover:to-white/20 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-bold text-lg shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-3 overflow-hidden relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#ED2024]/20 via-[#FABC13]/20 to-[#279948]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {loading ? (
           <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className="w-5 h-5 text-[#FABC13] relative z-10" />
           </motion.div>
        ) : (
           <Languages className="w-5 h-5 relative z-10 text-white/90 group-hover:text-white" />
        )}
        <span className="relative z-10">{loading ? '...' : L.btn_tr}</span>
      </motion.button>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="mt-2 text-start bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[28px] text-[#F4F4F5] text-base md:text-lg shadow-[0_12px_40px_rgba(0,0,0,0.3)] relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#FABC13]/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#279948]/20 rounded-full blur-2xl"></div>
            <div className="relative z-10 p-6 min-h-[100px] flex flex-col items-start gap-4" style={{ direction: result.match(/[A-Za-z]/) ? 'ltr' : 'rtl' }}>
              <p className="leading-relaxed drop-shadow-sm font-medium w-full whitespace-pre-wrap flex-1">{result}</p>
              
              <div className="w-full flex justify-end" style={{ direction: 'ltr' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 p-2.5 rounded-full text-white/70 hover:text-white backdrop-blur-md transition-all flex items-center justify-center h-10 min-w-10 overflow-hidden shadow-sm"
                  title="Copy Translation"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="copied"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Check className="w-4 h-4 text-[#279948]" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Copy className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


