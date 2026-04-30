import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { isWeekend } from "date-fns";
import { FOOD_MENU } from "../data/foodMenu";

// Backend API URL — Timeweb VPS (HTTPS через nip.io)
const API_BASE = import.meta.env.VITE_API_URL || 'https://194-87-118-33.nip.io';

// ──────────────────────────────────────────────
// localStorage cache helpers
// ──────────────────────────────────────────────
const CACHE_VERSION = 1;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getCacheKey(leadId: string | null) {
  return leadId ? `wizard_cache_${leadId}` : 'wizard_cache_standalone';
}

interface CachedData {
  version: number;
  timestamp: number;
  step: number;
  state: WizardState;
}

function saveToCache(key: string, step: number, state: WizardState) {
  try {
    const data: CachedData = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      step,
      state: {
        ...state,
        // Date needs special handling — store as ISO string
        date: state.date ? (state.date as unknown as string) : null,
      },
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage may be full or unavailable (e.g. private mode)
  }
}

function loadFromCache(key: string): { step: number; state: WizardState } | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const data: CachedData = JSON.parse(raw);

    // Version mismatch or expired
    if (data.version !== CACHE_VERSION) { localStorage.removeItem(key); return null; }
    if (Date.now() - data.timestamp > CACHE_TTL_MS) { localStorage.removeItem(key); return null; }

    // Restore Date object
    const restored: WizardState = {
      ...data.state,
      date: data.state.date ? new Date(data.state.date as unknown as string) : null,
    };

    return { step: data.step, state: restored };
  } catch {
    return null;
  }
}

function clearCacheByKey(key: string) {
  try { localStorage.removeItem(key); } catch { /* noop */ }
}

export interface WizardState {
  // Step 1
  packageType: "basic" | "premium" | "exclusive" | "custom" | null;
  isWeekend: boolean;
  // Step 2 — Quests
  questType: "phygital_voxels" | "phygital_space" | "classic_fort" | "classic_minecraft" | "classic_squid" | "classic_barbie" | "classic_safari" | "classic_harry" | "classic_heroes" | "classic_bloggers" | "classic_fortnite" | "classic_agents" | "none" | null;
  // Step 3 — Location
  patiroom: string | null;
  patiroomDetails: string | null;
  patiroomHours: number;
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
  hasReachedSummary: boolean;
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
  leadId: string | null;
  submitToAPI: (price?: number) => Promise<boolean>;
  clearCache: () => void;
  resetWizard: () => void;
}

const initialState: WizardState = {
  packageType: null,
  isWeekend: false,
  questType: null,
  patiroom: null,
  patiroomDetails: null,
  patiroomHours: 3,
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
  hasReachedSummary: false,
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
const PATIROOM_HOURLY_RATE = 3000; // Custom mode: 3000₽/hour for any patiroom

// ── Custom mode: gift logic based on selected services ──
export interface CustomGift {
  id: string;
  name: string;
  gradient: string;
  emoji: string;
}

const ALL_CUSTOM_GIFTS: CustomGift[] = [
  { id: "invite", name: "Электронные пригласительные", gradient: "from-[#d4fc79] to-[#96e6a1]", emoji: "✉️" },
  { id: "wow", name: "WOW-поздравление от Лиса Рокки", gradient: "from-[#a1c4fd] to-[#c2e9fb]", emoji: "🎉" },
  { id: "gift", name: "Подарок имениннику", gradient: "from-[#a18cd1] to-[#fbc2eb]", emoji: "🎁" },
  { id: "balloon_decor", name: "Украшение шарами", gradient: "from-[#fbc2eb] to-[#a6c1ee]", emoji: "🎈" },
  { id: "balloon", name: "Шар-сюрприз", gradient: "from-[#ffecd2] to-[#fcb69f]", emoji: "🎊" },
  { id: "pinata", name: "Пиньята / Шар-цифра", gradient: "from-[#ff9a9e] to-[#fecfef]", emoji: "🪅" },
  { id: "gifts_all", name: "Подарки всем гостям", gradient: "from-[#84fab0] to-[#8fd3f4]", emoji: "🛍️" },
];

export function getCustomGifts(state: WizardState): CustomGift[] {
  if (state.packageType !== "custom") return [];
  const gifts: CustomGift[] = [];
  const hasAnyService = state.questType || state.patiroom || state.shows.length > 0
    || state.masterClasses.length > 0 || state.includeFood || state.animators.length > 0;
  const hasQuest = !!state.questType && state.questType !== "none";
  const hasShow = state.shows.length > 0;
  const hasMC = state.masterClasses.length > 0;
  const hasFood = state.includeFood;
  const hasPatiroom = !!state.patiroom;

  // Level 1: any service → invites
  if (hasAnyService) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "invite")!);
  }
  // Level 2: quest → wow + birthday gift
  if (hasQuest) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "wow")!);
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "gift")!);
  }
  // Level 3: patiroom → balloon decor
  if (hasPatiroom) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "balloon_decor")!);
  }
  // Level 4: quest + show or MC → surprise balloon
  if (hasQuest && (hasShow || hasMC)) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "balloon")!);
  }
  // Level 5: quest + show + MC → pinata
  if (hasQuest && hasShow && hasMC) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "pinata")!);
  }
  // Level 6: quest + show + MC + food → gifts for all
  if (hasQuest && hasShow && hasMC && hasFood) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "gifts_all")!);
  }

  return gifts;
}

