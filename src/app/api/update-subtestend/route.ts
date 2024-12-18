import { postSubtestEnd } from "~/server/queries";


interface updateSubtestEndBody {
  userId: string;
  tryoutId: number;
  subtest: string;
}
export async function POST(req: Request) {
  try {
    const { userId, tryoutId, subtest } = await req.json() as updateSubtestEndBody;

    await postSubtestEnd(userId, tryoutId, subtest);


    return new Response(JSON.stringify({ message: 'End time recorded successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating end time:', error);
    return new Response(JSON.stringify({ error: 'Failed to update end time' }), { status: 500 });
  }
}

