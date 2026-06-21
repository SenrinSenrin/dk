import { Link, useLocation, Route, Switch } from "wouter";
import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import Dashboard from "./Dashboard";
import AdminVideos from "./AdminVideos";
import AdminArticles from "./AdminArticles";
import AdminProducts from "./AdminProducts";
import AdminMessages from "./AdminMessages";
import { IconFileText, IconLayoutDashboard, IconLogout, IconMessage, IconPlayerPlay, IconShoppingCart, IconSparkle2 } from "@tabler/icons-react";

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: IconLayoutDashboard, exact: true },
  { to: "/admin/videos", label: "Videos", icon: IconPlayerPlay },
  { to: "/admin/articles", label: "Articles", icon: IconFileText },
  { to: "/admin/products", label: "Store", icon: IconShoppingCart },
  { to: "/admin/messages", label: "Messages", icon: IconMessage },
] as const;

export default function AdminLayout() {
  useDocumentTitle("Admin");

  const { user, isAdmin, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) setLocation("/auth");
  }, [loading, user, setLocation]);

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="max-w-md rounded-3xl glass-strong p-10 text-center">
          <h1 className="font-display text-2xl font-bold">Admin access required</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account is signed in but doesn't have the admin role yet. Promote it by inserting a row into <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">user_roles</code> with role <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs">admin</code> for your user ID.
          </p>
          <p className="mt-3 break-all rounded-lg bg-white/5 p-3 text-xs">{user.id}</p>
          <Button onClick={() => supabase.auth.signOut()} variant="outline" className="mt-6 border-white/15 bg-white/5">Sign out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-white/5 bg-black/30 backdrop-blur md:flex md:flex-col">
        <Link href="/" className="flex items-center gap-2 px-6 py-5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-linear-to-br from-primary to-secondary">
            <IconSparkle2 className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="font-display text-base font-bold">Admin</span>
        </Link>
        <nav className="flex-1 px-3">
          {items.map((it) => {
            const isExactAdmin = it.to === "/admin/dashboard" && it.exact;
            const isActive = isExactAdmin ? (location === "/admin/dashboard" || location === "/admin/dashboard") : (location.startsWith(it.to) && it.to !== "/admin/dashboard");
            return (
              <Link key={it.to} href={it.to}
                className={cn(
                  "mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive ? "bg-linear-to-r from-primary/20 to-secondary/15 text-foreground ring-1 ring-primary/30" : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}>
                <it.icon className="h-4 w-4" /> {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/5 p-3">
          <Button variant="ghost" onClick={() => supabase.auth.signOut().then(() => setLocation("/"))} className="w-full justify-start text-muted-foreground hover:text-foreground">
            <IconLogout className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="flex items-center justify-between border-b border-white/5 bg-black/20 px-6 py-4 md:hidden">
          <Link href="/" className="font-display font-bold">DK Admin</Link>
          <Button size="sm" variant="ghost" onClick={() => supabase.auth.signOut()}><IconLogout className="h-4 w-4" /></Button>
        </header>
        <div className="md:hidden flex gap-2 overflow-x-auto border-b border-white/5 bg-black/20 px-4 py-3">
          {items.map((it) => {
            const isExactAdmin = it.to === "/admin/dashboard" && it.exact;
            const active = isExactAdmin ? (location === "/admin/dashboard" || location === "/admin/dashboard") : (location.startsWith(it.to) && it.to !== "/admin/dashboard");
            return (
              <Link key={it.to} href={it.to} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ring-1", active ? "bg-primary text-primary-foreground ring-primary" : "bg-white/5 text-muted-foreground ring-white/10")}>
                <it.icon className="h-3.5 w-3.5" /> {it.label}
              </Link>
            );
          })}
        </div>
        <main className="flex-1 p-6 lg:p-10">
          <Switch>
            <Route path="/admin/videos" component={AdminVideos} />
            <Route path="/admin/articles" component={AdminArticles} />
            <Route path="/admin/products" component={AdminProducts} />
            <Route path="/admin/messages" component={AdminMessages} />
            <Route path="/admin/:rest*" component={Dashboard} />
          </Switch>
        </main>
      </div>
    </div>
  );
}
