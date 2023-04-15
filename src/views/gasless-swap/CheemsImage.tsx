import { MutableRefObject, useRef, useState } from "react";
import { classNames } from "utils";
import Image from "next/image";

type Props = {
  wrapperRef: MutableRefObject<HTMLDivElement>;
};

export const CheemsImage = ({ wrapperRef }: Props) => {
  const cheemsRef = useRef<HTMLDivElement | null>(null);
  const [bonkCounter, setBonkCounter] = useState(0);
  const [bonkAnimate, setBonkAnimate] = useState(false);

  const handleCheemsBonk = () => {
    if (!cheemsRef?.current) return;
    // Start animating
    setBonkAnimate(true);

    // Trigger the "jello" animation
    cheemsRef.current.style.animation = "none";
    cheemsRef.current.offsetHeight; /* trigger reflow */
    cheemsRef.current.style.animation = null;

    // Eyes trigger
    setBonkCounter((prev) => prev + 1);

    // Text bubbles
    if (!wrapperRef.current) return;
    const randomX = Math.round(Math.random() * 100); // [0, 100]
    const randomY = Math.round(Math.random() * 80); // [0, 80]
    const turnDeg = Math.round(Math.random() * 120 - 60); // [-60, 60]
    const el = document.createElement("span");
    el.textContent = "BONK";
    el.classList.add(
      "absolute",
      "text-orange-400",
      "text-sm",
      "font-semibold",
      "border-2",
      "border-orange-400",
      "px-1.5",
      "py-0.5",
      "rounded-xl",
      "pointer-events-none"
    );
    el.style.setProperty("transform", `rotate(${turnDeg}deg)`);
    el.style.setProperty("top", `${randomY}%`);
    el.style.setProperty("left", `${randomX}%`);
    wrapperRef.current.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 1000);
  };

  return (
    <div
      ref={cheemsRef}
      className={classNames(bonkAnimate && "jello-horizontal", "p-8 hover:cursor-pointer")}
      onClick={handleCheemsBonk}
    >
      <div className="relative">
        <Image unoptimized={true} src={"/cheems.png"} alt="" height={320} width={320} />
        {/* Eyes */}
        <div
          className={classNames(
            "absolute top-[8%] left-[64%] text-sm",
            bonkCounter >= 20 ? "fire-in" : "opacity-0"
          )}
        >
          🔥
        </div>
        <div
          className={classNames(
            "absolute top-[7.5%] left-[81%] text-sm",
            bonkCounter >= 20 ? "fire-in" : "opacity-0"
          )}
        >
          🔥
        </div>
      </div>
    </div>
  );
};
