import { useState } from "react";
import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Check, ChevronLeft, ChevronRight, Users, Clock, Zap } from "lucide-react";

import rockyImg1 from "../../assets/rocky-quest-1.png";
import rockyImg2 from "../../assets/rocky-quest-2.png";
import rockyImg3 from "../../assets/rocky-quest-3.png";
import rockyImg4 from "../../assets/rocky-quest-4.png";
import rockyImg5 from "../../assets/rocky-quest-5.png";
import rockyImg6 from "../../assets/rocky-quest-6.png";

const ROCKY_PHOTOS = [rockyImg1, rockyImg2, rockyImg3, rockyImg4, rockyImg5, rockyImg6];

const PHYGITAL_QUESTS = [
  {
    id: "phygital_voxels" as const,
    title: "Воксели",
    subtitle: "Мир Майнкрафт оживает!",
    emoji: "🟩",
    color: "#4CAF50",
    gradientFrom: "#4CAF50",
    gradientTo: "#2E7D32",
    addonPrice: 2000,
    duration: 60,
    maxKids: 20,
    animators: 1,
    description:
      "Лис Рокки приглашает детей в цифровой мир вокселей! Квест объединяет физические активности в парке с интерактивными проекциями — дети «добывают» ресурсы, строят конструкции и сражаются с боссами. Каждый ребёнок — герой, а Рокки — их проводник.",
    highlights: ["Интерактивные проекции", "Физические испытания", "Командная работа", "Финальный босс"],
    photos: ROCKY_PHOTOS,
  },
  {
    id: "phygital_space" as const,
    title: "Космическое приключение",
    subtitle: "Звёзды ждут тебя!",
    emoji: "🚀",
    color: "#3B4DD4",
    gradientFrom: "#3B4DD4",
    gradientTo: "#1a1a7e",
    addonPrice: 2000,
    duration: 60,
    maxKids: 20,
    animators: 1,
    description:
      "Лис Рокки — капитан космического корабля! Дети отправляются в межгалактическую миссию: проходят испытания на невесомость, расшифровывают сигналы с других планет и спасают Вселенную. Цифровые технологии делают каждое задание магически реальным.",
    highlights: ["Космические миссии", "Цифровые спецэффекты", "Командная игра", "Финальное награждение"],
    photos: ROCKY_PHOTOS.slice().reverse(),
  },
];

const CLASSIC_QUESTS = [
  { id: "classic_fort", name: "Форт Боярд", emoji: "🏰" },
  { id: "classic_minecraft", name: "Майнкрафт", emoji: "⛏️" },
  { id: "classic_squid", name: "Игра в кальмара", emoji: "🦑" },
  { id: "classic_barbie", name: "Барби", emoji: "💗" },
  { id: "classic_safari", name: "Путешествие Сафари", emoji: "🦁" },
  { id: "classic_harry", name: "Гарри Поттер", emoji: "⚡" },
  { id: "classic_heroes", name: "Миссия Супергероев", emoji: "🦸" },
  { id: "classic_bloggers", name: "Блогеры", emoji: "📱" },
  { id: "classic_fortnite", name: "Фортнайт", emoji: "🎯" },
  { id: "classic_agents", name: "Суперагенты", emoji: "🕵️" },
];

type PhygitalId = typeof PHYGITAL_QUESTS[number]["id"];
type ClassicId = typeof CLASSIC_QUESTS[number]["id"];

