import { IconPlayerPlay } from "@tabler/icons-react";
import { motion } from "framer-motion";

export interface VideoCardData {
  id: string;
  youtube_id: string;
  title: string;
  thumbnail_url: string | null;
  category: string | null;
  author_name?: string;
  author_avatar?: string;
  views?: string;
  duration?: string;
  time_ago?: string;
}

export function VideoCard({ video, index = 0 }: { video: VideoCardData; index?: number }) {
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
        {/* Hover Background Effect */}
        <div className="absolute -inset-3 z-0 rounded-2xl bg-foreground/10 opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100" />
        <div className="relative z-10">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-black/10 ring-1 ring-white/10">
            <img
              src={video.thumbnail_url ?? `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
              alt={video.title}
              loading="lazy"
              className="h-full w-full object-cover"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.src.includes("hqdefault")) {
                  img.src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
                }
              }}
            />
            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />

            {video.duration && (
              <div className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                {video.duration}
              </div>
            )}

            <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-foreground/90">
                <IconPlayerPlay size="20" className="fill-primary-foreground text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Video Info Area */}
          <div className="mt-3 flex gap-3 pr-6">
            {video.author_avatar ? (
              <img src={video.author_avatar} alt="" className="h-9 w-9 rounded-full bg-white/10 object-cover" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-white/10" />
            )}

            <div className="flex flex-col">
              <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground">
                {video.title}
              </h3>

              <p className="mt-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                {video.author_name ?? "YouTube Channel"}
              </p>

              <div className="text-[13px] text-muted-foreground">
                {video.views ?? "0 views"} • {video.time_ago ?? "Just now"}
              </div>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}
