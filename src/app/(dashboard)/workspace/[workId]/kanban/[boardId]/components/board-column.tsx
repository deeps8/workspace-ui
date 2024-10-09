"use client";

import { forwardRef, memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ColumnType } from "@/types/board";
import { Ellipsis } from "lucide-react";
import { useBoardContext } from "@/lib/context/board-context";
import invariant from "tiny-invariant";

import {
  autoScrollForElements,
  autoScrollWindowForElements,
} from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { attachClosestEdge, Edge, extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { centerUnderPointer } from "@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer";
import { ColumnContext, ColumnContextProps } from "@/lib/context/column-context";

import { cn } from "@/lib/utils";
import { DropIndicator } from "@/components/custom/DropIndicator";
import { ColumnCard } from "./column-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnActionMenu } from "./board-action-menus";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import ColumnCardForm from "./column-card-form";

type BoardProps = {
  children: ReactNode;
};
const Board = forwardRef<HTMLDivElement, BoardProps>(function Board({ children }: BoardProps, ref) {
  const { instanceId } = useBoardContext();

  useEffect(() => {
    return autoScrollWindowForElements({
      canScroll: ({ source }) => source.data.instanceId === instanceId,
    });
  }, [instanceId]);

  return (
    <div ref={ref} className="flex h-full overflow-x-auto overflow-y-auto gap-4 pb-4 px-4 pt-2 styled-scrollbar">
      {children}
    </div>
  );
});

export default memo(Board);

const stateStyles: {
  [key in State["type"]]: string | undefined;
} = {
  idle: "cursor-grab",
  "is-card-over": "bg-secondary/10",
  "is-column-over": undefined,
  "generate-column-preview": "isolate",
  "generate-safari-column-preview": undefined,
};

type State =
  | { type: "idle" }
  | { type: "is-card-over" }
  | { type: "is-column-over"; closestEdge: Edge | null }
  | { type: "generate-safari-column-preview"; container: HTMLElement }
  | { type: "generate-column-preview" };

// preventing re-renders with stable state objects
const idle: State = { type: "idle" };
const isCardOver: State = { type: "is-card-over" };

type BoardColumnProps = {
  column: ColumnType;
};

export const BoardColumn = memo(function BoardColumn({ column }: BoardColumnProps) {
  const columnId = column.columnId;
  const columnRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardListRef = useRef<HTMLDivElement | null>(null);
  const scrollableRef = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState<State>(idle);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { instanceId, registerColumn, addCard, data } = useBoardContext();

  useEffect(() => {
    if (!scrollableRef.current || data.lastOperation === null) return;
    if (data.lastOperation.outcome.type === "card-add") {
      const listHeight = scrollableRef.current.scrollHeight;
      scrollableRef.current.scrollTo(0, listHeight);
    }
  }, [data.lastOperation, scrollableRef]);

  useEffect(() => {
    invariant(columnRef.current);
    invariant(headerRef.current);
    invariant(cardListRef.current);
    invariant(scrollableRef.current);

    return combine(
      registerColumn({
        columnId,
        entry: { element: columnRef.current },
      }),
      draggable({
        element: columnRef.current,
        dragHandle: headerRef.current,
        getInitialData: () => ({ columnId, type: "column", instanceId }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          const isSafari: boolean =
            navigator.userAgent.includes("AppleWebKit") && !navigator.userAgent.includes("Chrome");

          if (isSafari) {
            setState({ type: "generate-column-preview" });
            return;
          }

          setCustomNativeDragPreview({
            getOffset: centerUnderPointer,
            render: ({ container }) => {
              setState({
                type: "generate-safari-column-preview",
                container,
              });
              return () => setState(idle);
            },
            nativeSetDragImage,
          });
        },
        onDragStart: () => setIsDragging(true),
        onDrop: () => {
          setState(idle);
          setIsDragging(false);
        },
      }),
      dropTargetForElements({
        element: cardListRef.current,
        getData: () => ({ columnId }),
        canDrop: ({ source }) => {
          return source.data.instanceId === instanceId && source.data.type === "card";
        },
        getIsSticky: () => true,
        onDragEnter: () => setState(isCardOver),
        onDragLeave: () => setState(idle),
        onDragStart: () => setState(isCardOver),
        onDrop: () => setState(idle),
      }),
      dropTargetForElements({
        element: columnRef.current,
        canDrop: ({ source }) => {
          return source.data.instanceId === instanceId && source.data.type === "column";
        },
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = { columnId };
          return attachClosestEdge(data, { input, element, allowedEdges: ["left", "right"] });
        },
        onDragEnter: (args) => {
          setState({ type: "is-column-over", closestEdge: extractClosestEdge(args.self.data) });
        },
        onDrag: (args) => {
          setState((current) => {
            const closestEdge: Edge | null = extractClosestEdge(args.self.data);
            if (current.type === "is-column-over" && current.closestEdge === closestEdge) {
              return current;
            }
            return { type: "is-column-over", closestEdge };
          });
        },
        onDragLeave: () => setState(idle),
        onDrop: () => setState(idle),
      }),
      autoScrollForElements({
        element: scrollableRef.current,
        canScroll: ({ source }) => source.data.instanceId === instanceId && source.data.type === "card",
      })
    );
  }, [columnId, instanceId, registerColumn]);

  const stableItems = useRef(column.items);
  useEffect(() => {
    stableItems.current = column.items;
  }, [column.items]);

  const getCardIndex = useCallback((id: string) => {
    return stableItems.current.findIndex((i) => i.id == id);
  }, []);

  const getNumCards = useCallback(() => {
    return stableItems.current.length;
  }, []);

  const contextValue: ColumnContextProps = useMemo(() => {
    return { columnId, getCardIndex, getNumCards };
  }, [columnId, getCardIndex, getNumCards]);

  return (
    <ColumnContext.Provider value={contextValue}>
      {/* add style based on state.type */}
      <div className={cn("h-full relative")}>
        <div
          className={cn(
            "w-80 bg-primary-foreground rounded-md flex flex-col border max-h-full",
            isDragging ? "opacity-40" : undefined,
            stateStyles[state.type]
          )}
          ref={columnRef}
        >
          <div className="flex px-3 py-2 border-b" ref={headerRef}>
            <div className="font-bold text-secondary">{column.title}</div>
            <div className="ml-auto">
              <ColumnActionMenu />
            </div>
          </div>
          <div ref={scrollableRef} className="p-2 flex-1 h-full overflow-y-auto styled-scrollbar">
            <div ref={cardListRef} className="flex flex-col gap-2">
              {column.items.map((item) => (
                <ColumnCard key={item.id} card={item} />
              ))}
            </div>
          </div>
          <div className="px-2 py-2 border-t">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="p-1 h-auto w-full text-sm" variant={"ghost"}>
                  Add Card
                </Button>
              </DialogTrigger>
              <DialogContent className="inline-flex flex-col max-w-lg w-4/5 sm:max-w-lg rounded-lg overflow-auto max-h-[80%] p-0 gap-0">
                <DialogHeader className="text-lg px-6 py-5 border-b border-input sticky top-0">
                  Create New Board
                </DialogHeader>
                <ColumnCardForm
                  addCard={addCard}
                  columnId={columnId}
                  scrollableRef={scrollableRef}
                  containerAttr={{ className: "px-6 py-5 space-y-5 overflow-auto flex-1" }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {state.type === "is-column-over" && state.closestEdge && <DropIndicator edge={state.closestEdge} gap="16px" />}
      </div>
    </ColumnContext.Provider>
  );
});
