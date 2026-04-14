import { PackageCard } from "./components/PackageCard";
import imgCake from "../imports/Frame1597881146-1/d63f2cf6de50da1743bd1a141484714a0cdddae2.png";

const packages = [
  {
    name: "Fun",
    nameColor: "#ef5299",
    borderColor: "#ef5299",
    duration: "2,5 часа",
    tickets: "8 билетов",
    features: [
      "Безлимитные билеты в парк — 8 шт.",
      "WOW-поздравление от Лиса Рокки",
      "Анимационная программа — 45 мин.",
      "Мини-дискотека — 15 мин.",
      "Украшение шарами с гелием — 8 шт.",
      "Подарок имениннику",
      "Электронные пригласительные",
    ],
    price: "24 900 ₽",
    oldPrice: "32 900 ₽",
  },
  {
    name: "Party",
    nameColor: "#ff7f00",
    borderColor: "#ff7f00",
    duration: "3 часа",
    tickets: "8 билетов",
    badge: "ХИТ",
    badgeColor: "#ff6022",
    features: [
      "Безлимитные билеты в парк — 8 шт.",
      "WOW-поздравление от Лиса Рокки",
      "Анимационная программа — 45 мин.",
      "Мини-дискотека или треш-коробка — 25 мин.",
      "Украшение шарами (гелий + фонтан из шаров)",
      "Мастер-класс на выбор — 30 мин.",
      "Шар-сюрприз",
      "Детские обеды",
      "Подарок имениннику",
    ],
    price: "47 900 ₽",
    oldPrice: "63 990 ₽",
  },
  {
    name: "Bloom",
    nameColor: "#5b21cc",
    borderColor: "#5b21cc",
    duration: "4 часа",
    tickets: "8 билетов",
    features: [
      "Безлимитные билеты в парк — 8 шт.",
      "WOW-поздравление + интерактивное поздравление",
      "Анимационная программа — 45 мин.",
      "Мини-дискотека или треш-коробка — 25 мин.",
      "Украшение комнаты шарами",
      "Аренда Party-room на 4 часа",
      "Кулинарный мастер-класс",
      "Шоу-программа на выбор — 30 мин.",
      "Шар-сюрприз или Пиньята",
      "Детские обеды",
      "Подарки всем гостям",
      "Фотограф — 2 часа",
    ],
    price: "79 900 ₽",
    oldPrice: "105 990 ₽",
  },
];

export default function App() {
  return (
    <div className="min-h-full bg-[#f5f3f0] font-['Nunito',sans-serif]">
      <div className="max-w-[420px] mx-auto px-[16px] py-[32px] flex flex-col gap-[20px]">
        {/* Title */}
        <div className="text-center mb-[8px]">
          <h1
            className="font-['Nunito',sans-serif] text-[28px] text-[#101011] tracking-[-0.5px]"
            style={{ fontWeight: 900 }}
          >
            🎉 Пакетные предложения
          </h1>
          <p
            className="font-['Nunito',sans-serif] text-[#999490] text-[16px] mt-[4px]"
            style={{ fontWeight: 500 }}
          >
            День рождения в Hello Park
          </p>
        </div>

        {/* Package Cards */}
        {packages.map((pkg) => (
          <PackageCard key={pkg.name} {...pkg} />
        ))}

        {/* Custom CTA */}
        <div className="bg-[#ff6022] rounded-[24px] px-[20px] py-[24px] flex flex-col items-center gap-[12px]">
          <img src={imgCake} alt="cake" className="w-[90px] h-[82px] object-contain" />
          <div className="text-center text-white">
            <p className="font-['Nunito',sans-serif] text-[22px] tracking-[-0.3px]" style={{ fontWeight: 800 }}>
              Не нашли подходящего?
            </p>
            <p className="font-['Nunito',sans-serif] text-[16px] mt-[2px] opacity-90" style={{ fontWeight: 500 }}>
              Мы готовы организовать особый праздник для вас!
            </p>
          </div>
          <button className="bg-[#5b21cc] px-[28px] py-[16px] rounded-full active:scale-[0.97] transition-transform">
            <span className="font-['Nunito',sans-serif] text-white text-[17px]" style={{ fontWeight: 700 }}>
              Собери свой праздник
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
