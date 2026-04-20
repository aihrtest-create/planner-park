import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";

const BASE = import.meta.env.BASE_URL;

type AnimatorCategory =
  | "all"
  | "princesses"
  | "superheroes"
  | "villains"
  | "cartoons"
  | "games"
  | "universal";

interface Animator {
  id: string;
  name: string;
  category: AnimatorCategory;
  image: string;
  tag?: string;
}

const CATEGORIES: { id: AnimatorCategory; label: string; emoji: string }[] = [
  { id: "all", label: "Все", emoji: "✨" },
  { id: "princesses", label: "Принцессы", emoji: "👑" },
  { id: "superheroes", label: "Супергерои", emoji: "🦸" },
  { id: "villains", label: "Антигерои", emoji: "🖤" },
  { id: "cartoons", label: "Мультики", emoji: "🎬" },
  { id: "games", label: "Игры", emoji: "🎮" },
  { id: "universal", label: "Другие", emoji: "🌟" },
];

const ANIMATORS: Animator[] = [
  // Принцессы и куклы
  {
    id: "elsa_anna",
    name: "Эльза и Анна",
    category: "princesses",
    image: "/animators/elsa-anna.png",
    tag: "🔥 ТОП",
  },
  {
    id: "lol_dolls",
    name: "Куклы ЛОЛ",
    category: "princesses",
    image: "/animators/lol-dolls.png",
    tag: "Хит",
  },
  {
    id: "barbie_ken",
    name: "Барби и Кен",
    category: "princesses",
    image: "/animators/barbie-ken.png",
  },
  {
    id: "ariel",
    name: "Русалочка",
    category: "princesses",
    image: "/animators/ariel.png",
  },
  {
    id: "little_pony",
    name: "Литл Пони",
    category: "princesses",
    image: "/animators/little-pony.png",
  },

  // Супергерои
  {
    id: "spiderman",
    name: "Человек-Паук",
    category: "superheroes",
    image: "/animators/spiderman.jpg",
    tag: "🔥 ТОП",
  },
  {
    id: "transformers",
    name: "Трансформеры",
    category: "superheroes",
    image: "/animators/transformers.png",
  },

  // Антигерои
  {
    id: "wednesday",
    name: "Уэнсдей и Энид",
    category: "villains",
    image: "/animators/wednesday.png",
    tag: "Тренд",
  },
  {
    id: "harley_joker",
    name: "Харли и Джокер",
    category: "villains",
    image: "/animators/harley-joker.png",
    tag: "Хит",
  },
  {
    id: "huggy_wuggy",
    name: "Хагги Вагги",
    category: "villains",
    image: "/animators/huggy-wuggy.png",
  },

  // Мультики
  {
    id: "ladybug",
    name: "Леди Баг",
    category: "cartoons",
    image: "/animators/ladybug.png",
    tag: "Хит",
  },
  {
    id: "naruto",
    name: "Наруто",
    category: "cartoons",
    image: "/animators/naruto.png",
    tag: "Тренд",
  },
  {
    id: "moana",
    name: "Моана и Мауи",
    category: "cartoons",
    image: "/animators/moana.png",
  },
  {
    id: "tri_kota",
    name: "Три Кота",
    category: "cartoons",
    image: "/animators/tri-kota.png",
  },
  {
    id: "alice",
    name: "Алиса",
    category: "cartoons",
    image: "/animators/alice.png",
  },

  // Компьютерные игры
  {
    id: "minecraft",
    name: "Майнкрафт",
    category: "games",
    image: "/animators/minecraft.png",
    tag: "Хит",
  },
  {
    id: "brawl_stars",
    name: "Бравл Старс",
    category: "games",
    image: "/animators/brawl-stars.png",
  },

  // Универсальные / Другие
  {
    id: "harry_potter",
    name: "Гарри Поттер",
    category: "universal",
    image: "/animators/harry-potter.jpg",
    tag: "🔥 ТОП",
  },
  {
    id: "pirates",
    name: "Пираты",
    category: "universal",
    image: "/animators/pirates.png",
  },
  {
    id: "bloggers",
    name: "Блогеры",
    category: "universal",
    image: "/animators/bloggers.png",
  },
  {
    id: "labubu",
    name: "Лабуба",
    category: "universal",
    image: "/animators/labubu.png",
    tag: "Тренд",
  },
];

