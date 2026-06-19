export const fakeVideos = [
  {
    id: "1",
    youtube_id: "jNQXAC9IVRw",
    title: "The Future of Artificial Intelligence",
    description: "A deep dive into how AI will change our world in the next 10 years.",
    category: "Artificial Intelligence",
    thumbnail_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
    published_at: new Date().toISOString(),
    is_featured: true,
  },
  {
    id: "2",
    youtube_id: "dQw4w9WgXcQ",
    title: "Exploring the Edge of the Universe",
    description: "What lies beyond the observable universe?",
    category: "Space & Cosmos",
    thumbnail_url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop",
    published_at: new Date(Date.now() - 86400000).toISOString(),
    is_featured: true,
  },
  {
    id: "3",
    youtube_id: "M7lc1UVf-VE",
    title: "Quantum Physics Explained",
    description: "The weird world of quantum mechanics made simple.",
    category: "Physics",
    thumbnail_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
    published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    is_featured: true,
  },
  {
    id: "4",
    youtube_id: "bHQqvYy5KYo",
    title: "Brain-Computer Interfaces",
    description: "How close are we to merging with machines?",
    category: "Future Tech",
    thumbnail_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    is_featured: false,
  }
];

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
