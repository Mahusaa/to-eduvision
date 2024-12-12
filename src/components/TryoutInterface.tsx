'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Label } from '~/components/ui/label';
import type { AllProblems } from '~/server/db/schema';
import { TryoutTimer } from './tryout-interface/time';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function TryoutInterface({
  allProblem,
  subtestProps,
  subtestTime,
  tryoutId,
  userId,
  subtestCode,
}: {
  allProblem: AllProblems[];
  subtestProps: string;
  subtestTime: Date | null;
  tryoutId: number;
  userId: string;
  subtestCode: string,
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const totalQuestions = allProblem.length;

  const localStorageKey = `tryout-${tryoutId}-${userId}-${subtestProps}-answers`;

  useEffect(() => {
    setIsClient(true); // Mark that rendering is on the client

    const savedAnswers = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
    setAnswers(savedAnswers.length ? savedAnswers : new Array(totalQuestions).fill(null));
  }, [localStorageKey, totalQuestions]);

  // Sync localStorage with answers
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

  const handleTimeUp = useCallback(() => {
    setTimeout(() => {
      router.push(`/${userId}/${tryoutId}`);
    }, 0);
  }, [router, userId, tryoutId]);

  const handleSubmit = async () => {
    try {
      console.log('Submitting answers:', answers);

      const response = await fetch('/api/submit-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answerArray: answers, subtest: subtestCode, userId, tryoutId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response from server:', data);
        alert('Answers submitted successfully!');
      } else {
        console.error('Error submitting answers');
        alert('Failed to submit answers.');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      alert('An error occurred while submitting answers.');
    }
  };

  if (!isClient) {
    // Avoid rendering during SSR to prevent hydration mismatch
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
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-emerald-600 font-semibold text-xl">Eduvision</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Waktu subtest: </div>
            <TryoutTimer subtestEnd={subtestTime} onTimeUp={handleTimeUp} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3 space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="bg-gray-200 w-32 h-32 rounded-lg mx-auto" />
              <div className="text-center space-y-2">
                <div className="font-mono text-sm">23-8394-99-2083</div>
                <div className="font-semibold">Usamah Hafizh Ammar Zaim</div>
                <div className="text-sm text-gray-500">Tes Potensi Skolastik</div>
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
                  className="h-10 w-10"
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
                <Image
                  src="/images/yuhu456.jpg"
                  alt="naga"
                  width={800}
                  height={400}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />

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
                  <div>{
                    currentQuestionIndex === totalQuestions - 1 ? (
                      <Button
                        className="gap-2"
                        onClick={handleSubmit}
                      >
                        Submit
                        <ChevronRight className="w-4 h-4" />
                      </Button>) : ""
                  }

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

