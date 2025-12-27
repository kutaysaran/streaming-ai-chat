export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-lg font-semibold text-primary">Home</p>
        <p className="text-sm text-muted-foreground">
          This is the default landing page. Navigate to /login for the auth
          screen.
        </p>
      </div>
    </main>
  );
}
