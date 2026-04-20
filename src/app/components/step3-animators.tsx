import { useWizard } from "./wizard-context";
import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

const BASE = import.meta.env.BASE_URL;

type AnimatorCategory =
  | "princesses"
  | "superheroes"
  | "villains"
  | "cartoons"
  | "games"
  | "universal";

interface Animator {
  id: string;
  name: string;
  category: AnimatorCategory;
  image: string;
}

const SECTION_CATEGORIES: { id: AnimatorCategory; label: string; emoji: string }[] = [
  { id: "princesses", label: "Принцессы", emoji: "👑" },
  { id: "superheroes", label: "Супергерои", emoji: "🦸" },
  { id: "villains", label: "Антигерои", emoji: "🖤" },
  { id: "cartoons", label: "Мультики", emoji: "🎬" },
  { id: "games", label: "Игры", emoji: "🎮" },
  { id: "universal", label: "Другие", emoji: "🌟" },
];

const ANIMATORS: Animator[] = [
  // 👑 Принцессы
  { id: "elsa", name: "Эльза", category: "princesses", image: "/animators/cropped/elsa.jpg" },
  { id: "anna", name: "Анна", category: "princesses", image: "/animators/cropped/anna.jpg" },
  { id: "ariel", name: "Ариэль", category: "princesses", image: "/animators/cropped/ariel.jpg" },
  { id: "rapunzel", name: "Рапунцель", category: "princesses", image: "/animators/cropped/rapunzel.jpg" },
  { id: "aurora", name: "Аврора", category: "princesses", image: "/animators/cropped/aurora.jpg" },
  { id: "snow_white", name: "Белоснежка", category: "princesses", image: "/animators/cropped/snow_white.jpg" },
  { id: "jasmine", name: "Жасмин", category: "princesses", image: "/animators/cropped/jasmine.jpg" },
  { id: "cinderella", name: "Золушка", category: "princesses", image: "/animators/cropped/cinderella.jpg" },
  { id: "moana", name: "Моана", category: "princesses", image: "/animators/cropped/moana.jpg" },
  { id: "minnie_mouse", name: "Минни Маус", category: "princesses", image: "/animators/cropped/minnie_mouse.jpg" },
  { id: "barbie", name: "Барби", category: "princesses", image: "/animators/cropped/barbie.jpg" },
  { id: "lol_queen_bee", name: "Королева Пчёлка", category: "princesses", image: "/animators/cropped/lol_queen_bee.jpg" },
  { id: "lol_doll", name: "Кукла L.O.L.", category: "princesses", image: "/animators/cropped/lol_doll.jpg" },
  { id: "lol_unicorn", name: "Фея-Единорог", category: "princesses", image: "/animators/cropped/lol_unicorn.jpg" },
  { id: "rainbow_dash", name: "Радуга Дэш", category: "princesses", image: "/animators/cropped/rainbow_dash.jpg" },
  { id: "princess_cadence", name: "Принцесса Каденс", category: "princesses", image: "/animators/cropped/princess_cadence.jpg" },

  // 🦸 Супергерои
  { id: "spiderman", name: "Человек-Паук", category: "superheroes", image: "/animators/cropped/spiderman.jpg" },
  { id: "batman", name: "Бэтмен", category: "superheroes", image: "/animators/cropped/batman.jpg" },
  { id: "captain_america", name: "Капитан Америка", category: "superheroes", image: "/animators/cropped/captain_america.jpg" },
  { id: "superman", name: "Супермен", category: "superheroes", image: "/animators/cropped/superman.jpg" },
  { id: "deadpool", name: "Дэдпул", category: "superheroes", image: "/animators/cropped/deadpool.jpg" },
  { id: "optimus_prime", name: "Оптимус Прайм", category: "superheroes", image: "/animators/cropped/optimus_prime.jpg" },

  // 🖤 Антигерои
  { id: "wednesday", name: "Уэнсдей", category: "villains", image: "/animators/cropped/wednesday.jpg" },
  { id: "enid", name: "Энид", category: "villains", image: "/animators/cropped/enid.jpg" },
  { id: "maleficent", name: "Малефисента", category: "villains", image: "/animators/cropped/maleficent.jpg" },
  { id: "cruella", name: "Круэлла", category: "villains", image: "/animators/cropped/cruella.jpg" },
  { id: "huggy_wuggy", name: "Хаги Ваги", category: "villains", image: "/animators/cropped/huggy_wuggy.jpg" },
  { id: "kissy_missy", name: "Киси Миси", category: "villains", image: "/animators/cropped/kissy_missy.jpg" },
  { id: "darth_vader", name: "Дарт Вейдер", category: "villains", image: "/animators/cropped/darth_vader.jpg" },

  // 🎬 Мультики
  { id: "chase", name: "Чейз", category: "cartoons", image: "/animators/cropped/chase.jpg" },
  { id: "skye", name: "Скай", category: "cartoons", image: "/animators/cropped/skye.jpg" },
  { id: "kuromi", name: "Куроми", category: "cartoons", image: "/animators/cropped/kuromi.jpg" },
  { id: "hello_kitty", name: "Hello Kitty", category: "cartoons", image: "/animators/cropped/hello_kitty.jpg" },
  { id: "naruto", name: "Наруто", category: "cartoons", image: "/animators/cropped/naruto.jpg" },
  { id: "pikachu", name: "Пикачу", category: "cartoons", image: "/animators/cropped/pikachu.jpg" },
  { id: "alice", name: "Алиса", category: "cartoons", image: "/animators/cropped/alice.jpg" },
  { id: "maui", name: "Мауи", category: "cartoons", image: "/animators/cropped/maui.jpg" },
  { id: "donatello", name: "Донателло", category: "cartoons", image: "/animators/cropped/donatello.jpg" },
  { id: "michelangelo", name: "Микеланджело", category: "cartoons", image: "/animators/cropped/michelangelo.jpg" },
  { id: "raphael", name: "Рафаэль", category: "cartoons", image: "/animators/cropped/raphael.jpg" },

  // 🎮 Игры
  { id: "minecraft_creeper", name: "Крипер", category: "games", image: "/animators/cropped/minecraft_creeper.jpg" },
  { id: "green_creeper", name: "Зелёный Крипер", category: "games", image: "/animators/cropped/green_creeper.jpg" },
  { id: "brawl_leon", name: "Леон", category: "games", image: "/animators/cropped/brawl_leon.jpg" },
  { id: "brawl_shelly", name: "Шелли", category: "games", image: "/animators/cropped/brawl_shelly.jpg" },
  { id: "sonic", name: "Соник", category: "games", image: "/animators/cropped/sonic.jpg" },
  { id: "mario", name: "Марио", category: "games", image: "/animators/cropped/mario.jpg" },
  { id: "roblox_girl", name: "Девочка Роблокс", category: "games", image: "/animators/cropped/roblox_girl.jpg" },
  { id: "roblox_boy", name: "Мальчик Роблокс", category: "games", image: "/animators/cropped/roblox_boy.jpg" },
  { id: "roblox_blue", name: "Блю Роблокс", category: "games", image: "/animators/cropped/roblox_blue.jpg" },

  // 🌟 Другие
  { id: "harry_potter", name: "Гарри Поттер", category: "universal", image: "/animators/cropped/harry_potter.jpg" },
  { id: "hermione", name: "Гермиона", category: "universal", image: "/animators/cropped/hermione.jpg" },
  { id: "ken", name: "Кен", category: "universal", image: "/animators/cropped/ken.jpg" },
  { id: "squid_game", name: "Охранник", category: "universal", image: "/animators/cropped/squid_game.jpg" },
  { id: "blogger", name: "Блогерша", category: "universal", image: "/animators/cropped/blogger.jpg" },
  { id: "blogger_male", name: "Блогер", category: "universal", image: "/animators/cropped/blogger_male.jpg" },
  { id: "pirate", name: "Пират", category: "universal", image: "/animators/cropped/pirate.jpg" },
  { id: "pirate_girl", name: "Пиратка", category: "universal", image: "/animators/cropped/pirate_girl.jpg" },
  { id: "host", name: "Ведущий", category: "universal", image: "/animators/cropped/host.jpg" },
  { id: "pop_it", name: "Pop It", category: "universal", image: "/animators/cropped/pop_it.jpg" },
  { id: "paleontologist", name: "Палеонтолог", category: "universal", image: "/animators/cropped/paleontologist.jpg" },
  { id: "footballer", name: "Футболист", category: "universal", image: "/animators/cropped/footballer.jpg" },
  { id: "dragon", name: "Дракоша", category: "universal", image: "/animators/cropped/dragon.jpg" },
  { id: "unicorn", name: "Единорожка", category: "universal", image: "/animators/cropped/unicorn.jpg" },
  { id: "jester", name: "Шут", category: "universal", image: "/animators/cropped/jester.jpg" },
  { id: "circus_bunny", name: "Цирковой зайка", category: "universal", image: "/animators/cropped/circus_bunny.jpg" },
  { id: "circus_artist1", name: "Цирковой артист", category: "universal", image: "/animators/cropped/circus_artist1.jpg" },
  { id: "circus_artist2", name: "Цирковой артист", category: "universal", image: "/animators/cropped/circus_artist2.jpg" },
];

