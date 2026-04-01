import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { Check, Moon, Sun } from "lucide-react";

const PACKAGES = [
  {
    id: "basic" as const,
    name: "Базовый",
    emoji: "✨",
    accentColor: "#FF6022",
    bgGradient: "from-orange-50 to-amber-50",
    weekdayPrice: 24900,
    weekendPrice: null, // weekday only
    duration: "2,5 часа",
    features: [
      "Безлимитные билеты в парк — 8 шт.",
      "WOW-поздравление от Лиса Рокки",
      "Анимационная программа — 45 мин.",
      "Мини-дискотека — 15 мин.",
      "Украшение шарами с гелием — 8 шт.",
      "Подарок имениннику",
      "Электронные пригласительные",
    ],
    badge: null,
  },
  {
    id: "premium" as const,
    name: "Премиум",
    emoji: "🎉",
    accentColor: "#FF6022",
    bgGradient: "from-rose-50 to-orange-50",
    weekdayPrice: 47900,
    weekendPrice: 57900,
    duration: "3 часа",
    features: [
      "Безлимитные билеты в парк — 8 шт.",
      "WOW-поздравление от Лиса Рокки",
      "Анимационная программа — 45 мин.",
      "Мини-дискотека или треш-коробка — 25 мин.",
      "Украшение шарами (гелий + фонтан из шаров)",
      "Мастер-класс на выбор — 30 мин.",
      "Шар-сюрприз",
      "Детские обеды",
      "Подарок имениннику",
    ],
    badge: "ХИТ",
  },
  {
    id: "exclusive" as const,
    name: "Эксклюзив",
    emoji: "👑",
    accentColor: "#6C4AED",
    bgGradient: "from-violet-50 to-purple-50",
    weekdayPrice: 79900,
    weekendPrice: 89900,
    duration: "4 часа",
    features: [
      "Безлимитные билеты в парк — 8 шт.",
      "WOW-поздравление от Лиса Рокки",
      "Анимационная программа — 45 мин.",
      "Мини-дискотека или треш-коробка — 25 мин.",
      "Украшение шарами (максимальный набор)",
      "Мастер-класс на выбор — 30 мин.",
      "Шоу-программа на выбор — 30 мин.",
      "Шар-сюрприз или Пиньята + Шар-цифра",
      "Детские обеды + Подарки всем гостям",
      "Фотограф — 2 часа",
    ],
    badge: null,
  },
  {
    id: "custom" as const,
    name: "Собери сам",
    emoji: "🧩",
    accentColor: "#FF6022",
    bgGradient: "from-gray-50 to-gray-100",
    weekdayPrice: 0,
    weekendPrice: 0,
    duration: "Любое время",
    features: [
      "Выберите только то, что нужно",
      "Гибкое ценообразование",
      "Любые комбинации услуг",
      "Индивидуальный подход",
    ],
    badge: null,
  },
];

function formatPrice(price: number) {
  return price.toLocaleString("ru-RU");
}

export function Step1Format() {
  const { state, updateState, nextStep } = useWizard();

  const handleSelect = (id: typeof PACKAGES[number]["id"]) => {
    updateState({ packageType: id });
  };

  const handleWeekendToggle = (isWeekend: boolean) => {
    // If switching to weekend and basic is selected, reset
    if (isWeekend && state.packageType === "basic") {
      updateState({ isWeekend: true, packageType: null });
    } else {
      updateState({ isWeekend });
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
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1">
          Выберите пакет
        </h1>
        <p className="text-[#747474] text-sm">
          Всё для незабываемого праздника вашего ребёнка
        </p>
      </div>

      {/* Weekday / Weekend toggle */}
      <div className="sticky top-[76px] z-30 bg-[#F7F7F7] pt-2 pb-4 -mx-4 px-4 mb-2">
        <div className="flex items-center gap-1 bg-[#F0F0F0] p-1 rounded-2xl">
          <button
            onClick={() => handleWeekendToggle(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              !state.isWeekend
                ? "bg-white text-[#1A1A1A] shadow-sm"
                : "text-[#747474]"
            }`}
          >
            <Sun className="w-4 h-4" />
            Будни
          </button>
          <button
            onClick={() => handleWeekendToggle(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              state.isWeekend
                ? "bg-white text-[#1A1A1A] shadow-sm"
                : "text-[#747474]"
            }`}
          >
            <Moon className="w-4 h-4" />
            Выходные
          </button>
        </div>
      </div>

      {/* Weekend note */}
      <AnimatePresence>
        {state.isWeekend && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-amber-700 text-xs">
                🌟 Пакет «Базовый» доступен только по будням. В выходные — «Премиум» и «Эксклюзив».
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Package cards */}
      <div className="space-y-3">
        {PACKAGES.map((pkg, i) => {
          const isSelected = state.packageType === pkg.id;
          const isDisabled = pkg.weekendPrice === null && state.isWeekend;
          const displayPrice = state.isWeekend ? pkg.weekendPrice : pkg.weekdayPrice;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isDisabled ? 0.4 : 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <button
                onClick={() => !isDisabled && handleSelect(pkg.id)}
                disabled={isDisabled}
                className={`w-full text-left rounded-2xl bg-white overflow-hidden transition-all duration-300 ${
                  isDisabled
                    ? "opacity-40 cursor-not-allowed"
                    : isSelected
                    ? "shadow-lg"
                    : "ring-1 ring-[#E5E5E5] shadow-sm hover:shadow-md active:scale-[0.99]"
                }`}
                style={isSelected ? {
                  outline: `2px solid ${pkg.accentColor}`,
                  outlineOffset: "-2px",
                  boxShadow: `0 4px 24px ${pkg.accentColor}25`,
                } : undefined}
              >
                <div className="p-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pkg.emoji}</span>
                      <div>
                        <h3 className="text-base font-semibold text-[#1A1A1A]">
                          {pkg.name}
                        </h3>
                        <span className="text-[11px] text-[#ABABAB]">{pkg.duration} · 8 билетов</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {pkg.badge && !isSelected && (
                        <span
                          className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                          style={{ backgroundColor: pkg.accentColor }}
                        >
                          {pkg.badge}
                        </span>
                      )}
                      {isSelected && (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: pkg.accentColor }}
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-1.5 mb-4">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[#3A3A3A]">
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-[6px] shrink-0"
                          style={{ backgroundColor: pkg.accentColor }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="flex items-baseline justify-between pt-3 border-t border-[#F0F0F0]">
                    <div className="flex items-baseline gap-2">
                      {isDisabled ? (
                        <span className="text-sm text-[#ABABAB]">Только в будни</span>
                      ) : (
                        <>
                          <span className="text-xl font-bold" style={{ color: pkg.accentColor }}>
                            {formatPrice(displayPrice!)} ₽
                          </span>
                          {!state.isWeekend && pkg.weekendPrice && (
                            <span className="text-xs text-[#ABABAB]">
                              {formatPrice(pkg.weekendPrice)} ₽ в выходные
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

    </motion.div>
  );
}