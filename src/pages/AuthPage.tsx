import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { IconSparkle2 } from "@tabler/icons-react";

export default function AuthPage() {
  useDocumentTitle("Sign in");

  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setLocation("/admin");
  }, [user, setLocation]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      }
      setLocation("/admin");
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setLoading(false); }
  };

  return (
    <div className="relative grid min-h-screen place-items-center px-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-secondary/25 blur-[120px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl glass-strong p-8 ring-gradient"
      >
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-primary to-secondary">
            <IconSparkle2 className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold">Dimension Knowledge</span>
        </Link>
        <h1 className="font-display text-2xl font-bold">{mode === "signin" ? "Welcome back" : "Create account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Admin access to Dimension Knowledge.</p>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/5 ring-1 ring-white/10" />
          </div>
          <div className="grid gap-2">
            <Label>Password</Label>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white/5 ring-1 ring-white/10" />
          </div>
          <Button type="submit" size="lg" disabled={loading} className="bg-linear-to-r from-primary to-secondary text-primary-foreground">
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "No account? Sign up" : "Already have an account? Sign in"}
        </button>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          The first signed-in user needs to be promoted to admin via the database to access admin tools.
        </p>
      </motion.div>
    </div>
  );
}
