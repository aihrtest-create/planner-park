import { useWizard } from "./wizard-context";
import { motion } from "motion/react";
import { Check, Sparkles, Star } from "lucide-react";

const ANIMATORS = [
  { id: "princess_elsa", name: "Принцесса Эльза", category: "Принцессы", emoji: "👸" },
  { id: "princess_rapunzel", name: "Рапунцель", category: "Принцессы", emoji: "👑" },
  { id: "princess_bell", name: "Принцесса Белль", category: "Принцессы", emoji: "🌹" },
  { id: "spiderman", name: "Человек-Паук", category: "Супергерои", emoji: "🕷️" },
  { id: "batman", name: "Бэтмен", category: "Супергерои", emoji: "🦇" },
  { id: "ironman", name: "Железный Человек", category: "Супергерои", emoji: "🤖" },
  { id: "pirate", name: "Пират", category: "Приключения", emoji: "🏴‍☠️" },
  { id: "wizard", name: "Волшебник", category: "Приключения", emoji: "🧙" },
  { id: "fairy", name: "Фея", category: "Волшебство", emoji: "🧚" },
  { id: "clown", name: "Клоун", category: "Классика", emoji: "🤡" },
];

const PREMIUM_COSTUMES = [
  { id: "bumblebee", name: "Бамблби", price: "+8 000 ₽", emoji: "🤖" },
  { id: "genie", name: "Джин", price: "+8 000 ₽", emoji: "🧞" },
  { id: "rabbit", name: "Кролик", price: "+8 000 ₽", emoji: "🐰" },
  { id: "dinosaur", name: "Динозавр", price: "+8 000 ₽", emoji: "🦕" },
  { id: "mr_blue", name: "Мистер Блю", price: "+8 000 ₽", emoji: "💙" },
  { id: "unicorn", name: "Единорог", price: "+8 000 ₽", emoji: "🦄" },
];

export function Step3Animators() {
  const { state, updateState } = useWizard();

  const toggleAnimator = (id: string) => {
    const current = state.animators;
    if (current.includes(id)) {
      updateState({ animators: current.filter((a) => a !== id) });
    } else if (current.length < 2) {
      updateState({ animators: [...current, id] });
    }
  };

  const selectPremium = (id: string) => {
    updateState({ premiumCostume: state.premiumCostume === id ? null : id });
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
        <h2 className="text-xl text-[#1A1A1A] mb-1">Любимые герои</h2>
        <p className="text-sm text-[#747474]">
          На празднике 2 артиста. Выберите до 2-х героев
        </p>
      </div>

      {state.questType?.startsWith("phygital_") && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[#FF6022] font-bold text-sm mb-1">К фиджитал-квесту!</h3>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              Вы выбрали приключение с Лисом Рокки. Теперь вы можете добавить любимых героев, которые присоединятся к нему на празднике!
            </p>
          </div>
          <div className="absolute -bottom-2 -right-2 text-6xl opacity-20 transform rotate-12">🦊</div>
        </div>
      )}

      {/* Animators grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {ANIMATORS.map((anim) => {
          const isSelected = state.animators.includes(anim.id);
          return (
            <motion.button
              key={anim.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleAnimator(anim.id)}
              className={`relative p-4 rounded-2xl text-left bg-white transition-all ${
                isSelected
                  ? "ring-2 ring-[#FF6022] shadow-md"
                  : "ring-1 ring-[#E5E5E5] shadow-sm"
              }`}
            >
              <div className="text-3xl mb-2">{anim.emoji}</div>
              <h4 className="text-sm text-[#1A1A1A]">{anim.name}</h4>
              <p className="text-xs text-[#ABABAB]">{anim.category}</p>
              {isSelected && (
                <div className="absolute top-2 right-2 bg-[#FF6022] rounded-full p-0.5">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Premium costumes */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-[#FF6022]" />
          <h3 className="text-[#1A1A1A]">Премиум костюмы</h3>
          <span className="text-[10px] bg-[#FF6022]/10 text-[#FF6022] px-2 py-0.5 rounded-full">
            Доплата
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {PREMIUM_COSTUMES.map((costume) => {
            const isSelected = state.premiumCostume === costume.id;
            return (
              <motion.button
                key={costume.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectPremium(costume.id)}
                className={`p-3 rounded-xl text-center bg-white transition-all ${
                  isSelected
                    ? "ring-2 ring-[#FF6022] shadow-md"
                    : "ring-1 ring-[#E5E5E5] shadow-sm"
                }`}
              >
                <div className="text-2xl mb-1">{costume.emoji}</div>
                <h4 className="text-xs text-[#1A1A1A]">{costume.name}</h4>
                <p className="text-[10px] text-[#FF6022] mt-0.5">{costume.price}</p>
                {isSelected && (
                  <Star className="w-3 h-3 text-[#FF6022] mx-auto mt-1" fill="#FF6022" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}