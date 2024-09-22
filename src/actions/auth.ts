import { cookies } from "next/headers";

export async function MySession() {
  const sessionId = cookies().get("session")?.value ?? null;
  if (!sessionId) {
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
  if (!res.ok) return null;
  return res.json();
}
