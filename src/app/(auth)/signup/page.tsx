import Link from "next/link";
import { signUpWithPassword } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0F1E] px-6">
      <Card className="w-full max-w-md border-slate-700/60 bg-slate-900/70 text-slate-100">
        <CardHeader>
          <CardTitle className="text-2xl">Create your ShipFeed account</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={signUpWithPassword} className="space-y-4">
            <Input required name="email" type="email" placeholder="you@company.com" />
            <Input required name="password" type="password" placeholder="Create password" />
            <Button className="w-full">Sign up</Button>
          </form>
          <Button asChild variant="outline" className="mt-3 w-full border-slate-600 bg-transparent">
            <Link href="/api/auth/google">Continue with Google</Link>
          </Button>
          <p className="mt-5 text-sm text-slate-400">
            Already have an account? <Link className="text-blue-300 hover:text-blue-200" href="/login">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
