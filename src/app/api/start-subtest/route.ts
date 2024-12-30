// pages/api/update-end.ts
import { type NextRequest, NextResponse } from "next/server";
import { updateSectionEndTime } from "~/server/queries";

interface updateSectionBody {
  sectionId: number;
  duration: number;
  subtest: string;
}

export async function POST(req: NextRequest) {
  try {
    const { sectionId, duration, subtest } = await req.json() as updateSectionBody;
    const now = new Date();
    const endTime = new Date(now.getTime() + duration * 60 * 1000); // Add duration in milliseconds

    await updateSectionEndTime(sectionId, subtest, endTime);

    return NextResponse.json({ success: true, end: endTime });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to update end time" }, { status: 500 });
  }
}

