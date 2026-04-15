import React, { useState } from "react";
import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { Users, Projector, Check, MapPin, Coffee, Info, PlayCircle, X, UtensilsCrossed, Armchair } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose } from "./ui/drawer";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Button } from "./ui/button";

const getPublicUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return ((import.meta as any).env?.BASE_URL || '/') + path.replace(/^\//, '');
};

const CAFE_OPTIONS = [
  {
    id: "cafe_round",
    name: "Круглый стол",
    subtitle: "Уютная зона с круглым столом",
    seats: 8,
    weekdayDeposit: 5000,
    weekendDeposit: 10000,
    thumbnail: "/locations/cafe/round.jpg",
    description: "Уютная зона с большим круглым столом — идеальна для небольшой компании взрослых. Удобное расположение рядом с патирумами.",
  },
  {
    id: "cafe_pink",
    name: "За шторками",
    subtitle: "Зона за розовыми шторками",
    seats: 10,
    weekdayDeposit: 5000,
    weekendDeposit: 10000,
    thumbnail: "/locations/cafe/pink.jpg",
    description: "Уединённая зона за розовыми шторками. Приватное пространство, где взрослые могут спокойно пообщаться, пока дети веселятся.",
    exclusiveWith: "cafe_pink_full" as const,
  },
  {
    id: "cafe_pink_full",
    name: "Вся зона за шторками",
    subtitle: "Аренда всей зоны целиком",
    seats: 20,
    weekdayDeposit: 10000,
    weekendDeposit: 20000,
    thumbnail: "/locations/cafe/pink.jpg",
    description: "Вся приватная зона за шторками — для большой компании. Несколько столов, максимум пространства и комфорта для взрослых гостей.",
    exclusiveWith: "cafe_pink" as const,
    badge: "Вся зона",
  },
];

