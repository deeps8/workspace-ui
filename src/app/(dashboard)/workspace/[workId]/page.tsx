import { GetWorkspaceWbrd } from "@/actions/workspace";
import CreateBoardForm from "@/components/custom/create-board-form";
import MemberListDialog from "@/components/custom/members-dialog";
import BoardCard from "@/components/layout/board-card";
import { BreadcrumbComp, BreadcrumbType } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEMO_BOARD_DETAILS } from "@/types/board";
import { DEMO_WORKSPACE_DATA } from "@/types/workspace";
import { Plus } from "lucide-react";

const Crumbs: BreadcrumbType[] = [{ href: "/workspace", label: "Workspace" }];
const TempWorkspace = DEMO_WORKSPACE_DATA[1];

export default async function Page({ params }: { params: { workId: string } }) {
  const { data, message } = await GetWorkspaceWbrd(params.workId ?? "");
  if (!data) return <>{message}</>;
  return (
    <main className="py-4">
      <header>
        <div className="space-y-2">
          <BreadcrumbComp crumbs={[...Crumbs, { href: "", label: params.workId }]} />
          <div className="grid grid-cols-10 gap-3">
            <div className="col-span-10 md:col-span-8 space-y-2 ">
              <CardTitle>{data.name}</CardTitle>
              <div className="flex space-x-4 [&>*:not(:last-child)]:pr-4 text-sm [&>*:not(:last-child)]:border-r-2 border-muted-foreground">
                <span>
                  Created on - {new Date(data.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}
                </span>
                <div>
                  <MemberListDialog
                    members={[data.ownerdetails, ...data.members]}
                    ownerId={data.owner}
                    dialogTrigger={
                      <button className="hover:text-secondary focus:text-secondary underline">
                        {data.members.length + 1} Members
                      </button>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section className="py-4 border-b sticky top-14 bg-background">
        <div className="flex flex-row items-center">
          <div className="flex-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"secondary"}>
                  <Plus size={18} className="mr-1" /> New Board
                </Button>
              </DialogTrigger>
              <DialogContent className="inline-flex flex-col max-w-lg w-4/5 sm:max-w-lg rounded-lg overflow-auto max-h-[80%] p-0 gap-0">
                <DialogHeader className="text-lg px-6 py-5 border-b border-input sticky top-0">
                  Create New Board
                </DialogHeader>
                <CreateBoardForm
                  spaceId={data.id}
                  containerAttr={{ className: "px-6 py-5 space-y-5 overflow-auto flex-1" }}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <div className="inline-flex items-center">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Choose filter" defaultValue={"byme"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="byme">Owned by me</SelectItem>
                    <SelectItem value="byother">Owned by other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>
      <section className="py-4">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {data?.boards
            ?.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            ?.map((b) => {
              return <BoardCard board={b} key={b.id} workId={params.workId} />;
            })}
        </div>
      </section>
    </main>
  );
}
