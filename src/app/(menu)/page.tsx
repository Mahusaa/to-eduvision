import { ArrowRight, BarChart, BookOpen, Brain, Users, CheckCircle, Phone } from 'lucide-react';
import Link from "next/link";
import { Button } from "~/components/ui/button";
import Image from 'next/image';
import tryoutImage from "public/tryout.png"
import { Card, CardTitle, CardHeader, CardContent } from '~/components/ui/card';
import { Twitter, Instagram, Linkedin } from "lucide-react"


export default async function HomePage() {
  const targetDate = new Date('2025-04-23');
  const currentDate = new Date();
  targetDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  const timeDifference = targetDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
  const encodedWhatsapp = "https://wa.me/6282261995067?text=Kak%20saya%20tertarik%20dengan%20produk%20paket%20super%20intensif%20dengan%20code:cdaaptnia"
  return (
    <>
      <main className="flex-1">
        <section className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2">
          <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <span className="font-medium">🚀 <span className="font-bold underline">Diskon 50%</span> untuk Paket Super Intensif  UTBK/SNBT! </span>
            </div>
            <a href="#pricing" className="text-sm bg-white text-blue-600 px-4 py-1 rounded-full font-semibold hover:bg-blue-50 transition-colors">
              🔥 Daftar sekarang! 🔥
            </a>
          </div>
        </section>
        <section className="w-full py-12 relative">
          <div className="px-4 md:px-6 lg:py-10 xl:py-28">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-primary">
                    Siap UTBK dengan Eduvision
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl dark:text-gray-400">
                    UTBK? Easy! Tryout ini bikin lo lebih siap, lebih pede, dan lebih chill ngadepin UTBK beneran!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                    <Link href="#pricing">Mulai aja dulu</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/sign-in">Punya Akun?</Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end relative">
                <div className="relative">
                  <Image
                    src={tryoutImage}
                    alt="Eduvision UTBK application on laptop and phone"
                    placeholder="blur"
                  />

                  {/* Arrow 1: Laptop screen to first feature */}
                  <div className="absolute top-1/4 left-0 hidden lg:block">
                    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g transform="translate(40, 0)">

                        <path d="M200 40 Q60 100 20 140" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 5" fill="none" />


                        <g transform="rotate(40, 10, 135)">
                          <path d="M20 140L28 132M20 140L12 132" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
                        </g>

                      </g>

                      <text x="0" y="160" fill="#3B82F6" fontSize="14" fontWeight="bold" fontFamily="Arial, sans-serif">
                        Pembahasan Detail
                      </text>
                    </svg>
                  </div>

                  {/* Arrow 2: Laptop keyboard to second feature */}
                  <div className="absolute top-[8%] left-[32%] hidden lg:block">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M60 20L60 80" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 5" />
                      <path d="M60 20L55 30M60 20L65 30" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                      <g>
                        <text x="13" y="10" fill="#3B82F6" fontSize="14" fontWeight="bold" fontFamily="system-ui">Soal mirip UTBK</text>
                      </g>
                    </svg>
                  </div>

                  {/* Arrow 3: Phone to third feature */}
                  <div className="absolute top-[14%] right-12 hidden lg:block">
                    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M60 80 Q100 70 130 110" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 5" fill="none" />

                      <g transform="rotate(-25, 130, 110)">
                        <path d="M130 110L138 102M130 110L122 102" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                      </g>
                      <text x="80" y="140" fill="#3B82F6" fontSize="14" fontWeight="bold">
                        <tspan x="55" dy="0">Pemeringkatan</tspan>
                        <tspan x="80" dy="18">Nasional</tspan>
                      </text>
                    </svg>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-6 text-blue-600">
                Kenapa Eduvision ?
              </h2>
              <p className="text-base sm:text-lg text-gray-500">
                Platform kita punya fitur kece banget yang bikin persiapan UTBK lo makin maksimal!
              </p>
            </div>
            <dl className="mt-10 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <feature.icon className="absolute h-6 w-6 text-blue-500" aria-hidden="true" />
                    <p className="ml-9 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  </dt>
                  <dd className="mt-2 ml-9 text-sm sm:text-base text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-blue-50">
          <div className="px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-blue-600">
              Pilih paket dan Raih PTN Impian!
            </h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Paket Gratis</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-2">
                    <span className="text-lg font-semibold text-green-600">Gratis</span>
                    <span className="text-sm text-muted-foreground ml-2">(100 orang pertama)</span>
                  </div>
                  <div className="mb-4 flex flex-col">
                    <span className="text-xl font-bold line-through text-gray-400">Rp 50.000</span>
                    <span className="text-3xl font-bold text-blue-600">Rp 0</span>
                    <span className="text-muted-foreground">/bulan</span>
                  </div>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <ul className="space-y-2 mb-6">
                    {[
                      "Tryout dengan format UTBK/SNBT",
                      "Analisa subtest dan soal",
                      "Pemeringkatan nasional",
                      "Pembahasan secara detail",
                      "Grup belajar se-Indonesia",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full " variant="secondary">
                    <Link href="https://docs.google.com/forms/d/e/1FAIpQLScjmAsCy7_QD-2KXkTb_UxA9CWBK8eKjpILgRFY9A65rXSEKQ/viewform">
                      Daftar Gratis
                    </Link>
                  </Button>
                </div>
              </Card>
              <Card className="relative overflow-hidden border-blue-600 border-2">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  BEST VALUE!
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Paket Super Intensif UTBK/SNBT</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <span className="text-lg font-semibold text-green-600">Potongan 50%</span>
                    <span className="text-sm text-muted-foreground ml-2">(Penawaran Terbatas)</span>
                  </div>
                  <div className="mb-4 flex flex-col">
                    <span className="text-xl font-bold line-through text-gray-400">Rp 549.000</span>
                    <span className="text-3xl font-bold text-blue-600">Rp 279.000</span>
                    <span className="text-muted-foreground">/sampai utbk</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {[
                      "Semua yang ada di paket gratis",
                      "Pembahasan soal kategori sulit",
                      "Live Class UTBK dan Akses Rekaman",
                      "Pembelajaran langsung oleh Alumni & Mahasiswa UI",
                      "Webinar dan Konsultasi bersama Mahasiswa UI",
                      "Special E-Book SNBT 2025",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={encodedWhatsapp}>
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Daftar Sekarang</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <div className="bg-gradient-to-b from-blue-50 to-blue-100 w-full">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                <span className="block">Siap ngadepin UTBK?</span>
                <span className="block text-blue-600">Start your journey with Eduvision today.</span>
              </h2>
              <div className="mt-8 flex justify-center lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="https://bit.ly/TryOutEduvision">
                      Daftar sekarang aja ! <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </Button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-blue-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-2xl font-bold text-primary">Connect with Us</h2>
            <p className="text-gray-600 text-center">Stay updated with our latest news and offers</p>
            <div className="flex space-x-4">
              <SocialLink href="https://wa.me/6282261995067" icon={<Phone size={24} />} label="Phone" />
              <SocialLink href="https://twitter.com/eduvisionid" icon={<Twitter size={24} />} label="Twitter" />
              <SocialLink href="https://instagram.com/eduvisionid" icon={<Instagram size={24} />} label="Instagram" />
              <SocialLink
                href="https://www.linkedin.com/company/eduvision-id/about/"
                icon={<Linkedin size={24} />}
                label="LinkedIn"
              />
            </div>
            <p className="text-sm text-gray-500 mt-4">
              &copy; {new Date().getFullYear()} Eduvision. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="text-gray-600 hover:text-primary transition-colors duration-300" aria-label={label}>
      {icon}
    </Link>
  )
}


const features = [
  {
    name: 'Pemeringkatan Nasional',
    description: 'Bandingin performa kamu dengan siswa seluruh Indonesia dan pantau progres belajarmu.',
    icon: BarChart,
  },
  {
    name: 'Penjelasan Lengkap',
    description: 'Solusi dan penjelasan detail untuk tiap soal, biar pemahamanmu makin mantap.',
    icon: BookOpen,
  },
  {
    name: 'Penilaian Model IRT',
    description: 'Penilaian canggih dengan Item Response Theory (IRT) sesuai format UTBK',
    icon: Brain,
  },
  {
    name: 'Grup Belajar',
    description: 'Grup belajar UTBK yang membantu kamu menghadapi UTBK!',
    icon: Users,
  },
];

