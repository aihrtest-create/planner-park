import React, { createContext, useContext, useState, useCallback } from "react";
import { isWeekend } from "date-fns";
import { FOOD_MENU } from "../data/foodMenu";

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
  customFood: Record<string, number>;
  cakeChoice: string | null;
  fillingChoice: string | null;
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
  visibleSteps: number[];
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
  customFood: {},
  cakeChoice: null,
  fillingChoice: null,
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

const TOTAL_STEPS = 12;

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
      
      // Skip Animators (Step 4) if not a phygital quest
      if (s === 3 && !state.questType?.startsWith("phygital_")) {
        next = 5;
      }
      
      // Going from Adult Location (Step 6)
      if (s === 6) {
        if (state.packageType === "basic") {
          next = 9; // Skip Shows(7) and MC(8)
        } else if (state.packageType === "premium") {
          next = 8; // Skip Shows(7)
        }
      }

      // Skip Included bonuses (Step 11) if custom
      if (s === 10 && state.packageType === "custom") {
        next = 12;
      }
      
      return Math.min(next, TOTAL_STEPS);
    });
  }, [state.questType, state.packageType]);

  const prevStep = useCallback(() => {
    setStep((s) => {
      let prev = s - 1;
      
      // Going back from Food (Step 9)
      if (s === 9) {
        if (state.packageType === "basic") {
          prev = 6;
        } else if (state.packageType === "premium") {
          prev = 8;
        }
      }
      // Going back from MC (Step 8)
      else if (s === 8) {
        if (state.packageType === "premium") {
          prev = 6;
        }
      }
      // If going back from Kids Location (Step 5) and not phygital quest, skip Animators (Step 4)
      else if (s === 5 && !state.questType?.startsWith("phygital_")) {
        prev = 3;
      }
      // If going back from Summary (Step 12) and custom, skip Included Bonuses (Step 11)
      else if (s === 12 && state.packageType === "custom") {
        prev = 10;
      }
      
      return Math.max(prev, 1);
    });
  }, [state.questType, state.packageType]);
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

    // Shows
    const showPrices: Record<string, number> = { soap: 14000, paper: 15000, tesla: 15000, professor: 14000 };
    if (state.packageType === "custom" || state.packageType === "basic" || state.packageType === "premium") {
      for (const show of state.shows) {
        if (showPrices[show]) total += showPrices[show];
      }
    } else if (state.packageType === "exclusive") {
      // 1 is free, rest are paid. Let's just subtract the cheapest? Or just assume the first selected is free.
      // Usually it's simplest to just subtract the cost of one show if length > 0.
      if (state.shows.length > 0) {
        let showsCost = 0;
        for (const show of state.shows) {
          if (showPrices[show]) showsCost += showPrices[show];
        }
        // Subtract up to the minimum price of selected to be fair, or just a fixed ~15000? Let's just subtract the first item's price.
        showsCost -= showPrices[state.shows[0]];
        total += showsCost;
      }
    }

    // MK — included in premium/exclusive (1 free); charged for basic
    if (state.packageType === "basic" || state.packageType === "custom") {
      total += state.masterClasses.length * 7500;
    } else if (state.packageType === "premium" || state.packageType === "exclusive") {
      total += Math.max(0, state.masterClasses.length - 1) * 7500;
    }

    // Food — kids set is included in premium/exclusive. If removed, we subtract price.
    if (state.includeFood && (state.packageType === "basic" || state.packageType === "custom")) {
      total += 12070;
    } else if (!state.includeFood && (state.packageType === "premium" || state.packageType === "exclusive")) {
      total -= 12070;
    }

    // Custom food calculations
    Object.entries(state.customFood).forEach(([itemId, qty]) => {
      if (qty > 0) {
        for (const cat of FOOD_MENU) {
          const item = cat.items.find((i) => i.id === itemId);
          if (item) {
            total += item.price * qty;
            break;
          }
        }
      }
    });

    // Cake
    if (state.cakeChoice) {
      if (state.cakeChoice.startsWith("cake")) total += 8400; // All standard catalog cakes are 8400
      else total += 8400; // Fallback
    }

    return total;
  })();

  const visibleSteps = React.useMemo(() => {
    const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    return list.filter((s) => {
      // Skip Animators (Step 4) if not a phygital quest
      if (s === 4 && state.questType && !state.questType.startsWith("phygital_")) return false;
      // Skip Shows(7) if basic or premium
      if (s === 7 && (state.packageType === "basic" || state.packageType === "premium")) return false;
      // Skip MC(8) if basic
      if (s === 8 && state.packageType === "basic") return false;
      // Skip Included Bonuses (11) if custom
      if (s === 11 && state.packageType === "custom") return false;
      return true;
    });
  }, [state.questType, state.packageType]);

  return (
    <WizardContext.Provider
      value={{
        step, totalSteps: TOTAL_STEPS, visibleSteps, state, setStep,
        nextStep, prevStep, updateState, totalPrice, submitted, setSubmitted
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}