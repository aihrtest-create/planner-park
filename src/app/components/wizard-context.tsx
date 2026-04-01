import React, { createContext, useContext, useState, useCallback } from "react";
import { isWeekend } from "date-fns";

export interface WizardState {
  // Step 1
  packageType: "basic" | "premium" | "exclusive" | "custom" | null;
  isWeekend: boolean;
  // Step 2 — Quests
  questType: "phygital_voxels" | "phygital_space" | "classic_fort" | "classic_minecraft" | "classic_squid" | "classic_barbie" | "classic_safari" | "classic_harry" | "classic_heroes" | "classic_bloggers" | "classic_fortnite" | "classic_agents" | "none" | null;
  // Step 3 — Location
  patiroom: string | null;
  patiroomDetails: string | null;
  cafeZones: string[];
  // Step 4 — Animators
  animators: string[];
  premiumCostume: string | null;
  // Step 5 — Shows
  shows: string[];
  // Step 6 — Master classes
  masterClasses: string[];
  // Step 7 — Food
  includeFood: boolean;
  cakeChoice: string | null;
  cakeCustomText: string;
  // Step 7 — Date/time
  date: Date | null;
  time: string;
  childrenCount: number;
  adultsCount: number;
  // Step 8 — Contact
  contactName: string;
  contactPhone: string;
  contactComment: string;
  isQuestPopupOpen: boolean;
}

interface WizardContextType {
  step: number;
  totalSteps: number;
  state: WizardState;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateState: (partial: Partial<WizardState>) => void;
  totalPrice: number;
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
}

const initialState: WizardState = {
  packageType: null,
  isWeekend: false,
  questType: null,
  patiroom: null,
  patiroomDetails: null,
  cafeZones: [],
  animators: [],
  premiumCostume: null,
  shows: [],
  masterClasses: [],
  includeFood: false,
  cakeChoice: null,
  cakeCustomText: "",
  date: null,
  time: "",
  childrenCount: 8,
  adultsCount: 4,
  contactName: "",
  contactPhone: "",
  contactComment: "",
  isQuestPopupOpen: false,
};

const WizardContext = createContext<WizardContextType | null>(null);

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}

const TOTAL_STEPS = 9;

const PACKAGE_PRICES: Record<string, [number, number]> = {
  custom:    [0, 0],
  basic:     [24900, 0],      // basic is weekday-only
  premium:   [47900, 57900],
  exclusive: [79900, 89900],
};

const PHYGITAL_QUEST_ADDON = 2000;
const CLASSIC_QUEST_ADDON = 10000;

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const nextStep = useCallback(() => {
    setStep((s) => {
      let next = s + 1;
      // Skip Heroes (Step 3) if not a phygital quest
      if (s === 2 && !state.questType?.startsWith("phygital_")) {
        next = 4;
      }
      return Math.min(next, TOTAL_STEPS);
    });
  }, [state.questType]);

  const prevStep = useCallback(() => {
    setStep((s) => {
      let prev = s - 1;
      // If going back from Location (Step 4) and not phygital quest, skip Heroes (Step 3)
      if (s === 4 && !state.questType?.startsWith("phygital_")) {
        prev = 2;
      }
      return Math.max(prev, 1);
    });
  }, [state.questType]);
  const updateState = useCallback(
    (partial: Partial<WizardState>) => setState((s) => ({ ...s, ...partial })),
    []
  );

  const totalPrice = (() => {
    let total = 0;

    // Package base price
    if (state.packageType) {
      const [weekday, weekend] = PACKAGE_PRICES[state.packageType] || [0, 0];
      total += state.isWeekend ? weekend : weekday;
    }

    // Quest addon
    if (state.questType && state.questType !== "none") {
      if (state.packageType === "custom") {
        total += state.questType.startsWith("phygital_") ? 8000 : 15000;
      } else {
        // According to user: "В пакетах можно выбрать любой квест".
        // No checkout +10000 for classic, optionally +2000 for phygital (keeping +2000 for phygital if package, 0 for classic)
        if (state.questType.startsWith("phygital_")) {
          total += PHYGITAL_QUEST_ADDON;
        }
      }
    }

    // Cafe zone deposits (multiple can be selected)
    // Use actual date's weekend status if date is set, otherwise use toggle
    const effectiveWeekend = state.date ? isWeekend(state.date) : state.isWeekend;
    for (const zone of state.cafeZones) {
      if (zone === "cafe_round") total += effectiveWeekend ? 10000 : 5000;
      if (zone === "cafe_pink") total += effectiveWeekend ? 10000 : 5000;
      if (zone === "cafe_pink_full") total += effectiveWeekend ? 20000 : 10000;
    }

    // Premium costume
    if (state.premiumCostume) total += 8000;

    // Shows — priced for custom package, included in other packages
    if (state.packageType === "custom") {
      for (const show of state.shows) {
        if (show === "soap") total += 14000;
        if (show === "paper") total += 15000;
        if (show === "tesla") total += 15000;
        if (show === "professor") total += 14000;
      }
    }

    // MK — included in premium/exclusive; charged for basic
    if (state.packageType === "basic") {
      total += state.masterClasses.length * 7500;
    }

    // Food — included in premium/exclusive
    if (state.includeFood && state.packageType === "basic") total += 12070;

    // Cake
    if (state.cakeChoice && state.cakeChoice !== "none") total += 5000;

    return total;
  })();

  return (
    <WizardContext.Provider
      value={{
        step, totalSteps: TOTAL_STEPS, state, setStep,
        nextStep, prevStep, updateState, totalPrice, submitted, setSubmitted
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}