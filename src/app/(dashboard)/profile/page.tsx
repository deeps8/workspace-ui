"use client";
import { useSession } from "@/components/provider/session-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

function ProfilePage() {
  const { user } = useSession();
  return (
    <div className="py-4">
      <div className="flex flex-row gap-4">
        <Avatar className="rounded-sm w-36 h-36">
          <AvatarImage src={user.picture} alt={user.name} />
          <AvatarFallback className="bg-primary-foreground rounded-sm text-2xl font-semibold">
            {user.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="">
          <h2 className="text-2xl font-semibold text-secondary">{user.name}</h2>
          <h3 className="my-2">{user.email}</h3>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
