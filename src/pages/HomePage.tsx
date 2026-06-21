import { useQuery } from "@/hooks/useData";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/site/SiteLayout";
import { VideoCard } from "@/components/site/VideoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getFakeVideos } from "@/lib/fakeData";
import { IconArrowRight, IconAtom, IconBrain, IconCpu, IconMail, IconRocket, IconSparkle2 } from "@tabler/icons-react";

const categories = [
  { name: "Artificial Intelligence", icon: IconBrain, hue: "from-primary to-secondary" },
  { name: "Space & Cosmos", icon: IconRocket, hue: "from-secondary to-accent" },
  { name: "Physics", icon: IconAtom, hue: "from-accent to-primary" },
  { name: "Future Tech", icon: IconCpu, hue: "from-primary to-accent" },
];

export default function HomePage() {
  useDocumentTitle();

  const featured = useQuery({
    queryKey: ["videos", "featured"],
    queryFn: async () => {
      // const vids = await getFakeVideos();
      // return vids.filter((v) => v.is_featured).slice(0, 3);
    
      const { data } = await supabase
        .from("videos")
        .select("id,youtube_id,title,thumbnail_url,category")
        .eq("is_featured", true)
        .order("published_at", { ascending: false })
        .limit(3);
      return data ?? [];
      
    },
  });

  const latest = useQuery({
    queryKey: ["videos", "latest"],
    queryFn: async () => {
      // const vids = await getFakeVideos();
      // return vids.slice(0, 8);
      
      const { data } = await supabase
        .from("videos")
        .select("id,youtube_id,title,thumbnail_url,category")
        .order("published_at", { ascending: false })
        .limit(8);
      return data ?? [];
      
    },
  });

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-secondary/20 blur-[120px] animate-pulse-glow" />
          <div className="absolute right-1/4 top-1/2 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-muted-foreground ring-1 ring-white/10">
              <IconSparkle2 className="h-3.5 w-3.5 text-primary" />
              Welcome to the next dimension
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
              Knowledge from <br />
              <span className="text-gradient">another dimension</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
              Cinematic deep-dives into the future of technology, science, AI, and the cosmos —
              told the way they deserve to be told.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-linear-to-r from-primary to-secondary text-primary-foreground glow-cyan hover:opacity-95">
                <Link href="/videos">
                  Explore videos <IconArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/15 bg-white/5 backdrop-blur hover:bg-white/10">
                <Link href="/about">About the channel</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED VIDEOS */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeader eyebrow="Featured" title="Hand-picked stories" />
        {featured.data && featured.data.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.data.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
          </div>
        ) : (
          <EmptyState text="Featured videos will appear here once added in the admin dashboard." />
        )}
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeader eyebrow="Categories" title="Pick your dimension" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/videos?category=${encodeURIComponent(c.name)}`}
                className="group relative block overflow-hidden rounded-2xl glass p-6 ring-gradient transition-transform hover:-translate-y-1"
              >
                <div className={`mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-linear-to-br ${c.hue} text-primary-foreground`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold">{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Browse all →</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LATEST */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between">
          <SectionHeader eyebrow="Latest" title="New from the channel" />
          <Link href="/videos" className="hidden text-sm font-medium text-primary hover:underline sm:block">
            View all →
          </Link>
        </div>
        {latest.data && latest.data.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latest.data.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
          </div>
        ) : (
          <EmptyState text="No videos yet. Sign in as admin and add one — paste a YouTube URL and we'll do the rest." />
        )}
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <Newsletter />
      </section>
    </SiteLayout>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</div>
      <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{title}</h2>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-10 rounded-2xl glass p-10 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-3xl glass-strong p-10 sm:p-14"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground ring-1 ring-white/10">
            <IconMail className="h-3.5 w-3.5 text-primary" /> Newsletter
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Get new episodes <span className="text-gradient">before anyone else</span>
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            One thoughtful email when a new video drops. No spam — ever.
          </p>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success("You're on the list."); setEmail(""); }}
          className="flex w-full max-w-md gap-2"
        >
          <Input
            type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@dimension.dev"
            className="h-12 bg-white/5 ring-1 ring-white/10"
          />
          <Button type="submit" size="lg" className="h-12 bg-linear-to-r from-primary to-secondary text-primary-foreground">
            Subscribe
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
