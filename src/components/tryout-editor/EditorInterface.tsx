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

interface QuestionsDataProps {
  tryoutId: number | null;
  questionNumber: number | null;
  subtest: string;
  problemDesc: string | null;
  option: string | null;
  questionImagePath: string | null;
  answer: string | null;
  explanation: string | null,
  explanationImagePath: string | null;
  linkPath: string | null;
}

interface EditorInterfaceProps {
  questionsData: QuestionsDataProps[];
}

export default function EditorInterface({ questionsData: initialQuestionsData }: EditorInterfaceProps) {
  const [questionsData, setQuestionsData] = useState(initialQuestionsData);
  const [questionImagePath, setQuestionImagePath] = useState<string>("")
  const [explanationImagePath, setExplanationImagePath] = useState<string>("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isEditMode, setIsEditMode] = useState(false);
  const totalQuestions = questionsData.length
  const currentQuestion = questionsData[currentQuestionIndex];
  const options = currentQuestion?.option ? JSON.parse(currentQuestion.option) : [];

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

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const handleInputChange = (field: keyof QuestionsDataProps, value: string) => {
    setQuestionsData(prevData => {
      const newData = [...prevData];
      newData[currentQuestionIndex] = {
        ...newData[currentQuestionIndex],
        [field]: value
      };
      return newData;
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    setQuestionsData(prevData => {
      const newData = [...prevData];
      const newOptions = [...JSON.parse(newData[currentQuestionIndex].option || '[]')];
      newOptions[index] = value;
      newData[currentQuestionIndex] = {
        ...newData[currentQuestionIndex],
        option: JSON.stringify(newOptions)
      };
      return newData;
    });
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
      const { path } = res.json()
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
                    value={currentQuestion!.problemDesc || ''}
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

              <RadioGroup value="yes">
                <div className="space-y-2">
                  {options.map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="yes"
                        id={`option-${index}`}
                        checked={false}
                      />
                      {isEditMode ? (
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="flex-grow"
                        />
                      ) : (
                        <Label htmlFor={`option-${index}`}>{option}</Label>
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {isEditMode && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="explanation">Explanation</Label>
                    <Textarea
                      id="explanation"
                      value={currentQuestion!.explanation || ''}
                      onChange={(e) => handleInputChange('explanation', e.target.value)}
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
                    onClick={() => handleQuestionChange(currentQuestionIndex + 1)}
                    disabled={currentQuestionIndex === totalQuestions - 1}
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


