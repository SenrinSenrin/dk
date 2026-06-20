import { useQuery } from "@/hooks/useData";
import { Link, useSearch } from "wouter";
import { useState, useMemo } from "react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { VideoCard } from "@/components/site/VideoCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { fakeVideos } from "@/lib/fakeData";
import { IconSearch } from "@tabler/icons-react";

export default function VideosPage() {
  useDocumentTitle("Videos");

  const searchString = useSearch();
  const params = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const category = params.get("category") ?? undefined;
  const qParam = params.get("q") ?? undefined;

  const [q, setQ] = useState(qParam ?? "");

  const { data: videos } = useQuery({
    queryKey: ["videos", category ?? null, qParam ?? null],
    queryFn: async () => {
      let data = fakeVideos;
      if (category) data = data.filter(v => v.category === category);
      if (qParam) data = data.filter(v => v.title.toLowerCase().includes(qParam.toLowerCase()));
      return data;
      /*
      let query = supabase
        .from("videos")
        .select("id,youtube_id,title,thumbnail_url,category")
        .order("published_at", { ascending: false });
      if (category) query = query.eq("category", category);
      if (qParam) query = query.ilike("title", `%${qParam}%`);
      const { data } = await query;
      return data ?? [];
      */
    },
  });

  const { data: cats } = useQuery({
    queryKey: ["videos", "categories"],
    queryFn: async () => {
      const set = new Set<string>();
      fakeVideos.forEach((v) => v.category && set.add(v.category));
      return Array.from(set);
      /*
      const { data } = await supabase.from("videos").select("category");
      const set = new Set<string>();
      (data ?? []).forEach((v) => v.category && set.add(v.category));
      return Array.from(set);
      */
    },
  });

  const buildSearch = (overrides: Record<string, string | undefined>) => {
    const next = new URLSearchParams(searchString);
    for (const [k, v] of Object.entries(overrides)) {
      if (v === undefined) next.delete(k);
      else next.set(k, v);
    }
    const s = next.toString();
    return s ? `/videos?${s}` : "/videos";
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-16">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">All <span className="text-gradient">videos</span></h1>
        <p className="mt-2 text-muted-foreground">Every story we've told, in one place.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.location.href = buildSearch({ q: q || undefined });
          }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search videos…"
              className="h-12 pl-10 bg-white/5 ring-1 ring-white/10"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 bg-linear-to-r from-primary to-secondary text-primary-foreground">Search</Button>
        </form>

        {cats && cats.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href={buildSearch({ category: undefined })}
              className={`rounded-full px-4 py-1.5 text-sm ring-1 transition-colors ${!category ? "bg-primary text-primary-foreground ring-primary" : "bg-white/5 ring-white/10 hover:bg-white/10"}`}
            >All</Link>
            {cats.map((c) => (
              <Link
                key={c}
                href={buildSearch({ category: c })}
                className={`rounded-full px-4 py-1.5 text-sm ring-1 transition-colors ${category === c ? "bg-primary text-primary-foreground ring-primary" : "bg-white/5 ring-white/10 hover:bg-white/10"}`}
              >{c}</Link>
            ))}
          </div>
        )}

        {videos && videos.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
          </div>
        ) : (
          <div className="mt-16 rounded-2xl glass p-12 text-center text-sm text-muted-foreground">
            No videos found.
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
