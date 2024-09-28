import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Collaborate with developers in you'r own personal space.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
