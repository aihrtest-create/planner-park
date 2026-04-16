import { useEffect, useMemo } from "react";
import { WizardProvider, useWizard } from "./components/wizard-context";
import { StepIndicator } from "./components/step-indicator";
import { Step1Format } from "./components/step1-format";
import { Step1FormatV2 } from "./components/step1-format-v2";
import { Step2Quests } from "./components/step2-quests";
import { Step2Location } from "./components/step2-location";
import { Step3Animators } from "./components/step3-animators";
import { Step3AdultLocation } from "./components/step3-adult-location";
import { Step4MasterClasses } from "./components/step4-masterclasses";
import { Step5Food } from "./components/step5-food";
import { Step6DateTime } from "./components/step6-datetime";
import { Step7Summary } from "./components/step7-summary";
import { Step11Included } from "./components/step11-included";
import { StepShows } from "./components/step-shows";
import { StepCakes } from "./components/step-cakes";
import { FloatingPrice } from "./components/floating-price";
import { AnimatePresence } from "motion/react";
import HParkLogo from "../imports/HParkLogo";

function WizardContent() {
  const { step } = useWizard();
  const useV2 = useMemo(() => new URLSearchParams(window.location.search).has("v2"), []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case 1: return <Step6DateTime key="step1" />;
      case 2: return useV2 ? <Step1FormatV2 key="step2v2" /> : <Step1Format key="step2" />;
      case 3: return <Step2Quests key="step3" />;
      case 4: return <Step3Animators key="step4" />;
      case 5: return <Step2Location key="step5" />;
      case 6: return <Step3AdultLocation key="step6" />;
      case 7: return <StepShows key="step7" />;
      case 8: return <Step4MasterClasses key="step8" />;
      case 9: return <Step5Food key="step9" />;
      case 10: return <StepCakes key="step10" />;
      case 11: return <Step11Included key="step11" />;
      case 12: return <Step7Summary key="step12" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          {/* Logo bar */}
          <div className="flex items-center justify-between pt-3 pb-2 px-4 relative">
            <div className="w-[64px] h-[37px] flex-shrink-0">
              <HParkLogo />
            </div>
            <span className="text-[11px] text-[#747474] bg-[#F5F5F5] px-3 py-1.5 rounded-full font-medium">
              Конструктор праздников
            </span>
          </div>

          <div className="px-4">
            <div className="w-full h-[1px] bg-[#F0F0F0]" />
          </div>

          {/* Step indicator */}
          <StepIndicator />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto py-4 pb-40">
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