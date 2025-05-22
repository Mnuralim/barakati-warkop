import { getAdmin } from "@/actions/auth";
import { UpdateAdminForm } from "./_components/update-form";

export default async function AdminSettingsPage() {
  const admin = await getAdmin();
  return (
    <div>
      <UpdateAdminForm admin={admin!} />
    </div>
  );
}
