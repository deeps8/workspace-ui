import { WorkspaceType } from "@/types/workspace";
import { Link, Plus, Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import { CardTitle, CardDescription, Card, CardHeader, CardFooter } from "../ui/card";
import { UserAvatarList, UserAvatar } from "../ui/user-avatar";

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
