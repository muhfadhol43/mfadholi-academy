export const siteConfig = {
  name: "Mfadholi.Dev Academy",
  description:
    "Platform belajar bahasa Jepang online. Video pembelajaran berkualitas, materi terstruktur, latihan interaktif, dan sertifikat untuk perjalanan belajarmu.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    instagram: "https://instagram.com/mfadholidev",
    youtube: "https://youtube.com/@mfadholidev",
  },
};

export const navLinks = [
  { title: "Beranda", href: "/" },
  { title: "Kelas", href: "/courses" },
  { title: "JLPT", href: "/courses?category=jlpt" },
  { title: "Blog", href: "/blog" },
  { title: "Harga", href: "/pricing" },
];
