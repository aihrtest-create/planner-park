function Heading() {
  return (
    <div className="absolute h-[48px] left-0 top-0 w-[336px]" data-name="Heading 2">
      <p className="absolute font-['Nunito:Black',sans-serif] font-black leading-[0] left-0 text-[#101011] text-[32px] top-0 tracking-[-0.5px] whitespace-nowrap">
        <span className="leading-[48px]">{`Hello `}</span>
        <span className="leading-[48px] text-[#ef5299]">Fun</span>
      </p>
    </div>
  );
}

function Paragraph() {
  return <div className="absolute h-[22.5px] left-0 top-[52px] w-[336px]" data-name="Paragraph" />;
}

function Container1() {
  return (
    <div className="absolute h-[74.5px] left-[24px] top-[28px] w-[336px]" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function Container4() {
  return <div className="absolute bg-[#ff6022] left-0 rounded-[16777200px] size-[8px] top-[8px]" data-name="Container" />;
}

function Paragraph1() {
  return (
    <div className="absolute h-[22.398px] left-[20px] top-0 w-[278.469px]" data-name="Paragraph">
      <p className="absolute font-['Nunito:Medium',sans-serif] font-medium leading-[0] left-0 text-[#101011] text-[16px] top-0 whitespace-nowrap">
        <span className="leading-[22.4px]">{`Безлимитные билеты в парк — `}</span>
        <span className="font-['Nunito:Bold',sans-serif] font-bold leading-[22.4px] text-white">8 шт.</span>
      </p>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[22.398px] left-0 top-0 w-[336px]" data-name="Container">
      <Container4 />
      <div className="absolute bg-[#ff6022] h-[25px] left-[259px] rounded-[9px] top-[-1.5px] w-[42px]" />
      <Paragraph1 />
    </div>
  );
}

function Container6() {
  return <div className="absolute bg-[#ff6022] left-0 rounded-[16777200px] size-[8px] top-[8px]" data-name="Container" />;
}

function Paragraph2() {
  return (
    <div className="absolute content-stretch flex h-[22.398px] items-start left-[20px] top-0 w-[274.242px]" data-name="Paragraph">
      <p className="font-['Nunito:Medium',sans-serif] font-medium leading-[22.4px] relative shrink-0 text-[#101011] text-[16px] whitespace-nowrap">WOW-поздравление от Лиса Рокки</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[22.398px] left-0 top-[34.4px] w-[336px]" data-name="Container">
      <Container6 />
      <Paragraph2 />
    </div>
  );
}

function Container8() {
  return <div className="absolute bg-[#ff6022] left-0 rounded-[16777200px] size-[8px] top-[8px]" data-name="Container" />;
}

function Paragraph3() {
  return (
    <div className="absolute h-[22.398px] left-[20px] top-0 w-[283.047px]" data-name="Paragraph">
      <p className="absolute font-['Nunito:Medium',sans-serif] font-medium leading-[0] left-0 text-[#101011] text-[16px] top-0 whitespace-nowrap">
        <span className="leading-[22.4px]">{`Анимационная программа — `}</span>
        <span className="font-['Nunito:Bold',sans-serif] font-bold leading-[22.4px] text-white">45 мин.</span>
      </p>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute h-[22.398px] left-0 top-[68.8px] w-[336px]" data-name="Container">
      <Container8 />
      <div className="absolute bg-[#5b21cc] h-[26px] left-[240px] rounded-[13.08px] top-[-1.3px] w-[71px]" data-name="Rounded rectangle" />
      <Paragraph3 />
    </div>
  );
}

function Container10() {
  return <div className="absolute bg-[#ff6022] left-0 rounded-[16777200px] size-[8px] top-[8px]" data-name="Container" />;
}

function Paragraph4() {
  return (
    <div className="absolute content-stretch flex h-[22.398px] items-start left-[20px] top-0 w-[207.219px]" data-name="Paragraph">
      <p className="font-['Nunito:Medium',sans-serif] font-medium leading-[22.4px] relative shrink-0 text-[#101011] text-[16px] whitespace-nowrap">Мини-дискотека — 15 мин.</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute h-[22.398px] left-0 top-[103.2px] w-[336px]" data-name="Container">
      <Container10 />
      <Paragraph4 />
    </div>
  );
}

function Container12() {
  return <div className="absolute bg-[#ff6022] left-0 rounded-[16777200px] size-[8px] top-[8px]" data-name="Container" />;
}

function Paragraph5() {
  return (
    <div className="absolute content-stretch flex h-[22.398px] items-start left-[20px] top-0 w-[281.414px]" data-name="Paragraph">
      <p className="font-['Nunito:Medium',sans-serif] font-medium leading-[22.4px] relative shrink-0 text-[#101011] text-[16px] whitespace-nowrap">Украшение шарами с гелием — 8 шт.</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute h-[22.398px] left-0 top-[137.59px] w-[336px]" data-name="Container">
      <Container12 />
      <Paragraph5 />
    </div>
  );
}

function Container14() {
  return <div className="absolute bg-[#ff6022] left-0 rounded-[16777200px] size-[8px] top-[8px]" data-name="Container" />;
}

function Paragraph6() {
  return (
    <div className="absolute content-stretch flex h-[22.398px] items-start left-[20px] top-0 w-[163.93px]" data-name="Paragraph">
      <p className="font-['Nunito:Medium',sans-serif] font-medium leading-[22.4px] relative shrink-0 text-[#101011] text-[16px] whitespace-nowrap">Подарок имениннику</p>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute h-[22.398px] left-0 top-[171.99px] w-[336px]" data-name="Container">
      <Container14 />
      <Paragraph6 />
    </div>
  );
}

function Container16() {
  return <div className="absolute bg-[#ff6022] left-0 rounded-[16777200px] size-[8px] top-[8px]" data-name="Container" />;
}

function Paragraph7() {
  return (
    <div className="absolute content-stretch flex h-[22.398px] items-start left-[20px] top-0 w-[240.695px]" data-name="Paragraph">
      <p className="font-['Nunito:Medium',sans-serif] font-medium leading-[22.4px] relative shrink-0 text-[#101011] text-[16px] whitespace-nowrap">Электронные пригласительные</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[22.398px] left-0 top-[206.39px] w-[336px]" data-name="Container">
      <Container16 />
      <Paragraph7 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[228.789px] left-[24px] top-[126.5px] w-[336px]" data-name="Container">
      <Container3 />
      <Container5 />
      <Container7 />
      <Container9 />
      <Container11 />
      <Container13 />
      <Container15 />
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[24.571px] relative shrink-0 w-[67.612px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[text-decoration-skip-ink:none] absolute decoration-solid font-['Nunito:SemiBold',sans-serif] font-semibold leading-[24.571px] left-0 line-through text-[#999490] text-[16.38px] top-0 whitespace-nowrap">32 900 ₽</p>
      </div>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[124.986px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Nunito:ExtraBold',sans-serif] font-extrabold leading-[46.411px] left-0 text-[#ff6022] text-[30.941px] top-[-0.91px] tracking-[-0.455px] whitespace-nowrap">24 900 ₽</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.64px] h-[101px] items-center left-[-15px] top-[422px] w-[374.945px]" data-name="Container">
      <Paragraph8 />
      <Paragraph9 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents h-[91.162px] left-[247px] top-[-19px] w-[162.755px]">
      <div className="absolute flex h-[78.456px] items-center justify-center left-[249.3px] top-[-12.65px] w-[158.163px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[-9.32deg]">
          <div className="bg-[#5b21cc] h-[54.682px] rounded-[15px] w-[151.307px]" data-name="Rounded rectangle" />
        </div>
      </div>
      <div className="absolute flex h-[66.227px] items-center justify-center left-[272.04px] top-[-8.98px] w-[124.151px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-[-9.19deg]">
          <p className="font-['Nunito:Black',sans-serif] font-black h-[48px] leading-[48px] relative text-[#fffefe] text-[32px] tracking-[-0.5px] w-[118px]">3 часа</p>
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[21px] top-[377px]">
      <div className="absolute bg-[#5b21cc] h-[23px] left-[21px] rounded-[13.08px] top-[377px] w-[240px]" data-name="Rounded rectangle" />
      <p className="-translate-x-1/2 absolute font-['Nunito:SemiBold',sans-serif] font-semibold leading-[22.4px] left-[141px] text-[16px] text-center text-white top-[377px] w-[240px]">Взрослым вход бесплатный</p>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[570.789px] relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Container2 />
      <Container17 />
      <Group />
      <Group1 />
    </div>
  );
}

export default function PackageCard() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start p-[2px] relative rounded-[24px] size-full" data-name="PackageCard">
      <div aria-hidden="true" className="absolute border-2 border-[#ef5299] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <Container />
    </div>
  );
}