import { Metadata } from "next";

export const metadata: Metadata = {
  description: "Collaborate with developers in you'r own personal space.",
};

export default function WorkLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { boardId: string };
}>) {
  metadata.title = "Board: " + params.boardId.toLocaleUpperCase();
  return children;
}
