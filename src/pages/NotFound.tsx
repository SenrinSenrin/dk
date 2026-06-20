import { Link } from "wouter";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("Page not found");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-black text-gradient">404</h1>
        <h2 className="mt-4 font-display text-2xl font-semibold">Lost in another dimension</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for has slipped beyond our reach.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-linear-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
