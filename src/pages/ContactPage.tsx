import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function ContactPage() {
  useDocumentTitle("Contact");

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert(form);
    setSending(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Message sent. We'll be in touch.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Contact</span>
          <h1 className="mt-3 font-display text-5xl font-bold">Let's <span className="text-gradient">collaborate</span></h1>
          <p className="mt-3 text-muted-foreground">
            Sponsorships, partnerships, press, or just a kind word — we read everything.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={submit}
          className="mt-12 grid gap-5 rounded-3xl glass-strong p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          </div>
          <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
          <div className="grid gap-2">
            <Label>Message</Label>
            <Textarea
              required rows={6} value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="bg-white/5 ring-1 ring-white/10"
            />
          </div>
          <Button type="submit" size="lg" disabled={sending}
                  className="bg-linear-to-r from-primary to-secondary text-primary-foreground glow-cyan">
            {sending ? "Sending…" : <>Send message <Send className="ml-2 h-4 w-4" /></>}
          </Button>
        </motion.form>
      </section>
    </SiteLayout>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div className="grid gap-2">
      <Label>{label}{required && <span className="text-primary">*</span>}</Label>
      <Input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} className="bg-white/5 ring-1 ring-white/10" />
    </div>
  );
}
