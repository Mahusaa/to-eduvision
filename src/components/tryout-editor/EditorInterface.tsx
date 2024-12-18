"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import Image from "next/image"
import { Card } from "../ui/card"
import { ChevronRight, ZoomOut, ZoomIn, ChevronLeft, Edit, Save, EyeIcon } from 'lucide-react'
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { dataSchema } from "~/types/question-exp"

interface QuestionsDataProps {
  tryoutId?: number | null | undefined;
  questionNumber?: number | null | undefined;
  subtest: string;
  problemDesc: string | null;
  option: string | null
  questionImagePath: string | null;
  answer: string | null;
  explanation: string | null,
  explanationImagePath: string | null;
  linkPath: string | null;
}interface EditorInterfaceProps {
  questionsData: QuestionsDataProps[];
}
interface Option {
  value: string; // Changed from text to value
  id: number;
  description?: string; // Optional property kept the same
}


export default function EditorInterface({ questionsData: initialQuestionsData }: EditorInterfaceProps) {
  const [questionsData, setQuestionsData] = useState(initialQuestionsData);
  const [questionImagePath, setQuestionImagePath] = useState<string>("")
  const [explanationImagePath, setExplanationImagePath] = useState<string>("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isEditMode, setIsEditMode] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const totalQuestions = questionsData.length
  const currentQuestion = questionsData[currentQuestionIndex];
  const options: Option[] = currentQuestion?.option && typeof currentQuestion.option === "string"
    ? (JSON.parse(currentQuestion.option) as Option[])
    : [];


  const handleQuestionChange = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);

      // Set correctAnswer for the current question
      const currentAnswer = questionsData[index]?.answer;
      setCorrectAnswer(currentAnswer !== null ? parseInt(currentAnswer!) : null);
    }
  };


  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel((prevZoom) => {
      const newZoom = direction === 'in' ? prevZoom + 10 : prevZoom - 10;
      return Math.min(Math.max(newZoom, 50), 200);
    });
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleInputChange = (field: keyof QuestionsDataProps, value: string) => {
    setQuestionsData(prevData => {
      const newData = [...prevData];
      {/*@ts-expect-error: data from server error*/ }
      newData[currentQuestionIndex] = {
        ...newData[currentQuestionIndex],
        [field]: value
      };
      return newData;
    });
  };

  const handleOptionChange = (index: number, value: string, isCorrect: boolean) => {
    setQuestionsData((prevData) => {
      const updatedData = prevData.map((question, idx) => {
        if (idx === currentQuestionIndex) {
          const optionsArray: string[] = Array.isArray(question.option)
            ? [...(question.option as string[])]
            : JSON.parse(question.option ?? "[]") as string[];

          optionsArray[index] = value;

          return {
            ...question,
            option: JSON.stringify(optionsArray),
            answer: isCorrect ? index.toString() : question.answer,
          };
        }
        return question;
      });

      return updatedData;
    });

    // Update local state for correct answer
    if (isCorrect) {
      setCorrectAnswer(index);
    }
  };


  const handleFileChange = async (imageType: 'question' | 'explanation', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    await handleImageUpload(imageType, file);
  };

  const handleImageUpload = async (imageType: 'question' | 'explanation', file: File | null) => {
    if (!file) return;
    const details = `${imageType}-${questionsData[0]?.tryoutId}-${questionsData[0]?.subtest}-${currentQuestionIndex + 1}`;

    const data = new FormData();
    data.append('file', file)
    data.append('details', details)


    try {

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error(await res.text());
      const result = await res.json() as { success: boolean; message: string; path: string }
      const { path } = result
      console.log(path)
      if (imageType === "question") {
        setQuestionImagePath(path)
      } else if (imageType === "explanation") {
        setExplanationImagePath(path)
      }
      console.log(`${imageType} image uploaded successfully!`);
    } catch (e) {
      console.error("Error during file upload:", e);
    }
  };
  const handleSubmit = async () => {
    const updatedData = {
      problemDesc: questionsData[currentQuestionIndex]?.problemDesc,
      option: questionsData[currentQuestionIndex]?.option,
      questionImagePath: questionImagePath,
      answer: correctAnswer !== null ? correctAnswer.toString() : questionsData[currentQuestionIndex]?.answer,
      explanation: questionsData[currentQuestionIndex]?.explanation,
      explanationImagePath: explanationImagePath,
      linkPath: questionsData[currentQuestionIndex]?.linkPath,

    }

    const data = {
      tryoutId: questionsData[0]?.tryoutId,
      subtest: questionsData[0]?.subtest,
      questionNumber: currentQuestionIndex + 1,
      updatedData,
    };


    try {
      dataSchema.parse(data)
      const res = await fetch('/api/update-questions', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const result = await res.json() as { success: boolean, message: string };
      if (!result) { console.log("error update questions") }
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-3 space-y-4">
        <Card className="p-4">
          <div className="space-y-4">
            <div className="bg-gray-200 w-32 h-32 rounded-lg mx-auto" />
            <div className="text-center space-y-2">
              <div className="font-mono text-sm">23-8394-99-2083</div>
              <div className="font-semibold">Admin</div>
              <div className="text-sm text-gray-500">Tes Potensi Skolastik</div>
              <div className="text-xs text-gray-400">{questionsData[0]?.subtest}</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Nomor Soal</h2>
          <div className="grid grid-cols-5 gap-2">
            {questionsData.map((problem, index) => (
              <Button
                key={index}
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
                {isEditMode ? (
                  <Textarea
                    value={currentQuestion!.problemDesc ?? ''}
                    onChange={(e) => handleInputChange('problemDesc', e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p>{currentQuestion!.problemDesc}</p>
                )}
              </div>
              {isEditMode ? (
                <div>
                  <Label htmlFor="questionImage">Question Image</Label>
                  <Input
                    id="questionImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('question', e)}
                  />
                </div>
              ) : currentQuestion!.questionImagePath && (
                <Image
                  src={currentQuestion!.questionImagePath}
                  alt="Question"
                  width={800}
                  height={400}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />
              )}

              <RadioGroup
                value={correctAnswer?.toString() ?? ""}
                onValueChange={(value) => setCorrectAnswer(parseInt(value))} // Update correct answer
              >
                <div className="space-y-2">
                  {options.map((option: Option, index: number) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                      {isEditMode ? (
                        <div className="flex items-center space-x-2 flex-grow">
                          <Input
                            value={option.value}
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value, index === correctAnswer)
                            }
                            className="flex-grow"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOptionChange(index, option.value, true)}
                          >
                            Set as Correct
                          </Button>
                        </div>
                      ) : (
                        <Label
                          htmlFor={`option-${option.id}`}
                          className={
                            correctAnswer === index ? "font-bold text-green-600" : ""
                          }
                        >
                          {option.value}
                          {correctAnswer === index && " (Correct)"}
                        </Label>
                      )}
                    </div>
                  ))}                </div>
              </RadioGroup>

              {!isEditMode && correctAnswer !== null && (
                <div className="mt-4 p-2 bg-green-100 border border-green-300 rounded">
                  <p className="text-green-700">Correct Answer: Option {correctAnswer + 1}</p>
                </div>
              )}
              {isEditMode && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="explanation">Explanation</Label>
                    <Textarea
                      id="explanation"
                      value={currentQuestion!.explanation ?? ''}
                      onChange={(e) => handleInputChange('explanation', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="link">Link explanation</Label>
                    <Input
                      id="linkpath"
                      value={currentQuestion!.linkPath ?? ''}
                      onChange={(e) => handleInputChange('linkPath', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="explanationImage">Explanation Image</Label>
                    <Input
                      id="explanationImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('explanation', e)}
                    />
                  </div>
                </div>
              )}

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
                <Button
                  className="gap-2 mx-4"
                  variant={isEditMode ? "default" : "outline"}
                  onClick={handleEditToggle}
                >
                  {isEditMode ? (
                    <>
                      <EyeIcon className="w-4 h-4" /> Preview
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" /> Edit
                    </>
                  )}
                </Button>
                {isEditMode && (
                  <Button
                    className="gap-2 mx-4"
                    onClick={handleSubmit}
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>)}


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
        </Card>
      </div>
    </main>
  )
}

