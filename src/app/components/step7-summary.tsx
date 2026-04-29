import { useWizard } from "./wizard-context";
import { motion } from "motion/react";
import {
  Package,
  MapPin,
  Users as UsersIcon,
  Palette,
  UtensilsCrossed,
  Calendar,
  Phone,
  User,
  MessageSquare,
  PartyPopper,
  Check,
  Star,
  Cake,
  Gamepad2,
  ChevronRight,
} from "lucide-react";
import { format, isWeekend } from "date-fns";
import { ru } from "date-fns/locale";
import { CAKES } from "./step-cakes";
import { ANIMATORS } from "./step3-animators";

const PACKAGE_NAMES: Record<string, string> = {
  basic: "Базовый",
  premium: "Премиум",
  exclusive: "Эксклюзив",
  custom: "Собери сам",
};

const QUEST_NAMES: Record<string, string> = {
  phygital_voxels: "Фиджитал: Воксели",
  phygital_space: "Фиджитал: Космос",
  classic_fort: "Форт Боярд",
  classic_minecraft: "Майнкрафт",
  classic_squid: "Игра в кальмара",
  classic_barbie: "Барби",
  classic_safari: "Сафари",
  classic_harry: "Гарри Поттер",
  classic_heroes: "Миссия Супергероев",
  classic_pirates: "Пиратский",
  classic_wednesday: "Уэнсдей",
  classic_bloggers: "Блогеры",
  classic_fortnite: "Фортнайт",
  classic_agents: "Суперагенты",
  none: "Без квеста",
};

const SHOW_NAMES: Record<string, string> = {
  soap: "Мыльное шоу",
  paper: "Бумажное шоу",
  tesla: "Тесла шоу",
  professor: "Профессор Тесла",
};

const MC_NAMES: Record<string, string> = {
  elsa_tiara: "Диадема Эльзы",
  felt_toy: "Игрушка из фетра",
  kapitoshka: "Капитошка",
  mc_weapon: "Оружие из Майнкрафта",
  birthday_card: "Открытка имениннику",
  sand_picture: "Песочная картина",
  gingerbread: "Роспись пряников",
  slime: "Слайм / Табо-лапки",
  jewelry: "Трендовые украшения",
};

const CAKE_NAMES: Record<string, string> = {
  own_cake: "Свой торт",
};

const FILLING_NAMES: Record<string, string> = {
  filling_1: "Лаванда-Ягодный микс",
  filling_2: "Кокос-Малина",
  filling_3: "Красный бархат",
  filling_4: "Фисташка-Клубника",
  filling_5: "Ванильный",
  filling_6: "Сникерс",
  filling_7: "Миндаль-Вишня",
};

