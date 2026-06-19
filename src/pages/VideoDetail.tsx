import { useQuery } from "@/hooks/useData";
import { Link, useParams } from "wouter";
import { ArrowLeft, Calendar } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { VideoCard } from "@/components/site/VideoCard";
import { supabase } from "@/integrations/supabase/client";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { fakeVideos } from "@/lib/fakeData";

export default function VideoDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: video, isLoading } = useQuery({
    queryKey: ["video", id],
    queryFn: async () => {
      const v = fakeVideos.find(v => v.id === id);
      if (!v) throw new Error("Video not found");
      return v;
      /*
      const { data, error } = await supabase.from("videos").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data;
      */
    },
    enabled: !!id,
  });

  useDocumentTitle(video?.title ?? "Video");

  const { data: related } = useQuery({
    queryKey: ["videos", "related", video?.category, id],
    enabled: !!video?.category,
    queryFn: async () => {
      return fakeVideos.filter(v => v.category === video!.category && v.id !== id).slice(0, 4);
      /*
      const { data } = await supabase
        .from("videos")
        .select("id,youtube_id,title,thumbnail_url,category")
        .eq("category", video!.category!)
        .neq("id", id!)
        .limit(4);
      return data ?? [];
      */
    },
  });

  if (isLoading) {
    return <SiteLayout><div className="mx-auto max-w-5xl px-4 py-32"><div className="aspect-video w-full animate-pulse rounded-2xl bg-white/5" /></div></SiteLayout>;
  }

  if (!video) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-32 text-center">
          <h1 className="font-display text-3xl font-bold">Video not found</h1>
          <Link href="/videos" className="mt-4 inline-block text-primary hover:underline">Back to videos</Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article className="mx-auto max-w-5xl px-4 pb-16 pt-12">
        <Link href="/videos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All videos
        </Link>
        <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-white/10 glow-cyan">
          <div className="aspect-video">
            <iframe
              src={youtubeEmbedUrl(video.youtube_id)}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
        <div className="mt-8">
          {video.category && (
            <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/30">
              {video.category}
            </span>
          )}
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{video.title}</h1>
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />
              {new Date(video.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          {video.description && (
            <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-muted-foreground">{video.description}</p>
          )}
        </div>

        {related && related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold">More in {video.category}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
            </div>
          </section>
        )}
      </article>
    </SiteLayout>
  );
}
