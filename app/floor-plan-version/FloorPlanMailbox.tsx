"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useControlledState } from "@/hooks/use-controlled-state";
import { CONTACT_EMAIL } from "@/app/lib/contact";
import { Tooltip, TooltipTrigger } from "@/app/components/animate-ui/tooltip";
import { useGlobalTooltip, TooltipArrow } from "@/app/components/animate-ui/primitives/tooltip";
import { FloorPlanTooltipContent } from "./FloorPlanTooltipContent";

const ASSET = (name: string) => `/new-homepage-plan/${encodeURIComponent(name)}`;
const COPIED_TOOLTIP_MS = 2500;

type FloorPlanMailboxProps = {
  style: React.CSSProperties;
};

function CopiedTooltipBody() {
  return (
    <>
      <motion.div
        className="overflow-hidden px-3 py-1.5 text-xs text-balance text-white"
        style={{ fontFamily: "var(--font-hind), sans-serif" }}
      >
        <motion.div layout="preserve-aspect">Copied</motion.div>
      </motion.div>
      <TooltipArrow
        className="fill-[#95062c] size-3 data-[side='bottom']:translate-y-[1px] data-[side='right']:translate-x-[1px] data-[side='left']:translate-x-[-1px] data-[side='top']:translate-y-[-1px]"
        tipRadius={2}
      />
    </>
  );
}

/** Foyer mailbox — copies the contact email on click, mirroring CopyEmailIcon's tooltip behavior. */
export function FloorPlanMailbox({ style }: FloorPlanMailboxProps) {
  const [isCopied, setIsCopied] = useControlledState({ defaultValue: false });
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const copiedTooltipId = React.useId();
  const resetTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTooltipTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showTooltip, hideImmediate, setReferenceEl } = useGlobalTooltip();

  React.useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      if (copiedTooltipTimeoutRef.current) clearTimeout(copiedTooltipTimeoutRef.current);
    };
  }, []);

  const showCopiedTooltip = React.useCallback(() => {
    const el = buttonRef.current;
    if (!el) return;

    hideImmediate();
    setReferenceEl(el);
    showTooltip({
      contentProps: {
        className: "z-50 w-fit bg-[#95062c] text-white rounded-md",
        children: <CopiedTooltipBody />,
      },
      contentAsChild: false,
      rect: el.getBoundingClientRect(),
      side: "top",
      sideOffset: 8,
      align: "center",
      alignOffset: 0,
      id: copiedTooltipId,
    });

    if (copiedTooltipTimeoutRef.current) clearTimeout(copiedTooltipTimeoutRef.current);
    copiedTooltipTimeoutRef.current = setTimeout(() => {
      hideImmediate();
    }, COPIED_TOOLTIP_MS);
  }, [copiedTooltipId, hideImmediate, setReferenceEl, showTooltip]);

  const handleCopy = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (isCopied) return;

      navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
        setIsCopied(true);
        showCopiedTooltip();

        if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      });
    },
    [isCopied, setIsCopied, showCopiedTooltip],
  );

  return (
    <Tooltip side="top" sideOffset={8}>
      <TooltipTrigger asChild>
        <button
          ref={buttonRef}
          type="button"
          className="absolute cursor-hover-pointer"
          style={style}
          onClick={handleCopy}
          aria-label={isCopied ? "Email copied" : "Copy email address"}
        >
          <img
            src={ASSET("Mailbox.png")}
            alt=""
            data-fp-key="mailbox"
            className="fp-tilt absolute object-contain"
            style={{ left: 0, top: 0, width: "100%", height: "100%" }}
          />
        </button>
      </TooltipTrigger>
      <FloorPlanTooltipContent>Copy email</FloorPlanTooltipContent>
    </Tooltip>
  );
}
