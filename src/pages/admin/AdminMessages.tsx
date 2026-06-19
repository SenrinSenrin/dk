import { useMutation, useQuery, useQueryClient } from "@/hooks/useData";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function AdminMessages() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => (await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const toggle = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => { const { error } = await supabase.from("contact_messages").update({ is_read }).eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "messages"] }),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("contact_messages").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "messages"] }); toast.success("Deleted"); },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">Submissions from the contact form.</p>
      <div className="mt-8 grid gap-4">
        {(data ?? []).map((m) => (
          <div key={m.id} className={`rounded-2xl p-5 ${m.is_read ? "glass" : "glass ring-1 ring-primary/40"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="text-sm text-primary hover:underline">{m.email}</a>
                </div>
                {m.subject && <div className="mt-1 text-sm text-muted-foreground">{m.subject}</div>}
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={() => toggle.mutate({ id: m.id, is_read: !m.is_read })}>
                  {m.is_read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4 text-primary" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete?")) del.mutate(m.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm">{m.message}</p>
            <div className="mt-3 text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
          </div>
        ))}
        {data && data.length === 0 && <div className="rounded-2xl glass p-10 text-center text-sm text-muted-foreground">No messages yet.</div>}
      </div>
    </div>
  );
}
