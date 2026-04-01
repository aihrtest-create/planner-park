import { useWizard } from "./wizard-context";
import { Check } from "lucide-react";

const STEP_LABELS = [
  "Пакет",
  "Квест",
  "Герои",
  "Локация",
  "МК",
  "Питание",
  "Дата",
  "Заявка",
];

export function StepIndicator() {
  const { step, totalSteps, setStep } = useWizard();

  return (
    <div className="w-full px-4 py-3">
      {/* Progress bar */}
      <div className="relative h-1 bg-[#E5E5E5] rounded-full mb-3 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[#FF6022] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = step > stepNum;
          const isCurrent = step === stepNum;

          return (
            <button
              key={stepNum}
              onClick={() => stepNum <= step && setStep(stepNum)}
              className="flex flex-col items-center relative"
              disabled={stepNum > step}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? "bg-[#FF6022] text-white"
                    : isCurrent
                    ? "bg-white text-[#FF6022] ring-2 ring-[#FF6022]"
                    : "bg-[#E5E5E5] text-[#ABABAB]"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span className="text-[10px]">{stepNum}</span>
                )}
              </div>
              <span
                className={`text-[8px] mt-1 whitespace-nowrap transition-colors ${
                  isCurrent ? "text-[#FF6022]" : isCompleted ? "text-[#FF6022]" : "text-[#ABABAB]"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
