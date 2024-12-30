'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CircleStop, SendHorizonal, ZoomIn, ZoomOut } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Label } from '~/components/ui/label';
import type { AllProblems } from '~/server/db/schema';
import { TryoutTimer } from './tryout-interface/time';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { z } from 'zod';
import LogoSVG from 'public/Logo';
import { FinishTryoutDialog } from './tryout-interface/FinishTryoutDialog';


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
  console.log(answers)
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
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
        <div className="flex flex-wrap items-center justify-between max-w-7xl mx-auto">
          {/* Logo and Title Section */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span>
              <LogoSVG className="text-primary w-8 h-8" />
            </span>
            <span className="text-2xl font-bold text-primary">EDUVISION</span>
          </div>

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
            <div className="text-sm text-gray-500">Waktu subtest:</div>
            <TryoutTimer subtestEnd={subtestTime} onTimeUp={handleTimeUp} />
          </div>
        </div>
      </header>


      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3 space-y-4">
          <Card className="p-4 hidden md:block">
            <div className="space-y-4">
              <div className="bg-gray-200 w-32 h-32 rounded-lg mx-auto" />
              <div className="text-center space-y-2">
                <div className="font-semibold">{userName ? userName : "Peserta"}</div>
                <div className="text-xs text-gray-400">{subtestProps}</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
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
                  <h2 className="text-lg font-semibold">
                    Soal {currentQuestion!.questionNumber}
                  </h2>
                  <p>{currentQuestion!.problemDesc}</p>
                </div>
                {currentQuestion?.imagePath &&
                  <Image
                    src={currentQuestion?.imagePath}
                    alt="naga"
                    width={400}
                    height={300}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                  />
                }

                <RadioGroup value={answers[currentQuestionIndex] ?? ''} onValueChange={handleAnswerChange}>
                  <div className="space-y-2">
                    {options.map((option: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={optionLetters[index]!} // Assign letter value (A, B, C, etc.)
                          id={`option-${index}`}
                        />
                        <Label htmlFor={`option-${index}`}>{option}</Label>
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
    </div>
  );
}

