"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegend, ChartLegendContent } from "~/components/ui/chart"
import { Progress } from "~/components/ui/progress"
import { CheckCircle2, XCircle, TrendingUp, Trophy } from "lucide-react"
import type { DataItem } from "~/app/(menu)/analysis/[tryoutId]/page"

const getTailwindColor = (score: number) => {
  if (score >= 700) return "bg-green-400";
  if (score >= 500) return "bg-yellow-400";
  if (score >= 300) return "bg-orange-400";
  return "bg-red-500";
};

const getTextTailwindColor = (score: number) => {
  if (score >= 700) return "text-green-400";
  if (score >= 500) return "text-yellow-400";
  if (score >= 300) return "text-orange-400";
  return "text-red-500";
}

const chartConfig = {
  meanScore: {
    label: "Rata - rata peserta",
    color: "hsl(var(--chart-1))",
  },
  userScore: {
    label: "Nilai anda",
    color: "hsl(var(--chart-2))",
  }
}

export default function TestScoreVisualization({ dataItem }: { dataItem: DataItem[] }) {
  const rankedSubtestData = useMemo(() => {
    const dataWithMean = dataItem.map((test) => {
      const totalQuestions = test.correct + test.incorrect
      const userScore = parseFloat(test.score ?? "0")
      const correctPercentage = (test.correct / totalQuestions) * 100
      const incorrectPercentage = (test.incorrect / totalQuestions) * 100
      return { ...test, userScore, correctPercentage, incorrectPercentage, totalQuestions }
    })
    return dataWithMean
  }, [dataItem])

  const [selectedSubtest, setSelectedSubtest] = useState(rankedSubtestData[0])

  const totalQuestions = rankedSubtestData.reduce((acc, test) => acc + test.totalQuestions, 0)
  const totalCorrect = rankedSubtestData.reduce((acc, test) => acc + test.correct, 0)
  const totalIncorrect = rankedSubtestData.reduce((acc, test) => acc + test.incorrect, 0)
  const overallMeanScore = rankedSubtestData.reduce((acc, test) => acc + test.userScore, 0) / rankedSubtestData.length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="overall" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overall">Analisis Nilai</TabsTrigger>
          <TabsTrigger value="detailed">Detail Subtest</TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-4">
          {/* Overall Statistics */}
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle>Analisis Seluruh Subtest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-8 h-8 text-primary" />
                      <span className="text-2xl font-semibold">Score</span>
                    </div>
                    <span className={`text-4xl font-bold  ${getTextTailwindColor(overallMeanScore)}`}>
                      {Math.round(overallMeanScore)}
                    </span>
                  </div>
                  <Progress
                    value={(overallMeanScore / 1000) * 100}
                    className={`h-3 bg-opacity-20 ${getTailwindColor(overallMeanScore)}`}
                    indicatorClassName={getTailwindColor(overallMeanScore)}
                  />
                </div>
                <div className="col-span-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium">Benar</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-lg font-bold ${getTextTailwindColor((totalIncorrect / totalQuestions) * 1000)}`}>
                          {totalCorrect}/{totalQuestions}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({Math.round((totalCorrect / totalQuestions) * 100)}%)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={(totalCorrect / totalQuestions) * 100}
                      className={`h-2 bg-opacity-20 ${getTailwindColor((totalCorrect / totalQuestions) * 1000)}`}
                      indicatorClassName={getTailwindColor((totalCorrect / totalQuestions) * 1000)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="text-sm font-medium">Salah</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-lg font-bold ${getTextTailwindColor(1000 - (totalIncorrect / totalQuestions) * 1000)}`}>
                          {totalIncorrect}/{totalQuestions}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({Math.round((totalIncorrect / totalQuestions) * 100)}%)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={(totalIncorrect / totalQuestions) * 100}
                      className={`h-2 bg-opacity-20 ${getTailwindColor(1000 - (totalIncorrect / totalQuestions) * 1000)}`}
                      indicatorClassName={getTailwindColor(1000 - (totalIncorrect / totalQuestions) * 1000)}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-medium">Ranking Keseluruhan</span>
                    </div>
                    <span className={`text-sm`}>
                      -ongoing-
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full flex items-center justify-center">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto h-[200px] w-full sm:h-[300px] md:h-[350px] lg:h-[400px]"
                >
                  <ResponsiveContainer>
                    <RadarChart data={rankedSubtestData}>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={30} domain={[0, 1000]} />
                      <Radar
                        name="rata-rata"
                        dataKey="meanScore"
                        fill="hsl(var(--chart-1))"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="kamu"
                        dataKey="userScore"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.6}
                      />
                      <ChartLegend className="mt-8" content={<ChartLegendContent />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="detailed" className="space-y-4">
          {/* Detailed Subtest Breakdown */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Detailed Subtest Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  {rankedSubtestData.map((test) => (
                    <button
                      key={test.name}
                      className={`w-full text-left p-4 rounded-lg transition-colors ${selectedSubtest?.name === test.name
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                        }`}
                      onClick={() => setSelectedSubtest(test)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{test.name}</div>
                      </div>
                      <div className={`text-sm opacity-90 ${getTextTailwindColor(test.userScore)}`}>
                        Nilai: {Math.round(test.userScore)}
                      </div>
                    </button>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {selectedSubtest?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium">Nilai</span>
                          </div>
                          <span className={`text-2xl font-bold ${getTextTailwindColor(selectedSubtest?.userScore ?? 0)}`} >
                            {Math.round(selectedSubtest?.userScore ?? 0)}
                          </span>
                        </div>
                        <Progress
                          value={((selectedSubtest?.userScore ?? 0) / 1000) * 100}
                          className={`h-2 bg-opacity-20 ${getTailwindColor(selectedSubtest?.userScore ?? 0)}`}
                          indicatorClassName={getTailwindColor(selectedSubtest?.userScore ?? 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium">Benar</span>
                          </div>
                          <span className={`font-semibold ${getTextTailwindColor((selectedSubtest?.correctPercentage ?? 0) * 10)}`}>
                            {`${selectedSubtest?.correct}/${selectedSubtest?.totalQuestions}`} ({Math.round(selectedSubtest?.correctPercentage ?? 0)}%)
                          </span>
                        </div>
                        <Progress
                          value={selectedSubtest?.correctPercentage}
                          className={`h-2 bg-opacity-20 ${getTailwindColor((selectedSubtest?.correctPercentage ?? 0) * 10)}`}
                          indicatorClassName={getTailwindColor((selectedSubtest?.correctPercentage ?? 0) * 10)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <XCircle className="w-5 h-5 text-red-500" />
                            <span className="text-sm font-medium">Salah</span>
                          </div>
                          <span className={`font-semibold ${getTextTailwindColor(1000 - ((selectedSubtest?.incorrectPercentage ?? 0) * 10))}`}>
                            {`${selectedSubtest?.incorrect}/${selectedSubtest?.totalQuestions}`} ({Math.round(selectedSubtest?.incorrectPercentage ?? 0)}%)
                          </span>
                        </div>
                        <Progress
                          value={selectedSubtest?.incorrectPercentage}
                          className={`h-2 bg-opacity-20 ${getTailwindColor(1000 - ((selectedSubtest?.incorrectPercentage ?? 0) * 10))}`}
                          indicatorClassName={getTailwindColor(1000 - ((selectedSubtest?.incorrectPercentage ?? 0) * 10))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  )
}


