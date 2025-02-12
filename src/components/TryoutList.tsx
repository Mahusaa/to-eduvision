'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Clock, BarChart, ListTodo, User } from 'lucide-react';
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
      return 'bg-green-100 text-green-800 hover:bg-green-200'
    case 'closed':
      return 'bg-red-100 text-red-800 hover:bg-red-200'
    case 'completed':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
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
            if (tryout.status !== 'open' && tryout.status !== 'completed') {
              return null;
            }
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
                      {tryout.name}
                    </CardTitle>
                    <Badge className={`${getStatusColor(tryout.status)} font-semibold`}>
                      {tryout.status.charAt(0).toUpperCase() + tryout.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pb-2 flex flex-col justify-center items-center">
                  <div className="flex items-center gap-2 text-sm text-pretty justify-center">
                    <div className="flex items-center gap-1 ">
                      <span>Total waktu: </span>
                      <Clock className="h-4 w-4" />
                      <span>{tryout.duration} menit,</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Sekali Pengerjaan</span>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground text-center">
                    Berakhir pada: {new Date(tryout.endedAt).toLocaleDateString()} pukul 00:00 WIB
                  </div>
                </CardContent>


                <CardFooter className=" flex flex-col">
                  {tryout.status === 'completed' && (
                    <div className="flex w-full mt-2 gap-2">
                      <Link href={`/leaderboard/${tryout.id}`} className='w-full '>
                        <Button
                          className="w-full"
                          variant="outline"
                        >
                          <BarChart className="w-4 h-4" />Leaderboard
                        </Button>
                      </Link>
                      <Link href={`/analysis/${tryout.id}`} className='w-full'>
                        <Button
                          className="w-full"
                          variant="outline"
                        >
                          <ListTodo className="w-4 h-4" /> Pembahasan
                        </Button>
                      </Link>
                    </div>
                  )}
                  {tryout.status === "open" && (
                    <Button
                      className={`w-full `}
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
                    >
                      {tryout.status === 'open' ? (
                        isTryoutEnded ? (
                          'Menunggu Pembahasan'
                        ) : tryout.userTimes[0]?.tryoutEnd ? (
                          'Lanjutkan Tryout'
                        ) : (
                          'Mulai Tryout'
                        )
                      ) : null}

                    </Button>

                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

