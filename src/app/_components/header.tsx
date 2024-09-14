import Link from "next/link";
import { Button } from "~/app/_components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export const Header = async () => {
  let isAdmin = false;
  const session = await getServerAuthSession();

  if (session?.user) {
    isAdmin = await api.admin.checkIsAdmin();
  }

  return (
    <header className="space-y-2">
      <h1 className="text-center text-5xl font-extrabold tracking-wide sm:text-[5rem]">
        rec
      </h1>
      <nav className="flex flex-row justify-center">
        <Button variant="link" asChild>
          <Link href="/">home</Link>
        </Button>
        {session?.user ? (
          <Button variant="link" asChild>
            <Link href="/u">me</Link>
          </Button>
        ) : (
          <Button variant="link" asChild>
            <Link href="/api/auth/signin">sign in</Link>
          </Button>
        )}
        {isAdmin && (
          <Button variant="link" asChild>
            <Link href="/admin">admin</Link>
          </Button>
        )}
      </nav>
    </header>
  );
};
