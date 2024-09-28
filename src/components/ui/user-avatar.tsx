"use client";
import { UserType } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn } from "@/lib/utils";

type UserAvatarType = {
  className: string;
  user: Omit<UserType, "created_at" | "updated_at">;
};
function UserAvatar(props: UserAvatarType) {
  const { className, user } = props;
  return (
    <div className="relative">
      <Avatar
        className={cn(
          "cursor-pointer relative border-2 bg-primary-foreground hover:border-primary hover:z-[2] peer",
          className
        )}
      >
        <AvatarImage src={user.picture} alt={user.name} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
      <div className="shadow-md hidden -translate-x-[calc(50%-20px)] absolute top-full mt-2 z-20 p-4 rounded-lg min-w-52 text-primary bg-primary-foreground peer-hover:block">
        <span className="absolute z-10 -top-1 left-[calc(50%-4px)] w-0 h-0 border-transparent border-l-8 border-r-8 border-b-8 border-b-primary-foreground"></span>
        <div>
          <p className="font-medium inline">{user.name}</p>
          <p className="text-sm text-muted-foreground border-gray-400">{user.email}</p>
        </div>
      </div>
    </div>
  );
}

function UserAvatarList({ userList }: { userList: Omit<UserType, "created_at" | "updated_at">[] }) {
  return (
    <div className="flex relative w-full">
      {userList.map((u, idx) => {
        return (
          <div key={u.id} style={{ marginLeft: idx === 0 ? "0" : `-8%` }}>
            <UserAvatar user={u} className="" />
          </div>
        );
      })}
    </div>
  );
}

export { UserAvatar, UserAvatarList };
