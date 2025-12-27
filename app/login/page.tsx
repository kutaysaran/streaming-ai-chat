import Image from "next/image";
import Link from "next/link";
import { Globe2, Menu, MessageCircle, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/icons/google";
import { AppleIcon } from "@/components/icons/apple";

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
            <Image
              src="/chat-app-logo.png"
              alt="ChatAPP"
              width={170}
              height={52}
              className="h-10 w-auto sm:h-12"
              priority
            />
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

