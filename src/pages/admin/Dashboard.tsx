import { useQuery } from "@/hooks/useData";
import { Video, FileText, ShoppingBag, MessageSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const stats = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [v, a, p, m] = await Promise.all([
        supabase.from("videos").select("id,published_at,category"),
        supabase.from("articles").select("id"),
        supabase.from("products").select("id"),
        supabase.from("contact_messages").select("id,is_read"),
      ]);
      return {
        videos: v.data ?? [],
        articles: a.data?.length ?? 0,
        products: p.data?.length ?? 0,
        messages: m.data ?? [],
      };
    },
  });

  const byCategory = (() => {
    const map = new Map<string, number>();
    (stats.data?.videos ?? []).forEach((v) => map.set(v.category ?? "Other", (map.get(v.category ?? "Other") ?? 0) + 1));
    return Array.from(map, ([category, count]) => ({ category, count }));
  })();

  const cards = [
    { label: "Videos", value: stats.data?.videos.length ?? 0, icon: Video },
    { label: "Articles", value: stats.data?.articles ?? 0, icon: FileText },
    { label: "Products", value: stats.data?.products ?? 0, icon: ShoppingBag },
    { label: "Unread messages", value: (stats.data?.messages ?? []).filter((m) => !m.is_read).length, icon: MessageSquare },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of Dimension Knowledge.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl glass p-5 ring-gradient">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 font-display text-3xl font-bold text-gradient">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl glass p-6">
        <h2 className="font-display text-lg font-semibold">Videos by category</h2>
        <div className="mt-6 h-72">
          {byCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.18 210)" />
                    <stop offset="100%" stopColor="oklch(0.65 0.22 305)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="category" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "rgba(20,20,30,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Bar dataKey="count" fill="url(#g)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-full place-items-center text-sm text-muted-foreground">No videos yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
