import Link from "next/link";
import ThemeSwitcher from "./theme-switcher";
import { Logo } from "../ui/logo";
import { Button } from "../ui/button";

/*
    Header content will be changed based on user logged-in or not 
        ---OR---
    create different header for different part of app 
*/
export function Header() {
  return (
    <div className="container flex h-14 max-w-full items-center">
      <div className="flex items-center">
        <Link href={"/"} className="mr-6 flex items-center space-x-2">
          <Logo />
          <span className="font-bold font-mono text-lg">Workspace</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href={"/workspace"}>Workspace</Link>
        </div>
      </div>
      <div className="flex flex-1 justify-end space-x-3">
        <Link href={"/login"}>
          <Button>Login</Button>
        </Link>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
