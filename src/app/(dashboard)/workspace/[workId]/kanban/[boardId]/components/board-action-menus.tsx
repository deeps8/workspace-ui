import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBoardContext } from "@/lib/context/board-context";
import { useColumnContext } from "@/lib/context/column-context";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useCallback, useEffect } from "react";

export function ColumnActionMenu() {
  const { columnId } = useColumnContext();
  const { getColumns, reorderColumn } = useBoardContext();
  const columns = getColumns();
  const startIndex = columns.findIndex((cl) => cl.columnId === columnId);

  const moveLeft = useCallback(() => {
    reorderColumn({ startIndex, finishIndex: startIndex - 1 });
  }, [reorderColumn, startIndex]);

  const moveRight = useCallback(() => {
    reorderColumn({ startIndex, finishIndex: startIndex + 1 });
  }, [reorderColumn, startIndex]);

  const isMoveLeftDisabled = startIndex === 0;
  const isMoveRightDisabled = startIndex === columns.length - 1;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-auto w-auto aspect-square px-1 py-0" variant={"ghost"}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={moveLeft} disabled={isMoveLeftDisabled}>
          Move Left
        </DropdownMenuItem>
        <DropdownMenuItem onClick={moveRight} disabled={isMoveRightDisabled}>
          Move Right
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type CardActionMenuProps = {
  cardId: string;
};
export function CardActionMenu({ cardId }: CardActionMenuProps) {
  const { getColumns, reorderCard, moveCard } = useBoardContext();
  const { columnId, getCardIndex, getNumCards } = useColumnContext();

  const numCards = getNumCards();
  const startIndex = getCardIndex(cardId);

  const moveToTop = useCallback(() => {
    reorderCard({ columnId, startIndex, finishIndex: 0 });
  }, [columnId, reorderCard, startIndex]);

  const moveToBottom = useCallback(() => {
    reorderCard({ columnId, startIndex, finishIndex: numCards - 1 });
  }, [columnId, numCards, reorderCard, startIndex]);

  const moveUp = useCallback(() => {
    reorderCard({ columnId, startIndex, finishIndex: startIndex - 1 });
  }, [columnId, reorderCard, startIndex]);

  const moveDown = useCallback(() => {
    reorderCard({ columnId, startIndex, finishIndex: startIndex + 1 });
  }, [columnId, reorderCard, startIndex]);

  const moveCardToColumn = useCallback(
    (finishId: string) => {
      moveCard({ startColumnId: columnId, finishColumnId: finishId, itemIndexInStartColumn: startIndex });
    },
    [columnId, moveCard, startIndex]
  );

  const isMoveUpDisabled = startIndex === 0;
  const isMoveDownDisabled = startIndex === numCards - 1;

  const moveColumnOptions = getColumns().filter((col) => col.columnId !== columnId);
  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuItem onClick={moveToTop} disabled={isMoveUpDisabled}>
          Move to Top
        </DropdownMenuItem>
        <DropdownMenuItem onClick={moveUp} disabled={isMoveUpDisabled}>
          Move Up
        </DropdownMenuItem>
        <DropdownMenuItem onClick={moveToBottom} disabled={isMoveDownDisabled}>
          Move to Bottom
        </DropdownMenuItem>
        <DropdownMenuItem onClick={moveDown} disabled={isMoveDownDisabled}>
          Move Down
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuGroup>
      <DropdownMenuGroup>
        <DropdownMenuLabel className="text-muted-foreground px-2 text-sm">Move To -</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {moveColumnOptions.map((col) => {
          return (
            <DropdownMenuItem key={col.columnId} onClick={() => moveCardToColumn(col.columnId)}>
              {col.title}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuGroup>
    </>
  );
}
