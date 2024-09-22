import { MySession } from "@/actions/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login",
  description: "Collaborate with developers in you'r own personal space.",
};

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await MySession();
  if (data) redirect("/workspace");
  return children;
}
