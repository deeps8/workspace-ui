import { Metadata } from "next";
import { SideBar } from "@/components/ui/sidebar";
import { SidebarMenu } from "@/components/layout/sidebar-menu";
import { MySession } from "@/actions/auth";
import { Header } from "@/components/layout/header";
import SessionProvider from "@/components/provider/session-provider";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Collaborate with developers in you'r own personal space.",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <HomeLayout>
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
    </HomeLayout>
  );
}

async function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const data = await MySession();
  if (data == null) redirect("/login");
  return (
    <SessionProvider value={data}>
      <div className="relative flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95">
          <Header />
        </header>
        <main className="flex-1">
          <div className="w-full h-full">{children}</div>
        </main>
        {/* <footer>
        <div className="border-t">Footer Component</div>
      </footer> */}
      </div>
    </SessionProvider>
  );
}
