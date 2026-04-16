import { useWizard } from "./wizard-context";
import { Check } from "lucide-react";

const STEP_LABELS = [
  "Дата",
  "Пакет",
  "Квест",
  "Герои",
  "Патирум",
  "Взрослым",
  "Шоу",
  "МК",
  "Питание",
  "Торты",
  "Заявка",
];

export function StepIndicator() {
  const { step, setStep, visibleSteps } = useWizard();

  // If visibleSteps is not yet populated, safely fallback to 11 steps
  const stepsToRender = visibleSteps || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div className="w-full px-4 pt-3 pb-4">
      <div className="flex items-center justify-between">
        {stepsToRender.map((stepNum, i) => {
          const displayNum = i + 1;
          const label = STEP_LABELS[stepNum - 1]; // stepNum is 1-indexed (1 to 11)
          
          // A step is considered "completed" if the current active step index is strictly greater than this step's index
          const currentIndex = stepsToRender.indexOf(step);
          const thisStepIndex = i;
          
          const isCompleted = currentIndex > thisStepIndex;
          const isCurrent = step === stepNum;

          return (
            <button
              key={stepNum}
              onClick={() => thisStepIndex <= currentIndex && setStep(stepNum)}
              className="flex flex-col items-center relative"
              disabled={thisStepIndex > currentIndex}
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
                  <span className="text-[10px]">{displayNum}</span>
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
