import Link from "next/link";
import { signUpWithPassword } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-100">
      <Navbar />
      <main className="flex min-h-[calc(100vh-53px)] items-center justify-center px-6">
        <Card className="w-full max-w-md border-slate-700/60 bg-slate-900/70 text-slate-100">
          <CardHeader>
            <CardTitle className="text-2xl">Create your ShipFeed account</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={signUpWithPassword} className="space-y-4">
              <Input required name="email" type="email" autoComplete="email" placeholder="you@company.com" />
              <Input required name="password" type="password" autoComplete="new-password" placeholder="Create password" />
              <Button className="w-full bg-blue-500 hover:bg-blue-400">Sign up</Button>
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
    </div>
  );
}
