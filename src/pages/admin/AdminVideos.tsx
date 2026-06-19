import { useMutation, useQuery, useQueryClient } from "@/hooks/useData";
import { useState } from "react";
import { Plus, Trash2, Star, StarOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { extractYouTubeId, fetchYouTubeOEmbed, youtubeEmbedUrl, youtubeThumbnail } from "@/lib/youtube";

export default function AdminVideos() {
  const qc = useQueryClient();
  const { data: videos } = useQuery({
    queryKey: ["admin", "videos"],
    queryFn: async () => {
      const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase.from("videos").update({ is_featured }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "videos"] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "videos"] }); toast.success("Deleted"); },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Videos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Paste a YouTube URL — we'll grab the rest.</p>
        </div>
        <AddVideoDialog />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl glass">
        <table className="w-full text-sm">
          <thead className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Video</th>
              <th className="hidden p-4 md:table-cell">Category</th>
              <th className="hidden p-4 md:table-cell">Published</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(videos ?? []).map((v) => (
              <tr key={v.id} className="border-b border-white/5 last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={v.thumbnail_url ?? youtubeThumbnail(v.youtube_id, "mq")} alt="" className="h-12 w-20 rounded object-cover" />
                    <div className="min-w-0">
                      <div className="truncate font-medium">{v.title}</div>
                      <div className="text-xs text-muted-foreground">{v.youtube_id}</div>
                    </div>
                  </div>
                </td>
                <td className="hidden p-4 md:table-cell">{v.category ?? "—"}</td>
                <td className="hidden p-4 text-muted-foreground md:table-cell">{new Date(v.published_at).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" onClick={() => toggleFeatured.mutate({ id: v.id, is_featured: !v.is_featured })}>
                      {v.is_featured ? <Star className="h-4 w-4 fill-primary text-primary" /> : <StarOff className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete this video?")) del.mutate(v.id); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {videos && videos.length === 0 && (
              <tr><td colSpan={4} className="p-10 text-center text-muted-foreground">No videos yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddVideoDialog() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [form, setForm] = useState({ youtube_id: "", title: "", description: "", category: "", is_featured: false });

  const reset = () => { setUrl(""); setForm({ youtube_id: "", title: "", description: "", category: "", is_featured: false }); };

  const extract = async () => {
    const id = extractYouTubeId(url);
    if (!id) { toast.error("Couldn't find a YouTube ID in that URL"); return; }
    setExtracting(true);
    const meta = await fetchYouTubeOEmbed(id);
    setExtracting(false);
    setForm((f) => ({
      ...f, youtube_id: id,
      title: meta?.title ?? f.title ?? "",
      description: f.description,
    }));
    toast.success(meta ? `Loaded: ${meta.title}` : "Got the ID. Add a title manually.");
  };

  const save = useMutation({
    mutationFn: async () => {
      if (!form.youtube_id || !form.title) throw new Error("YouTube URL and title required");
      const { error } = await supabase.from("videos").insert({
        youtube_id: form.youtube_id,
        title: form.title,
        description: form.description || null,
        category: form.category || null,
        is_featured: form.is_featured,
        thumbnail_url: youtubeThumbnail(form.youtube_id),
        embed_url: youtubeEmbedUrl(form.youtube_id),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "videos"] });
      qc.invalidateQueries({ queryKey: ["videos"] });
      toast.success("Video added");
      reset(); setOpen(false);
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Add video
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-popover/95 backdrop-blur-xl">
        <DialogHeader><DialogTitle>Add a YouTube video</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>YouTube URL or ID</Label>
            <div className="flex gap-2">
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/watch?v=…" className="bg-white/5" />
              <Button type="button" onClick={extract} disabled={extracting} variant="outline" className="border-white/15">
                {extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Extract"}
              </Button>
            </div>
            {form.youtube_id && <div className="text-xs text-muted-foreground">ID: <span className="font-mono">{form.youtube_id}</span></div>}
          </div>
          {form.youtube_id && (
            <div className="overflow-hidden rounded-lg ring-1 ring-white/10">
              <img src={youtubeThumbnail(form.youtube_id, "hq")} alt="" className="aspect-video w-full object-cover" />
            </div>
          )}
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-white/5" />
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. AI, Space, Physics" className="bg-white/5" />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-white/5" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
            Feature on home page
          </label>
          <Button onClick={() => save.mutate()} disabled={save.isPending} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            {save.isPending ? "Saving…" : "Save video"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
