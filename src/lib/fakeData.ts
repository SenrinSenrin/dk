import { supabase } from "@/integrations/supabase/client";
import { extractYouTubeId, youtubeThumbnail, fetchYouTubeVideoDetails } from "./youtube";

const fakeVideosData = [
  {
    id: "1",
    youtube_url: "https://youtu.be/VSfpjU_FWog?si=8V6IbplI7gHQdMsY",
    category: "Artificial Intelligence",
    is_featured: true,
  },
  {
    id: "2",
    youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Space & Cosmos",
    is_featured: true,
  },
  {
    id: "3",
    youtube_url: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
    category: "Physics",
    is_featured: true,
  },
  {
    id: "4",
    youtube_url: "https://www.youtube.com/watch?v=bHQqvYy5KYo",
    category: "Future Tech",
    is_featured: false,
  }
];

export async function getFakeVideos() {
  return Promise.all(
    fakeVideosData.map(async (v) => {
      const youtube_id = extractYouTubeId(v.youtube_url) || "";
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      const meta = await fetchYouTubeVideoDetails(youtube_id, apiKey);
      
      return {
        ...v,
        youtube_id,
        thumbnail_url: youtubeThumbnail(v.youtube_url, "hq"),
        title: meta?.title ?? "Loading...",
        author_name: meta?.author_name ?? "Dimension Knowledge",
        author_avatar: meta?.author_avatar ?? undefined,
        views: meta?.views,
        duration: meta?.duration,
        time_ago: meta?.time_ago,
      };
    })
  );
}

export const fakeProducts = [
  {
    id: "1",
    name: "Dimension Hoodie",
    description: "Premium heavyweight cotton hoodie with our subtle embroidered logo.",
    price: 65.00,
    category: "Merch",
    image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
    buy_url: "#",
  },
  {
    id: "2",
    name: "Cosmos Coffee Mug",
    description: "Matte black ceramic mug perfect for late night coding or stargazing.",
    price: 24.00,
    category: "Accessories",
    image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop",
    buy_url: "#",
  },
  {
    id: "3",
    name: "Quantum Field Theory Poster",
    description: "Beautifully designed educational poster explaining the basics of QFT.",
    price: 35.00,
    category: "Art",
    image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop",
    buy_url: "#",
  }
];
