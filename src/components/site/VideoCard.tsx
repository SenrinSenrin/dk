import { IconPlayerPlay } from "@tabler/icons-react";
import { motion } from "framer-motion";

export interface VideoCardData {
  id: string;
  youtube_id: string;
  title: string;
  thumbnail_url: string | null;
  category: string | null;
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
        className="group block overflow-hidden rounded-2xl glass ring-gradient transition-transform hover:-translate-y-1"
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={video.thumbnail_url ?? `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
            alt={video.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent" />
          <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/90 shadow-[0_0_30px_oklch(0.78_0.18_210/0.7)]">
              <IconPlayerPlay className="h-6 w-6 fill-primary-foreground text-primary-foreground" />
            </div>
          </div>
          {video.category && (
            <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white ring-1 ring-white/15 backdrop-blur">
              {video.category}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-gradient">
            {video.title}
          </h3>
        </div>
      </a>
    </motion.div>
  );
}
