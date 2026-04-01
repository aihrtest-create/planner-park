import { useEffect } from "react";
import { WizardProvider, useWizard } from "./components/wizard-context";
import { StepIndicator } from "./components/step-indicator";
import { Step1Format } from "./components/step1-format";
import { Step2Quests } from "./components/step2-quests";
import { Step2Location } from "./components/step2-location";
import { Step3Animators } from "./components/step3-animators";
import { Step4MasterClasses } from "./components/step4-masterclasses";
import { Step5Food } from "./components/step5-food";
import { Step6DateTime } from "./components/step6-datetime";
import { Step7Summary } from "./components/step7-summary";
import { StepShows } from "./components/step-shows";
import { FloatingPrice } from "./components/floating-price";
import { AnimatePresence } from "motion/react";
import HParkLogo from "../imports/HParkLogo";

function WizardContent() {
  const { step } = useWizard();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Format key="step1" />;
      case 2: return <Step2Quests key="step2" />;
      case 3: return <Step3Animators key="step3" />;
      case 4: return <Step2Location key="step4" />;
      case 5: return <StepShows key="step-shows" />;
      case 6: return <Step4MasterClasses key="step5" />;
      case 7: return <Step5Food key="step6" />;
      case 8: return <Step6DateTime key="step7" />;
      case 9: return <Step7Summary key="step8" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="max-w-lg mx-auto">
          {/* Logo bar */}
          <div className="flex items-center justify-between py-3 px-4">
            <div className="w-[90px] h-[52px]">
              <HParkLogo />
            </div>
            <span className="text-xs text-[#747474] bg-[#F5F5F5] px-3 py-1 rounded-full">
              Конструктор праздников
            </span>
          </div>

          {/* Step indicator */}
          <StepIndicator />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto pt-4 pb-40">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </main>

      {/* Floating price bar */}
      <FloatingPrice />
    </div>
  );
}

export default function App() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}