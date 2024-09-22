import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DEMO_WORKSPACE_DATA } from "@/types/workspace";
import { Plus } from "lucide-react";
import Link from "next/link";
import Getdat from "@/components/custom/getdat";
import { WorkspaceCard, WorkspaceHeader } from "@/components/custom/workspace-helper";

export default function Workspace() {
  console.log("workspace");
  return (
    <main>
      <header className="py-4 sticky top-14 bg-background z-[1]">
        <WorkspaceHeader />
      </header>
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(264px,1fr))] gap-4 [&>.card]:h-auto">
          <Link href={"workspace/new"} className="card" title="create workspace">
            <Card className="h-full hover:bg-accent">
              <CardContent className="p-0 w-full h-full grid place-content-center">
                <Plus size={30} />
              </CardContent>
            </Card>
          </Link>
          {DEMO_WORKSPACE_DATA.map((w) => {
            return <WorkspaceCard {...w} key={w.id} />;
          })}
        </div>
      </section>
      <Getdat />
    </main>
  );
}
