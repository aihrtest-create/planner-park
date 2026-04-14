import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { Check, Moon, Sun } from "lucide-react";

/* ─── Package Data ─── */
const PACKAGES = [
  {
    id: "basic" as const,
    name: "Базовый",
    emoji: "✨",
    nameColor: "#ef5299",
    borderColor: "#ef5299",
    duration: "2,5 часа",
    weekdayOnly: true,
    features: [
      "Безлимитные билеты в парк — 8 шт.",
      "WOW-поздравление от Лиса Рокки",
      "Анимационная программа — 45 мин.",
      "Мини-дискотека — 15 мин.",
      "Украшение шарами с гелием — 8 шт.",
      "Подарок имениннику",
      "Электронные пригласительные",
    ],
    weekdayPrice: 24900,
    weekendPrice: null,
    oldPrice: 32900,
  },
  {
    id: "premium" as const,
    name: "Премиум",
    emoji: "🎉",
    nameColor: "#ff7f00",
    borderColor: "#ff7f00",
    duration: "3 часа",
    weekdayOnly: false,
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
    weekdayPrice: 47900,
    weekendPrice: 57900,
    oldPrice: 63990,
  },
  {
    id: "exclusive" as const,
    name: "Эксклюзив",
    emoji: "👑",
    nameColor: "#5b21cc",
    borderColor: "#5b21cc",
    duration: "4 часа",
    weekdayOnly: false,
    features: [
      "Безлимитные билеты в парк — 8 шт.",
      "WOW-поздравление + интерактивное поздравление",
      "Анимационная программа — 45 мин.",
      "Мини-дискотека или треш-коробка — 25 мин.",
      "Украшение комнаты шарами",
      "Аренда Party-room на 4 часа",
      "Кулинарный мастер-класс",
      "Шоу-программа на выбор — 30 мин.",
      "Шар-сюрприз или Пиньята",
      "Детские обеды",
      "Подарки всем гостям",
      "Фотограф — 2 часа",
    ],
    weekdayPrice: 79900,
    weekendPrice: 89900,
    oldPrice: 105990,
  }
];

function formatPrice(price: number) {
  return price.toLocaleString("ru-RU");
}

