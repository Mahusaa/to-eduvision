'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Trophy, Star, Clock, Users, Lock, BarChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Tryout {
  id: number;
  tryoutNumber: number;
  name: string;
  status: 'closed' | 'open' | 'completed';
  score?: number;
  rank?: number;
  duration: number | null;
  endedAt: Date;
  userTimes: {
    tryoutEnd: Date | null;
  }[];
}

interface TryoutListProps {
  tryoutData: Tryout[];
  userId: string;
}
const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-green-100 text-green-800'
    case 'closed':
      return 'bg-red-100 text-red-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function TryoutList({ tryoutData, userId }: TryoutListProps) {
  const router = useRouter();

  const handleStart = async (tryout: Tryout) => {
    if (!tryout.duration) {
      alert('Invalid tryout duration!');
      return;
    }

    if (tryout.status === 'completed') {
      return;
    }

    if (tryout.status === 'open') {
      const currentTime = new Date();
      const tryoutEndTime =
        tryout.userTimes.length > 0
          ? new Date(tryout.userTimes[0]?.tryoutEnd ?? 0)
          : new Date(currentTime.getTime() + tryout.duration * 60 * 1000);

      if (tryoutEndTime < currentTime) {
        alert('The tryout has already ended.');
        return;
      }
    }

    try {
      if (tryout.userTimes.length > 0) {
        router.push(`/${userId}/${tryout.id}`);
      } else {
        const tryoutEnd = new Date(Date.now() + tryout.duration * 60 * 1000); // Calculate end time
        const res = await fetch('/api/start-tryout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            tryoutId: tryout.id,
            tryoutEnd,
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to start tryout');
        }

        router.push(`/${userId}/${tryout.id}`);
      }
    } catch (error) {
      console.error('Error starting tryout:', error);
      alert('Error starting tryout');
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tryoutData.map((tryout) => {
            const currentTime = new Date();
            const isTryoutEnded =
              tryout.userTimes.length > 0 &&
              new Date(tryout.userTimes[0]?.tryoutEnd ?? 0) < currentTime;

            return (
              <Card
                key={tryout.id}
                className="relative overflow-hidden transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-primary">
                      {tryout.name} {tryout.tryoutNumber}
                    </CardTitle>
                    <Badge className={`${getStatusColor(tryout.status)} font-semibold`}>
                      {tryout.status.charAt(0).toUpperCase() + tryout.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pb-2 justify-center">
                  <div className="flex items-center gap-4 text-sm text-pretty">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{tryout.duration} menit</span>
                    </div>
                    {tryout.status === 'completed' && (
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        <span>Rank {tryout.rank}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-sm text-muted-foreground text-center">
                    Berakhir pada: {new Date(tryout.endedAt).toLocaleDateString()} pukul 00:00 WIB
                  </div>
                </CardContent>

                <CardFooter className=" flex flex-col gap-3">
                  {tryout.status === 'completed' && (
                    <Link href={`/leaderboard/${tryout.id}`} className='w-full mt-2'>
                      <Button
                        className="w-full"
                        variant="outline"
                      >
                        <BarChart className="w-4 h-4 mr-2" /> Lihat Leaderboard
                      </Button>
                    </Link>
                  )}
                  <Button
                    className={`w-full ${tryout.status === 'completed' ? '' : 'mt-16'}`}
                    variant={
                      tryout.status === 'open'
                        ? isTryoutEnded
                          ? 'secondary'
                          : 'default'
                        : 'secondary'
                    }
                    onClick={() =>
                      tryout.status === 'open' && !isTryoutEnded
                        ? handleStart(tryout)
                        : alert('Pembahasan Belum tersedia')
                    }
                    disabled={tryout.status === 'closed' || tryout.status === 'completed'}
                  >
                    {tryout.status === 'open'
                      ? isTryoutEnded
                        ? 'Menunggu Pembahasan'
                        : tryout.userTimes[0]?.tryoutEnd ? "Lanjutkan Tryout" : "Mulai Tryout"
                      : tryout.status === 'completed'
                        ? (<><Lock className="w-4 h-4" /> Lihat Pembahasan </>)
                        : 'Belum Tersedia'}
                  </Button>

                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

