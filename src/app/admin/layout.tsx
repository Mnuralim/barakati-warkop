import type { Metadata } from "next";
// import { getAdmin } from "@/actions/admin";
import { headers } from "next/headers";
import { Sidebar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar";
import { getAdmin } from "@/actions/auth";

export const metadata: Metadata = {
  title: "Pemesanan - Dashboard",
  description: "Aplikasi manajemen pemesanan",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const path =
    (await headersList).get("x-pathname") || (await headersList).get("x-url");
  const isLoginPage = path?.includes("/admin/login");

  let admin = null;
  if (!isLoginPage) {
    admin = await getAdmin();
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 ">
      {!isLoginPage && <Sidebar username={admin?.username} />}
      <div
        className={`min-h-screen flex-1 flex flex-col transition-all duration-300 ${
          !isLoginPage ? "lg:pl-72" : ""
        }`}
      >
        {!isLoginPage && <Navbar username={admin?.username} />}
        <main className="p-4 md:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
