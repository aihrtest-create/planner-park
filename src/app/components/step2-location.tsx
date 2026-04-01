import React, { useState } from "react";
import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { Users, Projector, Check, MapPin, Coffee, Info, PlayCircle, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose } from "./ui/drawer";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Button } from "./ui/button";

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
    thumbnail: "https://images.unsplash.com/photo-1764813823899-8d76d0c0c850?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGluZG9vciUyMHBsYXlncm91bmQlMjBmdXR1cmlzdGljfGVufDF8fHx8MTc3Mzc1MTc1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    gallery: ["https://images.unsplash.com/photo-1764813823899-8d76d0c0c850?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGluZG9vciUyMHBsYXlncm91bmQlMjBmdXR1cmlzdGljfGVufDF8fHx8MTc3Mzc1MTc1M3ww&ixlib=rb-4.1.0&q=80&w=1080"],
    video: "",
    description: "Футуристичное пространство для современных детей. Множество интерактивных зон и проекций сделают праздник невероятно увлекательным.",
  },
  {
    id: "patiroom_pikseli",
    name: "Пиксели",
    seats: 12,
    hasProjection: false,
    thumbnail: "https://images.unsplash.com/photo-1748518557177-fd9ffd0df1f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY3JhZnQlMjB3b3Jrc2hvcCUyMHNsaW1lJTIwbWFraW5nfGVufDF8fHx8MTc3Mzc1MTc1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    gallery: ["https://images.unsplash.com/photo-1748518557177-fd9ffd0df1f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY3JhZnQlMjB3b3Jrc2hvcCUyMHNsaW1lJTIwbWFraW5nfGVufDF8fHx8MTc3Mzc1MTc1Mnww&ixlib=rb-4.1.0&q=80&w=1080"],
    video: "",
    description: "Стильная и компактная комната для творческих мастер-классов и камерных дней рождения. Уютная обстановка для небольшой компании.",
  },
];

const CAFE_OPTIONS = [
  {
    id: "cafe_round",
    name: "Зона с круглым столом",
    description: "До 8 гостей",
    deposit: "5 000 — 10 000 ₽",
    depositNote: "будни / выходные",
    thumbnail: "/locations/cafe/round.jpg",
  },
  {
    id: "cafe_pink",
    name: "За розовыми шторками",
    description: "До 10 человек (две компании)",
    deposit: "5 000 — 10 000 ₽",
    depositNote: "будни / выходные",
    thumbnail: "/locations/cafe/pink.jpg",
  },
  {
    id: "cafe_pink_full",
    name: "Вся зона за шторками",
    description: "Аренда зоны целиком",
    deposit: "10 000 — 20 000 ₽",
    depositNote: "будни / выходные (x2)",
    thumbnail: "/locations/cafe/pink.jpg",
  },
];

