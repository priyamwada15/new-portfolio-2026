"use client";

import * as React from "react";
import { Check, Mailbox, type IconProps } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useControlledState } from "@/hooks/use-controlled-state";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./animate-ui/tooltip";
import {
  useGlobalTooltip,
  TooltipArrow,
} from "./animate-ui/primitives/tooltip";
import { CONTACT_EMAIL } from "../lib/contact";

type CopyEmailIconProps = {
  email?: string;
  tooltipSide?: "top" | "bottom";
  iconSize?: number;
  iconColor?: string;
  iconWeight?: IconProps["weight"];
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  iconStyle?: React.CSSProperties;
  className?: string;
  /** Renders this text instead of the icon (desktop nav). */
  label?: string;
  labelStyle?: React.CSSProperties;
  /** Text of the tooltip shown after copying. */
  copiedText?: string;
};

const COPIED_TOOLTIP_MS = 2500;

function CopiedTooltipBody({ text }: { text: string }) {
  return (
    <>
      <motion.div
        className="overflow-hidden px-3 py-1.5 text-xs text-balance"
        style={{ fontFamily: "var(--font-hind), sans-serif", color: "#fafafa" }}
      >
        <motion.div layout="preserve-aspect">{text}</motion.div>
      </motion.div>
      <TooltipArrow
        className="fill-[#111111] size-3 data-[side='bottom']:translate-y-[1px] data-[side='right']:translate-x-[1px] data-[side='left']:translate-x-[-1px] data-[side='top']:translate-y-[-1px]"
        tipRadius={2}
      />
    </>
  );
}

export function CopyEmailIcon({
  email = CONTACT_EMAIL,
  tooltipSide = "bottom",
  iconSize = 24,
  iconColor = "#555555",
  iconWeight = "regular",
  onMouseEnter,
  onMouseLeave,
  iconStyle,
  className,
  label,
  labelStyle,
  copiedText = "Copied",
}: CopyEmailIconProps) {
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
        className: "z-50 w-fit bg-[#111111] text-white rounded-md",
        children: <CopiedTooltipBody text={copiedText} />,
      },
      contentAsChild: false,
      rect: el.getBoundingClientRect(),
      side: tooltipSide,
      sideOffset: 8,
      align: "center",
      alignOffset: 0,
      id: copiedTooltipId,
    });

    if (copiedTooltipTimeoutRef.current) clearTimeout(copiedTooltipTimeoutRef.current);
    copiedTooltipTimeoutRef.current = setTimeout(() => {
      hideImmediate();
    }, COPIED_TOOLTIP_MS);
  }, [copiedText, copiedTooltipId, hideImmediate, setReferenceEl, showTooltip, tooltipSide]);

  const handleCopy = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (isCopied) return;

      navigator.clipboard.writeText(email).then(() => {
        setIsCopied(true);
        showCopiedTooltip();

        if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      });
    },
    [email, isCopied, setIsCopied, showCopiedTooltip],
  );

  const iconProps = {
    size: iconSize,
    color: iconColor,
    weight: iconWeight,
    "aria-hidden": true as const,
  };

  const button = (
    <motion.button
      ref={buttonRef}
      type="button"
      data-slot="copy-email-button"
      className={cn(
        "flex items-center justify-center h-8 rounded-md cursor-pointer",
        !label && "w-8",
        className,
      )}
      // Text label matches the other nav links: opacity hover only, no scale
      whileHover={label ? undefined : { scale: 1.05 }}
      whileTap={label ? undefined : { scale: 0.95 }}
      onClick={handleCopy}
      aria-label={isCopied ? "Email copied" : "Copy email address"}
    >
      {label ? (
        <span style={labelStyle}>{label}</span>
      ) : (
      <span style={iconStyle}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={isCopied ? "check" : "mailbox"}
            data-slot="copy-email-icon"
            className="inline-flex"
            initial={{ scale: 0, opacity: 0.4, filter: "blur(4px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0, opacity: 0.4, filter: "blur(4px)" }}
            transition={{ duration: 0.25 }}
          >
            {isCopied ? (
              <Check {...iconProps} />
            ) : (
              <Mailbox {...iconProps} />
            )}
          </motion.span>
        </AnimatePresence>
      </span>
      )}
    </motion.button>
  );

  // Text label (desktop nav) needs no hover tooltip; only "Copied" shows on click
  if (label) return button;

  return (
    <Tooltip side={tooltipSide} sideOffset={8}>
      <TooltipTrigger
        asChild
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {button}
      </TooltipTrigger>
      <TooltipContent>Email</TooltipContent>
    </Tooltip>
  );
}
