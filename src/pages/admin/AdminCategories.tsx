import { useMutation, useQuery, useQueryClient } from "@/hooks/useData";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";

// Variable type for categories, used in the admin interface. This type represents a category object with its properties.
export const CATEGORY_TYPES = ["video", "general", "product"] as const;
export type CategoryType = (typeof CATEGORY_TYPES)[number];

export type Category = {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  description: string | null;
  created_at?: string;
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminCategories() {
  const qc = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as Category[]) ?? [];
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Category deleted");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your site categories.</p>
        </div>
        <AddCategoryDialog />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl glass">
        <table className="w-full text-sm">
          <thead className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Name</th>
              <th className="hidden p-4 md:table-cell">Slug</th>
              <th className="p-4">Type</th>
              <th className="hidden p-4 md:table-cell">Description</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-white/5 last:border-0">
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="hidden p-4 font-mono text-xs text-muted-foreground md:table-cell">{cat.slug}</td>
                <td className="p-4">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-primary">
                    {cat.type}
                  </span>
                </td>
                <td className="hidden p-4 text-muted-foreground md:table-cell">{cat.description || "—"}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingCategory(cat)}
                    >
                      <IconPencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Delete category "${cat.name}"?`)) {
                          del.mutate(cat.id);
                        }
                      }}
                    >
                      <IconTrash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && categories.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-muted-foreground">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingCategory && (
        <EditCategoryDialog
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
        />
      )}
    </div>
  );
}

function AddCategoryDialog() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({
    name: "",
    type: CATEGORY_TYPES[0] as CategoryType,
    description: "",
  });

  const save = useMutation({
    mutationFn: async () => {
      const name = f.name.trim();
      if (!name) throw new Error("Category name is required");

      const { error } = await supabase.from("categories").insert({
        name,
        slug: slugify(name),
        type: f.type,
        description: f.description.trim() || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Category created");
      setOpen(false);
      setF({ name: "", type: CATEGORY_TYPES[0], description: "" });
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-linear-to-r from-primary to-secondary text-primary-foreground">
          <IconPlus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-popover/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>New Category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 mt-2">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              placeholder="e.g. Featured Videos"
              className="bg-white/5"
            />
          </div>
          <div className="grid gap-2">
            <Label>Type</Label>
            <select
              value={f.type}
              onChange={(e) => setF({ ...f, type: e.target.value as CategoryType })}
              className="flex h-9 w-full rounded-md border border-input bg-white/5 px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              {CATEGORY_TYPES.map((t) => (
                <option key={t} value={t} className="bg-popover text-popover-foreground">
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={f.description}
              onChange={(e) => setF({ ...f, description: e.target.value })}
              placeholder="Brief description..."
              className="bg-white/5"
            />
          </div>
          <Button
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="mt-2 bg-linear-to-r from-primary to-secondary text-primary-foreground"
          >
            {save.isPending ? "Saving…" : "Save Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditCategoryDialog({
  category,
  open,
  onOpenChange,
}: {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const qc = useQueryClient();
  const [f, setF] = useState({
    name: category.name,
    slug: category.slug,
    type: category.type || CATEGORY_TYPES[0],
    description: category.description || "",
  });

  const update = useMutation({
    mutationFn: async () => {
      const name = f.name.trim();
      const slug = f.slug.trim();

      if (!name) throw new Error("Category name is required");
      if (!slug) throw new Error("Slug is required");

      const { error } = await supabase
        .from("categories")
        .update({
          name,
          slug: slugify(slug),
          type: f.type,
          description: f.description.trim() || null,
        })
        .eq("id", category.id);

      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Category updated");
      onOpenChange(false);
    },
    onError: (e) => toast.error((e as Error).message),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-popover/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 mt-2">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              value={f.name}
              onChange={(e) => {
                const name = e.target.value;
                setF({ ...f, name, slug: slugify(name) });
              }}
              className="bg-white/5"
            />
          </div>
          <div className="grid gap-2">
            <Label>Slug</Label>
            <Input
              value={f.slug}
              onChange={(e) => setF({ ...f, slug: e.target.value })}
              className="bg-white/5 font-mono text-xs"
            />
          </div>
          <div className="grid gap-2">
            <Label>Type</Label>
            <select
              value={f.type}
              onChange={(e) => setF({ ...f, type: e.target.value as CategoryType })}
              className="flex h-9 w-full rounded-md border border-input bg-white/5 px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            >
              {CATEGORY_TYPES.map((t) => (
                <option key={t} value={t} className="bg-popover text-popover-foreground">
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={f.description}
              onChange={(e) => setF({ ...f, description: e.target.value })}
              className="bg-white/5"
            />
          </div>
          <Button
            onClick={() => update.mutate()}
            disabled={update.isPending}
            className="mt-2 bg-linear-to-r from-primary to-secondary text-primary-foreground"
          >
            {update.isPending ? "Updating…" : "Update Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}