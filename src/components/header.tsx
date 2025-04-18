import Link from "next/link";
import { buttonVariants } from "./ui/button";

export function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1 className="text-3xl font-bold">Article Knowledge Base Chat</h1>

      <Link
        className={buttonVariants({
          variant: "secondary",
        })}
        href="/articles"
      >
        Artigos
      </Link>
    </header>
  );
}
