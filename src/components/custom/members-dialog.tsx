import { UserType } from "@/types/user";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import React from "react";

type MemberListDialogProps = {
  members: UserType[];
  ownerId: string;
  dialogTrigger: React.ReactNode;
};

export default function MemberListDialog({ members, ownerId, dialogTrigger }: MemberListDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="inline-flex flex-col max-w-lg w-4/5 sm:max-w-lg rounded-lg overflow-auto max-h-[80%] p-0 gap-0">
        <DialogHeader className="text-lg px-6 py-5 border-b border-input sticky top-0">Member List</DialogHeader>
        <div className="px-6 py-5 space-y-5 overflow-auto flex-1">
          {members.map((m) => (
            <div key={m.id} className="flex space-x-4 items-center">
              <Avatar className="bg-primary-foreground h-11 w-11">
                <AvatarImage src={m.picture} alt={m.name} />
                <AvatarFallback>{m.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p>{m.name}</p>
                <p className="text-muted-foreground">{m.email}</p>
              </div>
              <div className="self-start !ml-auto">{m.id === ownerId && <Badge>Owner</Badge>}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
