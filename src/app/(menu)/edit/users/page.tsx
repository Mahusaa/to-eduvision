import UserManagement from "~/components/admin-interface/UsersTable";
import { getUsers } from "~/server/queries";

export default async function UsersManage() {
  const allUser = await getUsers();
  return (
    <div className="w-full mx-auto p-4">
      <UserManagement users={allUser} />
    </div>
  );
}

