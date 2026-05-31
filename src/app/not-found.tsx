import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="mt-2 text-4xl font-semibold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="mt-6 inline-block rounded-md bg-accent px-4 py-2 text-sm text-[var(--accent-foreground)]">
          Back home
        </Link>
      </div>
    </div>
  );
}
