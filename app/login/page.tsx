import Link from "next/link";
import { Globe2, Menu, MessageCircle, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" role="img" aria-hidden="true" className="h-5 w-5">
    <path
      fill="#EA4335"
      d="M24 9.5c3.1 0 5.9 1.1 8.1 3.2l6-6.1C34.3 3.3 29.5 1.5 24 1.5 14.7 1.5 6.7 7.6 3.6 16l7.5 5.8C12.5 15.5 17.7 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.5 24.5c0-1.7-.2-3.4-.6-5H24v9.6h12.7c-.5 2.7-2 5-4.2 6.6l6.6 5.1c3.9-3.6 6.4-8.9 6.4-16.3z"
    />
    <path
      fill="#FBBC05"
      d="M11.1 28.3c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7.5-5.8C1.2 15.7 0 19.7 0 23.5s1.2 7.8 3.6 11l7.5-6.2z"
    />
    <path
      fill="#34A853"
      d="M24 47.5c5.5 0 10.2-1.8 13.5-4.9l-6.6-5.1c-1.8 1.3-4.1 2.1-6.9 2.1-6.3 0-11.6-4-13.4-9.6l-7.5 5.8C6.7 40.4 14.7 47.5 24 47.5z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" role="img" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M17.477 12.585c-.023-2.286 1.87-3.389 1.957-3.445-1.067-1.56-2.722-1.773-3.305-1.8-1.408-.147-2.746.83-3.458.83-.715 0-1.816-.81-2.983-.79-1.53.023-2.952.89-3.74 2.256-1.602 2.77-.406 6.86 1.15 9.1.76 1.095 1.664 2.322 2.85 2.278 1.145-.045 1.576-.735 2.96-.735 1.383 0 1.775.735 2.98.711 1.233-.019 2.011-1.093 2.754-2.195.893-1.318 1.256-2.595 1.278-2.66-.028-.013-2.45-.94-2.483-3.25zM14.81 5.26c.64-.776 1.067-1.853.95-2.93-.92.037-2.033.61-2.693 1.383-.59.686-1.107 1.79-.97 2.84 1.02.08 2.07-.517 2.713-1.293z"
    />
  </svg>
);

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-border/70">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="border border-border text-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-lg font-extrabold text-primary">C</span>
              </div>
              <span className="text-lg font-semibold text-foreground">
                ChatAPP
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-2 rounded-full border border-border bg-white px-2 py-1 text-sm font-medium text-foreground lg:flex">
            <div className="flex items-center gap-2 rounded-full px-3 py-1 hover:bg-muted">
              <Globe2 className="h-4 w-4 text-primary" strokeWidth={2.25} />
              <span>Explore</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-primary-foreground shadow-sm">
              <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
              <span>Chat</span>
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="hidden rounded-full px-4 text-sm font-semibold text-primary sm:inline-flex"
            >
              Join Free
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden rounded-full border border-border px-4 text-sm font-semibold sm:inline-flex"
            >
              Login
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="border border-border text-foreground sm:hidden"
              aria-label="Profile"
            >
              <UserRound className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col lg:flex-row">
        <section className="flex w-full items-center justify-center py-10 lg:w-[55%] lg:py-0">
          <div className="container flex max-w-xl flex-col gap-10">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Get Started Now
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your account to start chatting with AI characters in
                seconds.
              </p>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Enter your name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Name"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox id="terms" name="terms" />
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal text-muted-foreground"
                >
                  I agree to the{" "}
                  <Link
                    href="#"
                    className="font-semibold text-primary hover:underline"
                  >
                    terms &amp; policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="h-12 w-full text-base">
                Create Free Account
              </Button>

              <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                <span>Or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="flex w-full items-center justify-center gap-2 rounded-full border-foreground/10 text-sm font-semibold text-foreground sm:w-auto sm:px-6"
                >
                  <GoogleIcon />
                  <span>Sign in with Google</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex w-full items-center justify-center gap-2 rounded-full border-foreground/10 text-sm font-semibold text-foreground sm:w-auto sm:px-6"
                >
                  <AppleIcon />
                  <span>Sign in with Apple</span>
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Have an account?{" "}
                <Link
                  href="#"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </section>

        <section className="relative hidden w-[45%] overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-900 to-black lg:block">
          <div className="absolute inset-0 bg-grid opacity-40" />
          <div className="hero-glow absolute inset-0" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[72%] w-[72%] rounded-full border border-emerald-500/20 bg-emerald-500/5 blur-0" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </section>
      </main>
    </div>
  );
}

