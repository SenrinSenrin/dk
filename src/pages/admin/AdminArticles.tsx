import { useMutation, useQuery, useQueryClient } from "@/hooks/useData";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { IconPlus, IconTrash } from "@tabler/icons-react";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminArticles() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "articles"],
    queryFn: async () => (await supabase.from("articles").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("articles").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "articles"] }); toast.success("Deleted"); },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Articles</h1>
          <p className="mt-1 text-sm text-muted-foreground">Long-form posts for the channel.</p>
        </div>
        <AddArticle />
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl glass">
        <table className="w-full text-sm">
          <thead className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="p-4">Title</th><th className="hidden p-4 md:table-cell">Slug</th><th className="hidden p-4 md:table-cell">Published</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {(data ?? []).map((a) => (
              <tr key={a.id} className="border-b border-white/5 last:border-0">
                <td className="p-4 font-medium">{a.title}</td>
                <td className="hidden p-4 font-mono text-xs text-muted-foreground md:table-cell">{a.slug}</td>
                <td className="hidden p-4 md:table-cell">{a.is_published ? <span className="rounded bg-primary/15 px-2 py-0.5 text-xs text-primary">Live</span> : <span className="text-muted-foreground">Draft</span>}</td>
                <td className="p-4 text-right">
                  <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete?")) del.mutate(a.id); }}><IconTrash className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
            {data && data.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-muted-foreground">No articles yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddArticle() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: "", excerpt: "", content: "", category: "", cover_image: "", is_published: true });
  const save = useMutation({
    mutationFn: async () => {
      if (!f.title) throw new Error("Title required");
      const { error } = await supabase.from("articles").insert({
        title: f.title, slug: slugify(f.title), excerpt: f.excerpt || null, content: f.content || null,
        category: f.category || null, cover_image: f.cover_image || null, is_published: f.is_published,
        published_at: f.is_published ? new Date().toISOString() : null,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "articles"] }); toast.success("Article saved"); setOpen(false); setF({ title: "", excerpt: "", content: "", category: "", cover_image: "", is_published: true }); },
    onError: (e) => toast.error((e as Error).message),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="bg-linear-to-r from-primary to-secondary text-primary-foreground"><IconPlus className="mr-2 h-4 w-4" />Add article</Button></DialogTrigger>
      <DialogContent className="max-w-lg bg-popover/95 backdrop-blur-xl">
        <DialogHeader><DialogTitle>New article</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2"><Label>Title</Label><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className="bg-white/5" /></div>
          <div className="grid gap-2"><Label>Category</Label><Input value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="bg-white/5" /></div>
          <div className="grid gap-2"><Label>Cover image URL</Label><Input value={f.cover_image} onChange={(e) => setF({ ...f, cover_image: e.target.value })} className="bg-white/5" /></div>
          <div className="grid gap-2"><Label>Excerpt</Label><Textarea rows={2} value={f.excerpt} onChange={(e) => setF({ ...f, excerpt: e.target.value })} className="bg-white/5" /></div>
          <div className="grid gap-2"><Label>Content (markdown)</Label><Textarea rows={6} value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} className="bg-white/5" /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_published} onChange={(e) => setF({ ...f, is_published: e.target.checked })} /> Publish immediately</label>
          <Button onClick={() => save.mutate()} disabled={save.isPending} className="bg-linear-to-r from-primary to-secondary text-primary-foreground">{save.isPending ? "Saving…" : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