export function Step3Animators() {
  const { state, updateState } = useWizard();
  const [activeCategory, setActiveCategory] = useState<AnimatorCategory>("princesses");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isScrollingToRef = useRef(false);

  const toggleAnimator = (id: string) => {
    const current = state.animators;
    if (current.includes(id)) {
      updateState({ animators: current.filter((a) => a !== id) });
    } else {
      updateState({ animators: [id] });
    }
  };

  // Auto-scroll the active tab into view within the horizontal tab bar
  const scrollTabIntoView = useCallback((catId: string) => {
    const btn = tabButtonRefs.current[catId];
    const container = tabsRef.current;
    if (btn && container) {
      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollLeft =
        container.scrollLeft +
        (btnRect.left - containerRect.left) -
        containerRect.width / 2 +
        btnRect.width / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, []);

  // IntersectionObserver to auto-switch active tab on scroll
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const timer = setTimeout(() => {
      SECTION_CATEGORIES.forEach((cat) => {
        const el = sectionRefs.current[cat.id];
        if (!el) return;

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !isScrollingToRef.current) {
                setActiveCategory(cat.id);
                scrollTabIntoView(cat.id);
              }
            });
          },
          {
            rootMargin: "-80px 0px -70% 0px",
            threshold: 0,
          }
        );
        observer.observe(el);
        observers.push(observer);
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      observers.forEach((o) => o.disconnect());
    };
  }, [scrollTabIntoView]);

  // Click on tab → scroll to section
  const scrollToSection = (catId: AnimatorCategory) => {
    setActiveCategory(catId);
    scrollTabIntoView(catId);

    const el = sectionRefs.current[catId];
    if (el) {
      isScrollingToRef.current = true;
      const yOffset = -180; // App header (~125px) + sticky tabs (~55px)
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });

      setTimeout(() => {
        isScrollingToRef.current = false;
      }, 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="pb-6"
    >
      {/* Header */}
      <div className="text-center mb-4 px-8 pt-2">
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">
            🦸‍♂️
          </span>
          Любимые герои
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">
          На празднике 2 артиста. Выберите героя для праздника
        </p>
      </div>

      {state.questType?.startsWith("phygital_") && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 mb-4 mx-4 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[#FF6022] font-bold text-sm mb-1">
              К фиджитал-квесту!
            </h3>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              Вы выбрали приключение с Лисом Рокки. Теперь вы можете добавить
              любимых героев, которые присоединятся к нему на празднике!
            </p>
          </div>
          <div className="absolute -bottom-2 -right-2 text-6xl opacity-20 transform rotate-12">
            🦊
          </div>
        </div>
      )}

      {/* Selection counter */}
      <div className="flex items-center justify-between mb-3 px-5">
        <span className="text-sm text-[#747474]">
          Выбрано:{" "}
          <span className="font-bold text-[#1A1A1A]">
            {state.animators.length}
          </span>{" "}
          / 1
        </span>
        {state.animators.length === 1 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1"
          >
            <Check className="w-3 h-3" /> Отлично!
          </motion.span>
        )}
      </div>

      {/* Sticky category tabs */}
      <div className="sticky top-[125px] z-30 bg-[#F7F7F7] pt-1 pb-3 -mx-4 px-4">
        <div
          ref={tabsRef}
          className="flex gap-1.5 overflow-x-auto scrollbar-hide"
        >
          {SECTION_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                ref={(el) => { tabButtonRefs.current[cat.id] = el; }}
                onClick={() => scrollToSection(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#1A1A1A] text-white shadow-md"
                    : "bg-white text-[#747474] ring-1 ring-[#E5E5E5]"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* All sections rendered continuously */}
      <div className="px-4 mt-2">
        {SECTION_CATEGORIES.map((cat) => {
          const sectionAnimators = ANIMATORS.filter((a) => a.category === cat.id);
          return (
            <div
              key={cat.id}
              ref={(el) => { sectionRefs.current[cat.id] = el; }}
              className="mb-6"
            >
              {/* Section heading */}
              <div className="flex items-center gap-2 mb-3 pt-2">
                <span className="text-xl">{cat.emoji}</span>
                <h3 className="text-[17px] font-bold text-[#1A1A1A]">{cat.label}</h3>
                <span className="text-xs text-[#ABABAB] font-medium ml-1">{sectionAnimators.length}</span>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-2 gap-3">
                {sectionAnimators.map((anim) => {
                  const isSelected = state.animators.includes(anim.id);
                  return (
                    <button
                      key={anim.id}
                      onClick={() => toggleAnimator(anim.id)}
                      className={`relative aspect-[4/5] rounded-[24px] overflow-hidden transition-all cursor-pointer group text-left ${
                        isSelected
                          ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]"
                          : "ring-1 ring-[#E5E5E5] shadow-sm hover:shadow-md"
                      }`}
                    >
                      {/* Background and Image */}
                      <div className="absolute inset-0 bg-white flex items-center justify-center">
                        <img
                          src={`${BASE}${anim.image.startsWith('/') ? anim.image.slice(1) : anim.image}`}
                          alt={anim.name}
                          className="w-full h-full object-contain object-bottom pt-5 px-3 pb-[70px] transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      {/* Checkmark */}
                      <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            isSelected ? "bg-[#FF6022] border-2 border-white text-white shadow-md shadow-[#FF6022]/40" : "bg-white/40 backdrop-blur-md border border-white/60 text-transparent"
                        }`}>
                           <Check className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Bottom Name Plate */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white rounded-[18px] p-3 shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex flex-col justify-center border border-[#F0F0F0] text-center min-h-[50px] pointer-events-none">
                        <h4 className="text-[14px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">
                          {anim.name}
                        </h4>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Premium costume info */}
      <div className="mx-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-4 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">
              Свой герой
            </h3>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              Не нашли нужного персонажа? Напишите нам — мы подберём костюм
              специально под вашу тему!
            </p>
          </div>
        </div>
        <div className="absolute -bottom-3 -right-3 text-5xl opacity-10 transform rotate-12">
          ✨
        </div>
      </div>
    </motion.div>
  );
}