export function Step3AdultLocation() {
  const { state, updateState } = useWizard();
  const [selectedDetails, setSelectedDetails] = useState<typeof CAFE_OPTIONS[0] | null>(null);
  const handleToggleCafe = (opt: typeof CAFE_OPTIONS[0]) => {
    const current = [...state.cafeZones];
    const idx = current.indexOf(opt.id);

    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      if ((opt as any).exclusiveWith) {
        const exIdx = current.indexOf((opt as any).exclusiveWith);
        if (exIdx >= 0) current.splice(exIdx, 1);
      }
      current.push(opt.id);
    }

    updateState({ cafeZones: current });
  };

  const formatDeposit = (opt: typeof CAFE_OPTIONS[0]) => {
    const price = state.isWeekend ? opt.weekendDeposit : opt.weekdayDeposit;
    return price.toLocaleString("ru-RU") + " ₽";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-6"
    >
      <div className="text-center mb-5">
        <h2 className="text-xl text-[#1A1A1A] mb-1">Локации для родителей</h2>
        <p className="text-sm text-[#747474]">Выберите место для комфортного отдыха</p>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Armchair className="w-5 h-5 text-[#FF6022]" />
          <h3 className="text-[#1A1A1A] font-medium">Стол для родителей</h3>
          <span className="ml-auto text-[10px] font-medium text-[#747474] bg-[#F0F0F0] px-2.5 py-1 rounded-full">
            По желанию
          </span>
        </div>
        <p className="text-xs text-[#747474] mb-1.5">
          Пока дети веселятся в патируме, взрослые могут расположиться за отдельным столом в зоне кафе.
        </p>
        <div className="flex items-center gap-1.5 mb-5">
          <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
            <UtensilsCrossed className="w-3 h-3 text-[#FF6022]" />
          </div>
          <p className="text-xs text-[#FF6022] font-semibold">
            Депозит можно тратить на блюда из меню
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {CAFE_OPTIONS.map((opt) => {
            const isSelected = state.cafeZones.includes(opt.id);
            return (
              <motion.div
                key={opt.id}
                whileTap={{ scale: 0.98 }}
                className={`relative h-[440px] sm:h-[500px] rounded-[32px] overflow-hidden bg-white transition-all cursor-pointer group ${
                  isSelected ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]" : "ring-1 ring-[#E5E5E5] shadow-sm"
                }`}
                onClick={() => handleToggleCafe(opt)}
              >
                <ImageWithFallback
                  src={getPublicUrl(opt.thumbnail)}
                  alt={opt.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                
                {(opt as any).badge && (
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full z-10 shadow-sm">
                    {(opt as any).badge}
                  </div>
                )}

                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[24px] p-5 shadow-2xl border border-white/20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-[#1A1A1A] mb-1.5">{opt.name}</h4>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-[#ABABAB]" />
                          <span className="text-xs text-[#747474]">до {opt.seats} мест</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Coffee className="w-4 h-4 text-[#ABABAB]" />
                          <span className="text-xs text-[#747474]">3 часа</span>
                        </div>
                      </div>
                      <div className="inline-flex items-baseline gap-2">
                        <span className="text-base font-bold text-[#FF6022]">
                          Депозит {formatDeposit(opt)}
                        </span>
                        <span className="text-[10px] text-[#ABABAB] font-semibold uppercase tracking-wider">
                          {state.isWeekend ? "выходной" : "будни"}
                        </span>
                      </div>
                    </div>

                    <div 
                      className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? "bg-[#FF6022] text-white shadow-lg shadow-orange-500/30" : "bg-gray-50 text-[#D1D1D1] group-hover:bg-gray-100"
                      }`}
                    >
                      <Check className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ==================== DETAILS DRAWER ==================== */}
      <Drawer open={!!selectedDetails} onOpenChange={(open) => !open && setSelectedDetails(null)}>
        <DrawerContent className="max-h-[90vh] w-full max-w-lg mx-auto bg-white pt-2 px-2 flex flex-col rounded-t-3xl">
          <div className="mx-auto mt-2 h-1.5 w-12 shrink-0 rounded-full bg-gray-200 mb-4" />
          
          {selectedDetails && (
            <div className="flex-1 overflow-y-auto pb-safe">
              <div className="relative rounded-2xl overflow-hidden mb-4 bg-black w-full flex items-center justify-center">
                {selectedDetails.video ? (
                  <video
                    src={getPublicUrl(selectedDetails.video)}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="w-full max-h-[60vh] object-contain"
                  />
                ) : (
                  <Carousel className="w-full aspect-[4/3] sm:aspect-video">
                    <CarouselContent className="h-full ml-0">
                      {selectedDetails.gallery.map((img, idx) => (
                        <CarouselItem key={idx} className="h-full pl-0">
                          <img src={getPublicUrl(img)} alt="" className="w-full h-full object-contain" />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                )}
                
                <DrawerClose asChild>
                  <button className="absolute top-3 right-3 bg-black/50 backdrop-blur-md rounded-full p-2 text-white z-20 transition-transform active:scale-95 border border-white/10 hover:bg-black/70">
                    <X className="w-5 h-5" />
                  </button>
                </DrawerClose>
              </div>

              <div className="px-3 pb-6 border-b border-gray-100">
                <DrawerTitle className="text-2xl font-bold text-[#1A1A1A] mb-2">{selectedDetails.name}</DrawerTitle>
                <DrawerDescription className="text-sm text-[#747474] leading-relaxed mb-4">
                  {selectedDetails.description}
                </DrawerDescription>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2 bg-orange-50/50 p-2.5 rounded-xl">
                    <Users className="w-4 h-4 text-[#FF6022]" />
                    <div>
                      <div className="text-[10px] text-[#747474]">Вместимость</div>
                      <div className="text-xs font-semibold text-[#1A1A1A]">до {selectedDetails.seats} мест</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-50/50 p-2.5 rounded-xl">
                    <Projector className="w-4 h-4 text-[#FF6022]" />
                    <div>
                      <div className="text-[10px] text-[#747474]">Оснащение</div>
                      <div className="text-xs font-semibold text-[#1A1A1A]">
                        {selectedDetails.hasProjection ? "Интерактивная проекция" : "Стандартное"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/80 backdrop-blur-md sticky bottom-0 border-t border-gray-100">
                <Button 
                  onClick={() => {
                    handleSelectRoom(selectedDetails!);
                    setSelectedDetails(null);
                  }}
                  className="w-full h-12 bg-[#FF6022] hover:bg-[#E55015] text-white rounded-xl text-base font-medium shadow-lg shadow-orange-500/20"
                >
                  Выбрать патирум "{selectedDetails.name}"
                </Button>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </motion.div>
  );
}