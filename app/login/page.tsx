"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/icons/google";
import { AppleIcon } from "@/components/icons/apple";
import { SiteHeader } from "@/components/layout/site-header";
import { getBrowserClient } from "@/lib/supabase-browser";
import { useToast } from "@/components/ui/toast";

type Mode = "signup" | "signin";

function LoginPageInner() {
  const supabase = useMemo(() => getBrowserClient(), []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });

  const onChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  useEffect(() => {
    const initialMode = searchParams.get("mode");
    if (initialMode === "signin" || initialMode === "signup") {
      setMode(initialMode);
    }
  }, [searchParams]);

  const isSignup = mode === "signup";
  const isFormValid =
    !!form.email && !!form.password && (!isSignup || form.terms) && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setLoading(true);
    try {
      if (isSignup) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { name: form.name || null },
          },
        });
        if (signUpError) throw signUpError;
        toast({
          title: "Account created",
          description: "Check your email, then sign in to continue.",
          variant: "success",
        });
        setMode("signin");
        return;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (signInError) throw signInError;
      }

      toast({
        title: "Signed in",
        description: "Welcome back!",
        variant: "success",
      });
      router.push("/chat");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      toast({
        title: "Authentication failed",
        description: message,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/chat` },
      });
      toast({
        title: "Redirecting to Google",
        description: "Complete sign in to continue.",
        variant: "info",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google sign-in failed.";
      setError(message);
      toast({
        title: "Google sign-in failed",
        description: message,
        variant: "error",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex flex-1 flex-col lg:flex-row">
        <section className="flex w-full items-center justify-center py-10 lg:w-[55%] lg:py-0">
          <div className="container flex max-w-xl flex-col gap-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {mode === "signup" ? "Get Started Now" : "Welcome back"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {mode === "signup"
                    ? ""
                    : "Sign in to continue your conversations."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signup" ? "signin" : "signup");
                  setError(null);
                }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {mode === "signup" ? "Sign in" : "Create account"}
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => onChange("password", e.target.value)}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  required
                />
              </div>

              {mode === "signup" && (
                <div className="flex items-center gap-2 pt-2">
                  <Checkbox
                    id="terms"
                    name="terms"
                    checked={form.terms}
                    onCheckedChange={(v) => onChange("terms", Boolean(v))}
                  />
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
              )}

              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="h-12 w-full text-base"
                disabled={loading || !isFormValid}
              >
                {loading
                  ? "Please wait..."
                  : mode === "signup"
                  ? "Create Free Account"
                  : "Sign In"}
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
                  onClick={handleGoogle}
                >
                  <GoogleIcon />
                  <span>Sign in with Google</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex w-full items-center justify-center gap-2 rounded-full border-foreground/10 text-sm font-semibold text-foreground sm:w-auto sm:px-6"
                  disabled
                >
                  <AppleIcon />
                  <span>Sign in with Apple</span>
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                {mode === "signup" ? "Have an account?" : "New here?"}{" "}
                <button
                  type="button"
                  className="font-semibold text-primary hover:underline"
                  onClick={() => {
                    setMode(mode === "signup" ? "signin" : "signup");
                    setError(null);
                  }}
                >
                  {mode === "signup" ? "Sign In" : "Create Free Account"}
                </button>
              </p>
            </form>
          </div>
        </section>

        <section className="relative hidden w-[45%] overflow-hidden bg-black lg:block">
          <Image
            src="/connection.png"
            alt="Network connection visualization"
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </section>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginPageInner />
    </Suspense>
  );
}

