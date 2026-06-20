import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconMenu2, IconSparkle2, IconX } from "@tabler/icons-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/videos", label: "Videos" },
  { to: "/about", label: "About" },
  { to: "/author", label: "Author" },
  { to: "/store", label: "Store" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [pathname] = useLocation();

  return (
    <header
      className="sticky top-0 z-50 w-full"
    >
      <div className="mx-auto max-w-7xl pt-4">
        <nav className="glass-strong flex items-center justify-between rounded-xl px-4 py-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2">
            <span className="h-11 w-11">
              <img src="/logo.png"/>
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Dimension <span className="text-gradient">Knowledge</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to));
              return (
                <Link
                  key={l.to}
                  href={l.to}
                  className={cn(
                    "relative px-4 py-2.5 text-sm font-medium transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-white/5 ring-1 ring-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <p className="leading-none">{l.label}</p>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:block">
            <Button asChild size="sm" className="bg-linear-to-r from-primary to-secondary text-primary-foreground hover:opacity-90">
              <Link href="/auth">Sign in</Link>
            </Button>
          </div>

          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <IconX className="h-4 w-4" /> : <IconMenu2 className="h-4 w-4" />}
          </button>
        </nav>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong mt-2 rounded-2xl p-3 md:hidden"
          >
            <div className="grid">
              {links.map((l) => (
                <Link
                  key={l.to}
                  href={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/auth"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-lg bg-linear-to-r from-primary to-secondary px-3 py-2 text-center text-sm font-semibold text-primary-foreground"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}
