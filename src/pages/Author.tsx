import { motion } from "framer-motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function Author() {
  useDocumentTitle("The Author");

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[280px_1fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto"
          >
            <div className="absolute -inset-4 rounded-full bg-linear-to-br from-primary to-secondary opacity-40 blur-2xl" />
            <div className="relative grid h-64 w-64 place-items-center overflow-hidden rounded-full ring-1 ring-white/10 glass-strong">
              <span className="font-display text-7xl font-bold text-gradient">DK</span>
            </div>
          </motion.div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The Author</span>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              Hi, I'm the mind behind <span className="text-gradient">Dimension Knowledge</span>.
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
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
