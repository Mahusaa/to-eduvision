import { redirect } from "next/navigation";
import UserManagement from "~/components/admin-interface/UsersTable";
import { auth } from "~/server/auth";
import { getUsers } from "~/server/queries";

export default async function UsersManage() {
  const session = await auth()
  if (!(session?.user.role === "admin" || session?.user.role === "mulyono")) return redirect("/dashboard");
  const allUser = await getUsers();
  return (
    <div className="w-full mx-auto p-4">
      <UserManagement users={allUser} />
    </div>
  );
}

