import { getAdmin } from "@/actions/auth";
import { UpdateAdminForm } from "./_components/update-form";
import { getSession } from "@/actions/session";

interface Props {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}

export default async function AdminSettingsPage({ searchParams }: Props) {
  const { message, error, success } = await searchParams;
  const session = await getSession();
  const admin = await getAdmin(session?.userId as string);
  return (
    <div>
      <UpdateAdminForm
        admin={admin!}
        message={message}
        toastType={success ? "success" : error ? "error" : undefined}
      />
    </div>
  );
}