export function Step2Location() {
  const { state, updateState } = useWizard();
  const [selectedDetails, setSelectedDetails] = useState<typeof PATIROOMS[0] | null>(null);

  const handleSelectRoom = (room: typeof PATIROOMS[0]) => {
    updateState({
      location: room.id,
      locationDetails: room.name,
    });
  };

  const handleSelectCafe = (opt: typeof CAFE_OPTIONS[0]) => {
    updateState({
      location: opt.id,
      locationDetails: opt.name,
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
      <div className="text-center mb-5">
        <h2 className="text-xl text-[#1A1A1A] mb-1">Выберите локацию</h2>
        <p className="text-sm text-[#747474]">Где пройдет ваш праздник?</p>
      </div>

      {/* Patirooms */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-[#FF6022]" />
          <h3 className="text-[#1A1A1A] font-medium">Патирумы</h3>
        </div>
        <p className="text-xs text-[#747474] mb-3">
          Интерактивные столы и проекции на стенах. При отдельном бронировании — 3 000 ₽/час.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {PATIROOMS.map((room) => {
            const isSelected = state.location === room.id;
            return (
              <div
                key={room.id}
                className={`relative rounded-3xl overflow-hidden bg-white transition-all cursor-pointer group ${
                  isSelected ? "ring-2 ring-[#FF6022] shadow-lg" : "ring-1 ring-[#E5E5E5] shadow-sm"
                }`}
                onClick={() => handleSelectRoom(room)}
              >
                {/* Background Image */}
                <div className="relative h-72 sm:h-80 w-full">
                  <ImageWithFallback
                    src={room.thumbnail}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Video/Info Trigger */}
                  <button 
                    className="absolute top-4 right-4 bg-gradient-to-tr from-[#FF6022] to-[#FF8A00] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-full flex items-center gap-2 z-10 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-[#FF6022]/40"
                    onClick={(e) => { e.stopPropagation(); setSelectedDetails(room); }}
                  >
                    {room.video ? (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        Видео
                      </>
                    ) : (
                      <>
                        <Info className="w-4 h-4" />
                        Фото
                      </>
                    )}
                  </button>
                </div>

                {/* Floating Info Plate at Bottom */}
                <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-[#1A1A1A]">{room.name}</h4>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#ABABAB]" />
                        <span className="text-xs text-[#747474]">до {room.seats} мест</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Projector className="w-3.5 h-3.5 text-[#ABABAB]" />
                        <span className="text-xs text-[#747474]">
                          {room.hasProjection ? "С проекцией" : "Без проекции"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Select Button/Checkbox */}
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? "bg-[#FF6022] text-white shadow-md shadow-[#FF6022]/30" : "bg-gray-100 text-[#ABABAB] group-hover:bg-gray-200"
                    }`}
                  >
                    <Check className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cafe zones */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Coffee className="w-5 h-5 text-[#FF6022]" />
          <h3 className="text-[#1A1A1A] font-medium">Столы в зоне кафе</h3>
        </div>
        <p className="text-xs text-[#747474] mb-3">Бронирование на 3 часа</p>

        <div className="grid grid-cols-1 gap-3">
          {CAFE_OPTIONS.map((opt) => {
            const isSelected = state.location === opt.id;
            return (
              <motion.button
                key={opt.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectCafe(opt)}
                className={`w-full text-left rounded-2xl overflow-hidden bg-white transition-all flex items-center ${
                  isSelected
                    ? "ring-2 ring-[#FF6022] shadow-md"
                    : "ring-1 ring-[#E5E5E5] shadow-sm"
                }`}
              >
                <div className="w-24 h-24 shrink-0">
                  <ImageWithFallback
                    src={opt.thumbnail}
                    alt={opt.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex-grow relative">
                  <h4 className="text-sm font-semibold text-[#1A1A1A] pr-6">{opt.name}</h4>
                  <p className="text-xs text-[#747474] mt-0.5">{opt.description}</p>
                  <p className="text-xs font-medium text-[#FF6022] mt-1.5">
                    Депозит: {opt.deposit}
                  </p>
                  <p className="text-[10px] text-[#ABABAB] mt-0.5">
                    {opt.depositNote}
                  </p>
                  
                  <div className={`absolute top-3 right-3 rounded-full p-0.5 ${isSelected ? "bg-[#FF6022]" : "bg-gray-100"}`}>
                    <Check className={`w-4 h-4 ${isSelected ? "text-white" : "text-gray-300"}`} />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Details Drawer */}
      <Drawer open={!!selectedDetails} onOpenChange={(open) => !open && setSelectedDetails(null)}>
        <DrawerContent className="max-h-[90vh] w-full max-w-lg mx-auto bg-white pt-2 px-2 flex flex-col rounded-t-3xl">
          <div className="mx-auto mt-2 h-1.5 w-12 shrink-0 rounded-full bg-gray-200 mb-4" />
          
          {selectedDetails && (
            <div className="flex-1 overflow-y-auto pb-safe">
              <div className="relative rounded-2xl overflow-hidden mb-4 bg-black w-full flex items-center justify-center">
                {selectedDetails.video ? (
                  <video
                    src={selectedDetails.video}
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
                          <img src={img} alt="" className="w-full h-full object-contain" />
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
                    handleSelectRoom(selectedDetails);
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