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

export default function AdminProducts() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => (await supabase.from("products").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("products").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "products"] }); toast.success("Deleted"); },
  });
  return (
    <div>
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-3xl font-bold">Store</h1><p className="mt-1 text-sm text-muted-foreground">Products in Dimension Store.</p></div>
        <AddProduct />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data ?? []).map((p) => (
          <div key={p.id} className="rounded-2xl glass p-4">
            {p.image_url && <img src={p.image_url} alt="" className="mb-3 aspect-video w-full rounded-lg object-cover" />}
            <div className="text-xs text-primary">{p.category}</div>
            <h3 className="font-semibold">{p.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-display font-bold text-gradient">{p.price ? `$${Number(p.price).toFixed(2)}` : ""}</span>
              <Button size="icon" variant="ghost" onClick={() => { if (confirm("Delete?")) del.mutate(p.id); }}><IconTrash className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {data && data.length === 0 && <div className="col-span-full rounded-2xl glass p-10 text-center text-sm text-muted-foreground">No products yet.</div>}
      </div>
    </div>
  );
}

function AddProduct() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", description: "", price: "", image_url: "", buy_url: "", category: "" });
  const save = useMutation({
    mutationFn: async () => {
      if (!f.name) throw new Error("Name required");
      const { error } = await supabase.from("products").insert({
        name: f.name, description: f.description || null, price: f.price ? Number(f.price) : null,
        image_url: f.image_url || null, buy_url: f.buy_url || null, category: f.category || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "products"] }); toast.success("Saved"); setOpen(false); setF({ name: "", description: "", price: "", image_url: "", buy_url: "", category: "" }); },
    onError: (e) => toast.error((e as Error).message),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="bg-linear-to-r from-primary to-secondary text-primary-foreground"><IconPlus className="mr-2 h-4 w-4" />Add product</Button></DialogTrigger>
      <DialogContent className="max-w-lg bg-popover/95 backdrop-blur-xl">
        <DialogHeader><DialogTitle>New product</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <Field label="Name" v={f.name} on={(v) => setF({ ...f, name: v })} />
          <Field label="Category" v={f.category} on={(v) => setF({ ...f, category: v })} />
          <Field label="Price (USD)" v={f.price} on={(v) => setF({ ...f, price: v })} />
          <Field label="Image URL" v={f.image_url} on={(v) => setF({ ...f, image_url: v })} />
          <Field label="Buy URL" v={f.buy_url} on={(v) => setF({ ...f, buy_url: v })} />
          <div className="grid gap-2"><Label>Description</Label><Textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="bg-white/5" /></div>
          <Button onClick={() => save.mutate()} disabled={save.isPending} className="bg-linear-to-r from-primary to-secondary text-primary-foreground">{save.isPending ? "Saving…" : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function Field({ label, v, on }: { label: string; v: string; on: (v: string) => void }) {
  return <div className="grid gap-2"><Label>{label}</Label><Input value={v} onChange={(e) => on(e.target.value)} className="bg-white/5" /></div>;
}
