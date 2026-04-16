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

const PATIROOMS = [
  {
    id: "patiroom_mechta",
    name: "Мечта",
    seats: 12,
    hasProjection: true,
    thumbnail: "/locations/mechta/1.jpg",
    gallery: ["/locations/mechta/1.jpg", "/locations/mechta/2.jpg"],
    video: "/locations/mechta/video.mp4",
    description: "Волшебная комната в нежных розовых тонах. Идеальное место для тех, кто любит сказки и мечтает о незабываемом празднике. В комнате есть все для комфортного отдыха и веселых игр.",
  },
  {
    id: "patiroom_kometa",
    name: "Комета",
    seats: 16,
    hasProjection: true,
    thumbnail: "/locations/kometa/1.jpg",
    gallery: ["/locations/kometa/1.jpg", "/locations/kometa/2.jpg"],
    video: "/locations/kometa/video.mp4",
    description: "Космический патирум с яркой неоновой подсветкой! Отличный выбор для активных космических рейнджеров. Большое пространство позволяет с комфортом разместить до 16 гостей.",
  },
  {
    id: "patiroom_arkada",
    name: "Аркада",
    seats: 16,
    hasProjection: true,
    thumbnail: "/locations/kometa/1.jpg",
    gallery: ["/locations/kometa/1.jpg", "/locations/kometa/2.jpg"],
    video: "/locations/kometa/video.mp4",
    description: "Футуристичное пространство для современных детей. Множество интерактивных зон и проекций сделают праздник невероятно увлекательным.",
  },
  {
    id: "patiroom_pikseli",
    name: "Пиксели",
    seats: 12,
    hasProjection: false,
    thumbnail: "/locations/mechta/1.jpg",
    gallery: ["/locations/mechta/1.jpg", "/locations/mechta/2.jpg"],
    video: "/locations/mechta/video.mp4",
    description: "Стильная и компактная комната для творческих мастер-классов и камерных дней рождения. Уютная обстановка для небольшой компании.",
  },
];

export function Step2Location() {
  const { state, updateState } = useWizard();
  const [selectedDetails, setSelectedDetails] = useState<typeof PATIROOMS[0] | null>(null);
  const isPackage = state.packageType !== "custom";

  const handleSelectRoom = (room: typeof PATIROOMS[0]) => {
    updateState({
      patiroom: room.id,
      patiroomDetails: room.name,
    });
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
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">🏠</span>
          Выберите локацию
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">Где пройдет ваш праздник?</p>
      </div>

      {/* ==================== PATIROOMS ==================== */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <MapPin className="w-5 h-5 text-[#FF6022]" />
          <h3 className="text-[#1A1A1A] font-medium">Патирумы</h3>
          {isPackage && (
            <span className="ml-auto text-[10px] font-medium text-white bg-[#FF6022] px-2 py-0.5 rounded-full">
              Обязательно
            </span>
          )}
        </div>
        <p className="text-xs text-[#747474] mb-3">
          Интерактивные столы и проекции на стенах. При отдельном бронировании — 3 000 ₽/час.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {PATIROOMS.map((room) => {
            const isSelected = state.patiroom === room.id;
            return (
              <div
                key={room.id}
                className={`relative h-[440px] sm:h-[500px] rounded-[32px] overflow-hidden bg-white transition-all cursor-pointer group ${
                  isSelected ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]" : "ring-1 ring-[#E5E5E5] shadow-sm"
                }`}
                onClick={() => handleSelectRoom(room)}
              >
                <ImageWithFallback
                  src={getPublicUrl(room.thumbnail)}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                
                <button 
                  className="absolute top-5 right-5 bg-gradient-to-tr from-[#FF6022] to-[#FF8A00] text-white text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full flex items-center gap-2 z-10 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-[#FF6022]/40"
                  onClick={(e) => { e.stopPropagation(); setSelectedDetails(room); }}
                >
                  {room.video ? (
                    <><PlayCircle className="w-4 h-4" />Видео</>
                  ) : (
                    <><Info className="w-4 h-4" />Фото</>
                  )}
                </button>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[24px] p-5 shadow-2xl flex items-center justify-between border border-white/20">
                  <div>
                    <h4 className="text-lg font-bold text-[#1A1A1A]">{room.name}</h4>
                    <div className="flex items-center gap-4 mt-1.5">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#ABABAB]" />
                        <span className="text-xs text-[#747474]">до {room.seats} мест</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Projector className="w-4 h-4 text-[#ABABAB]" />
                        <span className="text-xs text-[#747474]">
                          {room.hasProjection ? "С проекцией" : "Без проекции"}
                        </span>
                      </div>
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