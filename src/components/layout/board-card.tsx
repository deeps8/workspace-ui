/* eslint-disable @next/next/no-img-element */
import { BoardType } from "@/types/board";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Ellipsis, Kanban } from "lucide-react";
import Link from "next/link";

const BoardSticker: Record<string, string> = {
  kanban:
    "https://img.freepik.com/premium-vector/kanban-board-abstract-concept-vector-illustration_107173-29478.jpg?w=900",
};

type BoardCardProps = {
  board: BoardType;
  workId: string;
};
export default function BoardCard({ board, workId }: BoardCardProps) {
  // TODO: add created-at, updated-at date to table
  const date = new Date(board.created_at).toLocaleDateString("en-US", { dateStyle: "medium" });
  return (
    <Card className="group cursor-pointer h-auto relative flex flex-col overflow-hidden">
      <Link href={`${workId}/${board.type}/${board.slug}`}>
        <div className="flex-[0.5] relative">
          <img alt="sticker" className="h-auto aspect-[1.5] object-cover" src={BoardSticker[board.type]} />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button className="aspect-square p-0 absolute right-3 top-3 h-8 text-white" variant={"ghost"}>
              <Ellipsis size={20} />
            </Button>
          </div>
        </div>
        <div className="p-3 border-t bg-primary-foreground flex flex-[0.3]">
          <div className="flex-1">
            <CardTitle className="text-md font-normal group-hover:text-secondary">{board.name}</CardTitle>
            {/* <CardDescription className="text-xs">Updated on - {date}</CardDescription> */}
          </div>
          <div>
            <span title={"Kanban"} className="p-[2px] rounded-md aspect-square h-auto bg-purple-700 block">
              {/* show icon based on board type */}
              <Kanban size={18} color="white" />
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
