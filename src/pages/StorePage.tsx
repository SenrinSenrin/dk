import { useQuery } from "@/hooks/useData";
import { motion } from "framer-motion";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { fakeProducts } from "@/lib/fakeData";

export default function StorePage() {
  useDocumentTitle("Dimension Store");

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return fakeProducts;
      /*
      const { data } = await supabase
        .from("products")
        .select("*").eq("is_active", true)
        .order("created_at", { ascending: false });
      return data ?? [];
      */
    },
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-16">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Dimension Store</span>
        <h1 className="mt-3 font-display text-5xl font-bold">Curated for <span className="text-gradient">curious minds</span></h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Tools, books, and merch hand-picked from the worlds we explore. Every link is something we'd buy ourselves.
        </p>

        {products && products.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col overflow-hidden rounded-2xl glass ring-gradient"
              >
                <div className="aspect-video overflow-hidden bg-linear-to-br from-primary/20 to-secondary/20">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-muted-foreground"><ShoppingBag className="h-12 w-12" /></div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {p.category && <span className="text-xs uppercase tracking-wider text-primary">{p.category}</span>}
                  <h3 className="mt-1 font-display text-lg font-semibold">{p.name}</h3>
                  {p.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>}
                  <div className="mt-4 flex items-center justify-between">
                    {p.price ? (
                      <span className="font-display text-xl font-bold text-gradient">${Number(p.price).toFixed(2)}</span>
                    ) : <span />}
                    {p.buy_url && (
                      <a href={p.buy_url} target="_blank" rel="noreferrer"
                         className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-primary to-secondary px-3 py-1.5 text-sm font-medium text-primary-foreground">
                        Buy <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-2xl glass p-12 text-center text-sm text-muted-foreground">
            Store products will appear here. Admins can add them in the dashboard.
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
