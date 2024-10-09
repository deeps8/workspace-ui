"use server";
import { SessionType } from "@/components/provider/session-provider";
import { APIresponse } from "@/types/api";
import { UserType } from "@/types/user";
import { revalidateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const MySession = async function (): Promise<SessionType | null> {
  const sessionId = cookies().get("session")?.value ?? null;
  if (!sessionId) {
    return null;
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/session`, {
      credentials: "include",
      method: "GET",
      headers: {
        Cookie: `session=${sessionId}`,
      },
      next: { tags: ["session"] },
    });

    if (!res.ok) {
      return null;
    }
    const user: UserType = await res.json();
    console.log({ user });
    return { user, session: true };
  } catch (error) {
    return null;
  }
};

export const LogoutUser = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/logout`, {
      credentials: "include",
      method: "GET",
    });
    if (res.ok) {
      cookies().delete("session");
    }
    return redirect("/login");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return false;
  }
};

export async function GetAllUser(): Promise<APIresponse<UserType[]>> {
  try {
    const sessionId = cookies().get("session")?.value ?? "";
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/user`, {
      credentials: "include",
      method: "GET",
      cache: "force-cache",
      next: { tags: ["users"] },
      headers: {
        Cookie: `session=${sessionId}`,
      },
    });
    if (res.status === 401) {
      revalidateTag("session");
      return redirect("/login");
    }
    return res.json();
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { message: "Something went wrong", ok: false, data: [] };
  }
}
