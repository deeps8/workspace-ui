"use client";
import Link from "next/link";
import { SideBarContext, SidebarMenuList } from "../ui/sidebar";
import { useContext } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { LogoutUser } from "@/actions/auth";

export function SidebarMenu() {
  const { activeMenu, open, toggle } = useContext(SideBarContext);
  const menu = SidebarMenuList[activeMenu];
  const pathname = usePathname();
  const handleLogout = () => {
    LogoutUser();
  };
  return (
    <>
      <div className={`py-5 h-full relative overflow-y-auto overflow-x-hidden pr-7`}>
        <div className="flex flex-col h-full">
          <div className="space-y-2 flex-1">
            {menu.map((m) => {
              const isActive = pathname.startsWith(m.link);
              return (
                <Link
                  title={m.name}
                  key={m.name}
                  href={m.link}
                  className={cn(
                    "group flex gap-2 w-full rounded-md p-2 font-medium hover:bg-accent hover:text-accent-foreground overflow-hidden",
                    isActive ? "bg-primary text-primary-foreground font-medium" : null
                  )}
                >
                  <span>{m.icon}</span> {open ? m.name : null}
                </Link>
              );
            })}
          </div>
          <div className="sticky bottom-0 flex flex-col">
            <Button title="Logout" onClick={handleLogout} variant={"destructive"} className={cn("gap-2 p-2")}>
              <span>
                <LogOut size={24} />
              </span>
              {open ? "Logout" : null}
            </Button>
          </div>
        </div>
      </div>
      <Button
        title="Toggle sidebar"
        className="absolute -right-4 bottom-6 z-10 p-2 h-auto aspect-square rounded-full shadow-md hover:border-primary"
        variant={"outline"}
        onClick={toggle}
      >
        {open ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
      </Button>
    </>
  );
}
