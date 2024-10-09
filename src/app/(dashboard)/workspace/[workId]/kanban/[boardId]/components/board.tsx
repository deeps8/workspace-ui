"use client";

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  BoardState,
  CardType,
  ColumnMap,
  ColumnType,
  DEMO_BOARD_DATA,
  OrderedColumn,
  Outcome,
  Trigger,
  createRegistry,
} from "@/types/board";
import * as liveRegion from "@atlaskit/pragmatic-drag-and-drop-live-region";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import invariant from "tiny-invariant";
import { BoardContext, BoardContextValue } from "@/lib/context/board-context";
import { BoardColumn } from "./board-column";
import { DropTriggerFlash } from "@/components/custom/DropIndicator";
import Board from "./board-column";
import { slugifyTemp } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SocketContext } from "./socket-container";

const ColumnSchema = z.object({
  name: z.string().min(1, { message: "required" }).max(20, { message: "Name should be less than 20 characters" }),
});
type ColumnSchemaInfer = z.infer<typeof ColumnSchema>;

export default function BoardWrapper() {
  const form = useForm<ColumnSchemaInfer>({
    resolver: zodResolver(ColumnSchema),
    mode: "onBlur",
    defaultValues: { name: "" },
  });
  const clsBtn = useRef<HTMLButtonElement>(null);
  const { data, setData, ws } = useContext(SocketContext);

  const stableData = useRef(data);
  useEffect(() => {
    stableData.current = data;
  }, [data]);

  const [registry] = useState(createRegistry);

  const { lastOperation } = data;
  useEffect(() => {
    if (lastOperation === null) return;
    const { outcome, trigger } = lastOperation;

    if (outcome.type === "column-reorder") {
      const { startIndex, finishIndex } = outcome;

      const { columnMap, orderedColumnIds } = stableData.current;
      const sourceColumn = columnMap[orderedColumnIds[finishIndex]];

      const entry = registry.getColumn(sourceColumn.columnId);
      DropTriggerFlash(entry.element);

      liveRegion.announce(
        `You've moved ${sourceColumn.title} from position ${startIndex + 1} to position ${finishIndex + 1} of ${
          orderedColumnIds.length
        }.`
      );

      return;
    }

    if (outcome.type === "card-reorder") {
      const { columnId, startIndex, finishIndex } = outcome;

      const { columnMap } = stableData.current;
      const column = columnMap[columnId];
      const item = column.items[finishIndex];

      const entry = registry.getCard(item.id);
      DropTriggerFlash(entry.element);

      if (trigger !== "keyboard") {
        return;
      }

      liveRegion.announce(
        `You've moved ${item.title} from position ${startIndex + 1} to position ${finishIndex + 1} of ${
          column.items.length
        } in the ${column.title} column.`
      );

      return;
    }

    if (outcome.type === "card-move") {
      const { finishColumnId, itemIndexInStartColumn, itemIndexInFinishColumn } = outcome;

      const data = stableData.current;
      const destinationColumn = data.columnMap[finishColumnId];
      const item = destinationColumn.items[itemIndexInFinishColumn];

      const finishPosition =
        typeof itemIndexInFinishColumn === "number" ? itemIndexInFinishColumn + 1 : destinationColumn.items.length;

      const entry = registry.getCard(item.id);
      DropTriggerFlash(entry.element);

      if (trigger !== "keyboard") {
        return;
      }

      liveRegion.announce(
        `You've moved ${item.title} from position ${itemIndexInStartColumn + 1} to position ${finishPosition} in the ${
          destinationColumn.title
        } column.`
      );

      /**
       * Because the card has moved column, it will have remounted.
       * This means we need to manually restore focus to it.
       */
      entry.actionMenuTrigger.focus();

      return;
    }
  }, [lastOperation, registry]);

  useEffect(() => {
    return liveRegion.cleanup();
  }, []);

  // get columns
  const getColumns = useCallback(() => {
    const { columnMap, orderedColumnIds } = data;
    return orderedColumnIds.map((columnId) => columnMap[columnId]);
  }, [data]);

  const reorderColumn = useCallback(
    ({
      startIndex,
      finishIndex,
      trigger = "keyboard",
    }: {
      startIndex: number;
      finishIndex: number;
      trigger?: Trigger;
    }) => {
      const outcome: Outcome = {
        type: "column-reorder",
        columnId: data.orderedColumnIds[startIndex],
        startIndex,
        finishIndex,
      };
      const orderedColumnIds = reorder({
        list: data.orderedColumnIds,
        startIndex,
        finishIndex,
      });
      const d = {
        ...data,
        orderedColumnIds: orderedColumnIds,
        lastOperation: {
          outcome,
          trigger: trigger,
        },
      };
      setData({ ...d });
      if (ws && ws.current && ws.current.readyState === ws.current.OPEN) ws.current.send(JSON.stringify(d));
    },
    [data, setData, ws]
  );

  const reorderCard = useCallback(
    ({
      columnId,
      startIndex,
      finishIndex,
      trigger = "keyboard",
    }: {
      columnId: string;
      startIndex: number;
      finishIndex: number;
      trigger?: Trigger;
    }) => {
      const sourceColumn = data.columnMap[columnId];
      const updatedItems = reorder({
        list: sourceColumn.items,
        startIndex,
        finishIndex,
      });

      const updatedSourceColumn: ColumnType = {
        ...sourceColumn,
        items: updatedItems,
      };

      const updatedMap: ColumnMap = {
        ...data.columnMap,
        [columnId]: updatedSourceColumn,
      };

      const outcome: Outcome | null = {
        type: "card-reorder",
        columnId,
        startIndex,
        finishIndex,
      };

      const d = {
        ...data,
        columnMap: updatedMap,
        lastOperation: { trigger, outcome },
      };
      setData({ ...d });
      if (ws && ws.current && ws.current.readyState === ws.current.OPEN) ws.current.send(JSON.stringify(d));
    },
    [data, setData, ws]
  );

  const moveCard = useCallback(
    ({
      startColumnId,
      finishColumnId,
      itemIndexInStartColumn,
      itemIndexInFinishColumn,
      trigger = "keyboard",
    }: {
      startColumnId: string;
      finishColumnId: string;
      itemIndexInStartColumn: number;
      itemIndexInFinishColumn?: number;
      trigger?: "pointer" | "keyboard";
    }) => {
      // invalid cross column movement
      if (startColumnId === finishColumnId) {
        return;
      }
      const sourceColumn = data.columnMap[startColumnId];
      const destinationColumn = data.columnMap[finishColumnId];
      const item: CardType = sourceColumn.items[itemIndexInStartColumn];

      const destinationItems = Array.from(destinationColumn.items);
      // Going into the first position if no index is provided
      const newIndexInDestination = itemIndexInFinishColumn ?? 0;
      destinationItems.splice(newIndexInDestination, 0, item);

      const updatedMap = {
        ...data.columnMap,
        [startColumnId]: {
          ...sourceColumn,
          items: sourceColumn.items.filter((i) => i.id !== item.id),
        },
        [finishColumnId]: {
          ...destinationColumn,
          items: destinationItems,
        },
      };

      const outcome: Outcome | null = {
        type: "card-move",
        finishColumnId,
        itemIndexInStartColumn,
        itemIndexInFinishColumn: newIndexInDestination,
      };

      const d = {
        ...data,
        columnMap: updatedMap,
        lastOperation: {
          outcome,
          trigger: trigger,
        },
      };
      setData({ ...d });
      if (ws && ws.current && ws.current.readyState === ws.current.OPEN) ws.current.send(JSON.stringify(d));
    },
    [data, setData, ws]
  );

  const addCard = useCallback(
    ({ cd, columnId }: { cd: Omit<CardType, "id" | "creator">; columnId: string }) => {
      // TODO: get loggedin user details and update the card details.
      const newCard: CardType = {
        title: cd.title,
        id: slugifyTemp(cd.title),
        description: cd.description,
        priority: cd.priority,
        creator: {
          id: "",
          email: "",
          name: "",
          picture: "",
        },
      };

      const sourceColumn = data.columnMap[columnId];
      const updatedMap = {
        ...data.columnMap,
        [columnId]: {
          ...sourceColumn,
          items: sourceColumn.items.concat(newCard),
        },
      };

      const d = {
        ...data,
        columnMap: updatedMap,
        lastOperation: {
          outcome: { type: "card-add" },
          trigger: "keyboard",
        },
      };
      setData({ ...d } as BoardState);
      if (ws && ws.current && ws.current.readyState === ws.current.OPEN) ws.current.send(JSON.stringify(d));
    },
    [data, setData, ws]
  );

  const addColumn = useCallback(
    ({ columnTitle }: { columnTitle: string }) => {
      const newCol: ColumnType = {
        title: columnTitle,
        columnId: slugifyTemp(columnTitle),
        items: [],
      };
      const d = {
        ...data,
        columnMap: { ...data.columnMap, [newCol.columnId]: newCol },
        orderedColumnIds: data.orderedColumnIds.concat(newCol.columnId),
      };
      setData({ ...d });
      if (ws && ws.current && ws.current.readyState === ws.current.OPEN) ws.current.send(JSON.stringify(d));
    },
    [data, setData, ws]
  );

  const [instanceId] = useState(() => Symbol("instance-id"));

  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor({ source }) {
          return source.data.instanceId === instanceId;
        },
        onDrop(args) {
          const { location, source } = args;
          // didn't drop on anything
          if (!location.current.dropTargets.length) return;

          // need to handle drop
          // 1. remove element from original position
          // 2. move to new position

          if (source.data.type === "column") {
            const startIndex: number = data.orderedColumnIds.findIndex((colId) => colId === source.data.columnId);
            const target = location.current.dropTargets[0];
            const indexOfTarget: number = data.orderedColumnIds.findIndex((colId) => colId === target.data.columnId);
            const closestEdgeOfTarget: Edge | null = extractClosestEdge(target.data);
            const finishIndex = getReorderDestinationIndex({
              startIndex,
              indexOfTarget,
              closestEdgeOfTarget,
              axis: "horizontal",
            });

            reorderColumn({ startIndex, finishIndex, trigger: "pointer" });
          }

          // Dragging a card
          if (source.data.type === "card") {
            const itemId = source.data.itemId;
            invariant(typeof itemId === "string");

            const [, startColumnRecord] = location.initial.dropTargets;
            const sourceId = startColumnRecord.data.columnId;
            invariant(typeof sourceId === "string");
            const sourceColumn = data.columnMap[sourceId];
            const itemIndex = sourceColumn.items.findIndex((item) => item.id === itemId);

            if (location.current.dropTargets.length === 1) {
              const [destinationColumnRecord] = location.current.dropTargets;
              const destinationId = destinationColumnRecord.data.columnId;
              invariant(typeof destinationId === "string");
              const destinationColumn = data.columnMap[destinationId];
              invariant(destinationColumn);

              // reordering in same column
              if (sourceColumn === destinationColumn) {
                const destinationIndex = getReorderDestinationIndex({
                  startIndex: itemIndex,
                  indexOfTarget: sourceColumn.items.length - 1,
                  closestEdgeOfTarget: null,
                  axis: "vertical",
                });
                reorderCard({
                  columnId: sourceColumn.columnId,
                  startIndex: itemIndex,
                  finishIndex: destinationIndex,
                  trigger: "pointer",
                });
                return;
              }

              // moving to a new column
              moveCard({
                itemIndexInStartColumn: itemIndex,
                startColumnId: sourceColumn.columnId,
                finishColumnId: destinationColumn.columnId,
                trigger: "pointer",
              });
              return;
            }

            // dropping in a column (relative to a card)
            if (location.current.dropTargets.length === 2) {
              const [destinationCardRecord, destinationColumnRecord] = location.current.dropTargets;
              const destinationColumnId = destinationColumnRecord.data.columnId;
              invariant(typeof destinationColumnId === "string");
              const destinationColumn = data.columnMap[destinationColumnId];

              const indexOfTarget = destinationColumn.items.findIndex(
                (item) => item.id === destinationCardRecord.data.itemId
              );
              const closestEdgeOfTarget: Edge | null = extractClosestEdge(destinationCardRecord.data);

              // case 1: ordering in the same column
              if (sourceColumn === destinationColumn) {
                const destinationIndex = getReorderDestinationIndex({
                  startIndex: itemIndex,
                  indexOfTarget,
                  closestEdgeOfTarget,
                  axis: "vertical",
                });
                reorderCard({
                  columnId: sourceColumn.columnId,
                  startIndex: itemIndex,
                  finishIndex: destinationIndex,
                  trigger: "pointer",
                });
                return;
              }

              // case 2: moving into a new column relative to a card

              const destinationIndex = closestEdgeOfTarget === "bottom" ? indexOfTarget + 1 : indexOfTarget;

              moveCard({
                itemIndexInStartColumn: itemIndex,
                startColumnId: sourceColumn.columnId,
                finishColumnId: destinationColumn.columnId,
                itemIndexInFinishColumn: destinationIndex,
                trigger: "pointer",
              });
            }
          }
        },
      })
    );
  }, [data, instanceId, moveCard, reorderCard, reorderColumn]);

  const contextValue: BoardContextValue = useMemo(() => {
    return {
      getColumns,
      reorderColumn,
      reorderCard,
      moveCard,
      registerCard: registry.registerCard,
      registerColumn: registry.registerColumn,
      addCard,
      addColumn,
      instanceId,
      data,
    };
  }, [
    getColumns,
    reorderColumn,
    reorderCard,
    moveCard,
    registry.registerCard,
    registry.registerColumn,
    addCard,
    addColumn,
    instanceId,
    data,
  ]);

  const onAddColSubmit = ({ name }: ColumnSchemaInfer) => {
    addColumn({ columnTitle: name });
    form.reset();
    clsBtn.current?.click();
  };

  return (
    <BoardContext.Provider value={contextValue}>
      <Board>
        {data.orderedColumnIds.map((colId) => {
          return <BoardColumn key={colId} column={data.columnMap[colId]} />;
        })}
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add new Column</Button>
            </DialogTrigger>
            <DialogContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onAddColSubmit)} className="flex-1">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Column Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="enter name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <div className="space-x-4 px-6 py-5">
                      <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
                        {!form.formState.isSubmitting ? "Create" : "Creating..."}
                      </Button>
                      <DialogClose asChild>
                        <Button ref={clsBtn} variant={"outline"}>
                          Cancel
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </Board>
    </BoardContext.Provider>
  );
}
