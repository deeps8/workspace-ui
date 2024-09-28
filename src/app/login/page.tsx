"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex justify-center mx-auto p-5">
      <div>
        <Card className="w-[350px]">
          <CardHeader>
            <Logo />
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Welcome to{" "}
              <Link href={"/"}>
                <span className="font-mono text-secondary underline">Workspace</span>
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter className="flex justify-between">
            <form
              className="w-full"
              action={`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/auth/google/signup`}
              method="get"
            >
              <Button type="submit" className="w-full">
                Continue with Google
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
