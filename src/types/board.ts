import invariant from "tiny-invariant";
import type { CleanupFn } from "@atlaskit/pragmatic-drag-and-drop/types";

type BoardType = {
  id: string;
  name: string;
  type: string; // TODO: create type for it later on
  sticker: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

type Outcome =
  | { type: "column-reorder"; columnId: string; startIndex: number; finishIndex: number }
  | { type: "card-reorder"; columnId: string; startIndex: number; finishIndex: number }
  | { type: "card-move"; finishColumnId: string; itemIndexInStartColumn: number; itemIndexInFinishColumn: number }
  | { type: "card-add" };

type Trigger = "pointer" | "keyboard";
type Operation = {
  trigger: Trigger;
  outcome: Outcome;
};
type ColumnType = {
  title: string;
  columnId: string;
  items: CardType[];
};
type ColumnMap = {
  [columnId: string]: ColumnType;
};
type BoardState = {
  columnMap: ColumnMap;
  orderedColumnIds: string[];
  lastOperation: Operation | null;
};

type CardEntry = {
  element: HTMLElement;
  actionMenuTrigger: HTMLElement;
};

type ColumnEntry = {
  element: HTMLElement;
};

export type {
  BoardType,
  ColumnMap as BoardDataType,
  BoardState,
  CardType,
  ColumnMap,
  ColumnType,
  Operation,
  Outcome,
  Trigger,
};

export const DEMO_BOARD_DETAILS: BoardType[] = [
  {
    id: "board-1",
    name: "Codenames TODO",
    slug: "codenames-todo",
    sticker:
      "https://img.freepik.com/premium-vector/kanban-board-abstract-concept-vector-illustration_107173-29478.jpg?w=900",
    type: "kanban",
    createdAt: "2024-04-28T19:11:39.394Z",
    updatedAt: "2024-04-28T19:11:39.394Z",
  },
  {
    id: "board-2",
    name: "Team manager",
    slug: "team-manager",
    sticker:
      "https://img.freepik.com/premium-vector/kanban-board-abstract-concept-vector-illustration_107173-29478.jpg?w=900",
    type: "flows",
    createdAt: "2024-04-28T19:11:39.394Z",
    updatedAt: "2024-04-28T19:11:39.394Z",
  },
  {
    id: "board-3",
    name: "Icebox board",
    slug: "icebox-board",
    sticker: "https://cdn.pixabay.com/photo/2024/02/21/08/44/woman-8587090_1280.png",
    type: "kanban",
    createdAt: "2024-04-28T19:11:39.394Z",
    updatedAt: "2024-04-28T19:11:39.394Z",
  },
];

type CardType = {
  id: string;
  title: string;
  description: string;
};

let cardTitleNo = 1;

function getCardDetails(amount: number): CardType[] {
  return Array.from({ length: amount }, () => {
    cardTitleNo++;
    return {
      id: `card-id-${cardTitleNo}`,
      title: `card-${cardTitleNo}`,
      description: `description of the card ${cardTitleNo}`,
    };
  });
}

export const DEMO_BOARD_DATA: ColumnMap = {
  backlog: {
    columnId: "backlog",
    title: "Backlog",
    items: getCardDetails(3),
  },
  design: {
    columnId: "design",
    title: "Design",
    items: getCardDetails(10),
  },
  todo: {
    columnId: "todo",
    title: "To Do",
    items: getCardDetails(4),
  },
  code_review: {
    columnId: "code_review",
    title: "Code Review",
    items: getCardDetails(2),
  },
};

export const OrderedColumn = ["backlog", "design", "todo", "code_review"];

export function createRegistry() {
  const cards = new Map<string, CardEntry>();
  const columns = new Map<string, ColumnEntry>();

  function registerCard({ cardId, entry }: { cardId: string; entry: CardEntry }): CleanupFn {
    cards.set(cardId, entry);
    return function cleanup() {
      cards.delete(cardId);
    };
  }

  function registerColumn({ columnId, entry }: { columnId: string; entry: ColumnEntry }): CleanupFn {
    columns.set(columnId, entry);
    return function cleanup() {
      cards.delete(columnId);
    };
  }

  function getCard(cardId: string): CardEntry {
    const entry = cards.get(cardId);
    invariant(entry);
    return entry;
  }

  function getColumn(columnId: string): ColumnEntry {
    const entry = columns.get(columnId);
    invariant(entry);
    return entry;
  }

  return { registerCard, registerColumn, getCard, getColumn };
}