const TAG_STYLES: Record<string, string> = {
  "🔥 ТОП":
    "bg-gradient-to-r from-[#FF6022] to-[#FF8A50] text-white shadow-sm",
  Хит: "bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-sm",
  Тренд:
    "bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white shadow-sm",
};

export function Step3Animators() {
  const { state, updateState } = useWizard();
  const [activeCategory, setActiveCategory] =
    useState<AnimatorCategory>("all");

  const toggleAnimator = (id: string) => {
    const current = state.animators;
    if (current.includes(id)) {
      updateState({ animators: current.filter((a) => a !== id) });
    } else if (current.length < 2) {
      updateState({ animators: [...current, id] });
    }
  };

  const filteredAnimators =
    activeCategory === "all"
      ? ANIMATORS
      : ANIMATORS.filter((a) => a.category === activeCategory);

  return (
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
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">
            🦸‍♂️
          </span>
          Любимые герои
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">
          На празднике 2 артиста. Выберите до 2-х героев
        </p>
      </div>

      {state.questType?.startsWith("phygital_") && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 mb-5 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[#FF6022] font-bold text-sm mb-1">
              К фиджитал-квесту!
            </h3>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              Вы выбрали приключение с Лисом Рокки. Теперь вы можете добавить
              любимых героев, которые присоединятся к нему на празднике!
            </p>
          </div>
          <div className="absolute -bottom-2 -right-2 text-6xl opacity-20 transform rotate-12">
            🦊
          </div>
        </div>
      )}

      {/* Selection counter */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-sm text-[#747474]">
          Выбрано:{" "}
          <span className="font-bold text-[#1A1A1A]">
            {state.animators.length}
          </span>{" "}
          / 2
        </span>
        {state.animators.length === 2 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1"
          >
            <Check className="w-3 h-3" /> Отлично!
          </motion.span>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 -mx-4 px-4 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count =
            cat.id === "all"
              ? ANIMATORS.length
              : ANIMATORS.filter((a) => a.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#1A1A1A] text-white shadow-md"
                  : "bg-white text-[#747474] ring-1 ring-[#E5E5E5]"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-[#F5F5F5] text-[#ABABAB]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Animators grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <AnimatePresence mode="popLayout">
          {filteredAnimators.map((anim, idx) => {
            const isSelected = state.animators.includes(anim.id);
            const isDisabled =
              !isSelected && state.animators.length >= 2;
            return (
              <motion.button
                key={anim.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleAnimator(anim.id)}
                disabled={isDisabled}
                className={`relative rounded-2xl text-left bg-white transition-all overflow-hidden ${
                  isSelected
                    ? "ring-2 ring-[#FF6022] shadow-lg shadow-[#FF6022]/10"
                    : isDisabled
                    ? "ring-1 ring-[#E5E5E5] opacity-45"
                    : "ring-1 ring-[#E5E5E5] shadow-sm hover:shadow-md"
                }`}
              >
                {/* Image container */}
                <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#F8F8F8] to-[#EFEFEF] overflow-hidden">
                  <img
                    src={`${BASE}${anim.image.startsWith('/') ? anim.image.slice(1) : anim.image}`}
                    alt={anim.name}
                    className="w-full h-full object-contain object-center p-1"
                    loading="lazy"
                  />

                  {/* Tag badge */}
                  {anim.tag && (
                    <div
                      className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                        TAG_STYLES[anim.tag] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {anim.tag}
                    </div>
                  )}

                  {/* Selected checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 bg-[#FF6022] rounded-full p-1 shadow-md"
                    >
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>

                {/* Name */}
                <div className="p-3 pt-2">
                  <h4 className="text-sm font-semibold text-[#1A1A1A] leading-tight">
                    {anim.name}
                  </h4>
                </div>

                {/* Selected glow overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-[#FF6022]/[0.03] pointer-events-none rounded-2xl" />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredAnimators.length === 0 && (
        <div className="text-center py-8 text-[#ABABAB]">
          <p className="text-sm">Нет героев в этой категории</p>
        </div>
      )}

      {/* Premium costume info */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-4 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">
              Свой герой
            </h3>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              Не нашли нужного персонажа? Напишите нам — мы подберём костюм
              специально под вашу тему!
            </p>
          </div>
        </div>
        <div className="absolute -bottom-3 -right-3 text-5xl opacity-10 transform rotate-12">
          ✨
        </div>
      </div>
    </motion.div>
  );
}