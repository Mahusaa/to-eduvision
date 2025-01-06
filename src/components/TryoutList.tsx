'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Trophy, Star, Clock, Users, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
                    <CardTitle className="text-xl font-bold">
                      {tryout.name} {tryout.tryoutNumber}
                    </CardTitle>
                    <Badge
                    >
                      {tryout.status === 'closed'
                        ? 'Closed'
                        : tryout.status === 'completed'
                          ? 'Completed'
                          : 'Open'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{tryout.duration} menit</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      100 participants
                    </div>
                    {tryout.status === 'completed' && (
                      <>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          <span>{tryout.score} points</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          <span>Rank {tryout.rank}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-4 text-sm text-muted-foreground">
                    Berakhir pada: {new Date(tryout.endedAt).toLocaleDateString()}
                  </div>
                </CardContent>

                <CardFooter className="pt-4 mt-6">
                  <Button
                    className="w-full"
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
                    disabled={tryout.status === 'closed'}
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

