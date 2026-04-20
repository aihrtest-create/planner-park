import { useState } from "react";
import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Check, ChevronLeft, ChevronRight, Users, Clock, Zap, Info } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

import rockyImg1 from "../../assets/rocky-quest-1.png";
import rockyImg2 from "../../assets/rocky-quest-2.png";
import rockyImg3 from "../../assets/rocky-quest-3.png";
import rockyImg4 from "../../assets/rocky-quest-4.png";
import rockyImg5 from "../../assets/rocky-quest-5.png";
import rockyImg6 from "../../assets/rocky-quest-6.png";
import spaceImg from "../../assets/space-quest.png";

const ROCKY_PHOTOS = [rockyImg1, rockyImg2, rockyImg3, rockyImg4, rockyImg5, rockyImg6];

const getPublicUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return ((import.meta as any).env?.BASE_URL || '/') + path.replace(/^\//, '');
};

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
    photos: [spaceImg, ...ROCKY_PHOTOS.slice().reverse()],
  },
];

const CLASSIC_QUESTS = [
  {
    id: "classic_fort",
    name: "Форт Боярд",
    emoji: "🏰",
    image: "/quests/fort.png",
    gradient: "from-[#C8A97E] to-[#8B6914]",
    description: "Добывать заветные ключи и проходить испытания дети будут под руководством Паспарту, которые приготовили для них много всего интересного.",
    highlights: ["Добраться до форта быстрее соперников", "Достать капсулу с подсказкой", "Победить мастера игры", "Собрать 7 ключей для сокровищницы"],
  },
  {
    id: "classic_minecraft",
    name: "Майнкрафт",
    emoji: "⛏️",
    image: "/quests/minecraft.png",
    gradient: "from-[#4CAF50] to-[#2E7D32]",
    description: "Ребята погрузятся в мир Майнкрафта, где им предстоит крафтить, сражаться и проходить эпические испытания.",
    highlights: ["Изготовить собственное оружие", "Искать ресурсы", "Выиграть бой с Эндерменами", "Эстафета с крафт-головой", "Телепортация через портал"],
  },
  {
    id: "classic_squid",
    name: "Игра в кальмара",
    emoji: "🦑",
    image: "/quests/squid.png",
    gradient: "from-[#E53935] to-[#B71C1C]",
    description: "6 раундов испытаний, каждый из которых проверит навыки, ловкость и смекалку. Привычные задания из сериала станут реальностью, но с детским смехом и забавными интерпретациями.",
    highlights: ["6 раундов испытаний", "Головоломки и задания на скорость", "Ловушки и неожиданные повороты", "Настоящий проводник"],
  },
  {
    id: "classic_barbie",
    name: "Барби",
    emoji: "💗",
    image: "/quests/barbie.png",
    gradient: "from-[#F48FB1] to-[#EC407A]",
    description: "Барби и Кен начали новую жизнь в реальном мире, где обнаружили, что совершенства можно достичь только благодаря внутренней гармонии, доброте и дружбе!",
    highlights: ["Знакомство с любимыми персонажами", "Примерить разные образы", "Командные игры и эстафеты", "Мини-дефиле и модные танцы"],
  },
  {
    id: "classic_safari",
    name: "Путешествие Сафари",
    emoji: "🦁",
    image: "/quests/safari.png",
    gradient: "from-[#FFB74D] to-[#F57C00]",
    description: "Исследователи набирают команду юных путешественников, которые отправятся на Сафари, чтобы изучить разнообразных животных и растения, а также отыскать следы древнего динозавра.",
    highlights: ["Старинная карта со станциями", "Интерактив «Спаси обезьянку»", "Интерактив «Землетрясение»", "Поиск следов динозавра"],
  },
  {
    id: "classic_harry",
    name: "Гарри Поттер",
    emoji: "⚡",
    image: "/quests/harry.png",
    gradient: "from-[#7B1FA2] to-[#4A148C]",
    description: "Ученики собираются на платформе вокзала Кинг Кросс, чтобы отправиться в Хогвартс на волшебном экспрессе. Времени мало — нужно успеть подготовить ловушки и выучить новые заклинания.",
    highlights: ["Шляпа Хогвартса выбирает имена", "Разделение на команды", "Поиск философского камня", "Урок волшебства", "Игра в квиддич"],
  },
  {
    id: "classic_heroes",
    name: "Миссия Супергероев",
    emoji: "🦸",
    image: "/quests/heroes.png",
    gradient: "from-[#1565C0] to-[#0D47A1]",
    description: "Супергерои стоят на страже нашей планеты уже долгое время. Но как показывает история, даже супергероям иногда требуется помощь!",
    highlights: ["Сейф с зашифрованным кодом", "Задания от супергероев", "Мега-бомбы с посланиями", "Супергеройская зарядка", "Оружие каждому участнику"],
  },
  {
    id: "classic_pirates",
    name: "Пиратский",
    emoji: "🏴‍☠️",
    image: "/quests/pirates.png",
    gradient: "from-[#6D4C41] to-[#3E2723]",
    description: "Дети станут настоящими пиратами и отправятся на поиски древнего сокровища. В этом путешествии им придётся разобраться с чередой запутанных событий, изучить древние карты и добраться до пещер капитана Моргана.",
    highlights: ["Кодекс Чести пиратов", "Пиратский танец на корабле", "Морские сражения", "Прогулки по джунглям", "Состязания на ловкость"],
  },
  {
    id: "classic_wednesday",
    name: "Уэнсдей",
    emoji: "🖤",
    image: "/quests/wednesday.png",
    gradient: "from-[#424242] to-[#212121]",
    description: "Всей семье Аддамс сегодня нужно отлучиться по важным делам, но в их странном доме скрыты не только тайны, но и сокровища, которые так отчаянно старается разыскать Фестер!",
    highlights: ["Дегустация крови", "Зелье из белладонны", "Шокеры на вылет", "Ужасные головоломки", "Адская кухня «Лизни-откуси»"],
  },
  {
    id: "classic_bloggers",
    name: "Блогеры",
    emoji: "📱",
    image: "/quests/bloggers.png",
    gradient: "from-[#00BCD4] to-[#E91E63]",
    description: "Блогерам по всему миру стали приходить сообщения с угрозами удаления аккаунтов от некого Анонима. Чтобы угрозы прекратились, нужно выполнить ряд заданий.",
    highlights: ["Решить множество головоломок", "Разгадать шифры Анонима", "Открыть тайные кодовые замки", "Спасти соцсети блогеров"],
  },
  {
    id: "classic_fortnite",
    name: "Фортнайт",
    emoji: "🎯",
    image: "/quests/fortnite.png",
    gradient: "from-[#7C4DFF] to-[#304FFE]",
    description: "Главное правило — скооперироваться всей командой, быстро реагировать на изменения и подстраиваться под события. Это незабываемое приключение, которое захватит дух и погрузит в атмосферу драйва.",
    highlights: ["«Силомер» — покажи свою силу", "«Мозгоштурм» — разработка стратегии", "«Бомбоатака» — метание снарядов", "«Энергодвиж» — энергия танца", "«Невидимоход» — азы маскировки"],
  },
  {
    id: "classic_agents",
    name: "Суперагенты",
    emoji: "🕵️",
    image: "/quests/agents.png",
    gradient: "from-[#37474F] to-[#263238]",
    description: "Гангстерская вечеринка для детей — это яркое и незабываемое событие, где они смогут почувствовать себя настоящими героями мира азарта, блеска, приключений и тайн.",
    highlights: ["Праздник в полной секретности", "Много сюрпризов", "Танцы и конкурсы", "Изысканная вечеринка в ретро-стиле"],
  },
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
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={onClose}
      />

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
        <div className="overflow-y-auto flex-1 p-5 overscroll-contain">
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
  const [classicQuestInfo, setClassicQuestInfo] = useState<string | null>(null);
  const selectedClassicQuest = CLASSIC_QUESTS.find(q => q.id === classicQuestInfo);

  const selectPhygital = (id: PhygitalId) => {
    updateState({ questType: id, isQuestPopupOpen: false });
    setOpenQuest(null);
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
        <div className="text-center mb-6 px-4 pt-2">
          <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
            <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">🎉</span>
            Выберите квест
          </h2>
          <p className="text-base font-bold text-[#747474] leading-relaxed">
            Главное приключение дня рождения
          </p>
        </div>

        {/* Phygital section — FLAGSHIP */}
        <div className="mb-6 mt-4">
          {/* Section label */}
          <div className="flex justify-center mb-[32px]">
            <div className="bg-[#5b21cc] text-white text-[19px] sm:text-[22px] font-black tracking-[-0.3px] px-[28px] py-[10px] rounded-[16px] transform rotate-[-2deg] shadow-lg shadow-[#5b21cc]/30">
              Фиджитал квесты
            </div>
          </div>

          {/* Phygital quest cards */}
          <div className="flex flex-col gap-[28px]">
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
                    className={`relative h-[300px] sm:h-[350px] rounded-[32px] overflow-hidden bg-white transition-all cursor-pointer group ${
                      isSelected ? "ring-2 shadow-xl scale-[1.01]" : "ring-1 ring-[#E5E5E5] shadow-sm"
                    }`}
                    style={isSelected ? { outline: `2px solid ${quest.color}`, outlineOffset: "2px" } : {}}
                    onClick={() => selectPhygital(quest.id)}
                  >
                    <img
                      src={quest.photos[0]}
                      alt={quest.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full z-10 shadow-sm flex items-center gap-1.5">
                      <span className="text-base">🚀</span> С полным погружением
                    </div>

                    <button 
                      className="absolute top-4 right-4 bg-gradient-to-tr from-[#FF6022] to-[#FF8A00] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full flex items-center gap-2 z-10 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-[#FF6022]/40"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenQuest(quest);
                        updateState({ isQuestPopupOpen: true });
                      }}
                    >
                      <Info className="w-4 h-4" />Подробнее
                    </button>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[24px] p-4 shadow-2xl flex items-center justify-between border border-white/20">
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-xl leading-none">{quest.emoji}</span>
                          <h4 className="text-[15px] font-bold text-[#1A1A1A] truncate">{quest.title}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-md px-2 py-1">
                            <Clock className="w-3 h-3 text-[#747474]" />
                            <span className="text-[10px] text-[#1A1A1A] font-medium">{quest.duration} мин</span>
                          </div>
                          <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-md px-2 py-1">
                            <Users className="w-3 h-3 text-[#747474]" />
                            <span className="text-[10px] text-[#1A1A1A] font-medium">до {quest.maxKids} детей</span>
                          </div>
                        </div>
                      </div>

                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? "text-white shadow-lg" : "bg-gray-50 text-[#D1D1D1] group-hover:bg-gray-100"
                        }`}
                        style={isSelected ? { backgroundColor: quest.color, boxShadow: `0 10px 15px -3px ${quest.color}4d` } : {}}
                      >
                        <Check className="w-5 h-5 flex-shrink-0" />
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
          <div className="mb-[20px] mt-[16px]">
            <h2 className="text-[24px] tracking-[-0.5px] font-black text-[#1A1A1A] leading-tight mb-1.5">
              Или классические квесты
            </h2>
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-[#747474] font-medium">2 аниматора · до 20 детей · 60 мин.</span>
              {isCustom && (
                <span className="font-semibold text-[#FF6022] bg-[#FF6022]/10 px-2.5 py-0.5 rounded-md">+10 000 ₽</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {CLASSIC_QUESTS.map((quest, i) => {
              const isSelected = state.questType === quest.id;
              return (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectClassic(quest.id as ClassicId)}
                  className={`relative aspect-[4/5] sm:h-[280px] rounded-[24px] overflow-hidden transition-all cursor-pointer group ${
                    isSelected
                      ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]"
                      : "ring-1 ring-[#E5E5E5] shadow-sm"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${quest.gradient} flex items-center justify-center`}>
                    {quest.image ? (
                      <ImageWithFallback src={getPublicUrl(quest.image)} alt={quest.name} className="w-full h-full object-contain object-bottom pt-4 px-2 pb-[65px] drop-shadow-xl group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <span className="text-6xl sm:text-7xl filter drop-shadow-md pb-6 group-hover:scale-110 transition-transform duration-500">{quest.emoji}</span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setClassicQuestInfo(quest.id);
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

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] p-2.5 shadow-lg flex flex-col justify-center border border-white/30 text-center min-h-[50px]">
                     <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">{quest.name}</h4>
                  </div>
                </motion.div>
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

      {/* Classic Quest Info Popup */}
      <AnimatePresence>
        {classicQuestInfo && selectedClassicQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md"
            onClick={() => setClassicQuestInfo(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="relative shrink-0 bg-black">
                <div className={`aspect-[4/3] w-full bg-gradient-to-br ${selectedClassicQuest.gradient} flex items-center justify-center`}>
                  {selectedClassicQuest.image ? (
                    <ImageWithFallback src={getPublicUrl(selectedClassicQuest.image)} alt={selectedClassicQuest.name} className="w-full h-full object-contain object-bottom pt-8 px-4" />
                  ) : (
                    <span className="text-8xl sm:text-9xl filter drop-shadow-md">{selectedClassicQuest.emoji}</span>
                  )}
                </div>
                <button
                  onClick={() => setClassicQuestInfo(null)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full text-[#1A1A1A] transition-colors hover:bg-white z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto overscroll-contain">
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">{selectedClassicQuest.emoji} {selectedClassicQuest.name}</h3>
                <div className="text-xs text-[#747474] mb-4">2 аниматора · до 20 детей · 60 мин.</div>
                <p className="text-[#747474] text-sm leading-relaxed mb-5">
                  {selectedClassicQuest.description}
                </p>

                {selectedClassicQuest.highlights.length > 0 && (
                  <div className="mb-5">
                    <div className="text-sm font-semibold text-[#1A1A1A] mb-2">Что ждёт ребят:</div>
                    <div className="flex flex-col gap-1.5">
                      {selectedClassicQuest.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2 bg-[#F8F8F8] rounded-xl px-3 py-2">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#FF6022]" />
                          <span className="text-xs text-[#3A3A3A]">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const isSelected = state.questType === selectedClassicQuest.id;
                      if (!isSelected) {
                        selectClassic(selectedClassicQuest.id as ClassicId);
                      }
                      setClassicQuestInfo(null);
                    }}
                    className={`flex-1 py-3.5 rounded-xl font-medium text-center transition-all ${
                      state.questType === selectedClassicQuest.id
                        ? "bg-[#F5F5F5] text-[#747474]"
                        : "bg-[#FF6022] text-white shadow-md shadow-[#FF6022]/30 active:scale-[0.98]"
                    }`}
                  >
                    {state.questType === selectedClassicQuest.id ? "Выбрано ✓" : "Выбрать этот квест"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
