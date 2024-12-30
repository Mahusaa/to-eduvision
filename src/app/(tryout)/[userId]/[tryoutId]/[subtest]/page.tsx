import TryoutInterface from "~/components/TryoutInterface";
import { getProblembySubtest, getUserTimebyId } from "~/server/queries";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { Suspense } from "react";
import Loading from "../loading";


type Params = Promise<{ subtest: string; userId: string; tryoutId: number }>

export default async function TryoutInterfacePage(props: { params: Params }) {
  const params = await props.params;
  const subtest = params.subtest;
  const userId = params.userId
  const tryoutId = params.tryoutId
  const allProblem = await getProblembySubtest(tryoutId, subtest);
  const userTime = await getUserTimebyId(userId, tryoutId);
  const session = await auth()
  if (!session) return redirect("sign-in")
  const userName = session.user.name


  const subtestMapping: Record<
    string,
    { name: string; time: Date | null; code: string }
  > = {
    pu: { name: "Penalaran Umum", time: userTime!.puEnd, code: "pu" },
    ppu: { name: "Pengetahuan dan Pemahaman Umum", time: userTime!.ppuEnd, code: "ppu" },
    pbm: { name: "Kemampuan Memahami Bacaan dan Menulis", time: userTime!.pbmEnd, code: "pbm" },
    kk: { name: "Kemampuan Kuantitatif", time: userTime!.kkEnd, code: "kk" },
    lbind: { name: "Literasi Bahasa Indonesia", time: userTime!.lbindEnd, code: "lbind" },
    lbing: { name: "Literasi Bahasa Inggris", time: userTime!.lbingEnd, code: "lbing" },
    pm: { name: "Penalaran Matematika", time: userTime!.pmEnd, code: "pm" },
  };

  const subtestData = subtestMapping[subtest]

  if (!subtestData?.time || new Date(subtestData.time) < new Date()) {
    redirect(`/${userId}/${tryoutId}`);
  }

  return (
    <Suspense fallback={<Loading />}>

      <TryoutInterface
        allProblem={allProblem}
        subtestProps={subtestData.name}
        subtestTime={subtestData.time}
        tryoutId={tryoutId}
        userId={userId}
        subtestCode={subtestData.code}
        userName={userName}
      />
    </Suspense>
  );
}

