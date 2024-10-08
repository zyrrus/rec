import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Header } from "~/app/_components/header";
import { CreateListTemplate } from "~/app/admin/create-list-template";
import { ListTemplate } from "~/app/admin/list-template";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Admin() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const isAdmin = await api.admin.checkIsAdmin();
  if (!isAdmin) {
    redirect("/");
  }

  void api.curator.getAllLists.prefetch();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12 px-3 py-12 sm:px-6">
      <Header />
      <div className="flex flex-col gap-3">
        <CreateListTemplate />
        <Suspense>
          <ListTemplate />
        </Suspense>
      </div>
    </main>
  );
}
