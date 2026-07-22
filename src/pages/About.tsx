import { motion } from "framer-motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { IconBolt, IconGlobe, IconLayersIntersect, IconTelescope } from "@tabler/icons-react";

const pillars = [
  { icon: IconTelescope, title: "Depth over noise", text: "We pick fewer subjects, but dig deeper. Every video is research-first." },
  { icon: IconLayersIntersect, title: "Visual-first storytelling", text: "Motion, sound, and design carry the idea as much as the script." },
  { icon: IconBolt, title: "Built for curiosity", text: "If a 14-year-old future engineer can't follow it, we re-write it." },
  { icon: IconGlobe, title: "Global lens", text: "Ideas don't have borders — neither does our reporting." },
];

export default function About() {
  useDocumentTitle("About");

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-16 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">About</span>
        <h1 className="mt-3 font-display text-5xl font-bold sm:text-6xl">
          Knowledge for the <span className="text-gradient">next dimension</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
          Dimension Knowledge is a YouTube channel and digital studio exploring the
          frontiers of technology, science, and ideas — told the way they deserve to be told.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-5 sm:grid-cols-2">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl glass p-6 ring-gradient"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-linear-to-br from-primary to-secondary text-primary-foreground">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-3xl glass-strong p-10">
          <h2 className="font-display text-2xl font-bold">Our mission</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We believe knowledge about the future shouldn't be locked behind paywalls or buried in
            academic papers. We translate the most important ideas of our time — from quantum
            computing to neuroscience to space exploration — into stories anyone can enjoy and
            everyone can learn from.
          </p>
        </div> 
      </section>
    </SiteLayout>
  );
}
