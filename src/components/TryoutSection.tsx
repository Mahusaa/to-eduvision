"use client"
import { Card, CardContent } from "./ui/card";
import { ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import type { FC, SVGProps } from "react";
import { redirect, useParams } from "next/navigation";

type Section = {
  title: string;
  icon: FC<SVGProps<SVGSVGElement>>; // Correctly typing Lucide React icons
  color: string;
  total: number;
  duration: number;
  code: string;
};


// Component
export function SectionCard({ section, isDisabled }: { section: Section; isDisabled: boolean }) {
  const params = useParams<{ userId: string; tryoutId: string }>()
  const handleStart = () => {
    redirect(`/${params.userId}/${params.tryoutId}/${section.code}`);
  };
  return (
    <Card className={`transition-all ${isDisabled ? 'opacity-50' : 'hover:shadow-md'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${section.color} bg-opacity-10`}>
              <section.icon className={`w-5 h-5 ${section.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{section.title}</h3>
              <p className="text-sm text-muted-foreground">{`${section.total} soal, ${section.duration} menit`}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className={`flex items-center ${isDisabled ? 'cursor-not-allowed' : 'group-hover:translate-x-1 transition-transform'}`}
            onClick={handleStart}
            disabled={isDisabled}
          >
            {isDisabled ? 'Waktu Habis' : 'Mulai'}
            {!isDisabled && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

