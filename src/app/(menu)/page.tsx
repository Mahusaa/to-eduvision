import { ArrowRight, BarChart, BookOpen, Brain, Users } from 'lucide-react';
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center ">
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
            Welcome to Eduvision Tryout
          </h1>
          <p className="mt-3 max-w-md mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 md:mt-5 md:max-w-3xl">
            UTBK? Easy! Tryout ini bikin lo lebih siap, lebih pede, dan lebih chill ngadepin UTBK beneran!
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/dashboard">
                  Mulai Tryout <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </Button>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/sign-in">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className=" w-full bg-gradient-to-b from-white to-blue-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Kenapa Eduvision?</h2>
            <p className="mt-4 text-base sm:text-lg text-gray-500">
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
      </div>

      <div className="bg-blue-100 w-full">
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
  );
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
    description: 'Penilaian canggih dengan Item Response Theory (IRT) buat hasil yang akurat dan adil.',
    icon: Brain,
  },
  {
    name: 'Belajar Personal',
    description: 'Tes adaptif dan rencana belajar yang disesuaikan sama performa kamu.',
    icon: Users,
  },
];

