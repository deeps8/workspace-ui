"use client";

import { CardDescription } from "@/components/ui/card";
import { CardType } from "@/types/board";
import { Ref, forwardRef, useEffect, useRef, useState } from "react";

import { Edge, attachClosestEdge, extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { useBoardContext } from "@/lib/context/board-context";
import invariant from "tiny-invariant";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { dropTargetForExternal } from "@atlaskit/pragmatic-drag-and-drop/external/adapter";
import { cn } from "@/lib/utils";
import { DropIndicator } from "@/components/custom/DropIndicator";
import ReactDOM from "react-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { CardActionMenu } from "./board-action-menus";

type State = { type: "idle" } | { type: "preview"; container: HTMLElement; rect: DOMRect } | { type: "dragging" };
const idleState: State = { type: "idle" };
const draggingState: State = { type: "dragging" };

type CardProps = {
  card: CardType;
};
export function ColumnCard({ card }: CardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { id: cardId } = card;
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [state, setState] = useState<State>(idleState);

  const actionMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const { instanceId, registerCard } = useBoardContext();

  useEffect(() => {
    invariant(actionMenuTriggerRef.current);
    invariant(ref.current);
    return registerCard({
      cardId,
      entry: {
        element: ref.current,
        actionMenuTrigger: actionMenuTriggerRef.current,
      },
    });
  }, [cardId, registerCard]);

  useEffect(() => {
    const element = ref.current;
    invariant(element);
    return combine(
      draggable({
        element,
        getInitialData: () => ({ type: "card", itemId: cardId, instanceId }),
        onGenerateDragPreview: ({ location, source, nativeSetDragImage }) => {
          const rect = source.element.getBoundingClientRect();

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({ element, input: location.current.input }),
            render({ container }) {
              setState({ type: "preview", container, rect });
              return () => setState(draggingState);
            },
          });
        },
        onDragStart: () => setState(draggingState),
        onDrop: () => setState(idleState),
      }),
      dropTargetForExternal({ element }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          return source.data.instanceId === instanceId && source.data.type === "card";
        },
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = { type: "card", itemId: cardId };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDragEnter: (args) => {
          if (args.source.data.itemId !== cardId) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: (args) => {
          if (args.source.data.itemId !== cardId) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null),
      })
    );
  }, [cardId, instanceId, card]);

  return (
    <>
      <CardPrimitive
        ref={ref}
        item={card}
        state={state}
        closestEdge={closestEdge}
        actionMenuTriggerRef={actionMenuTriggerRef}
      />
      {state.type === "preview" &&
        ReactDOM.createPortal(
          <div
            style={{
              boxSizing: "border-box",
              width: state.rect.width,
              height: state.rect.height,
            }}
          >
            <CardPrimitive item={card} state={state} closestEdge={null} />
          </div>,
          state.container
        )}
    </>
  );
}
const className = "cursor-grab opacity-40";
const stateStyles: {
  [Key in State["type"]]: string | undefined;
} = {
  idle: "cursor-grab",
  dragging: "opacity-40",
  preview: undefined,
};

type CardPrimitiveProps = {
  closestEdge: Edge | null;
  item: CardType;
  state: State;
  actionMenuTriggerRef?: Ref<HTMLButtonElement>;
};
const CardPrimitive = forwardRef<HTMLDivElement, CardPrimitiveProps>(function CardPrimitive(
  { closestEdge, item, state, actionMenuTriggerRef },
  ref
) {
  const { description, id, title } = item;

  return (
    <div ref={ref} className={cn("bg-accent p-3 border rounded-md relative", stateStyles[state.type])}>
      <div className="flex ">
        <p>{title}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              ref={actionMenuTriggerRef}
              className="h-auto w-auto aspect-square px-1 py-0 ml-auto"
              variant={"ghost"}
            >
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <CardActionMenu cardId={id} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardDescription>{description}</CardDescription>
      {closestEdge && <DropIndicator edge={closestEdge} gap="8px" />}
    </div>
  );
});
