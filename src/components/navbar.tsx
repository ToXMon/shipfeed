import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="relative z-20 w-full border-b border-slate-800/60 bg-[#0A0F1E]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-10">
        <Link href="/" className="text-lg font-bold text-white tracking-tight">
          ShipFeed
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-300">
          <Link href="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Button asChild size="sm" variant="outline" className="border-slate-600 bg-transparent text-slate-100 hover:bg-slate-700/40 hover:text-white">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild size="sm" className="bg-blue-500 text-white hover:bg-blue-400">
            <Link href="/signup">Sign up free</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
