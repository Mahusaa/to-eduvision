"use client"
import { Card } from "./ui/card";
import { useState } from "react";
import { Button } from "./ui/button";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from "./ui/accordion";
import { processMathInHtml } from "~/lib/math-utils";
import { StarRating } from "./star-rating";
import type { questionCalculation } from "~/server/db/schema";
import { QuestionEvaluator } from "~/lib/question-evaluator";
import Link from "next/link";



interface QuestionsDataProps {
  tryoutId?: number | null | undefined;
  questionNumber?: number | null | undefined;
  subtest?: string | null;
  problemDesc?: string | null;
  option?: string | null
  questionImagePath?: string | null;
  answer?: string | null;
  explanation?: string | null,
  explanationImagePath?: string | null;
  linkPath?: string | null;
}

interface ReviewDataProps {
  reviewData: QuestionsDataProps[];
  userAnswerArray: string[];
  answerKeyArray: string[];
  questionCalculation: questionCalculation[]
  subtest: string;
  tryoutId: number;
}

export default function TryoutReview({
  reviewData: reviewData,
  userAnswerArray: userAnswerArray,
  answerKeyArray: answerKeyArray,
  questionCalculation: questionCalculation,
  subtest: subtest,
  tryoutId: tryoutId,
}: ReviewDataProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const totalQuestions = reviewData.length;
  const currentQuestion = reviewData[currentQuestionIndex];
  const options: string[] = currentQuestion?.option
    ? (JSON.parse(currentQuestion.option) as string[])
    : [];
  const evaluator = new QuestionEvaluator(questionCalculation[currentQuestionIndex]?.trueAnswer ?? 0, questionCalculation[currentQuestionIndex]?.totalAnswer ?? 1)

  const handleQuestionChange = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  };
  const getNameFromAlias = (alias: string) => {
    const nameMap: Record<string, string> = {
      "pu": "Penalaran Umum",
      "pbm": "Kemampuan Membaca dan Menulis",
      "ppu": "Pengetahuan dan Pemahaman Umum",
      "kk": "Kemampuan Kuantitatif",
      "lbind": "Literasi Bahasa Indonesia",
      "lbing": "Literasi Bahasa Inggris",
      "pm": "Penalaran Matematika"
    };

    return nameMap[alias] ?? null;
  };


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Mudah":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Sedang":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "Sulit":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const optionMap = ["A", "B", "C", "D", "E"]


  const checkAnswer = (index: number): boolean => {
    return userAnswerArray[index] === answerKeyArray[index];
  }


  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel((prevZoom) => {
      const newZoom = direction === 'in' ? prevZoom + 10 : prevZoom - 10;
      return Math.min(Math.max(newZoom, 50), 200);
    });
  };


  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3 space-y-4">
          <Link href={`/analysis/${tryoutId}`}>
            <Button
              variant="ghost"
              className="mb-3"
            >
              <ChevronLeft className="mr-2 w-4 h-4" />
              Back</Button>
          </Link>
          <Card className="p-4 hidden md:block">
            <div className="space-y-4">
              <div className="text-center space-y-2 justify-center">
                <div className="font-semibold">Pembahasan</div>
                <div className="text-xs text-gray-400">{getNameFromAlias(subtest)}</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <h2 className="font-semibold mb-2">Nomor Soal</h2>
            <div className="sm:flex sm:gap-2 sm:overflow-x-auto sm:whitespace-nowrap lg:grid lg:grid-cols-5 gap-2">
              {reviewData.map((problem, index) => (
                <Button
                  key={problem.questionNumber}
                  variant={index === currentQuestionIndex ? 'default' : 'outline'}
                  className={`
            h-10 w-10 
            hover:shadow-md
            hover:text-white
            ${checkAnswer(index) ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500" : "bg-red-500 hover:bg-red-600 text-white border-red-500"}
            ${index === currentQuestionIndex ? "ring-1 ring-offset-1 ring-primary" : ""}
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
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-medium text-gray-500">Level</div>
                        <Badge className={`mt-1 ${getDifficultyColor(evaluator.difficulty)}`}>{evaluator.difficulty}</Badge>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-medium text-gray-500">Rating</div>
                        <StarRating rating={Number(evaluator.rating)} className="mt-1" />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-medium text-gray-500">Bobot Soal</div>
                        <div className="mt-1 font-semibold">{parseFloat(questionCalculation[currentQuestionIndex]?.score ?? "0").toFixed(2)}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-medium text-gray-500">{evaluator.incorrectPercentage.toFixed(1)}% menjawab salah</div>
                        <div className="mt-3 w-full flex justify-center">
                          <Progress value={evaluator.incorrectPercentage} className="h-3 w-3/4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="prose prose-sm max-w-none p-4"
                    dangerouslySetInnerHTML={{ __html: processMathInHtml(currentQuestion?.problemDesc ?? "") }}
                  />
                </div>
                <div>
                  <div className="space-y-1">
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className={`rounded-lg border ${index === optionMap.indexOf(currentQuestion?.answer ?? "P")
                          ? "border-green-500 bg-green-50"
                          : index === optionMap.indexOf(userAnswerArray[currentQuestionIndex] ?? "P") && index !== optionMap.indexOf(currentQuestion?.answer ?? "P")
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200"
                          }`}
                      >
                        <span
                          className={`${index === optionMap.indexOf(currentQuestion?.answer ?? "P") ? "text-green-700"
                            : index === optionMap.indexOf(userAnswerArray[currentQuestionIndex] ?? "P") && index !== optionMap.indexOf(currentQuestion?.answer ?? "P")
                              ? "text-red-700"
                              : "text-gray-700"
                            }`}
                        >
                          <div
                            className="prose prose-sm max-w-none p-4"
                            dangerouslySetInnerHTML={{ __html: processMathInHtml(option) }}
                          />
                        </span>
                      </div>

                    ))}

                  </div>
                  <div className={`mt-4 p-2 rounded-lg  border  ${currentQuestion?.answer === userAnswerArray[currentQuestionIndex] ? "bg-green-50 border-green-200" : "bg-red-50 border-red-50"}`}>
                    <h3 className={`font-semibold ${currentQuestion?.answer === userAnswerArray[currentQuestionIndex] ? "text-green-600" : "text-red-500"}`}>
                      {currentQuestion?.answer !== userAnswerArray[currentQuestionIndex]
                        ? (userAnswerArray[currentQuestionIndex] === "" ? "Kamu Tidak Menjawab" : "Jawaban Kamu Salah")
                        : "Jawaban Kamu Benar"}
                    </h3>

                  </div>
                  {/* Explanation Accordion */}
                  <Accordion type="single" collapsible className="mt-4">
                    <AccordionItem value="explanation">
                      <AccordionTrigger className="text-blue-500">Penjelasan</AccordionTrigger>
                      <AccordionContent>
                        <div className="rounded-lg bg-blue-50 p-4">
                          <div
                            className="prose prose-sm max-w-none p-4"
                            dangerouslySetInnerHTML={{ __html: processMathInHtml(currentQuestion?.explanation ?? "Pembahasan Belom Tersedia") }}
                          />
                        </div>

                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>


                </div>

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
