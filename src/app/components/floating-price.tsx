import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Send } from "lucide-react";

export function FloatingPrice() {
  const { totalPrice, step, totalSteps, state, nextStep, prevStep, submitted, setSubmitted } = useWizard();

  if (submitted || state.isQuestPopupOpen) return null;

  const canProceed = (() => {
    switch (step) {
      case 1: return !!state.date && !!state.time;
      case 2: return !!state.packageType;
      case 5: return state.packageType === "custom" ? true : !!state.patiroom;
      case 11: return !!state.contactName && !!state.contactPhone;
      default: return true;
    }
  })();

  const handleNext = () => {
    if (step === totalSteps) {
      if (state.contactName && state.contactPhone) {
        setSubmitted(true);
      }
      return;
    }
    nextStep();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-lg mx-auto px-4 pb-4 pt-3 flex flex-col gap-2 bg-gradient-to-t from-[#F7F7F7] via-[#F7F7F7] to-[#F7F7F7]/0">
        {/* Price pill */}
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
                Шаг {step}/{totalSteps}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="flex-1 bg-white text-[#1A1A1A] py-3.5 rounded-full border border-[#E5E5E5] shadow-lg transition-all active:scale-[0.98]"
            >
              Назад
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`${step > 1 ? "flex-[2]" : "w-full"} bg-[#FF6022] text-white py-3.5 rounded-full shadow-lg transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2`}
          >
            {step === totalSteps ? (
              <>
                <Send className="w-4 h-4" />
                Оставить заявку
              </>
            ) : (
              "Продолжить"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}