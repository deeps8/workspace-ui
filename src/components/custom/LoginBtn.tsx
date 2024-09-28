/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { useSession } from "../provider/session-provider";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function LoginBtn() {
  const { session, user } = useSession();

  return (
    <div className="flex items-center">
      {session ? (
        <Avatar className="rounded-sm">
          <AvatarImage src={user.picture} alt={user.name} />
          <AvatarFallback className="bg-primary-foreground rounded-sm">{user.name[0]}</AvatarFallback>
        </Avatar>
      ) : (
        <Link href={"/login"}>
          <Button>Login</Button>
        </Link>
      )}
    </div>
  );
}

export default LoginBtn;
