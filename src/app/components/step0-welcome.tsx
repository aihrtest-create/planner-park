import { useWizard } from "./wizard-context";
import { motion } from "motion/react";
import { Clock, PartyPopper, Sparkles, ChevronRight } from "lucide-react";
import rockyImg from "../../assets/rocky-quest-1.png";

export function Step0Welcome() {
  const { nextStep } = useWizard();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="px-4 pb-6 flex flex-col items-center min-h-[75vh] justify-center"
    >
      {/* Rocky mascot image */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", damping: 15, stiffness: 200 }}
        className="relative mb-6"
      >
        <div className="w-52 h-52 rounded-full bg-gradient-to-br from-[#FF6022]/10 via-orange-50 to-[#FF8A00]/10 flex items-center justify-center relative overflow-hidden">
          <img
            src={rockyImg}
            alt="Лис Рокки"
            className="w-44 h-44 object-contain object-center drop-shadow-xl"
          />
          {/* Decorative floating elements */}
          <motion.div
            animate={{ y: [-4, 4, -4], rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute top-2 right-2 text-2xl"
          >
            🎉
          </motion.div>
          <motion.div
            animate={{ y: [3, -3, 3], rotate: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-6 left-3 text-xl"
          >
            🎈
          </motion.div>
          <motion.div
            animate={{ y: [-3, 5, -3] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-4 right-6 text-lg"
          >
            🎂
          </motion.div>
        </div>
      </motion.div>

      {/* Speech bubble */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative bg-white rounded-3xl p-6 shadow-xl border border-[#E5E5E5] max-w-sm w-full mb-6"
      >
        {/* Triangle pointing up to Rocky */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-l border-t border-[#E5E5E5] transform rotate-45" />
        
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-[#1A1A1A] mb-2 leading-tight text-center">
            Привет! Я Лис Рокки 🦊
          </h2>
          <p className="text-[#FF6022] text-sm font-bold text-center mb-3">
            Главный маскот Hello Park!
          </p>
          <p className="text-[#747474] text-sm text-center leading-relaxed">
            Давайте соберём <span className="font-bold text-[#1A1A1A]">идеальный день рождения</span> для вашего ребёнка. 
            Я помогу вам выбрать всё самое лучшее!
          </p>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-center gap-4 mb-8"
      >
        <div className="flex items-center gap-2 bg-[#FF6022]/5 border border-[#FF6022]/15 rounded-2xl px-4 py-2.5">
          <Clock className="w-4 h-4 text-[#FF6022]" />
          <span className="text-xs font-semibold text-[#1A1A1A]">~10 мин</span>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-2xl px-4 py-2.5">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-xs font-semibold text-[#1A1A1A]">Всё включено</span>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-2xl px-4 py-2.5">
          <PartyPopper className="w-4 h-4 text-green-500" />
          <span className="text-xs font-semibold text-[#1A1A1A]">Под ключ</span>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
        whileTap={{ scale: 0.97 }}
        onClick={nextStep}
        className="w-full max-w-sm bg-gradient-to-r from-[#FF6022] to-[#FF8A00] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#FF6022]/30 flex items-center justify-center gap-2 transition-all hover:shadow-2xl hover:shadow-[#FF6022]/40"
      >
        Начнём! 🎉
        <ChevronRight className="w-5 h-5" />
      </motion.button>

      {/* Subtle disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="text-[10px] text-[#ABABAB] text-center mt-4 max-w-xs"
      >
        Вы сможете выбрать пакет, квест, локацию, аниматоров, меню и многое другое
      </motion.p>
    </motion.div>
  );
}
