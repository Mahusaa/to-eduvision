import { Star, School, ArrowLeft, ChartLine } from 'lucide-react'
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import Link from "next/link"

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 text-center">
        {/* Hero Section */}
        <div className="mb-16 space-y-6">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <Star className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Segera Hadir!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fitur ini sedang dalam pengembangan dan akan segera tersedia. Nantikan pembaruan selanjutnya!
          </p>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </div>

        {/* Upcoming Features Section */}
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold">Fitur yang Akan Datang</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChartLine className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Grafik Perkembangan Tryout</h3>
                  <p className="text-muted-foreground">
                    Grafik Perkembangan Tryout menunjukkan tren pencapaian peserta dari waktu ke waktu, membantu memvisualisasikan kemajuan dan evaluasi hasil tryout secara mudah dan informatif
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <School className="w-8 h-8 text-orange-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Rasionalisasi Jurusan</h3>
                  <p className="text-muted-foreground">
                    Rasionalisasi Jurusan membantu peserta menentukan pilihan jurusan yang tepat berdasarkan analisis nilai tryout. Dengan mempertimbangkan kecocokan nilai, persyaratan jurusan, dan peluang kelulusan, peserta dapat membuat keputusan yang lebih terarah dan strategis
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