function PhotoStories({ photos, onClose }: { photos: string[]; onClose: () => void }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length);
  const next = () => setCurrent((c) => (c + 1) % photos.length);

  return (
    <div className="relative w-full h-full" onClick={next}>
      {/* Story progress bars */}
      <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-3">
        {photos.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/40 rounded-full overflow-hidden">
            <div
              className={`h-full bg-white rounded-full transition-all duration-300 ${
                i < current ? "w-full" : i === current ? "w-full" : "w-0"
              }`}
              style={i === current ? { animation: "story-progress 4s linear" } : undefined}
            />
          </div>
        ))}
      </div>

      {/* Image */}
      <img
        src={photos[current]}
        alt=""
        className="w-full h-full object-cover"
        draggable={false}
      />

      {/* Navigation */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Close */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-3 right-3 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white z-20"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function QuestPopup({
  quest,
  onClose,
  onSelect,
  isSelected,
}: {
  quest: typeof PHYGITAL_QUESTS[number];
  onClose: () => void;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const [showStories, setShowStories] = useState(true);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-lg bg-white rounded-t-3xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Stories / Media preview */}
        <div className="relative h-64 bg-gray-900 shrink-0">
          {showStories ? (
            <PhotoStories photos={quest.photos} onClose={() => setShowStories(false)} />
          ) : (
            <>
              <img
                src={quest.photos[currentPhoto]}
                alt={quest.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${quest.gradientTo}CC 0%, transparent 50%)`,
                }}
              />

              {/* Play stories button */}
              <button
                onClick={() => setShowStories(true)}
                className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Смотреть фото
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title on image */}
              <div className="absolute bottom-4 left-5">
                <div className="text-white/80 text-sm mb-1">{quest.subtitle}</div>
                <div className="text-white text-2xl font-bold">{quest.emoji} {quest.title}</div>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5">
          {/* Stats */}
          <div className="flex gap-3 mb-5">
            <div className="flex items-center gap-1.5 bg-[#F5F5F5] rounded-xl px-3 py-2 flex-1">
              <Clock className="w-4 h-4 text-[#747474]" />
              <span className="text-sm text-[#1A1A1A]">{quest.duration} мин.</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F5F5F5] rounded-xl px-3 py-2 flex-1">
              <Users className="w-4 h-4 text-[#747474]" />
              <span className="text-sm text-[#1A1A1A]">до {quest.maxKids} детей</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F5F5F5] rounded-xl px-3 py-2 flex-1">
              <Zap className="w-4 h-4 text-[#747474]" />
              <span className="text-sm text-[#1A1A1A]">1 аниматор</span>
            </div>
          </div>

          {/* Rocky badge */}
          <div
            className="flex items-center gap-3 p-4 rounded-2xl mb-5"
            style={{ background: `${quest.color}12`, border: `1px solid ${quest.color}30` }}
          >
            <span className="text-2xl">🦊</span>
            <div>
              <div className="text-sm font-semibold text-[#1A1A1A]">Лис Рокки — ведущий</div>
              <div className="text-xs text-[#747474]">Маскот Hello Park проводит весь праздник</div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#3A3A3A] leading-relaxed mb-5">
            {quest.description}
          </p>

          {/* Highlights */}
          <div className="mb-6">
            <div className="text-sm font-semibold text-[#1A1A1A] mb-3">Что будет на квесте:</div>
            <div className="grid grid-cols-2 gap-2">
              {quest.highlights.map((h) => (
                <div
                  key={h}
                  className="flex items-center gap-2 bg-[#F8F8F8] rounded-xl px-3 py-2.5"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: quest.color }}
                  />
                  <span className="text-xs text-[#3A3A3A]">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Video placeholder */}
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden mb-6 relative">
            <div className="aspect-video flex flex-col items-center justify-center gap-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: quest.color }}
              >
                <Play className="w-7 h-7 text-white fill-current ml-1" />
              </div>
              <div className="text-white/70 text-sm">Промо-видео квеста</div>
              <div className="text-white/40 text-xs">Скоро добавим</div>
            </div>
          </div>
        </div>

        {/* CTA - Fixed at bottom of popup */}
        <div className="mt-auto p-5 pb-8 bg-gradient-to-t from-white via-white to-white/0 relative z-10">
          <button
            onClick={onSelect}
            className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-3 shadow-lg shadow-orange-200"
            style={{ backgroundColor: isSelected ? "#22C55E" : quest.color }}
          >
            {isSelected ? (
              <>
                <Check className="w-5 h-5" />
                Выбрано, продолжаем →
              </>
            ) : (
              `Выбрать этот квест →`
            )}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-[#747474] font-medium text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            ← Назад к списку квестов
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Step2Quests() {
  const { state, updateState, nextStep, prevStep } = useWizard();
  const [openQuest, setOpenQuest] = useState<typeof PHYGITAL_QUESTS[number] | null>(null);

  const selectPhygital = (id: PhygitalId) => {
    updateState({ questType: id, isQuestPopupOpen: false });
    setOpenQuest(null);
    nextStep();
  };

  const selectClassic = (id: ClassicId) => {
    updateState({ questType: id });
  };

  const isPhygitalSelected = state.questType?.startsWith("phygital_");
  const isClassicSelected = state.questType?.startsWith("classic_");
  const isCustom = state.packageType === "custom";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
        className="px-4 pb-6"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">Выберите квест</h2>
          <p className="text-sm text-[#747474]">
            Главное приключение дня рождения
          </p>
        </div>

        {/* Phygital section — FLAGSHIP */}
        <div className="mb-6">
          {/* Section label */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-[#E5E5E5]" />
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <span>🦊</span>
              <span>ФИДЖИТАЛ ДР — флагман парка</span>
            </div>
            <div className="h-px flex-1 bg-[#E5E5E5]" />
          </div>

          {/* Phygital quest cards */}
          <div className="space-y-3">
            {PHYGITAL_QUESTS.map((quest, i) => {
              const isSelected = state.questType === quest.id;

              return (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div
                    className="relative rounded-3xl overflow-hidden cursor-pointer active:scale-[0.98] transition-all duration-200"
                    style={{
                      outline: isSelected ? `3px solid ${quest.color}` : "none",
                      outlineOffset: "2px",
                    }}
                    onClick={() => {
                      setOpenQuest(quest);
                      updateState({ isQuestPopupOpen: true });
                    }}
                  >
                    {/* Background image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={quest.photos[0]}
                        alt={quest.title}
                        className="w-full h-full object-cover scale-105"
                      />
                      {/* Gradient overlay */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(160deg, ${quest.gradientFrom}99 0%, ${quest.gradientTo}EE 100%)`,
                        }}
                      />

                      {/* Content on card */}
                      <div className="absolute inset-0 p-5 flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                            🦊 С Лисом Рокки
                          </div>
                          {isSelected && (
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4" style={{ color: quest.color }} />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-3xl mb-1">{quest.emoji}</div>
                          <h3 className="text-white text-xl font-bold mb-0.5">{quest.title}</h3>
                          <p className="text-white/80 text-sm mb-4">{quest.subtitle}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                                ⏱ {quest.duration} мин.
                              </div>
                              <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                                +{quest.addonPrice.toLocaleString("ru-RU")} ₽
                              </div>
                            </div>
                            <div className="bg-white text-[#1A1A1A] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                              <Play className="w-3 h-3 fill-current" />
                              Подробнее
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Classic quests section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-[#E5E5E5]" />
            <span className="text-xs font-bold text-[#747474] px-2 tracking-wide uppercase">ИЛИ КЛАССИЧЕСКИЕ КВЕСТЫ</span>
            <div className="h-px flex-1 bg-[#E5E5E5]" />
          </div>

          {/* Classic info */}
          <div className="bg-[#F8F8F8] rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-[#747474]">2 аниматора · до 20 детей · 60 мин.</span>
              {isCustom ? (
                <span className="font-semibold text-[#1A1A1A]">+10 000 ₽</span>
              ) : (
                <span className="font-semibold text-[#22C55E]">Включено</span>
              )}
            </div>
            <p className="text-xs text-[#ABABAB]">Классический квест в парке с готовым сценарием под ключ</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {CLASSIC_QUESTS.map((quest, i) => {
              const isSelected = state.questType === quest.id;
              return (
                <motion.button
                  key={quest.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectClassic(quest.id as ClassicId)}
                  className={`relative flex items-center gap-2.5 p-3.5 rounded-2xl text-left transition-all ${
                    isSelected
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-white ring-1 ring-[#E5E5E5] text-[#1A1A1A]"
                  }`}
                >
                  <span className="text-xl shrink-0">{quest.emoji}</span>
                  <span className="text-sm font-medium leading-tight">{quest.name}</span>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Quest popup */}
      <AnimatePresence>
        {openQuest && (
          <QuestPopup
            quest={openQuest}
            onClose={() => {
              setOpenQuest(null);
              updateState({ isQuestPopupOpen: false });
            }}
            onSelect={() => selectPhygital(openQuest.id)}
            isSelected={state.questType === openQuest.id}
          />
        )}
      </AnimatePresence>
    </>
  );
}
