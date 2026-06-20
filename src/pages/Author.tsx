import { motion } from "framer-motion";
import { ExternalLink, Youtube, BadgeCheck } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useYouTubeChannel } from "@/hooks/useYouTubeChannel";

export default function Author() {
  useDocumentTitle("The Author");

  const { data: channel, isLoading } = useYouTubeChannel();

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="grid items-start gap-12 lg:grid-cols-[400px_1fr]">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto w-full max-w-sm"
          >
            <div className="overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 shadow-2xl shadow-primary/10">
              {/* Banner */}
              <div className="relative h-48 overflow-hidden">
                {isLoading ? (
                  <div className="h-full w-full animate-pulse bg-white/5" />
                ) : channel?.bannerUrl ? (
                  <img
                    src={channel.bannerUrl}
                    alt="Channel banner"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-linear-to-br from-primary/40 via-secondary/30 to-accent/20" />
                )}
                {/* Banner overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

              </div>

              <div className="relative px-5">
                <div className="flex items-end justify-between">
                  <div className="-mt-12 relative">
                    <div className="h-24 w-24 rounded-full ring-4 ring-[oklch(0.14_0.025_270)] overflow-hidden bg-muted">
                      {isLoading ? (
                        <div className="h-full w-full animate-pulse bg-white/10" />
                      ) : channel?.thumbnailUrl ? (
                        <img
                          src={channel.thumbnailUrl}
                          alt={channel.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-linear-to-br from-primary/30 to-secondary/30">
                          <span className="font-display text-2xl font-bold text-gradient">{channel?.thumbnailUrl ?? ""}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <a
                    href={channel?.subscribeUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center leading-none gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-primary-foreground ring-1 ring-white/15 transition-all hover:bg-foreground/90"
                  >
                    Subscribe
                  </a>
                </div>
                {/* Name + Handle */}
                <div className="mt-3">
                  {isLoading ? (
                    <div className="space-y-2">
                      <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
                      <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-display text-lg font-bold">
                          {channel?.title ?? "Dimension Knowledge"}
                        </h2>
                        <BadgeCheck className="h-4.5 w-4.5 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {channel?.customUrl ?? "@dimensionknowledge"}
                      </p>
                    </>
                  )}
                </div>

                {/* Bio / Description */}
                <div className="mt-3">
                  {isLoading ? (
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-full animate-pulse rounded bg-white/5" />
                      <div className="h-3.5 w-3/4 animate-pulse rounded bg-white/5" />
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {channel?.description ?? "Exploring the future of technology, science, and ideas — one dimension at a time."}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-4 flex items-center gap-5 text-sm">
                  {isLoading ? (
                    <>
                      <div className="h-4 w-20 animate-pulse rounded bg-white/5" />
                      <div className="h-4 w-20 animate-pulse rounded bg-white/5" />
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="font-bold text-foreground">{channel?.subscriberCount ?? "0"}</span>{" "}
                        <span className="text-muted-foreground">Subscribers</span>
                      </div>
                      <div>
                        <span className="font-bold text-foreground">{channel?.videoCount ?? "0"}</span>{" "}
                        <span className="text-muted-foreground">Videos</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Link */}
                <div className="mt-3 mb-5 flex items-center gap-1.5 text-sm">
                  <ExternalLink className="h-3.5 w-3.5 text-primary" />
                  <a
                    href={channel?.customUrl ? `https://youtube.com/${channel.customUrl}` : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    youtube.com/{channel?.customUrl?.replace("@", "") ?? "channel"}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <span className="font-medium text-primary">The Author</span>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              Hi, I'm Jonh the mind behind <span className="text-gradient">{channel?.title}</span>.
            </h1>
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p>
                I'm a writer, researcher and filmmaker obsessed with the future. I've spent the
                last few years studying how the biggest ideas in science and technology actually
                get built — and turning what I learn into videos.
              </p>
              <p>
                Dimension Knowledge is my home for that work. It exists because the future is
                being shaped right now, and the people shaping it deserve a wider audience than
                a few hundred specialists.
              </p>
              <p>
                If you'd like to work together, talk to me through the{" "}
                <a href="/contact" className="text-primary hover:underline">contact page</a>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
