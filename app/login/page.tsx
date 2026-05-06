import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createHash } from "crypto";
import { AUTH_COOKIE, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

async function login(formData: FormData) {
  "use server";
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    redirect("/login?error=1");
  }
  const token = createHash("sha256").update(password).digest("hex");
  const jar = await cookies();
  jar.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/");
}

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <main className="min-h-screen grid place-items-center px-6">
      <form
        action={login}
        className="w-full max-w-sm bg-white border border-[#e8dec1] rounded-xl p-8 shadow-sm"
      >
        <h1 className="text-xl font-semibold mb-1 text-[var(--color-ink)]">Maryna&apos;s Job Tracker</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mb-6">Enter the access password.</p>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border border-[#e8dec1] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-cocoa)]"
          autoFocus
        />
        {error ? <p className="mt-2 text-sm text-rose-600">Wrong password.</p> : null}
        <button
          type="submit"
          className="mt-4 w-full bg-[var(--color-cocoa)] text-white rounded-md py-2 text-sm font-medium hover:opacity-90"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
