import { BoardState, CardType, ColumnType } from "@/types/board";
import { CleanupFn } from "@atlaskit/pragmatic-drag-and-drop/types";
import { createContext, useContext } from "react";
import invariant from "tiny-invariant";

export type BoardContextValue = {
  getColumns: () => ColumnType[];

  reorderColumn: (args: { startIndex: number; finishIndex: number }) => void;

  reorderCard: (args: { columnId: string; startIndex: number; finishIndex: number }) => void;

  moveCard: (args: {
    startColumnId: string;
    finishColumnId: string;
    itemIndexInStartColumn: number;
    itemIndexInFinishColumn?: number;
  }) => void;

  registerCard: (args: {
    cardId: string;
    entry: {
      element: HTMLElement;
      actionMenuTrigger: HTMLElement;
    };
  }) => CleanupFn;

  registerColumn: (args: {
    columnId: string;
    entry: {
      element: HTMLElement;
    };
  }) => CleanupFn;

  instanceId: symbol;
  addCard: (args: { cd: Omit<CardType, "id" | "creator">; columnId: string }) => void;
  addColumn: (args: { columnTitle: string }) => void;
  data: BoardState;
};

export const BoardContext = createContext<BoardContextValue | null>(null);

export function useBoardContext(): BoardContextValue {
  const value = useContext(BoardContext);
  invariant(value, "cannot find BoardContext provider");
  return value;
}
