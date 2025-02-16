'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, CircleStop, ZoomIn, ZoomOut, AlertTriangle, ChevronUp } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Label } from '~/components/ui/label';
import type { AllProblems } from '~/server/db/schema';
import { TryoutTimer } from './tryout-interface/time';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import LogoSVG from 'public/Logo';
import { FinishTryoutDialog } from './tryout-interface/FinishTryoutDialog';
import { processMathInHtml } from '~/lib/math-utils';
import { useToast } from '~/hooks/use-toast';
import { breakpoints, useMediaQuery } from '~/hooks/use-media-query';
import { ScrollArea } from './ui/scroll-area';
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription } from './ui/drawer';


const answerSubmissionSchema = z.object({
  answerArray: z.array(z.string().nullable()), // Array of strings or nulls
  subtest: z.string(), // Subtest code must be a string
  userId: z.string(), // User ID must be a string
  tryoutId: z.number(), // Tryout ID must be a number
})

const endTimeSchema = z.object({
  subtest: z.string(), // Subtest code must be a string
  userId: z.string(), // User ID must be a string
  tryoutId: z.number(), // Tryout ID must be a number
})

export default function TryoutInterface({
  allProblem,
  subtestProps,
  subtestTime,
  tryoutId,
  userId,
  subtestCode,
  userName,
}: {
  allProblem: AllProblems[];
  subtestProps: string;
  subtestTime: Date | null;
  tryoutId: number;
  userId: string;
  subtestCode: string,
  userName?: string | null,
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const isDesktop = useMediaQuery(breakpoints.lg)
  const { toast } = useToast();
  const router = useRouter();
  const problemDescRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to the problemDesc when the question changes
    if (problemDescRef.current) {
      problemDescRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentQuestionIndex]);
  const totalQuestions = allProblem.length;

  const localStorageKey = `tryout-${tryoutId}-${userId}-${subtestProps}-answers`;

  useEffect(() => {
    setIsClient(true);
    const savedAnswers = JSON.parse(localStorage.getItem(localStorageKey) ?? '[]') as (string | null)[];
    setAnswers(savedAnswers.length ? savedAnswers : new Array(totalQuestions).fill(null));
  }, [localStorageKey, totalQuestions]);


  useEffect(() => {
    if (isClient) {
      localStorage.setItem(localStorageKey, JSON.stringify(answers));
    }
  }, [answers, localStorageKey, isClient]);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleQuestionChange = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel((prevZoom) => {
      const newZoom = direction === 'in' ? prevZoom + 10 : prevZoom - 10;
      return Math.min(Math.max(newZoom, 50), 200);
    });
  };

  const handleSave = async () => {
    try {
      const submissionData = {
        answerArray: answers,
        subtest: subtestCode,
        userId,
        tryoutId: Number(tryoutId),
      };
      answerSubmissionSchema.parse(submissionData);

      const response = await fetch('/api/submit-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const data = await response.json() as Promise<{ message: string }>;
        console.log('Response from server:', data);
      } else {
        console.error('Error submitting answers');
        alert('Failed to submit answers.');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Failed to submit",
          description: "Check your connection",
          variant: 'destructive'
        })
        alert('Validation failed. Please check your data.');
      } else {
        toast({
          title: "Failed to submit",
          description: "Check your connection",
          variant: 'destructive'
        })
      }
    }
  }
  const MobileQuestNav = () => (
    <ScrollArea className="h-[300px] w-full">
      <div className="grid grid-cols-5 gap-2 p-4">
        {allProblem.map((problem, index) => (
          <Button
            key={problem.id}
            variant={index === currentQuestionIndex ? 'default' : 'outline'}
            className={`
            h-10 w-full
             hover:shadow-md
            ${answers[index] ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500" : ""}
            ${index === currentQuestionIndex ? "ring-1 ring-offset-1 ring-primary" : ""}
            ${!answers[index] && index !== currentQuestionIndex ? "hover:border-primary/50" : ""}
          `}
            onClick={() => handleQuestionChange(index)}
          >
            {problem.questionNumber}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )

  const handleTimeUp = useCallback(async () => {
    try {
      const endTimeData = {
        tryoutId: Number(tryoutId),
        subtest: subtestCode,
        userId,
      }
      endTimeSchema.parse(endTimeData);

      const response = await fetch('/api/update-subtestend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(endTimeData),
      });
      router.push(`/${userId}/${tryoutId}`);
      if (!response.ok) {
        console.error('Failed to record end time:', await response.text());
      } else {
        console.log('End time recorded successfully');
      }
    } catch (error) {
      console.error("error ngirim", error)
    }
  }, [router, userId, tryoutId, subtestCode]);

  const handleSubmit = async () => {
    setIsSubmiting(true)
    try {
      const submissionData = {
        answerArray: answers,
        subtest: subtestCode,
        userId,
        tryoutId: Number(tryoutId),
      };
      answerSubmissionSchema.parse(submissionData);

      const response = await fetch('/api/submit-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const data = await response.json() as Promise<{ message: string }>;
        console.log('Response from server:', data);
        setIsSubmiting(false)
        localStorage.removeItem(localStorageKey);
        await handleTimeUp()
      } else {
        console.error('Error submitting answers');
        alert('Failed to submit answers.');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
        alert('Validation failed. Please check your data.');
      } else {
        console.error('Error during submission:', error);
        alert('An error occurred while submitting answers.');
      }
    }
  };

  if (!isClient) {
    return null;
  }

  const currentQuestion = allProblem[currentQuestionIndex];
  const options: string[] = currentQuestion?.option
    ? (JSON.parse(currentQuestion.option) as string[])
    : [];
  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b p-4 sticky top-0 bg-white z-10">
        <div className="flex flex-wrap items-center justify-between mx-auto">
          {/* Logo and Title Section */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span>
              <LogoSVG className="text-primary w-8 h-8" />
            </span>
            <span className="text-2xl font-bold text-primary hidden md:block">EDUVISION</span>
          </div>

          {/* Warning Sign Section */}
          {isDesktop && (
            <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-full">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-medium">Jangan tutup halaman ini sebelum Selesai/Waktu Habis</span>
            </div>
          )}

          {/* Button Section */}
          <div className="mt-2 md:mt-0">
            <FinishTryoutDialog onConfirm={handleSubmit} isSubmitting={isSubmiting}>
              <Button
                className="gap-2"
                variant="destructive"
              >
                <CircleStop className="w-4 h-4" />
                Selesai Pengerjaan
              </Button>
            </FinishTryoutDialog>
          </div>

          {/* Timer Section */}
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <div className="text-sm text-gray-500 hidden md:block">Waktu subtest:</div>
            <TryoutTimer subtestEnd={subtestTime} onTimeUp={handleTimeUp} onSave={handleSave} />
          </div>
        </div>
      </header>


      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3 space-y-4">
          <Card className="p-4 hidden lg:block">
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="font-semibold">{userName ? userName : "Peserta"}</div>
                <div className="text-xs text-gray-400">{subtestProps}</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 hidden lg:block">
            <h2 className="font-semibold mb-2">Nomor Soal</h2>
            <div className="grid grid-cols-5 gap-2">
              {allProblem.map((problem, index) => (
                <Button
                  key={problem.id}
                  variant={index === currentQuestionIndex ? 'default' : 'outline'}
                  className={`
            h-10 w-10 
             hover:shadow-md
            ${answers[index] ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500" : ""}
            ${index === currentQuestionIndex ? "ring-1 ring-offset-1 ring-primary" : ""}
            ${!answers[index] && index !== currentQuestionIndex ? "hover:border-primary/50" : ""}
          `}
                  onClick={() => handleQuestionChange(index)}
                >
                  {problem.questionNumber}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        <div className="md:col-span-9">
          <Card className="p-6 overflow-auto">
            <div style={{ zoom: `${zoomLevel}%` }}>
              <div className="space-y-6">
                <div className="prose max-w-none">
                  <h2 className="text-lg font-semibold" ref={problemDescRef}>
                    Soal {currentQuestion!.questionNumber}
                  </h2>
                  <div
                    className="prose prose-sm max-w-none p-4"
                    dangerouslySetInnerHTML={{ __html: processMathInHtml(currentQuestion?.problemDesc ?? "") }}
                  />
                </div>
                <RadioGroup value={answers[currentQuestionIndex] ?? ''} onValueChange={handleAnswerChange}>
                  <div className="space-y-2">
                    {options.map((option: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={optionLetters[index]!} // Assign letter value (A, B, C, etc.)
                          id={`option-${index}`}
                        />
                        <Label htmlFor={`option-${index}`}>
                          <div
                            className="prose prose-sm"
                            dangerouslySetInnerHTML={{
                              __html: processMathInHtml(option) ?? "",
                            }}
                          />
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => handleQuestionChange(currentQuestionIndex - 1)}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Sebelumnya
                  </Button>
                  {isDesktop && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleZoom('out')}
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleZoom('in')}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-500">{zoomLevel}%</span>
                    </div>
                  )}
                  <div>
                    <Button
                      className="gap-2 mx-4"
                      onClick={() => handleQuestionChange(currentQuestionIndex + 1)}
                      disabled={currentQuestionIndex === totalQuestions - 1}
                    >
                      Selanjutnya
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
      {!isDesktop && (
        <div className="fixed bottom-0 left-0 right-0">
          <Drawer onOpenChange={setIsDrawerOpen} open={isDrawerOpen} autoFocus={isDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full rounded-none bg-white border-t border-gray-200" aria-label="Quest nav">
                Nomor Soal <ChevronUp className="ml-2 h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Navigasi Soal</DrawerTitle>
                <DrawerDescription>Select a question to jump to it directly</DrawerDescription>
              </DrawerHeader>
              <div role="navigation" aria-label="question navigation">
                <MobileQuestNav />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </div>
  );
}

