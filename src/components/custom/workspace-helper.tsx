import { WorkspaceType } from "@/types/workspace";
import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import { CardTitle, CardDescription, Card, CardHeader, CardFooter } from "../ui/card";
import { UserAvatarList } from "../ui/user-avatar";
import Link from "next/link";

export function WorkspaceHeader() {
  return (
    <div className="flex justify-between space-x-4 items-end">
      <div className="space-y-1">
        <CardTitle>Your Workspace</CardTitle>
        <CardDescription>Start collaborating with people in your own space.</CardDescription>
      </div>

      <Link href={"workspace/new"}>
        <Button className="gap-1 px-5">Create</Button>
      </Link>
    </div>
  );
}

export function WorkspaceCard(data: WorkspaceType) {
  return (
    <Card className="h-full flex flex-col">
      <Link href={`./workspace/${data.slug}`} className="group flex-1">
        <div className="border-b px-4 py-3 flex items-center">
          <CardTitle className="group-hover:text-secondary flex-1">{data.name}</CardTitle>
          <Button className="aspect-square p-0 h-8 opacity-0 group-hover:opacity-100" variant={"ghost"}>
            <Ellipsis size={20} />
          </Button>
        </div>
        <CardHeader className="py-2 px-4 text-sm">
          <CardDescription className="line-clamp-2 overflow-hidden text-ellipsis">{data.overview}</CardDescription>
          <div className="py-1">
            <p>
              <span className="text-muted-foreground">owner : </span> <span>{data.ownerdetails.email}</span>
            </p>
          </div>
        </CardHeader>
      </Link>
      <CardFooter className="flex justify-between gap-2 px-4 py-2">
        <div className="members flex-1">
          <UserAvatarList userList={data.members.filter((u) => u.id !== data.owner)} />
          <CardDescription className="text-xs mb-1">Members</CardDescription>
        </div>
        {/* <div className="owner">
          <UserAvatar user={data.ownerdetails} className="" />
          <CardDescription className="text-xs mb-1">Owner</CardDescription>
        </div> */}
      </CardFooter>
    </Card>
  );
}
