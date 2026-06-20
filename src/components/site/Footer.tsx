import { Link } from "wouter";
import { IconBrandInstagram, IconBrandX, IconBrandYoutube, IconSparkle2 } from '@tabler/icons-react';

export function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-white/5 bg-linear-to-b from-transparent to-black/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-primary to-secondary">
              <IconSparkle2 className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="font-display text-lg font-bold">Dimension Knowledge</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Exploring the future of technology, science, and ideas — one dimension at a time.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/videos" className="hover:text-foreground">Videos</Link></li>
            <li><Link href="/store" className="hover:text-foreground">Store</Link></li>
            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
            <li><Link href="/author" className="hover:text-foreground">Author</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Connect</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/contact" className="hover:text-foreground">Work with us</Link></li>
            <li><a href="#" className="hover:text-foreground">Press</a></li>
            <li><a href="#" className="hover:text-foreground">Newsletter</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Follow</h4>
          <div className="mt-4 flex gap-2">
            {[IconBrandYoutube, IconBrandX, IconBrandInstagram].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Dimension Knowledge. All rights reserved.
      </div>
    </footer>
  );
}
