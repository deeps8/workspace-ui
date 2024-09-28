"use client";

import { UserType } from "@/types/user";
import React, { createContext, useContext } from "react";

export type SessionType = {
  user: Omit<UserType, "createdAt" | "updatedAt">;
  session: boolean;
};

export const SessionContext = createContext<SessionType | null>(null);

export default function SessionProvider({ children, value }: React.PropsWithChildren<{ value: SessionType }>) {
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context || !context.user) {
    // throw new Error("useSession must be used within the SessionProvider");
    return { session: false, user: {} as UserType };
  }
  return { ...context };
}