export function Step7Summary() {
  const { state, updateState, totalPrice, submitted } = useWizard();

  const effectiveWeekend = state.date ? isWeekend(state.date) : state.isWeekend;

  const getPackagePrice = () => {
    if (state.packageType === "basic") return 24900;
    if (state.packageType === "premium") return effectiveWeekend ? 57900 : 47900;
    if (state.packageType === "exclusive") return effectiveWeekend ? 89900 : 79900;
    return 0;
  };

  const getQuestPrice = () => {
    if (!state.questType || state.questType === "none") return 0;
    if (state.packageType === "custom") {
      return state.questType.startsWith("phygital_") ? 12000 : 15000;
    } else if (state.questType.startsWith("classic_")) {
      if (state.packageType === "basic") return 10000;
      if (state.packageType === "premium") return 5000;
    }
    return 0;
  };

  const getPatiroomPrice = () => {
    if (state.packageType === "custom" && state.patiroom) {
      return state.patiroomHours * 3000;
    }
    return 0;
  };

  const getCafeZonesPrice = () => {
    let p = 0;
    for (const zone of state.cafeZones) {
      if (zone === "cafe_round") p += effectiveWeekend ? 10000 : 5000;
      if (zone === "cafe_small") p += 5000;
      if (zone === "cafe_pink") p += effectiveWeekend ? 10000 : 5000;
      if (zone === "cafe_pink_full") p += effectiveWeekend ? 20000 : 10000;
    }
    return p;
  };

  const getAnimatorsPrice = () => {
    if (state.animators.length > 1) {
      return (state.animators.length - 1) * 8000;
    }
    return 0;
  };

  const getShowsPrice = () => {
    const showPrices: Record<string, number> = { soap: 14000, paper: 15000, tesla: 15000, professor: 14000 };
    let p = 0;
    if (state.packageType === "custom" || state.packageType === "basic" || state.packageType === "premium") {
      for (const show of state.shows) {
        if (showPrices[show]) p += showPrices[show];
      }
    } else if (state.packageType === "exclusive") {
      if (state.shows.length > 0) {
        for (const show of state.shows) {
          if (showPrices[show]) p += showPrices[show];
        }
        p -= showPrices[state.shows[0]];
      }
    }
    return p;
  };

  const getMCPrice = () => {
    if (state.packageType === "basic" || state.packageType === "custom") {
      return state.masterClasses.length * 7500;
    } else if (state.packageType === "premium" || state.packageType === "exclusive") {
      return Math.max(0, state.masterClasses.length - 1) * 7500;
    }
    return 0;
  };

  const getFoodPrice = () => {
    let p = 0;
    if (state.includeFood && (state.packageType === "basic" || state.packageType === "custom")) {
      p += 12070;
    }
    Object.entries(state.customFood).forEach(([itemId, qty]) => {
      if (qty > 0) {
        for (const cat of FOOD_MENU) {
          const item = cat.items.find((i) => i.id === console.log(i.id === itemId) || i.id === itemId);
          if (item) {
            p += item.price * qty;
            break;
          }
        }
      }
    });
    return p;
  };

  const getCakePrice = () => {
    if (state.cakeChoice) {
      if (state.cakeChoice === "own_cake") return 2000;
      return 8400;
    }
    return 0;
  };

  const formatPrice = (p: number) => p === 0 ? "Включено" : `${p.toLocaleString("ru-RU")} ₽`;
  const formatPackagePrice = (p: number) => state.packageType === "custom" ? "" : formatPrice(p);

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-4 pb-6 flex flex-col items-center justify-center min-h-[60vh]"
      >
        <div className="w-20 h-20 bg-[#4CAF50] rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl text-[#1A1A1A] mb-2 text-center">
          Заявка отправлена!
        </h2>
        <p className="text-sm text-[#747474] text-center mb-6 max-w-xs">
          Наш банкетный менеджер свяжется с вами в ближайшее время для подтверждения деталей праздника
        </p>
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center border border-[#E5E5E5]">
          <PartyPopper className="w-8 h-8 text-[#FF6022] mx-auto mb-2" />
          <p className="text-sm text-[#1A1A1A]">
            Итого: <span className="text-lg text-[#FF6022]">{totalPrice.toLocaleString("ru-RU")} ₽</span>
          </p>
          <p className="text-xs text-[#ABABAB] mt-1">
            {state.contactName}, мы готовим для вас незабываемый праздник!
          </p>
        </div>
      </motion.div>
    );
  }

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
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">📝</span>
          Ваш праздник
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">Проверьте детали и оставьте заявку</p>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden mb-5">
        {state.packageType && (
          <SummaryRow
            icon={<Package className="w-4 h-4" />}
            label="Формат"
            value={PACKAGE_NAMES[state.packageType]}
            priceText={formatPackagePrice(getPackagePrice())}
            stepNumber={2}
          />
        )}

        {state.questType && state.questType !== "none" && (
          <SummaryRow
            icon={<Gamepad2 className="w-4 h-4" />}
            label="Квест"
            value={QUEST_NAMES[state.questType] || state.questType}
            priceText={formatPrice(getQuestPrice())}
            stepNumber={3}
          />
        )}

        {state.patiroomDetails && (
          <SummaryRow
            icon={<MapPin className="w-4 h-4" />}
            label="Патирум"
            value={state.patiroomDetails}
            priceText={formatPrice(getPatiroomPrice())}
            stepNumber={5}
          />
        )}

        {state.cafeZones.length > 0 && (
          <SummaryRow
            icon={<MapPin className="w-4 h-4" />}
            label="Стол для родителей"
            value={state.cafeZones.map(z => {
              if (z === "cafe_round") return "Круглый стол";
              if (z === "cafe_small") return "Маленький столик";
              if (z === "cafe_pink") return "За шторками";
              if (z === "cafe_pink_full") return "Вся зона за шторками";
              return z;
            }).join(", ")}
            priceText={formatPrice(getCafeZonesPrice())}
            stepNumber={6}
          />
        )}

        {state.animators.length > 0 && (
          <SummaryRow
            icon={<UsersIcon className="w-4 h-4" />}
            label="Герой"
            value={state.animators.map((id, index) => {
              const name = ANIMATORS.find(a => a.id === id)?.name || id;
              if (index === 0) {
                return state.packageType !== "custom" ? `${name} (Входит в пакет)` : name;
              }
              return `${name} (+8 000 ₽)`;
            }).join(", ")}
            priceText={formatPrice(getAnimatorsPrice())}
            stepNumber={4}
          />
        )}

        {state.shows.length > 0 && (
          <SummaryRow
            icon={<Star className="w-4 h-4" />}
            label="Шоу-программы"
            value={state.shows.map(s => SHOW_NAMES[s] || s).join(", ")}
            priceText={formatPrice(getShowsPrice())}
            stepNumber={7}
          />
        )}

        {state.masterClasses.length > 0 && (
          <SummaryRow
            icon={<Palette className="w-4 h-4" />}
            label="Мастер-классы"
            value={state.masterClasses.map(mc => MC_NAMES[mc] || mc).join(", ")}
            priceText={formatPrice(getMCPrice())}
            stepNumber={8}
          />
        )}

        {(state.includeFood || Object.values(state.customFood).some(qty => qty > 0)) && (
          <SummaryRow
            icon={<UtensilsCrossed className="w-4 h-4" />}
            label="Питание"
            value={
              [
                state.includeFood ? "Набор детской еды" : null,
                Object.values(state.customFood).some(qty => qty > 0) ? "Доп. меню" : null
              ].filter(Boolean).join(" + ")
            }
            priceText={formatPrice(getFoodPrice())}
            stepNumber={9}
          />
        )}

        {state.cakeChoice && state.cakeChoice !== "none" && (
          <SummaryRow
            icon={<Cake className="w-4 h-4" />}
            label="Торт"
            value={`${CAKES.find(c => c.id === state.cakeChoice)?.name || CAKE_NAMES[state.cakeChoice] || state.cakeChoice}${state.fillingChoice ? " · " + (FILLING_NAMES[state.fillingChoice] || state.fillingChoice) : ""}${state.cakeChoice === 'own_cake' ? " (+2 000 ₽)" : " (8 400 ₽ · 2 кг)"}`}
            priceText={formatPrice(getCakePrice())}
            stepNumber={10}
          />
        )}

        {state.date && (
          <SummaryRow
            icon={<Calendar className="w-4 h-4" />}
            label="Дата"
            value={`${format(state.date, "d MMMM yyyy", { locale: ru })}, ${state.time}${
              isWeekend(state.date) ? " (выходной)" : " (будний)"
            }`}
          />
        )}

        <SummaryRow
          icon={<UsersIcon className="w-4 h-4" />}
          label="Гости"
          value={`${state.childrenCount} детей, ${state.adultsCount} взрослых`}
          isLast
        />
      </div>

      {/* Total */}
      <div 
        className="relative overflow-hidden rounded-[28px] p-6 mb-6 text-center text-white"
        style={{
          background: "linear-gradient(135deg, #FF6022, #FF8A50)",
          boxShadow: "0 12px 32px rgba(255, 96, 34, 0.3)",
        }}
      >
        <p className="text-[15px] font-bold text-white/90 mb-1.5 uppercase tracking-wider">
          Итого к оплате
        </p>
        <p className="text-[42px] leading-none font-black tracking-tight mb-2 drop-shadow-sm">
          {totalPrice.toLocaleString("ru-RU")} ₽
        </p>
        <p className="text-[13px] font-medium text-white/80">
          Окончательная стоимость подтверждается менеджером
        </p>
      </div>

      {/* Contact form */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-6">
        <h3 className="text-[#1A1A1A] mb-4">Контактные данные</h3>

        <div className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ABABAB]" />
            <input
              type="text"
              placeholder="Ваше имя"
              value={state.contactName}
              onChange={(e) => updateState({ contactName: e.target.value })}
              className="w-full bg-[#F5F5F5] rounded-xl py-3 pl-10 pr-4 text-sm border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#FF6022]"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ABABAB]" />
            <input
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={state.contactPhone}
              onChange={(e) => updateState({ contactPhone: e.target.value })}
              className="w-full bg-[#F5F5F5] rounded-xl py-3 pl-10 pr-4 text-sm border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#FF6022]"
            />
          </div>

          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#ABABAB]" />
            <textarea
              placeholder="Комментарий или пожелания..."
              value={state.contactComment}
              onChange={(e) => updateState({ contactComment: e.target.value })}
              className="w-full bg-[#F5F5F5] rounded-xl py-3 pl-10 pr-4 text-sm border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#FF6022] resize-none h-20"
            />
          </div>
        </div>
      </div>

    </motion.div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  priceText,
  stepNumber,
  isLast = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  priceText?: string;
  stepNumber?: number;
  isLast?: boolean;
}) {
  const { setStep } = useWizard();

  return (
    <div
      onClick={stepNumber ? () => setStep(stepNumber) : undefined}
      className={`flex items-center gap-3 px-4 py-3 ${
        !isLast ? "border-b border-[#E5E5E5]" : ""
      } ${stepNumber ? "cursor-pointer hover:bg-black/5 transition-colors" : ""}`}
    >
      <div className="w-8 h-8 rounded-full bg-[#FF6022]/10 flex items-center justify-center text-[#FF6022] shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#ABABAB]">{label}</p>
        <p className="text-sm text-[#1A1A1A] truncate">{value}</p>
      </div>
      {priceText && (
        <div className={`text-sm font-bold whitespace-nowrap mr-2 ${priceText === "Включено" || priceText === "Бесплатно" ? "text-[#4CAF50]" : "text-[#1A1A1A]"}`}>
          {priceText}
        </div>
      )}
      {stepNumber && (
        <ChevronRight className="w-4 h-4 text-[#ABABAB] shrink-0" />
      )}
    </div>
  );
}