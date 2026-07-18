"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import {
  useGlobalTooltip,
  TooltipArrow,
} from "@/app/components/animate-ui/primitives/tooltip";
import type { FlipBoardCellSpec } from "./types";

export type GridRenderSegment =
  | { type: "cell"; spec: FlipBoardCellSpec }
  | { type: "link"; href: string; specs: FlipBoardCellSpec[] };

export function segmentGridForRender(
  specs: FlipBoardCellSpec[],
): GridRenderSegment[] {
  const segments: GridRenderSegment[] = [];
  let index = 0;

  while (index < specs.length) {
    const spec = specs[index]!;
    if (spec.href && spec.interactive) {
      const href = spec.href;
      const group: FlipBoardCellSpec[] = [spec];
      index += 1;
      while (
        index < specs.length &&
        specs[index]!.href === href &&
        specs[index]!.interactive
      ) {
        group.push(specs[index]!);
        index += 1;
      }
      segments.push({ type: "link", href, specs: group });
      continue;
    }

    segments.push({ type: "cell", spec });
    index += 1;
  }

  return segments;
}

export type FooterLinkHoverHandlers = {
  onPointerEnter: (event: PointerEvent<HTMLAnchorElement>) => void;
  onPointerLeave: (event: PointerEvent<HTMLAnchorElement>) => void;
};

const COPIED_TOOLTIP_MS = 2500;

function CopiedTooltipBody() {
  return (
    <>
      <motion.div
        className="overflow-hidden px-3 py-1.5 text-xs text-balance"
        style={{ fontFamily: "var(--font-hind), sans-serif", color: "#fafafa" }}
      >
        <motion.div layout="preserve-aspect">Copied</motion.div>
      </motion.div>
      <TooltipArrow
        className="fill-[#111111] size-3 data-[side='bottom']:translate-y-[1px] data-[side='right']:translate-x-[1px] data-[side='left']:translate-x-[-1px] data-[side='top']:translate-y-[-1px]"
        tipRadius={2}
      />
    </>
  );
}

function EmailLinkSegment({
  href,
  specs,
  renderCell,
  linkHover,
}: {
  href: string;
  specs: FlipBoardCellSpec[];
  renderCell: (spec: FlipBoardCellSpec) => ReactNode;
  linkHover?: FooterLinkHoverHandlers;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const copiedTooltipId = useId();
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copiedTooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showTooltip, hideImmediate, setReferenceEl } = useGlobalTooltip();

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      if (copiedTooltipTimeoutRef.current) clearTimeout(copiedTooltipTimeoutRef.current);
    };
  }, []);

  const handleCopy = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      if (isCopied) return;

      const email = href.replace(/^mailto:/, "");
      navigator.clipboard.writeText(email).then(() => {
        setIsCopied(true);

        const el = anchorRef.current;
        if (el) {
          hideImmediate();
          setReferenceEl(el);
          showTooltip({
            contentProps: {
              className: "z-50 w-fit bg-[#111111] text-white rounded-md",
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
        }

        if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      });
    },
    [href, isCopied, copiedTooltipId, hideImmediate, setReferenceEl, showTooltip],
  );

  return (
    <a
      ref={anchorRef}
      href={href}
      className="cursor-hover-pointer flip-board-footer__link"
      onPointerEnter={linkHover?.onPointerEnter}
      onPointerLeave={linkHover?.onPointerLeave}
      onClick={handleCopy}
      aria-label={isCopied ? "Email copied" : "Copy email address"}
    >
      {specs.map((spec) => renderCell(spec))}
    </a>
  );
}

export function mapGridSegments(
  segments: GridRenderSegment[],
  renderCell: (spec: FlipBoardCellSpec) => ReactNode,
  linkHover?: FooterLinkHoverHandlers,
): ReactNode[] {
  return segments.map((segment) => {
    if (segment.type === "cell") {
      return renderCell(segment.spec);
    }

    const key = `${segment.href}-${segment.specs[0]?.id ?? "link"}`;

    if (segment.href.startsWith("mailto:")) {
      return (
        <EmailLinkSegment
          key={key}
          href={segment.href}
          specs={segment.specs}
          renderCell={renderCell}
          linkHover={linkHover}
        />
      );
    }

    return (
      <a
        key={key}
        href={segment.href}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-hover-pointer flip-board-footer__link"
        onPointerEnter={linkHover?.onPointerEnter}
        onPointerLeave={linkHover?.onPointerLeave}
      >
        {segment.specs.map((spec) => renderCell(spec))}
      </a>
    );
  });
}