export function Step1Format() {
  const { state, updateState } = useWizard();

  const handleSelect = (id: typeof PACKAGES[number]["id"]) => {
    const includeFood = id === "premium" || id === "exclusive";
    updateState({ packageType: id, includeFood });
  };

  const handleWeekendToggle = (isWeekend: boolean) => {
    if (isWeekend && state.packageType === "basic") {
      updateState({ isWeekend: true, packageType: null, includeFood: false });
    } else {
      updateState({ isWeekend });
    }
  };

  const renderFeature = (text: string) => {
    if (text.startsWith("Безлимитные билеты в парк") && text.includes(" — ")) {
      const parts = text.split(" — ");
      return (
        <span className="font-medium text-[#101011] text-[16px] leading-[22.4px] flex items-center flex-wrap">
          {parts[0]} —{" "}
          <span className="bg-[#ff6022] text-white font-bold px-[8px] py-[2px] rounded-[9px] ml-[4px] leading-none inline-flex items-center" style={{ height: '24px' }}>
            {parts[1]}
          </span>
        </span>
      );
    }
    
    if (text.startsWith("Анимационная программа") && text.includes(" — ")) {
      const parts = text.split(" — ");
      return (
        <span className="font-medium text-[#101011] text-[16px] leading-[22.4px] flex items-center flex-wrap">
          {parts[0]} —{" "}
          <span className="bg-[#5b21cc] text-white font-bold px-[10px] py-[2px] rounded-[13px] ml-[4px] leading-none inline-flex items-center" style={{ height: '24px' }}>
            {parts[1]}
          </span>
        </span>
      );
    }

    return (
      <span className="font-medium text-[#101011] text-[16px] leading-[22.4px]">
        {text}
      </span>
    );
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
      <div className="text-center mb-[20px]">
        <h1 className="text-[28px] text-[#101011] tracking-[-0.5px] font-black leading-tight">
          🎉 Выберите пакет
        </h1>
        <p className="text-[#999490] text-[16px] mt-[4px] font-medium">
          День рождения в Hello Park
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
                🌟 Пакет «Hello Fun» доступен только по будням.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Package cards */}
      <div className="flex flex-col gap-[36px] mt-4">
        {PACKAGES.map((pkg, i) => {
          const isSelected = state.packageType === pkg.id;
          const isDisabled = pkg.weekdayOnly && state.isWeekend;
          const displayPrice = state.isWeekend ? (pkg.weekendPrice ?? pkg.weekdayPrice) : pkg.weekdayPrice;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isDisabled ? 0.45 : 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="relative pr-1"
            >
              {/* Duration Badge (Top Right Rotated) - Adjusted for clipping */}
              <div className="absolute right-0 top-[-16px] rotate-[-5deg] z-20 flex items-center justify-center pointer-events-none origin-bottom-right">
                <div 
                  className="px-[24px] rounded-[15px] flex items-center justify-center min-w-[110px] shadow-md h-[46px] bg-[#5b21cc]"
                >
                  <span className="font-black text-white text-[24px] tracking-[-0.5px] leading-none mt-[-2px]">
                    {pkg.duration}
                  </span>
                </div>
              </div>

              <div
                onClick={() => !isDisabled && handleSelect(pkg.id)}
                className={`bg-white rounded-[24px] w-full relative transition-all duration-300 cursor-pointer ${
                  isDisabled ? "pointer-events-none" : "hover:shadow-md"
                }`}
                style={{
                  boxShadow: isSelected
                    ? `0 12px 40px ${pkg.borderColor}30, 0 4px 12px rgba(0,0,0,0.05)`
                    : "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                {/* Border effect based on selection */}
                <div 
                  className="absolute inset-0 rounded-[24px] pointer-events-none transition-all duration-300"
                  style={{ 
                    border: `2.5px solid ${isSelected ? pkg.borderColor : '#E5E5E5'}`,
                  }}
                />

                <div className="flex flex-col px-[24px] pt-[28px] pb-[28px] relative z-0">
                  {/* Header */}
                  <div className="mb-[24px] pr-[100px]">
                    <h2 className="text-[32px] tracking-[-0.5px] leading-[1]">
                      <span className="font-black text-[#101011]">{pkg.emoji} </span>
                      <span className="font-black" style={{ color: pkg.nameColor }}>{pkg.name}</span>
                    </h2>
                  </div>

                  {/* Features */}
                  <div className="flex flex-col gap-[12px] mb-[24px]">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex gap-[12px] items-start relative">
                        <div 
                          className="rounded-full size-[8px] mt-[8px] shrink-0 bg-[#ff6022]" 
                        />
                        {renderFeature(feature)}
                      </div>
                    ))}
                  </div>

                  {/* Purple 'Free Entry for Adults' Badge */}
                  <div className="mb-[36px] ml-[-4px]">
                    <div className="bg-[#5b21cc] rounded-[13px] inline-flex items-center justify-center px-[20px] py-[6px] shadow-sm">
                      <span className="font-semibold text-white text-[15px]">
                        Взрослым вход бесплатный
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col items-center gap-[2px] mb-[20px]">
                    {pkg.oldPrice && (
                      <p className="text-[#999490] text-[16px] line-through font-semibold leading-none">
                        {formatPrice(pkg.oldPrice)} ₽
                      </p>
                    )}
                    <p className="text-[#ff6022] text-[32px] tracking-[-0.5px] font-black leading-none mt-[4px]">
                      {formatPrice(displayPrice)} ₽
                    </p>
                    {pkg.weekendPrice && !state.isWeekend && (
                      <span className="text-xs text-[#ABABAB] mt-2">
                        {formatPrice(pkg.weekendPrice)} ₽ в выходные
                      </span>
                    )}
                  </div>
                  
                  {/* CTA */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDisabled) handleSelect(pkg.id);
                    }}
                    className="w-full mt-[4px] py-[16px] rounded-full active:scale-[0.97] transition-all duration-300"
                    style={{
                      backgroundColor: isSelected ? pkg.borderColor : '#ff6022',
                      boxShadow: isSelected ? `0 6px 20px ${pkg.borderColor}40` : 'none'
                    }}
                  >
                    <span className="text-white text-[17px] flex items-center justify-center gap-2" style={{ fontWeight: 700 }}>
                      {isSelected ? (
                        <>
                          <Check className="w-5 h-5" />
                          Выбрано
                        </>
                      ) : (
                        "Выбрать пакет"
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Custom Package - Light minimal card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div
            onClick={() => handleSelect("custom")}
            className="bg-white rounded-[20px] p-[16px] flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
            style={{ 
              border: `2px dashed ${state.packageType === "custom" ? '#1A1A1A' : '#D5D5D5'}`,
              backgroundColor: state.packageType === "custom" ? '#F7F7F7' : '#FFFFFF'
            }}
          >
            <div className="flex items-center gap-[12px]">
              <span className="text-[28px]">🧩</span>
              <div>
                <div className="font-black text-[#1A1A1A] text-[16px]">Собери сам</div>
                <div className="text-[13px] text-[#ABABAB] font-medium mt-0.5">Выбери только нужные опции</div>
              </div>
            </div>
            
            {state.packageType === "custom" ? (
              <div className="w-[36px] h-[36px] rounded-full bg-[#1A1A1A] flex items-center justify-center text-white shrink-0">
                <Check className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-[36px] h-[36px] rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[16px] shrink-0 font-bold">
                →
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}