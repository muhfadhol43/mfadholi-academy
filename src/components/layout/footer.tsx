import Link from "next/link";
import { Sparkles, Instagram, Youtube, Mail } from "lucide-react";
import { siteConfig, navLinks } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">
              Mfadholi<span className="text-primary">.Dev</span> Academy
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">{siteConfig.description}</p>
          <div className="flex gap-3 pt-2">
            <Link href={siteConfig.links.instagram} className="text-muted-foreground hover:text-primary">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href={siteConfig.links.youtube} className="text-muted-foreground hover:text-primary">
              <Youtube className="h-5 w-5" />
            </Link>
            <Link href="mailto:hello@mfadholi.dev" className="text-muted-foreground hover:text-primary">
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Navigasi</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Level JLPT</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/courses?level=N5" className="hover:text-foreground">JLPT N5</Link></li>
            <li><Link href="/courses?level=N4" className="hover:text-foreground">JLPT N4</Link></li>
            <li><Link href="/courses?level=N3" className="hover:text-foreground">JLPT N3</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Perusahaan</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">Tentang Kami</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Kontak</Link></li>
            <li><Link href="/privacy" className="hover:text-foreground">Kebijakan Privasi</Link></li>
            <li><Link href="/terms" className="hover:text-foreground">Syarat & Ketentuan</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Mfadholi.Dev Academy. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
