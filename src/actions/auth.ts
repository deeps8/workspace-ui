import { cookies } from "next/headers";

export async function MySession() {
  const sessionId = cookies().get("session")?.value ?? null;
  if (!sessionId) {
    console.log({ msg: "Session ID not found" });
    return null;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/session`, {
    credentials: "include",
    method: "GET",
    headers: {
      Cookie: cookies().toString(),
    },
  });
  //   console.log({ res: await res.json() });
  if (!res.ok) {
    console.log({ res, msg: "wrong api call" });
    return null;
  }
  return res.json();
}
