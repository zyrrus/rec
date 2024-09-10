import Link from "next/link";
import { Button } from "~/app/_components/ui/button";

export const Header = () => {
  return (
    <header className="space-y-2">
      <h1 className="text-center text-5xl font-extrabold tracking-wide sm:text-[5rem]">
        rec
      </h1>
      <nav className="flex flex-row justify-center">
        <Button variant="link">
          <Link href="/">home</Link>
        </Button>
        <Button variant="link">
          <Link href="/u">me</Link>
        </Button>
      </nav>
    </header>
  );
};
