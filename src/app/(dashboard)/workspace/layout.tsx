import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Collaborate with developers in you'r own personal space.",
};

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
