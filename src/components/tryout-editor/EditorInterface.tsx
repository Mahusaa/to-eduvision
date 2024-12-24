"use client"

import { useState, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Card } from "~/components/ui/card"
import { ChevronRight, ZoomOut, ZoomIn, ChevronLeft, Edit, Save, EyeIcon } from 'lucide-react'
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { dataSchema } from "~/types/question-exp"
import { QuestionNavigator } from "./QuestionNavigator"
import { OptionEditor } from "./OptionEditor"
import { ImageUploader } from "./ImageUploader"


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
}

interface EditorInterfaceProps {
  questionsData: QuestionsDataProps[];
}

interface Option {
  value: string;
  id: string;
  description?: string;
}

export default function EditorInterface({ questionsData: initialQuestionsData }: EditorInterfaceProps) {
  const [questionsData, setQuestionsData] = useState(initialQuestionsData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isEditMode, setIsEditMode] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  console.log(correctAnswer, "correct answer")

  const totalQuestions = questionsData.length;
  const currentQuestion = questionsData[currentQuestionIndex];
  console.log(questionsData)

  useEffect(() => {
    if (currentQuestion) {
      setCorrectAnswer(currentQuestion.answer);
    }
  }, [currentQuestion]);

  const options: Option[] = currentQuestion?.option
    ? JSON.parse(currentQuestion.option)
    : [];

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

  const handleOptionChange = (optionId: number, value: string) => {
    setQuestionsData((prevData) => {
      const newData = [...prevData];

      // Parse the option array from the current question
      const currentOptions = JSON.parse(newData[currentQuestionIndex].option! ?? '[]');

      // Update the option at the specified index (optionId)
      currentOptions[optionId] = value;

      // Update the question's option property with the modified array
      newData[currentQuestionIndex] = {
        ...newData[currentQuestionIndex],
        option: JSON.stringify(currentOptions),
      };

      return newData;
    });
  };


  const handleImageUpload = async (imageType: 'question' | 'explanation', file: File) => {
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

      setQuestionsData(prevData => {
        const newData = [...prevData];
        newData[currentQuestionIndex] = {
          ...newData[currentQuestionIndex],
          [imageType === 'question' ? 'questionImagePath' : 'explanationImagePath']: path
        };
        return newData;
      });

      console.log(`${imageType} image uploaded successfully!`);
    } catch (e) {
      console.error("Error during file upload:", e);
    }
  };

  const handleSubmit = async () => {
    const updatedData = {
      problemDesc: currentQuestion?.problemDesc,
      option: currentQuestion?.option,
      questionImagePath: currentQuestion?.questionImagePath,
      answer: correctAnswer,
      explanation: currentQuestion?.explanation,
      explanationImagePath: currentQuestion?.explanationImagePath,
      linkPath: currentQuestion?.linkPath,
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
      if (result.success) {
        console.log("Question updated successfully");
      } else {
        console.log("Error updating question:", result.message);
      }
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
        <QuestionNavigator
          totalQuestions={totalQuestions}
          currentQuestionIndex={currentQuestionIndex}
          onQuestionChange={handleQuestionChange}
        />
      </div>

      <div className="md:col-span-9">
        <Card className="p-6 overflow-auto">
          <div style={{ zoom: `${zoomLevel}%` }}>
            <div className="space-y-6">
              <div className="prose max-w-none">
                <h2 className="text-lg font-semibold">
                  Soal {currentQuestion?.questionNumber}
                </h2>
                {isEditMode ? (
                  <Textarea
                    value={currentQuestion?.problemDesc ?? ''}
                    onChange={(e) => handleInputChange('problemDesc', e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p>{currentQuestion?.problemDesc}</p>
                )}
              </div>

              <ImageUploader
                isEditMode={isEditMode}
                imagePath={currentQuestion?.questionImagePath}
                onFileChange={(file) => handleImageUpload('question', file)}
                altText="Question"
              />

              <OptionEditor
                options={options}
                isEditMode={isEditMode}
                correctAnswer={correctAnswer}
                onOptionChange={handleOptionChange}
                onCorrectAnswerChange={setCorrectAnswer}
              />

              {isEditMode && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="explanation">Explanation</Label>
                    <Textarea
                      id="explanation"
                      value={currentQuestion?.explanation ?? ''}
                      onChange={(e) => handleInputChange('explanation', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="link">Link explanation</Label>
                    <Input
                      id="linkpath"
                      value={currentQuestion?.linkPath ?? ''}
                      onChange={(e) => handleInputChange('linkPath', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <ImageUploader
                    isEditMode={isEditMode}
                    imagePath={currentQuestion?.explanationImagePath}
                    onFileChange={(file) => handleImageUpload('explanation', file)}
                    altText="Explanation"
                  />
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
                  </Button>
                )}
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


