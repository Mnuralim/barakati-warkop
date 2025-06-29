"use server";

import prisma from "@/lib/prisma";
import { createSession, deleteSession, getSession } from "./session";
import { compare, hash } from "bcryptjs";
import { revalidatePath, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

interface AuthState {
  error: string | null;
}

export async function loginAdmin(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username dan password harus diisi" };
  }

  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    return { error: "Username tidak terdaftar" };
  }

  const passwordMatch = await compare(password, admin.password);
  if (!passwordMatch) {
    return { error: "Password salah" };
  }

  await createSession(admin.id.toString());
  return { error: null };
}

export async function logout() {
  await deleteSession();
}

export const getAdmin = unstable_cache(async function getAdmin(id: string) {
  return prisma.admin.findUnique({
    where: {
      id,
    },
  });
});

export const updateAdmin = async (
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> => {
  try {
    const admin = await getSession();
    if (!admin) {
      return { error: "Admin tidak ditemukan" };
    }

    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();

    if (!username) {
      throw new Error("Username harus diisi");
    }

    if (/\s/.test(username)) {
      throw new Error("Username tidak boleh mengandung spasi");
    }

    if (password) {
      const hashPassword = await hash(password, 10);
      await prisma.admin.update({
        where: { id: admin.userId as string },
        data: {
          username,
          password: hashPassword,
        },
      });
    } else {
      await prisma.admin.update({
        where: { id: admin.userId as string },
        data: {
          username,
        },
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Terjadi kesalahan saat memperbarui profil" };
    }
  }

  revalidatePath("/admin/settings");
  revalidatePath("/admin", "layout");
  redirect("/admin/settings?success=1&message=Profil berhasil diperbarui");
};
