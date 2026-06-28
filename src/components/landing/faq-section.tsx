import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Apakah ada kelas gratis untuk pemula?",
    a: "Ya! Kami menyediakan banyak kelas gratis seperti Hiragana Dasar, Katakana Dasar, dan beberapa bab dari Minna no Nihongo level N5 yang bisa diakses tanpa biaya.",
  },
  {
    q: "Apakah saya mendapatkan sertifikat setelah menyelesaikan kelas?",
    a: "Ya, setiap siswa yang menyelesaikan seluruh lesson dan quiz pada sebuah kelas akan mendapatkan sertifikat digital yang bisa diunduh dan dibagikan.",
  },
  {
    q: "Bagaimana cara mengakses kelas premium?",
    a: "Anda dapat membeli kelas premium satuan melalui halaman detail kelas. Setelah pembayaran terverifikasi, akses kelas akan otomatis terbuka di dashboard Anda.",
  },
  {
    q: "Apakah materi sesuai dengan kurikulum JLPT?",
    a: "Materi kami disusun berdasarkan buku Minna no Nihongo dan disesuaikan dengan kisi-kisi JLPT N5 hingga N3, termasuk kosakata, grammar, dan latihan soal.",
  },
  {
    q: "Bisakah saya belajar lewat HP?",
    a: "Tentu. Platform kami responsive dan dioptimalkan untuk diakses melalui smartphone, tablet, maupun desktop.",
  },
];

export function FaqSection() {
  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">Pertanyaan Umum</h2>
          <p className="mt-2 text-muted-foreground">Hal-hal yang sering ditanyakan oleh calon siswa kami</p>
        </div>

        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-6">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
