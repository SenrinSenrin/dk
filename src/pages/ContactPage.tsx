import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { IconSend2, IconBrandTelegram } from "@tabler/icons-react";

// Replace with your actual Telegram username or link
const TELEGRAM_URL = "https://t.me/simsenrin";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialFormState: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  useDocumentTitle("Contact");

  const [form, setForm] = useState<FormState>(initialFormState);
  const [sending, setSending] = useState(false);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const { error } = await supabase.from("contact_messages").insert([form]);

      if (error) {
        toast.error(error.message || "Failed to send message. Please try again.");
        return;
      }

      toast.success("Message sent! We'll be in touch soon.");
      setForm(initialFormState);
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setSending(false);
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Contact
          </span>
          <h1 className="mt-3 font-display text-5xl font-bold">
            Let's <span className="text-gradient">collaborate</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Sponsorships, partnerships, press, or just a kind word — we read everything.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={submit}
          className="mt-12 grid gap-5 rounded-3xl glass-strong p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Name"
              value={form.name}
              onChange={(v) => handleChange("name", v)}
              disabled={sending}
              required
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => handleChange("email", v)}
              disabled={sending}
              required
            />
          </div>
          <Field
            label="Subject"
            value={form.subject}
            onChange={(v) => handleChange("subject", v)}
            disabled={sending}
          />
          <div className="grid gap-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              required
              rows={6}
              value={form.message}
              disabled={sending}
              onChange={(e) => handleChange("message", e.target.value)}
              className="bg-white/5 ring-1 ring-white/10"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={sending}
            className="bg-linear-to-r from-primary to-secondary text-primary-foreground glow-cyan"
          >
            {sending ? (
              "Sending…"
            ) : (
              <>
                Send message <IconSend2 className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.form>

        {/* --- Telegram Link Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col items-center gap-3 text-center"
        >
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-full">
            <span className="h-px flex-1 bg-white/10" />
            <span>Or message directly</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500/10 px-5 py-2.5 text-sm font-medium text-sky-400 ring-1 ring-sky-500/20 transition-all hover:bg-sky-500/20 hover:ring-sky-500/40"
          >
            <IconBrandTelegram className="h-4 w-4" />
            Chat on Telegram
          </a>
        </motion.div>
      </section>
    </SiteLayout>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}

function Field({ label, value, onChange, type = "text", required, disabled }: FieldProps) {
  const fieldId = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="grid gap-2">
      <Label htmlFor={fieldId}>
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </Label>
      <Input
        id={fieldId}
        type={type}
        required={required}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/5 ring-1 ring-white/10"
      />
    </div>
  );
}
