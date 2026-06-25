import { IconPlayerPlay } from "@tabler/icons-react";
import { motion } from "framer-motion";

export interface VideoCardData {
  id: string;
  youtube_id: string;
  title: string;
  thumbnail_url: string | null;
  category: string | null;
  // Populated from YouTube API at the page level
  yt_channel?: string;
  yt_channel_avatar?: string;
  yt_views?: string;
  yt_duration?: string;
  yt_time_ago?: string;
}

export function VideoCard({ video, index = 0 }: { video: VideoCardData; index?: number }) {
  const meta = [video.yt_views, video.yt_time_ago].filter(Boolean).join(" • ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <a
        href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative"
      >
        {/* Hover glow */}
        <div className="absolute -inset-3 z-0 rounded-2xl bg-foreground/10 opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100" />

        <div className="relative z-10">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden rounded-xl bg-black/10 ring-1 ring-white/10">
            <img
              src={video.thumbnail_url ?? `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
              alt={video.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.src.includes("hqdefault")) {
                  img.src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
                }
              }}
            />
            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />

            {video.yt_duration && (
              <div className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                {video.yt_duration}
              </div>
            )}

            <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-foreground/90">
                <IconPlayerPlay size="20" className="fill-primary-foreground text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-3 flex gap-3 pr-6">
            {video.yt_channel_avatar ? (
              <img
                src={video.yt_channel_avatar}
                alt={video.yt_channel ?? "channel"}
                className="h-9 w-9 shrink-0 rounded-full bg-white/10 object-cover"
              />
            ) : (
              <div className="h-9 w-9 shrink-0 rounded-full bg-white/10 animate-pulse" />
            )}

            <div className="flex flex-col min-w-0">
              <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground">
                {video.title}
              </h3>
              <p className="mt-1 text-[13px] text-muted-foreground truncate">
                {video.yt_channel ?? "YouTube Channel"}
              </p>
              {meta ? (
                <div className="text-[13px] text-muted-foreground">{meta}</div>
              ) : (
                <div className="mt-1 flex gap-2">
                  <div className="h-3 w-16 rounded bg-white/10 animate-pulse" />
                  <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}
