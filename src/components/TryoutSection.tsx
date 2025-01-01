"use client"
import { Card, CardContent } from "./ui/card";
import { ChevronRight, Files, Timer } from "lucide-react";
import { Button } from "./ui/button";
import type { FC, SVGProps } from "react";
import { redirect, useParams } from "next/navigation";

type Section = {
  title: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  color: string;
  total: number;
  duration: number;
  code: string;
  end: Date | null;
  sectionId: number;
};

// Component
export function SectionCard({ section, isDisabled }: { section: Section; isDisabled: boolean }) {
  const now = new Date();
  let disableCondition = false;
  let buttonText = "Mulai";

  if (isDisabled) {
    disableCondition = true;
    buttonText = "Waktu Tryout Habis";  // If `isDisabled` is true, all subtests are disabled
  } else if (section.end) {
    if (new Date(section.end) < now) {
      disableCondition = true;
      buttonText = "Selesai";  // If the end time has passed, disable and show "Waktu Habis"
    } else {
      buttonText = "Lanjutkan";  // If end time is in the future, we can continue
    }
  } else {
    disableCondition = false;
    buttonText = "Mulai";
  }

  const params = useParams<{ userId: string; tryoutId: string }>();
  const handleStart = async () => {
    if (!section.end) {
      try {
        const response = await fetch("/api/start-subtest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sectionId: section.sectionId, // Use the section's code or ID
            duration: section.duration, // Duration in minutes
            subtest: section.code
          }),
        });

        const data = await response.json() as { success: boolean; end: string | Date };
        if (data.success) {
          console.log("Subtest end updated:", data.end);
        } else {
          console.error("Failed to update subtest end");
          return; // Prevent redirect on error
        }
      } catch (error) {
        console.error("Error updating subtest end:", error);
        return; // Prevent redirect on error
      }
    }

    // Redirect to the section page
    redirect(`/${params.userId}/${params.tryoutId}/${section.code}`);
  };


  return (
    <Card className={`transition-all ${disableCondition ? 'opacity-50' : 'hover:shadow-md'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${section.color} bg-opacity-10`}>
              <section.icon className={`w-5 h-5 ${section.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{section.title}</h3>
              <p className="text-sm text-muted-foreground flex flex-row items-center gap-1"><Files className="w-3 h-3" />{`${section.total} soal,`}<Timer className="w-3 h-3" />{`${section.duration} menit`}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className={`flex items-center ${isDisabled ? 'cursor-not-allowed' : 'group-hover:translate-x-1 transition-transform'}`}
            onClick={handleStart}
            disabled={disableCondition}
          >
            {buttonText}
            {!disableCondition && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

