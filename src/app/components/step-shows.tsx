import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { Check, Star, Info, X } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const getPublicUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return ((import.meta as any).env?.BASE_URL || '/') + path.replace(/^\//, '');
};

const SHOWS = [
  { id: "soap", name: "Шоу мыльных пузырей", price: 14000, emoji: "🫧", desc: "Самое популярное, незабываемое красочное шоу, вызывающее незабываемые впечатления у детей и взрослых! В ходе шоу гостей ожидает: • гусеница из пузырей • разноцветная радуга • погружение в гигнатский мыльный пузырь • целый рой из пузырей разного размера", gradient: "from-[#a1c4fd] to-[#c2e9fb]", image: "/shows/soap.webp" },
  { id: "paper", name: "Бумажное шоу", price: 15000, emoji: "🎊", desc: "Невероятное шоу, которое превращает обычные танцы в безудержное веселье с огромным количеством бумаги. В ходе шоу гостей ожидает: • популярная музыка, воздушные пушки, целое море белой бумаги • интересные конкурсы и танцевальные баттлы • безудержное веселье • увлекательные игры", gradient: "from-[#ffecd2] to-[#fcb69f]", image: "/shows/paper.webp" },
  { id: "tesla", name: "Тесла-шоу", price: 15000, emoji: "⚡", desc: "Научно-развлекательное представление, вдохновлённое изобретениями Николы Теслы. Оно превращает сложные физические явления в зрелищные эксперименты, создаёт атмосферу научно-фантастического праздника. В ходе шоу гостей ожидает: • демонстрация молний до 50 см на катушке Тесла • управление ручными молниями • зажигание люмиесцентных ламп • зажигание лампочки с помощью катушки Тесла", gradient: "from-[#a18cd1] to-[#fbc2eb]", image: "/shows/tesla.webp" },
  { id: "professor", name: "Чокнутый профессор", price: 14000, emoji: "🧪", desc: "Это не просто занудный урок физики или химии, а интересная и захватывающая наука в действии. В ходе шоу гостей ожидает: • эксперимент «Яйцо в колбе» • настоящая дымовая завеса • игра «Жидкое или твёрдое?» • исчезновение предметов * Все эксперименты проводятся профессиональнообученными людьми и полностью безопасны для детей", gradient: "from-[#d4fc79] to-[#96e6a1]", image: "/shows/professor.webp" }
];

