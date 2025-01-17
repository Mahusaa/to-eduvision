"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "../ui/scroll-area";

interface UserScoreData {
  userName: string;
  userId: string | null;
  tryoutId: number | null;
  puScore: string | null;
  pbmScore: string | null;
  ppuScore: string | null;
  kkScore: string | null;
  lbindScore: string | null;
  lbingScore: string | null;
  pmScore: string | null;
}

const calculateMeanScores = (data: UserScoreData[]) => {
  const sum = data.reduce((acc, curr) => {
    Object.keys(curr).forEach((key) => {
      if (key.endsWith("Score") && curr[key as keyof UserScoreData] !== null) {
        acc[key] = (acc[key] ?? 0) + parseInt(curr[key as keyof UserScoreData] as unknown as string, 10);
      }
    });
    return acc;
  }, {} as Record<string, number>);

  Object.keys(sum).forEach((key) => {
    sum[key] = Math.round(sum[key]! / data.length);
  });

  sum.totalScore = Object.values(sum).reduce(
    (a, b) => (typeof b === "number" ? a + b : a),
    0
  );

  return sum;
};


const subjectFullNames: Record<string, string> = {
  pu: "Penalaran Umum",
  pbm: "Pemahaman Bacaan dan Menulis",
  ppu: "Pengetahuan dan Pemahaman Umum",
  kk: "Kemampuan Kuantitatif",
  lbind: "Literasi Bahasa Indonesia",
  lbing: "Literasi Bahasa Inggris",
  pm: "Penalaran Matematika",
};

export function AdminLeaderboard({ userScores }: { userScores: UserScoreData[] }) {
  const processedData = userScores.map((user) => ({
    ...user,
    totalScore:
      Math.round( // Round the final result
        Object.entries(user)
          .filter(([key]) => key.endsWith("Score") && user[key as keyof UserScoreData] !== null)
          .reduce((total, [, val]) => total + parseInt(val as string, 10), 0) / 7 // Divide the total sum by 7
      ),
  }));

  const meanScores = calculateMeanScores(processedData);

  const chartData = Object.entries(meanScores)
    .filter(([key]) => key.endsWith("Score") && key !== 'totalScore')
    .map(([key, value]) => ({
      subject: subjectFullNames[key.replace("Score", "").toLowerCase()] ?? key,
      score: value ? value : 0,
    }));

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Nilai rata-rata tiap subtest
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 1000]} />
              <YAxis dataKey="subject" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Participant Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead className="text-center">Mean Score</TableHead>
                  <TableHead className="text-center">Subject Scores</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedData
                  .sort((a, b) => b.totalScore - a.totalScore)
                  .map((user, index) => (
                    <TableRow key={user.userId}>
                      <TableCell className="font-medium">
                        {index === 0 && <Badge className="mr-2 bg-yellow-500">1st</Badge>}
                        {index === 1 && <Badge className="mr-2 bg-gray-400">2nd</Badge>}
                        {index === 2 && <Badge className="mr-2 bg-orange-600">3rd</Badge>}
                        {index > 2 && `${index + 1}th`}
                      </TableCell>
                      <TableCell>{user.userName}</TableCell>
                      <TableCell className="font-bold text-center">{user.totalScore}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(user)
                            .filter(([key]) => key.endsWith("Score") && key !== "totalScore")
                            .map(([key, value]) => (
                              <Badge key={key} variant="outline">
                                {key.replace('Score', '').toUpperCase()}
                                : {Math.floor(Number(value))}
                              </Badge>
                            ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div >
  );
}

