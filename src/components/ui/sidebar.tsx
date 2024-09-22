"use client";

import { Home, Inbox, Send, User } from "lucide-react";
import React from "react";
import { Dispatch, SetStateAction, createContext, useState } from "react";

export function SideBar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState<MenuType>("dashboard");

  const toggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <SideBarContext.Provider value={{ open, setOpen, toggle, activeMenu, setActiveMenu }}>
      <div
        className={`container flex-1 items-start grid ${
          open ? "grid-cols-[240px_minmax(0,1fr)]" : "grid-cols-[70px_minmax(0,1fr)]"
        } gap-7`}
      >
        {children}
      </div>
    </SideBarContext.Provider>
  );
}

export type SideBarContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
  activeMenu: MenuType;
  setActiveMenu: React.Dispatch<React.SetStateAction<MenuType>>;
};
export const SideBarContext = createContext({} as SideBarContextType);

export const SidebarMenuList = {
  dashboard: [
    { name: "Workspace", link: "/workspace", icon: <Home size={24} /> },
    { name: "Profile", link: "/profile", icon: <User size={24} /> },
    { name: "Inbox", link: "/inbox", icon: <Inbox size={24} /> },
    { name: "Invitation", link: "/invites", icon: <Send size={24} /> },
  ],
} as const;

export type MenuType = keyof typeof SidebarMenuList;