export function StepShows() {
  const { state, updateState } = useWizard();
  const isCustom = state.packageType === "custom";
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);

  const toggleShow = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const current = state.shows;
    if (current.includes(id)) {
      updateState({ shows: current.filter((m) => m !== id) });
    } else {
      updateState({ shows: [...current, id] });
    }
  };

  const selectedShowDetails = SHOWS.find(s => s.id === selectedInfo);
  
  const getTotalShowsPrice = () => {
    let cost = state.shows.reduce((acc, showId) => {
      const show = SHOWS.find(s => s.id === showId);
      return acc + (show?.price || 0);
    }, 0);
    if (state.packageType === "exclusive" && state.shows.length > 0) {
      const firstShow = SHOWS.find(s => s.id === state.shows[0]);
      if (firstShow) cost -= firstShow.price;
    }
    return cost;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-6"
    >
      <div className="text-center mb-8 px-4 pt-2">
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">✨</span>
          Шоу-программы
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">
          {state.packageType === "exclusive"
            ? "1 шоу-программа включена. Остальные за доп. плату"
            : "Выберите шоу-программы для вашего праздника"}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-[#FF6022]" />
        <h3 className="text-[#1A1A1A]">Доступные шоу</h3>
      </div>

      {/* Grid of Shows */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {SHOWS.map((show) => {
          const isSelected = state.shows.includes(show.id);
          return (
            <motion.div
              key={show.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleShow(show.id)}
              className={`relative aspect-[4/5] sm:h-[280px] rounded-[24px] overflow-hidden transition-all cursor-pointer group ${
                isSelected
                  ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]"
                  : "ring-1 ring-[#E5E5E5] shadow-sm"
              }`}
            >
              {/* Image / Gradient Placeholder */}
              <div className={`absolute inset-0 bg-gradient-to-br ${show.gradient} flex items-center justify-center`}>
                {(show as any).image ? (
                  <ImageWithFallback src={getPublicUrl((show as any).image)} alt={show.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <span className="text-6xl sm:text-7xl filter drop-shadow-md pb-6 group-hover:scale-110 transition-transform duration-500">{show.emoji}</span>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              {/* Top details: Button + Checkmark */}
              <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInfo(show.id);
                  }}
                  className="bg-gradient-to-tr from-[#FF6022] to-[#FF8A00] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-full flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shadow-md shadow-[#FF6022]/40"
                >
                  <Info className="w-3.5 h-3.5" />
                  Подробнее
                </button>

                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? "bg-[#FF6022] border-2 border-white text-white shadow-md shadow-[#FF6022]/40" : "bg-white/40 backdrop-blur-md border border-white/60 text-transparent"
                }`}>
                   <Check className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom pill-like panel like location cards */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] p-2.5 shadow-lg flex flex-col justify-center border border-white/30 text-center min-h-[50px]">
                 <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">{show.name}</h4>
                 {(isCustom || state.packageType === "exclusive" && state.shows.length > 0) && (
                    <p className="text-[11px] text-[#FF6022] font-extrabold mt-0.5">{show.price.toLocaleString("ru-RU")} ₽</p>
                 )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {state.shows.length > 0 && (isCustom || state.packageType === "exclusive" && state.shows.length > 1) && (
        <div className="bg-[#FF6022]/5 rounded-2xl p-4 mb-6 text-center border border-[#FF6022]/20">
          <p className="text-sm text-[#FF6022]">
            Выбрано платных: {isCustom ? state.shows.length : state.shows.length - 1} шоу ={" "}
            <span className="text-base font-semibold">
              {getTotalShowsPrice().toLocaleString("ru-RU")} ₽
            </span>
          </p>
        </div>
      )}

      {/* Info Popup Modal */}
      <AnimatePresence>
        {selectedInfo && selectedShowDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-[-50vh] bottom-[-50vh] left-0 right-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          >
            {/* Extended bounce cover backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-md pointer-events-auto"
              onClick={() => setSelectedInfo(null)}
            />
            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] pointer-events-auto relative z-10"
            >
              <div className="relative shrink-0 bg-black">
                <div className={`aspect-[4/5] max-h-[40vh] w-full bg-gradient-to-br ${selectedShowDetails.gradient} flex items-center justify-center`}>
                  {(selectedShowDetails as any).image ? (
                    <ImageWithFallback src={getPublicUrl((selectedShowDetails as any).image)} alt={selectedShowDetails.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-8xl sm:text-9xl filter drop-shadow-md">{selectedShowDetails.emoji}</span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedInfo(null)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full text-[#1A1A1A] transition-colors hover:bg-white z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-5 overflow-y-auto overscroll-contain">
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{selectedShowDetails.name}</h3>
                <p className="text-[#747474] text-sm leading-relaxed mb-6 whitespace-pre-line">
                  {selectedShowDetails.desc.replace(/ • /g, '\n• ')}
                </p>
                
                <div className="flex gap-3">
                  <button
                     onClick={() => {
                        const isSelected = state.shows.includes(selectedShowDetails.id);
                        if (!isSelected) {
                            updateState({ shows: [...state.shows, selectedShowDetails.id] });
                        }
                        setSelectedInfo(null);
                     }}
                     className={`flex-1 py-3.5 rounded-xl font-medium text-center transition-all ${
                         state.shows.includes(selectedShowDetails.id)
                         ? "bg-[#F5F5F5] text-[#747474]"
                         : "bg-[#FF6022] text-white shadow-md shadow-[#FF6022]/30 active:scale-[0.98]"
                     }`}
                  >
                    {state.shows.includes(selectedShowDetails.id) ? "Добавлено" : "Добавить в праздник"}
                  </button>
                    
                  {state.shows.includes(selectedShowDetails.id) && (
                     <button
                        onClick={() => {
                           updateState({ shows: state.shows.filter(id => id !== selectedShowDetails.id) });
                           setSelectedInfo(null);
                        }}
                        className="py-3.5 px-4 rounded-xl font-medium text-center bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                     >
                       Убрать
                     </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
