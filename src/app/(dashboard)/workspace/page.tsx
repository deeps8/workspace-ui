import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DEMO_WORKSPACE_DATA } from "@/types/workspace";
import { Plus } from "lucide-react";
import Link from "next/link";
import { WorkspaceCard, WorkspaceHeader } from "@/components/custom/workspace-helper";
import { GetAllWorkspace } from "@/actions/workspace";

export default async function Workspace() {
  const spaces = await GetAllWorkspace();
  console.log({ spaces });
  return (
    <main>
      <header className="py-4 sticky top-14 bg-background z-[1]">
        <WorkspaceHeader />
      </header>
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(264px,1fr))] gap-4 [&>.card]:h-auto">
          <Link href={"workspace/new"} className="card" title="create workspace">
            <Card className="h-full hover:bg-accent min-h-48 border-dashed">
              <CardContent className="p-0 w-full h-full grid place-content-center">
                <Plus size={30} className="mx-auto" />
                {(spaces.data == undefined || spaces.data.length === 0) && (
                  <div className="text-muted-foreground">No Workspace Added yet</div>
                )}
              </CardContent>
            </Card>
          </Link>
          {spaces?.data
            ?.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .map((w) => {
              return <WorkspaceCard {...w} key={w.id} />;
            })}
        </div>
      </section>
    </main>
  );
}
