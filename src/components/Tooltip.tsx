import { ReactNode, createRef, useState, useEffect } from "react";
import { createPopper } from "@popperjs/core";

export type TooltipProps = {
  children: ReactNode;
  content: string | ReactNode;
};

export const Tooltip = ({ children, content }: TooltipProps) => {
  const [popoverShow, setPopoverShow] = useState(false);
  const triggerRef = createRef<HTMLDivElement>();
  const popoverRef = createRef<HTMLDivElement>();
  const openTooltip = () => {
    createPopper(triggerRef.current, popoverRef.current, {
      placement: "bottom",
    });
    setPopoverShow(true);
  };
  const closeTooltip = () => {
    setPopoverShow(false);
  };

  useEffect(() => {
    const handleOutsideTap = (ev: TouchEvent) => {
      console.log(ev.touches);
    };
    window.addEventListener("touchstart", handleOutsideTap);

    return () => {
      window.removeEventListener("touchstart", handleOutsideTap);
    };
  }, []);

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full text-center">
          <div
            onMouseEnter={openTooltip}
            onMouseLeave={closeTooltip}
            ref={triggerRef}
            onClick={openTooltip}
          >
            {children}
          </div>
          <div
            className={
              (popoverShow ? "" : "hidden ") +
              "z-50 block max-w-xs break-words rounded-lg border-0 bg-gray-600 text-left text-sm font-normal leading-normal no-underline"
            }
            onMouseEnter={openTooltip}
            onMouseLeave={closeTooltip}
            ref={popoverRef}
          >
            <div>
              <div className="p-3 text-white">{content}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tooltip;
