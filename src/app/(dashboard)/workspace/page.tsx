import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar, UserAvatarList } from "@/components/ui/user-avatar";
import { DEMO_WORKSPACE_DATA, WorkspaceType } from "@/types/workspace";
import { Ellipsis, Plus } from "lucide-react";
import Link from "next/link";
import Getdat from "@/components/custom/getdat";

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

export function WorkspaceHeader() {
  return (
    <div className="flex justify-between space-x-4 items-end">
      <div className="space-y-1">
        <CardTitle>Your Workspace</CardTitle>
        <CardDescription>Start collaborating with people in your own space.</CardDescription>
      </div>

      <Link href={"workspace/new"}>
        <Button className="gap-1 px-5">
          <Plus size={20} /> Create
        </Button>
      </Link>
    </div>
  );
}

export function WorkspaceCard(data: WorkspaceType) {
  const owner = data.members.find((u) => u.id === data.owner);
  return (
    <Card className="h-full">
      <Link href={`./workspace/${data.slug}`} className="group">
        <div className="border-b px-4 py-3 flex items-center">
          <CardTitle className="group-hover:text-secondary flex-1">{data.title}</CardTitle>
          <Button className="aspect-square p-0 h-8 opacity-0 group-hover:opacity-100" variant={"ghost"}>
            <Ellipsis size={20} />
          </Button>
        </div>
        <CardHeader className="pt-1 px-4">
          <CardDescription className="line-clamp-2 overflow-hidden text-ellipsis">{data.description}</CardDescription>
        </CardHeader>
      </Link>
      <CardFooter className="flex justify-between gap-2 px-4">
        <div className="members flex-1">
          <UserAvatarList userList={data.members.filter((u) => u.id !== data.owner)} />
          <CardDescription className="text-xs mb-1">Members</CardDescription>
        </div>
        {owner && (
          <div className="owner">
            <UserAvatar user={owner} className="" />
            <CardDescription className="text-xs mb-1">Owner</CardDescription>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
