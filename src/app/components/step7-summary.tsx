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
} from "lucide-react";
import { format, isWeekend } from "date-fns";

const PACKAGE_NAMES: Record<string, string> = {
  basic: "Hello Fun",
  premium: "Hello Party",
  exclusive: "Hello Bloom",
  custom: "Индивидуальный",
};

export function Step7Summary() {
  const { state, updateState, totalPrice, submitted } = useWizard();

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
          />
        )}

        {state.patiroomDetails && (
          <SummaryRow
            icon={<MapPin className="w-4 h-4" />}
            label="Патирум"
            value={state.patiroomDetails}
          />
        )}

        {state.cafeZones.length > 0 && (
          <SummaryRow
            icon={<MapPin className="w-4 h-4" />}
            label="Стол для родителей"
            value={state.cafeZones.map(z => {
              if (z === "cafe_round") return "Круглый стол";
              if (z === "cafe_pink") return "За шторками";
              if (z === "cafe_pink_full") return "Вся зона за шторками";
              return z;
            }).join(", ")}
          />
        )}

        {state.animators.length > 0 && (
          <SummaryRow
            icon={<UsersIcon className="w-4 h-4" />}
            label="Герои"
            value={`${state.animators.length} аниматор(а)${
              state.premiumCostume ? " + премиум костюм" : ""
            }`}
          />
        )}

        {state.shows.length > 0 && (
          <SummaryRow
            icon={<Star className="w-4 h-4" />}
            label="Шоу-программы"
            value={`${state.shows.length} шоу`}
          />
        )}

        {state.masterClasses.length > 0 && (
          <SummaryRow
            icon={<Palette className="w-4 h-4" />}
            label="Мастер-классы"
            value={`${state.masterClasses.length} МК`}
          />
        )}

        {(state.includeFood || state.cakeChoice) && (
          <SummaryRow
            icon={<UtensilsCrossed className="w-4 h-4" />}
            label="Питание"
            value={[
              state.includeFood && "Детский обед",
              state.cakeChoice && state.cakeChoice !== "none" && "Торт",
            ]
              .filter(Boolean)
              .join(", ")}
          />
        )}

        {state.date && (
          <SummaryRow
            icon={<Calendar className="w-4 h-4" />}
            label="Дата"
            value={`${format(state.date, "d MMMM yyyy")}, ${state.time}${
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
      <div className="bg-[#FF6022] rounded-2xl p-5 mb-5 text-center text-white">
        <p className="text-sm opacity-80 mb-1">Итого к оплате</p>
        <p className="text-3xl">{totalPrice.toLocaleString("ru-RU")} ₽</p>
        <p className="text-xs opacity-60 mt-1">Окончательная стоимость подтверждается менеджером</p>
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
  isLast = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${
        !isLast ? "border-b border-[#E5E5E5]" : ""
      }`}
    >
      <div className="w-8 h-8 rounded-full bg-[#FF6022]/10 flex items-center justify-center text-[#FF6022] shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#ABABAB]">{label}</p>
        <p className="text-sm text-[#1A1A1A] truncate">{value}</p>
      </div>
    </div>
  );
}