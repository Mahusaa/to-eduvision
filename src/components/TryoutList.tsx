'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Trophy, Star, Clock, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Tryout {
  id: number;
  tryoutNumber: number;
  mode: string;
  status?: 'not completed' | 'completed';
  score?: number;
  rank?: number;
  duration: number | null; // Duration in minutes
  endedAt: Date;
  userTimes: {
    tryoutEnd: Date | null; // Allow null values for tryoutEnd
  }[];
}


interface TryoutListProps {
  tryoutData: Tryout[];
  userId: string;
}

export default function TryoutList({ tryoutData, userId }: TryoutListProps) {
  const router = useRouter()
  const handleStart = async (tryout: Tryout) => {
    if (!tryout.duration) {
      alert('Invalid tryout duration!');
      return;
    }

    try {
      if (tryout.userTimes.length > 0) {
        router.push(`/${userId}/${tryout.id}`)

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

        router.push(`/${userId}/${tryout.id}`)
      }
    } catch (error) {
      console.error('Error starting tryout:', error);
      alert('Error starting tryout');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tryoutData.map((tryout) => (
            <Card key={tryout.id} className="relative overflow-hidden transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">
                    Tryout {tryout.tryoutNumber}
                  </CardTitle>
                  <Badge variant={tryout.mode === 'open' ? 'default' : 'secondary'}>
                    {tryout.mode === 'closed' ? 'Closed' : 'Open'}
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
                  {tryout.mode === 'closed' && (
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
                  variant={tryout.mode === 'open' ? 'default' : 'secondary'}
                  onClick={() => handleStart(tryout)} // Replace 'user123' with the actual user ID
                >
                  {tryout.mode === 'open' ? 'Mulai' : 'Lihat Pembahasan'}
                </Button>
              </CardFooter>

              {/* Decorative element */}
              <div
                className={`absolute inset-x-0 top-0 h-1 ${tryout.mode === 'open' ? 'bg-primary' : 'bg-secondary'}`}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

