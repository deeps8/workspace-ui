import { Metadata } from "next";
import { SideBar } from "@/components/ui/sidebar";
import { SidebarMenu } from "@/components/layout/sidebar-menu";
import { MySession } from "@/actions/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Collaborate with developers in you'r own personal space.",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await MySession();
  console.log({ data });
  return (
    <SideBar>
      <aside className="h-[calc(100vh-3.5rem)] w-full sticky top-14 border-r">
        <div className="w-full h-full">
          <SidebarMenu />
        </div>
      </aside>
      <main className="">
        <div className="w-full min-h-[calc(100vh-3.5rem)]">{children}</div>
      </main>
    </SideBar>
  );
}
