"use server";
import { WorkspaceSchemaInfer } from "@/app/(dashboard)/workspace/new/createWorkspace";
import { APIresponse } from "@/types/api";
import { BoardType } from "@/types/board";
import { WorkspaceType } from "@/types/workspace";
import { revalidateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GetAllWorkspace(): Promise<APIresponse<WorkspaceType[]>> {
  try {
    const sessionId = cookies().get("session")?.value ?? "";
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/workspace`, {
      credentials: "include",
      method: "GET",
      cache: "force-cache",
      next: { tags: ["spaces"] },
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

export async function NewWorkspace(data: WorkspaceSchemaInfer) {
  try {
    const sessionId = cookies().get("session")?.value ?? "";
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/workspace`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${sessionId}`,
      },
      body: JSON.stringify({
        name: data.name,
        overview: data.overview,
        members: data.members.map((m) => m.value),
      }),
    });
    if (res.status === 401) {
      revalidateTag("session");
      return redirect("/login");
    }
    revalidateTag("spaces");
    if (res.ok) {
      return redirect("/workspace");
    }
    return await res.json();
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { message: error as string, ok: false, data: [] };
  }
}

export async function GetWorkspaceWbrd(name: string): Promise<APIresponse<WorkspaceType & { boards: BoardType[] }>> {
  try {
    const sessionId = cookies().get("session")?.value ?? "";
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/workspace?slug=${name}`, {
      credentials: "include",
      method: "GET",
      cache: "force-cache",
      next: { tags: ["spaces"] },
      headers: {
        Cookie: `session=${sessionId}`,
      },
    });
    if (res.status === 401) {
      console.log("User not authorized");
      revalidateTag("session");
      return redirect("/login");
    }
    return res.json();
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { message: "Something went wrong", ok: false, data: null };
  }
}
