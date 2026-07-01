import type { PointerEvent, ReactNode } from "react";
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

export function mapGridSegments(
  segments: GridRenderSegment[],
  renderCell: (spec: FlipBoardCellSpec) => ReactNode,
  linkHover?: FooterLinkHoverHandlers,
): ReactNode[] {
  return segments.map((segment) => {
    if (segment.type === "cell") {
      return renderCell(segment.spec);
    }

    return (
      <a
        key={`${segment.href}-${segment.specs[0]?.id ?? "link"}`}
        href={segment.href}
        target={segment.href.startsWith("mailto:") ? undefined : "_blank"}
        rel={
          segment.href.startsWith("mailto:")
            ? undefined
            : "noopener noreferrer"
        }
        className="cursor-hover-pointer flip-board-footer__link"
        onPointerEnter={linkHover?.onPointerEnter}
        onPointerLeave={linkHover?.onPointerLeave}
      >
        {segment.specs.map((spec) => renderCell(spec))}
      </a>
    );
  });
}
