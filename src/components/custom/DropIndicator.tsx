import { cn } from "@/lib/utils";
import { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { CSSProperties } from "react";

type DropIndicatorColorType = "primary" | "secondary";
const DropIndicatorVariant: Record<DropIndicatorColorType, { bg: string; border: string }> = {
  primary: { bg: "bg-primary", border: "border-primary" },
  secondary: { bg: "bg-secondary", border: "border-secondary" },
};

const line = {
  thickness: 2,
};
const terminalSize = 8;
const offsetToAlignTerminalWithLine = (line.thickness - terminalSize) / 2;
const lineOffset = terminalSize / 2;

type Orientation = "horizontal" | "vertical";
const edgeToOrientationMap: Record<Edge, Orientation> = {
  top: "horizontal",
  bottom: "horizontal",
  left: "vertical",
  right: "vertical",
};

const orientationStyles: Record<Orientation, CSSProperties> = {
  horizontal: { height: line.thickness, left: lineOffset, right: 0 },
  vertical: { width: line.thickness, top: lineOffset, bottom: 0 },
};

type DropIndicatorProps = {
  edge: Edge;
  gap?: string;
  color?: DropIndicatorColorType;
};

export function DropIndicator({ edge, gap = "0px", color = "secondary" }: DropIndicatorProps) {
  const lineOffset = `calc(-0.5 * (${gap} + ${line.thickness}px))`;
  const orientation = edgeToOrientationMap[edge];
  const className = `${DropIndicatorVariant[color].bg} block absolute z-[1] pointer-events-none`;
  return (
    <div
      className={cn(className)}
      style={{
        ...orientationStyles[orientation],
        [edge]: lineOffset,
      }}
    >
      <span
        className={`${DropIndicatorVariant[color].border}`}
        style={{
          position: "absolute",
          width: terminalSize,
          height: terminalSize,
          boxSizing: "border-box",
          aspectRatio: 1,
          borderRadius: "50%",
          borderWidth: line.thickness,
          left: orientation === "horizontal" ? -terminalSize : undefined,
          top: orientation === "vertical" ? -terminalSize : undefined,
          [edge]: offsetToAlignTerminalWithLine,
        }}
      />
    </div>
  );
}

export function DropTriggerFlash(element: HTMLElement) {
  element.animate([{ opacity: 0.5, backgroundColor: "inherit" }, {}], {
    iterations: 1,
    easing: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
    duration: 1000,
  });
}
