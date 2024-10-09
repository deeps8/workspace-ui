import { Button } from "@/components/ui/button";
import { DEMO_BOARD_DETAILS } from "@/types/board";
import { Ellipsis, Filter, Star } from "lucide-react";
import BoardWrapper from "./components/board";
import SocketProvider from "./components/socket-container";
import { StartSocket } from "@/actions/board";

const boardDetails = DEMO_BOARD_DETAILS[0];

export default async function KanbanBoard({ params }: { params: { boardId: string; workId: string } }) {
  console.log({ params });
  // const ws = await StartSocket();
  return (
    <main className="relative min-h-[inherit]">
      <div className="flex flex-col absolute inset-0">
        <header className="sticky z-20 top-14 border-b bg-background">
          <nav className="py-2 flex gap-1">
            <div className="flex items-center gap-2">
              <div className="text-md font-semibold">
                <h2>{boardDetails.name}</h2>
              </div>
              <Button className="h-auto w-auto p-2" variant={"ghost"}>
                <Star size={15} />
              </Button>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button className="h-auto w-auto p-2" variant={"ghost"}>
                <Filter size={14} className="mr-1" />
                Filter
              </Button>
              <Button className="h-auto w-auto p-2" variant={"ghost"}>
                <Ellipsis size={15} />
              </Button>
            </div>
          </nav>
        </header>
        <div className="h-full relative">
          <section className="flex-1 py-2 absolute inset-0">
            <SocketProvider boardid={params.boardId}>
              <BoardWrapper />
            </SocketProvider>
          </section>
        </div>
      </div>
    </main>
  );
}
