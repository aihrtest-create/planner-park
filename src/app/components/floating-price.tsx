import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Send, Gift } from "lucide-react";
import { useState, useEffect } from "react";

export function FloatingPrice() {
  const { totalPrice, step, totalSteps, visibleSteps, state, nextStep, prevStep, submitted, setSubmitted, submitToAPI } = useWizard();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset toast and shake when step changes
  useEffect(() => {
    setShowToast(false);
    setIsShaking(false);
  }, [step]);

  if (submitted || state.isQuestPopupOpen) return null;

  // ─── Optional steps: Adult Location (6) and Cakes (10) ───
  const isOptionalStep = step === 6 || step === 10;

  // ─── Mandatory validation ───
  const canProceed = (() => {
    switch (step) {
      case 1: return !!state.date && !!state.time;
      case 2: return !!state.packageType;
      case 3: return !!state.questType;
      case 5: return state.packageType === "custom" ? true : !!state.patiroom;
      case 7: return (state.shows || []).length > 0;
      case 8: return (state.masterClasses || []).length > 0;
      case 12: return !!state.contactName && !!state.contactPhone;
      default: return true;
    }
  })();

  // ─── Whether optional step has a selection ───
  const hasOptionalSelection = (() => {
    if (!isOptionalStep) return false;
    if (step === 6) return (state.cafeZones || []).length > 0;
    if (step === 10) return !!state.cakeChoice;
    return false;
  })();

  // ─── Validation messages ───
  const getValidationMessage = () => {
    switch (step) {
      case 1: {
        if (!state.date && !state.time) return "Выберите дату и время праздника";
        if (!state.date) return "Выберите дату праздника";
        return "Выберите время начала";
      }
      case 2: return "Выберите пакет для продолжения";
      case 3: return "Выберите квест для продолжения";
      case 5: return "Выберите патирум для праздника";
      case 7: return "Выберите шоу-программу — 1 шоу уже включено в пакет ✨";
      case 8: return "Выберите мастер-класс — 1 МК уже включён в пакет 🎨";
      case 12: {
        if (!state.contactName) return "Укажите ваше имя";
        return "Укажите номер телефона";
      }
      default: return "Сделайте выбор для продолжения";
    }
  };

  // ─── Handle navigation ───
  const handleNext = async () => {
    // Final step — submit
    if (step === totalSteps) {
      if (state.contactName && state.contactPhone) {
        setIsSubmitting(true);
        try {
          await submitToAPI(totalPrice);
        } catch {
          // Submit even if API fails — don't block the user
        }
        setSubmitted(true);
        setIsSubmitting(false);
      } else {
        // Trigger validation on final step too
        setIsShaking(true);
        setToastMessage(getValidationMessage());
        setShowToast(true);
        setTimeout(() => setIsShaking(false), 500);
        setTimeout(() => setShowToast(false), 2500);
      }
      return;
    }

    // Mandatory step without selection → shake + toast + scroll to missing element
    if (!canProceed && !isOptionalStep) {
      setIsShaking(true);
      setToastMessage(getValidationMessage());
      setShowToast(true);
      setTimeout(() => setIsShaking(false), 500);
      setTimeout(() => setShowToast(false), 2500);

      // Smart scroll: target the specific missing element
      const scrollTarget = getScrollTarget();
      if (scrollTarget) {
        const el = document.getElementById(scrollTarget);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          // Pulse highlight effect
          el.classList.add("ring-2", "ring-[#FF6022]", "ring-offset-2", "transition-all");
          setTimeout(() => el.classList.remove("ring-2", "ring-[#FF6022]", "ring-offset-2", "transition-all"), 2000);
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Optional step or valid mandatory → proceed
    nextStep();
  };

  const currentDisplayStep = (visibleSteps || []).indexOf(step) + 1 || 1;
  const currentTotalSteps = (visibleSteps || []).length || totalSteps;

  // ─── Dynamic button styles ───
  const getButtonClasses = () => {
    const sizing = step > 1 ? "flex-[2]" : "w-full";
    const base = `${sizing} py-3.5 rounded-full shadow-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2`;

    // Bonuses step — special gradient CTA
    if (step === 11) {
      return `${base} bg-gradient-to-r from-[#FF6022] to-[#FF8000] scale-[1.02] shadow-xl shadow-[#FF6022]/30 text-white font-bold`;
    }

    // Optional step without selection → outlined button
    if (isOptionalStep && !hasOptionalSelection) {
      return `${base} bg-white text-[#FF6022] border-2 border-[#FF6022] font-medium`;
    }

    // Mandatory step without selection → semi-transparent
    if (!canProceed && !isOptionalStep) {
      return `${base} bg-[#FF6022] text-white opacity-[0.45]`;
    }

    // Normal active state (valid selection or optional with selection)
    return `${base} bg-[#FF6022] text-white font-medium`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Safari Bottom Bounce Cover */}
      <div className="absolute top-full left-0 right-0 h-[50vh] bg-[#F7F7F7]" />
      
      <div className="max-w-lg mx-auto px-4 pb-4 pt-3 flex flex-col gap-2 bg-gradient-to-t from-[#F7F7F7] via-[#F7F7F7] to-[#F7F7F7]/0 relative">

        {/* ─── Validation Toast ─── */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ y: 10, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-[#1A1A1A] text-white text-[13px] font-medium px-5 py-3 rounded-2xl text-center shadow-xl"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Price pill ─── */}
        <AnimatePresence>
          {totalPrice > 0 && step < totalSteps && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-[#E5E5E5] px-5 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FF6022] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-[#ABABAB] uppercase tracking-wide">Итого</p>
                  <p className="text-lg text-[#1A1A1A]">
                    {totalPrice.toLocaleString("ru-RU")} ₽
                  </p>
                </div>
              </div>
              <div className="text-xs text-[#ABABAB] bg-[#F5F5F5] px-3 py-1 rounded-full">
                Шаг {currentDisplayStep}/{currentTotalSteps}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Navigation buttons ─── */}
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 bg-white text-[#1A1A1A] py-3.5 rounded-full border border-[#E5E5E5] shadow-lg transition-all active:scale-[0.98]"
            >
              Назад
            </button>
          )}
          <motion.button
            onClick={handleNext}
            animate={isShaking ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
            transition={isShaking ? { duration: 0.4, ease: "easeInOut" } : { duration: 0 }}
            className={getButtonClasses()}
          >
            {step === totalSteps ? (
              isSubmitting ? (
                <>Отправляем...</>
              ) : (
              <>
                <Send className="w-4 h-4" />
                Оставить заявку
              </>
              )
            ) : step === 11 ? (
              <>
                <span className="text-base animate-bounce">🎁</span>
                <span className="font-bold tracking-wide">Забрать подарки</span>
              </>
            ) : isOptionalStep && !hasOptionalSelection ? (
              "Пропустить"
            ) : (
              "Продолжить"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}