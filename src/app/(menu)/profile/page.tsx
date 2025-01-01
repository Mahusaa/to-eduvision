import ProfileEditPage from "~/components/EditProfile";
import { auth } from "~/server/auth"

export default async function Page() {
  const session = await auth();
  const userId = session?.user.id
  const userName = session?.user.name
  const email = session?.user.email
  return (
    <ProfileEditPage userName={userName!} email={email!} id={userId!} />
  )
}