function hasCustomGifts(state: WizardState): boolean {
  return getCustomGifts(state).length > 0;
}

export function WizardProvider({ children }: { children: React.ReactNode }) {
  // Lead ID from URL parameter (?lead=abc123)
  const [leadId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('lead');
  });

  // Derive cache key from leadId
  const cacheKey = getCacheKey(leadId);

  // Try to restore from cache on first render
  const [step, setStep] = useState(() => {
    const cached = loadFromCache(cacheKey);
    return cached ? cached.step : 0;
  });
  const [state, setState] = useState<WizardState>(() => {
    const cached = loadFromCache(cacheKey);
    if (!cached) return initialState;
    return {
      ...initialState,
      ...cached.state,
      patiroomHours: cached.state.patiroomHours ?? 3,
    };
  });
  const [submitted, setSubmitted] = useState(false);

  // Flag to prevent overwriting cache during initial lead data fetch
  const isInitializing = useRef(true);
  useEffect(() => { isInitializing.current = false; }, []);

  // Update hasReachedSummary
  useEffect(() => {
    if (step === 12 && !state.hasReachedSummary) {
      setState(s => ({ ...s, hasReachedSummary: true }));
    }
  }, [step, state.hasReachedSummary]);

  // Persist state + step to localStorage on every change
  useEffect(() => {
    if (submitted) return; // Don't cache after submission
    saveToCache(cacheKey, step, state);
  }, [step, state, cacheKey, submitted]);

  // Clear cache helper (call after successful submission)
  const clearCache = useCallback(() => {
    clearCacheByKey(cacheKey);
  }, [cacheKey]);

  // Reset entire wizard state
  const resetWizard = useCallback(() => {
    clearCacheByKey(cacheKey);
    setState(initialState);
    setStep(1);
    setSubmitted(false);
  }, [cacheKey]);

  // On mount: if we have a leadId, notify server and pre-fill contact data
  useEffect(() => {
    if (!leadId || !API_BASE) return;

    // Notify server that configurator was opened
    fetch(`${API_BASE}/api/leads/${leadId}/opened`, { method: 'POST' }).catch(() => {});

    // Fetch lead data to pre-fill name and phone
    fetch(`${API_BASE}/api/leads/${leadId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.lead) {
          setState(s => ({
            ...s,
            contactName: data.lead.name || s.contactName,
            contactPhone: data.lead.phone || s.contactPhone,
          }));
        }
      })
      .catch(() => {});
  }, [leadId]);

  // Submit configuration to API
  // Note: totalPrice is passed by the component calling submitToAPI
  const submitToAPI = useCallback(async (price?: number): Promise<boolean> => {
    if (!leadId || !API_BASE) return true; // No lead = standalone mode, always OK
    try {
      const payload = {
        ...state,
        date: state.date?.toISOString(),
        totalPrice: price ?? 0,
      };
      const res = await fetch(`${API_BASE}/api/leads/${leadId}/configure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return data.success;
    } catch {
      console.error('Failed to submit to API');
      return false;
    }
  }, [leadId, state]);

  const nextStep = useCallback(() => {
    setStep((s) => {
      let next = s + 1;
      
      // Skip Animators (Step 4) if not a phygital quest
      if (s === 3 && !state.questType?.startsWith("phygital_")) {
        next = 5;
      }
      
      // Going from Kids Location (Step 5) → skip to step 7 (Shows), 8 (MC) or 9 (Food)
      if (s === 5) {
        if (state.packageType === "basic") {
          next = 9; // Skip Shows(7) and MC(8)
        } else if (state.packageType === "premium") {
          next = 8; // Skip Shows(7)
        } else {
          next = 7;
        }
      }

      // After Food (Step 9) → go to Adult Location (Step 6) "Доп. услуги"
      if (s === 9) {
        next = 6;
      }

      // After Adult Location (Step 6) → go to Cakes (Step 10) "Доп. услуги"
      if (s === 6) {
        next = 10;
      }

      // Skip Included bonuses (Step 11) if custom AND no gifts earned
      if (s === 10 && state.packageType === "custom" && !hasCustomGifts(state)) {
        next = 12;
      }
      
      return Math.min(next, TOTAL_STEPS);
    });
  }, [state.questType, state.packageType]);

  const prevStep = useCallback(() => {
    setStep((s) => {
      let prev = s - 1;
      
      // Going back from Adult Location (Step 6) → back to Food (Step 9)
      if (s === 6) {
        prev = 9;
      }
      // Going back from Cakes (Step 10) → back to Adult Location (Step 6)
      else if (s === 10) {
        prev = 6;
      }
      // Going back from Food (Step 9)
      else if (s === 9) {
        if (state.packageType === "basic") {
          prev = 5;
        } else if (state.packageType === "premium") {
          prev = 8;
        }
      }
      // Going back from MC (Step 8)
      else if (s === 8) {
        if (state.packageType === "premium") {
          prev = 5;
        }
      }
      // Going back from Shows (Step 7)
      else if (s === 7) {
        prev = 5;
      }
      // If going back from Kids Location (Step 5) and not phygital quest, skip Animators (Step 4)
      else if (s === 5 && !state.questType?.startsWith("phygital_")) {
        prev = 3;
      }
      // If going back from Summary (Step 12) and custom, skip Included Bonuses (Step 11) if no gifts
      else if (s === 12 && state.packageType === "custom" && !hasCustomGifts(state)) {
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
        total += state.questType.startsWith("phygital_") ? 12000 : 15000;
      } else if (state.questType.startsWith("classic_")) {
        // Surcharge for classic quests in packages
        if (state.packageType === "basic") total += 10000;
        else if (state.packageType === "premium") total += 5000;
        // exclusive = free
      }
    }

    // Patiroom hourly rate (custom mode only — packages include patiroom)
    if (state.packageType === "custom" && state.patiroom) {
      total += (Number.isNaN(state.patiroomHours) ? 3 : state.patiroomHours || 3) * PATIROOM_HOURLY_RATE;
    }

    // Cafe zone deposits (multiple can be selected)
    // Use actual date's weekend status if date is set, otherwise use toggle
    const effectiveWeekend = state.date ? isWeekend(state.date) : state.isWeekend;
    for (const zone of state.cafeZones) {
      if (zone === "cafe_round") total += effectiveWeekend ? 10000 : 5000;
      if (zone === "cafe_small") total += 5000;
      if (zone === "cafe_pink") total += effectiveWeekend ? 10000 : 5000;
      if (zone === "cafe_pink_full") total += effectiveWeekend ? 20000 : 10000;
    }

    // Additional animators (+8000 each beyond the first)
    if (state.animators.length > 1) {
      total += (state.animators.length - 1) * 8000;
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
      if (state.cakeChoice === "own_cake") {
        total += 2000;
      } else {
        total += 8400;
      }
    }

    return total;
  })();

  const visibleSteps = React.useMemo(() => {
    // Actual navigation order: 1→2→3→4?→5→7?→8?→9→6→10→11?→12
    const list = [1, 2, 3, 4, 5, 7, 8, 9, 6, 10, 11, 12];
    return list.filter((s) => {
      // Skip Animators (Step 4) if not a phygital quest
      if (s === 4 && state.questType && !state.questType.startsWith("phygital_")) return false;
      // Skip Shows(7) if basic or premium
      if (s === 7 && (state.packageType === "basic" || state.packageType === "premium")) return false;
      // Skip MC(8) if basic
      if (s === 8 && state.packageType === "basic") return false;
      // Skip Included Bonuses (11) if custom AND no gifts earned
      if (s === 11 && state.packageType === "custom" && !hasCustomGifts(state)) return false;
      return true;
    });
  }, [state.questType, state.packageType]);

  return (
    <WizardContext.Provider
      value={{
        step, totalSteps: TOTAL_STEPS, visibleSteps, state, setStep,
        nextStep, prevStep, updateState, totalPrice, submitted, setSubmitted,
        leadId, submitToAPI, clearCache, resetWizard
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}