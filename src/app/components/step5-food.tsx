import { useWizard } from "./wizard-context";
import { motion } from "motion/react";
import { Check, UtensilsCrossed, Cake, Upload } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const CAKES = [
  { id: "minecraft", name: "Майнкрафт", emoji: "⛏️", price: "5 000 ₽" },
  { id: "princess", name: "Принцесса", emoji: "👸", price: "5 000 ₽" },
  { id: "superhero", name: "Супергерой", emoji: "🦸", price: "5 000 ₽" },
  { id: "unicorn", name: "Единорог", emoji: "🦄", price: "5 000 ₽" },
  { id: "space", name: "Космос", emoji: "🚀", price: "5 000 ₽" },
  { id: "custom_cake", name: "Свой дизайн", emoji: "✨", price: "от 5 000 ₽" },
];

const FOOD_ITEMS = [
  { name: "Пицца Маргарита", emoji: "🍕" },
  { name: "Наггетсы", emoji: "🍗" },
  { name: "Картофель фри", emoji: "🍟" },
  { name: "Морс ягодный", emoji: "🧃" },
  { name: "Фруктовая тарелка", emoji: "🍉" },
];

export function Step5Food() {
  const { state, updateState } = useWizard();
  const isCustom = state.packageType === "custom";

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-6"
    >
      <div className="text-center mb-5">
        <h2 className="text-xl text-[#1A1A1A] mb-1">Питание и торт</h2>
        <p className="text-sm text-[#747474]">Вкуснейшие угощения для гостей</p>
      </div>

      {/* Kids meal */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <UtensilsCrossed className="w-5 h-5 text-[#FF6022]" />
          <h3 className="text-[#1A1A1A]">Детский обед</h3>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => updateState({ includeFood: !state.includeFood })}
          className={`w-full rounded-2xl overflow-hidden bg-white transition-all ${
            state.includeFood
              ? "ring-2 ring-[#FF6022] shadow-md"
              : "ring-1 ring-[#E5E5E5] shadow-sm"
          }`}
        >
          <div className="relative h-40">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1755862922067-8a0135afc1bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMHBhcnR5JTIwZm9vZCUyMG51Z2dldHMlMjB0YWJsZSUyMHNwcmVhZHxlbnwxfHx8fDE3NzM3NTE3NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Детский обед"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {state.includeFood && (
              <div className="absolute top-3 right-3 bg-[#FF6022] rounded-full p-1">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white text-sm">Комплексный детский обед</p>
                  {isCustom && (
                    <p className="text-white/80 text-xs">12 070 ₽ (при отдельном заказе)</p>
                  )}
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    state.includeFood
                      ? "bg-[#FF6022] text-white"
                      : "bg-white/90 text-[#1A1A1A]"
                  }`}
                >
                  {state.includeFood ? "Добавлено" : "Добавить"}
                </div>
              </div>
            </div>
          </div>
        </motion.button>

        {state.includeFood && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 bg-[#FF6022]/5 rounded-2xl p-4 border border-[#FF6022]/10"
          >
            <p className="text-xs text-[#747474] mb-2">В комплект входит:</p>
            <div className="flex flex-wrap gap-2">
              {FOOD_ITEMS.map((item) => (
                <span
                  key={item.name}
                  className="bg-white text-[#1A1A1A] text-xs px-3 py-1.5 rounded-full border border-[#E5E5E5]"
                >
                  {item.emoji} {item.name}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Cakes */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Cake className="w-5 h-5 text-[#6C4AED]" />
          <h3 className="text-[#1A1A1A]">Тематические торты</h3>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {CAKES.map((cake) => {
            const isSelected = state.cakeChoice === cake.id;
            return (
              <motion.button
                key={cake.id}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  updateState({
                    cakeChoice: state.cakeChoice === cake.id ? null : cake.id,
                  })
                }
                className={`p-3 rounded-xl text-center bg-white transition-all ${
                  isSelected
                    ? "ring-2 ring-[#6C4AED] shadow-md"
                    : "ring-1 ring-[#E5E5E5] shadow-sm"
                }`}
              >
                <div className="text-3xl mb-1">{cake.emoji}</div>
                <h4 className="text-xs text-[#1A1A1A]">{cake.name}</h4>
                <p className="text-[10px] text-[#FF6022] mt-0.5">{cake.price}</p>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#6C4AED] mx-auto mt-1" />
                )}
              </motion.button>
            );
          })}
        </div>

        {state.cakeChoice === "custom_cake" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3"
          >
            <textarea
              value={state.cakeCustomText}
              onChange={(e) => updateState({ cakeCustomText: e.target.value })}
              placeholder="Опишите желаемый дизайн торта..."
              className="w-full bg-white border border-[#E5E5E5] rounded-xl p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#FF6022]"
            />
            <button className="mt-2 flex items-center gap-2 text-sm text-[#FF6022] bg-[#FF6022]/5 px-4 py-2 rounded-xl border border-[#FF6022]/20">
              <Upload className="w-4 h-4" />
              Загрузить референс
            </button>
          </motion.div>
        )}
      </div>

    </motion.div>
  );
}