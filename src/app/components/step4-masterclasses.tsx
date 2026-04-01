import { useWizard } from "./wizard-context";
import { motion } from "motion/react";
import { Check, Palette } from "lucide-react";

const MASTER_CLASSES = [
  { id: "elsa_tiara", name: "Диадема Эльзы", emoji: "👑", desc: "Создаем волшебную корону" },
  { id: "slimes", name: "Слаймы", emoji: "🧪", desc: "Яркие и тягучие слаймы" },
  { id: "minecraft_weapon", name: "Оружие из Майнкрафта", emoji: "⚔️", desc: "Меч или кирка из пены" },
  { id: "soap_making", name: "Мыловарение", emoji: "🧼", desc: "Ароматное мыло своими руками" },
  { id: "candle_making", name: "Свечи", emoji: "🕯️", desc: "Декоративные свечи" },
  { id: "bracelet", name: "Браслеты дружбы", emoji: "📿", desc: "Плетеные украшения" },
  { id: "painting", name: "Роспись футболок", emoji: "🎨", desc: "Уникальный дизайн" },
  { id: "cookie_deco", name: "Декор печенья", emoji: "🍪", desc: "Украшаем сладости" },
  { id: "flower_crown", name: "Цветочный венок", emoji: "🌸", desc: "Весенние венки из цветов" },
];

export function Step4MasterClasses() {
  const { state, updateState } = useWizard();
  const isCustom = state.packageType === "custom";

  const toggleMC = (id: string) => {
    const current = state.masterClasses;
    if (current.includes(id)) {
      updateState({ masterClasses: current.filter((m) => m !== id) });
    } else {
      updateState({ masterClasses: [...current, id] });
    }
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
        <h2 className="text-xl text-[#1A1A1A] mb-1">Мастер-классы</h2>
        <p className="text-sm text-[#747474]">
          {isCustom
            ? "Каждый мастер-класс — 7 500 ₽"
            : "Выберите мастер-класс, включенный в пакет"}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-[#FF6022]" />
        <h3 className="text-[#1A1A1A]">Доступные мастер-классы</h3>
      </div>

      <div className="space-y-3 mb-6">
        {MASTER_CLASSES.map((mc) => {
          const isSelected = state.masterClasses.includes(mc.id);
          return (
            <motion.button
              key={mc.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleMC(mc.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left bg-white transition-all ${
                isSelected
                  ? "ring-2 ring-[#FF6022] shadow-md"
                  : "ring-1 ring-[#E5E5E5] shadow-sm"
              }`}
            >
              <div className="text-3xl shrink-0">{mc.emoji}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm text-[#1A1A1A]">{mc.name}</h4>
                <p className="text-xs text-[#ABABAB]">{mc.desc}</p>
                {isCustom && (
                  <p className="text-xs text-[#FF6022] mt-0.5">7 500 ₽</p>
                )}
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  isSelected
                    ? "bg-[#FF6022] border-[#FF6022]"
                    : "border-[#E5E5E5]"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {state.masterClasses.length > 0 && isCustom && (
        <div className="bg-[#FF6022]/5 rounded-2xl p-4 mb-6 text-center border border-[#FF6022]/20">
          <p className="text-sm text-[#FF6022]">
            Выбрано: {state.masterClasses.length} МК ={" "}
            <span className="text-base">
              {(state.masterClasses.length * 7500).toLocaleString("ru-RU")} ₽
            </span>
          </p>
        </div>
      )}

    </motion.div>
  );
}