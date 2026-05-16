"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const TOOLTIP_OFFSET = 14;
const TOOLTIP_OPEN_MS = 200;

type TriggerElementProps = React.HTMLAttributes<HTMLElement>;

type CursorFollowTooltipProps = {
  label: string;
  children: ReactElement<TriggerElementProps>;
};

export function CursorFollowTooltip({ label, children }: CursorFollowTooltipProps) {
  const tooltipId = useId();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOpenTimer = useCallback(() => {
    if (openTimerRef.current !== null) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => clearOpenTimer();
  }, [clearOpenTimer]);

  const updateCoords = useCallback((clientX: number, clientY: number) => {
    setCoords({
      x: clientX + TOOLTIP_OFFSET,
      y: clientY + TOOLTIP_OFFSET,
    });
  }, []);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      updateCoords(event.clientX, event.clientY);
      clearOpenTimer();
      openTimerRef.current = setTimeout(() => setVisible(true), TOOLTIP_OPEN_MS);
    },
    [clearOpenTimer, updateCoords]
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      updateCoords(event.clientX, event.clientY);
    },
    [updateCoords]
  );

  const handleMouseLeave = useCallback(() => {
    clearOpenTimer();
    setVisible(false);
  }, [clearOpenTimer]);

  if (!isValidElement(children)) {
    return children as ReactNode;
  }

  const trigger = cloneElement(children, {
    className: cn(children.props.className, "cursor-default"),
    onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
      children.props.onMouseEnter?.(event);
      handleMouseEnter(event);
    },
    onMouseMove: (event: React.MouseEvent<HTMLElement>) => {
      children.props.onMouseMove?.(event);
      handleMouseMove(event);
    },
    onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
      children.props.onMouseLeave?.(event);
      handleMouseLeave();
    },
    "aria-describedby": visible ? tooltipId : undefined,
  });

  return (
    <>
      {trigger}
      {mounted &&
        visible &&
        createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            className="pointer-events-none fixed z-[100] w-fit rounded-md bg-[#111111] px-3 py-1.5 text-xs text-[#fafafa] shadow-md"
            style={{
              left: coords.x,
              top: coords.y,
              fontFamily: "var(--font-hind), sans-serif",
            }}
          >
            {label}
          </div>,
          document.body
        )}
    </>
  );
}
