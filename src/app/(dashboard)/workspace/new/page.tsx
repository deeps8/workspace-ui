import { BreadcrumbComp, BreadcrumbType } from "@/components/ui/breadcrumb";
import { CardTitle } from "@/components/ui/card";
import WorkspaceForm from "./createWorkspace";
import { GetAllUser } from "@/actions/auth";

const Crumbs: BreadcrumbType[] = [
  { href: "/workspace", label: "Workspace" },
  { href: "/workspace/new", label: "Create Workspace" },
];

export default async function CreateWorkspace() {
  const userDetails = await GetAllUser();
  return (
    <main>
      <header className="py-4 sticky top-14 bg-background z-[1]">
        <div className="space-y-2">
          <BreadcrumbComp crumbs={Crumbs} />
          <CardTitle>Create you own workspace</CardTitle>
        </div>
      </header>
      <section>
        <div className="lg:max-w-[70%] w-[100%]">
          <WorkspaceForm
            users={userDetails.data?.map((u) => ({ label: u.email, value: { id: u.id, email: u.email } })) ?? []}
          />
        </div>
      </section>
    </main>
  );
}
