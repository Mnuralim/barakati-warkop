"use server";

import prisma from "@/lib/prisma";
import { createSession, deleteSession, verifySession } from "./session";
import { compare, hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

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

export async function getAdmin() {
  const session = await verifySession();

  if (!session.isAuth) {
    return null;
  }

  return await prisma.admin.findUnique({
    where: { id: session.userId as string },
    select: { username: true, id: true },
  });
}

export const updateAdmin = async (
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> => {
  const admin = await getAdmin();
  if (!admin) {
    return { error: "Admin tidak ditemukan" };
  }

  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  if (!username) {
    return { error: "Username tidak boleh kosong" };
  }

  if (/\s/.test(username)) {
    return { error: "Username tidak boleh mengandung spasi" };
  }

  if (password) {
    const hashPassword = await hash(password, 10);
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        username,
        password: hashPassword,
      },
    });
  } else {
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        username,
      },
    });
  }

  revalidatePath("/admin/settings");

  return { error: null };
};
