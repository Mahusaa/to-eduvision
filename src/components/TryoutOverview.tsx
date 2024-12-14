
"use client"
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Timer, BookOpen, Brain, Calculator, Languages, School } from 'lucide-react'
import { SectionCard } from './TryoutSection'
import type { TryoutData, UserTime } from '~/server/db/schema'
import { useState, useEffect } from 'react'
import formatTime from '~/lib/format-time'
import { Loader2 } from 'lucide-react'

export default function TryoutOverview({ tryoutData, tryoutLeft, tryoutTime }: { tryoutData: TryoutData; tryoutLeft: Date | null; tryoutTime: UserTime }) {


  const {
    puTotal, kkTotal, pbmTotal, ppuTotal, puDuration, kkDuration, pbmDuration, ppuDuration,
    lbinTotal, lbingTotal, pmTotal, lbinDuration, lbingDuration, pmDuration, name
  } = tryoutData;


  const [remainingTime, setRemainingTime] = useState<number>(50000);



  useEffect(() => {
    if (tryoutLeft) {
      const tryoutEndDate = new Date(tryoutLeft);
      const now = Date.now();
      const remainingMilliseconds = tryoutEndDate.getTime() - now;
      if (!remainingMilliseconds) {
      }
      const initialTime = Math.max(0, Math.floor(remainingMilliseconds / 1000));
      setRemainingTime(initialTime);

      if (remainingMilliseconds > 0) {
        const timer = setInterval(() => {
          setRemainingTime((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      }
    }
  }, [tryoutLeft]);


  const sections = {
    tps: [
      {
        title: 'Penalaran Umum',
        total: puTotal,
        duration: puDuration,
        icon: Brain,
        color: 'text-blue-500',
        code: "pu",
        end: tryoutTime.puEnd,
      },
      {
        title: 'Kemampuan Kuantitatif',
        total: kkTotal,
        duration: kkDuration,
        icon: School,
        color: 'text-green-500',
        code: "kk",
        end: tryoutTime.kkEnd,
      },
      {
        title: 'Pemahaman Bacaan dan Menulis',
        total: pbmTotal,
        duration: pbmDuration,
        icon: Calculator,
        color: 'text-yellow-500',
        code: "pbm",
        end: tryoutTime.pbmEnd,
      },
      {
        title: 'Pengetahuan dan Pemahaman Umum',
        total: ppuTotal,
        duration: ppuDuration,
        icon: School,
        color: 'text-green-500',
        code: "ppu",
        end: tryoutTime.ppuEnd,
      },
    ],
    literasi: [
      {
        title: 'Literasi Bahasa Indonesia',
        total: lbinTotal,
        duration: lbinDuration,
        icon: Languages,
        color: 'text-red-500',
        code: "lbi",
        end: tryoutTime.lbindEnd,
      },
      {
        title: 'Literasi Bahasa Inggris',
        total: lbingTotal,
        duration: lbingDuration,
        icon: Languages,
        color: 'text-indigo-500',
        code: "lbing",
        end: tryoutTime.lbingEnd,
      },
      {
        title: 'Penalaran Matematika',
        total: pmTotal,
        duration: pmDuration,
        icon: Calculator,
        color: 'text-pink-500',
        code: "pm",
        end: tryoutTime.pmEnd,
      },
    ],
  };



  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">{name}</CardTitle>
              <div className="flex items-center gap-2 bg-primary-foreground/10 p-2 rounded-lg">
                <Timer className="w-5 h-5" />
                <span className="text-lg font-semibold">
                  {remainingTime === 50000 ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    remainingTime > 0 ? formatTime(remainingTime) : "Waktu habis!"
                  )}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="tps" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tps">TPS</TabsTrigger>
                <TabsTrigger value="literasi">Literasi</TabsTrigger>
              </TabsList>
              <TabsContent value="tps" className="mt-6">
                <div className="grid gap-4">
                  {sections.tps.map((section) => (
                    <SectionCard key={section.title} section={section} isDisabled={remainingTime > 0 ? false : true} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="literasi" className="mt-6">
                <div className="grid gap-4">
                  {sections.literasi.map((section) => (
                    <SectionCard key={section.title} section={section} isDisabled={remainingTime > 0 ? false : true} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

