"use server";
import { BoardSchemaInfer } from "@/components/custom/create-board-form";
import { APIresponse } from "@/types/api";
import { BoardDataType } from "@/types/board";
import { revalidateTag } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function NewBoard(data: BoardSchemaInfer & { space_id: string }): Promise<APIresponse<BoardDataType>> {
  try {
    const sessionId = cookies().get("session")?.value ?? "";
    console.log({ brd: data });
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/workspace/board`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${sessionId}`,
      },
      body: JSON.stringify(data),
    });
    if (res.status === 401) {
      revalidateTag("session");
      return redirect("/login");
    }
    revalidateTag("spaces");
    return await res.json();
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { message: error as string, ok: false, data: null };
  }
}

export async function StartSocket() {
  /**
   * 1. check if websocket is available or not
   * 2. create a websocket instance of a URL
   * 3. use that instance to read,send,close the connection
   */
  const url = new URL(process.env.NEXT_PUBLIC_API_BASE_PATH || "");
  const ws = new WebSocket(`ws://${url.host}/api/ws`);
  ws.onopen = function (e) {
    console.log("Connection Opened");
  };

  ws.onclose = function (e) {
    console.log("Connection Closed");
  };

  ws.onmessage = function (e) {
    console.log("Msg received", e.data);
    // var out = document.getElementById("output");
    // if (!out) return;
    // out.innerHTML += e.data + "<br>";
  };

  ws.onerror = function (e) {
    console.log("Connection Error", e);
  };

  setInterval(function () {
    ws.send("Hello, Server!");
  }, 1000);

  return ws;
}
