import React from 'react';

interface PackageCardProps {
  name: string;
  nameColor: string;
  borderColor: string;
  features: string[];
  price: string;
  oldPrice: string;
  badge?: string;
  badgeColor?: string;
  duration: string;
  tickets: string;
}

export function PackageCard({
  name,
  nameColor,
  borderColor,
  features,
  price,
  oldPrice,
  badge,
  badgeColor,
  duration,
  tickets,
}: PackageCardProps) {
  // Helper to format features like the reference image
  const renderFeature = (text: string) => {
    if (text.startsWith("Безлимитные билеты в парк") && text.includes(" — ")) {
      const parts = text.split(" — ");
      return (
        <span className="font-['Nunito',sans-serif] font-medium text-[#101011] text-[16px] leading-[22.4px] flex items-center flex-wrap">
          {parts[0]} —{" "}
          <span className="bg-[#ff6022] text-white font-bold px-[8px] py-[2px] rounded-[9px] ml-[4px] leading-none inline-flex items-center" style={{ height: '24px' }}>
            {parts[1]}
          </span>
        </span>
      );
    }
    
    if (text.startsWith("Анимационная программа") && text.includes(" — ")) {
      const parts = text.split(" — ");
      return (
        <span className="font-['Nunito',sans-serif] font-medium text-[#101011] text-[16px] leading-[22.4px] flex items-center flex-wrap">
          {parts[0]} —{" "}
          <span className="bg-[#5b21cc] text-white font-bold px-[10px] py-[2px] rounded-[13px] ml-[4px] leading-none inline-flex items-center" style={{ height: '24px' }}>
            {parts[1]}
          </span>
        </span>
      );
    }

    return (
      <span className="font-['Nunito',sans-serif] font-medium text-[#101011] text-[16px] leading-[22.4px]">
        {text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-[24px] w-full relative mt-[24px]">
      <div 
        className="absolute inset-0 rounded-[24px] pointer-events-none"
        style={{ border: `2px solid ${borderColor}` }}
      />
      
      {/* Top Left Optional Badge */}
      {badge && (
        <div
          className="absolute top-[24px] left-[-8px] px-[14px] py-[6px] rounded-r-full shadow-sm z-10"
          style={{ backgroundColor: badgeColor || borderColor }}
        >
          <span className="font-['Nunito',sans-serif] text-white text-[14px]" style={{ fontWeight: 800 }}>
            {badge}
          </span>
        </div>
      )}

      {/* Duration Badge (Top Right Rotated) */}
      <div className="absolute right-[-12px] top-[-20px] rotate-[-9.19deg] z-10 flex items-center justify-center pointer-events-none">
        <div className="bg-[#5b21cc] h-[55px] px-[24px] rounded-[15px] flex items-center justify-center min-w-[120px] shadow-md">
          <span className="font-['Nunito',sans-serif] font-black text-white text-[32px] tracking-[-0.5px] leading-none mt-[-2px]">
            {duration}
          </span>
        </div>
      </div>

      <div className="flex flex-col px-[24px] pt-[28px] pb-[28px] relative z-0">
        {/* Header */}
        <div className="mb-[34px] pr-[100px]">
          <h2 className="font-['Nunito',sans-serif] text-[32px] tracking-[-0.5px] leading-[1]">
            <span className="font-black text-[#101011]">Hello </span>
            <span className="font-black" style={{ color: nameColor }}>{name}</span>
          </h2>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-[12px] mb-[16px]">
          {features.map((feature, i) => (
            <div key={i} className="flex gap-[12px] items-start relative">
              <div className="bg-[#ff6022] rounded-full size-[8px] mt-[8px] shrink-0" />
              {renderFeature(feature)}
            </div>
          ))}
        </div>

        {/* Purple 'Free Entry for Adults' Badge */}
        <div className="mb-[40px] pl-[20px]">
          <div className="bg-[#5b21cc] rounded-[13px] inline-flex items-center justify-center px-[24px] py-[3px]">
            <span className="font-['Nunito',sans-serif] font-semibold text-white text-[16px] leading-[22.4px]">
              Взрослым вход бесплатный
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col items-center gap-[4px] mb-[20px]">
          <p className="font-['Nunito',sans-serif] text-[#999490] text-[16.38px] line-through font-semibold leading-none">
            {oldPrice}
          </p>
          <p className="font-['Nunito',sans-serif] text-[#ff6022] text-[31px] tracking-[-0.45px] font-extrabold leading-none mt-[4px]">
            {price}
          </p>
        </div>
        
        {/* CTA */}
        <button className="bg-[#ff6022] w-full mt-[4px] py-[16px] rounded-full active:scale-[0.97] transition-transform">
          <span className="font-['Nunito',sans-serif] text-white text-[17px]" style={{ fontWeight: 700 }}>
            Оставить заявку
          </span>
        </button>
      </div>
    </div>
  );
}
