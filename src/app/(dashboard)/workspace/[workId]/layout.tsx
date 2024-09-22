import { Metadata } from "next";

export const metadata: Metadata = {
  description: "Collaborate with developers in you'r own personal space.",
};

export default function WorkLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { workId: string };
}>) {
  metadata.title = "Workspace: " + params.workId.toLocaleUpperCase();
  return children;
}
