import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getCurrentUserSession() {
  return getServerSession(authOptions);
}

export async function requireUserId() {
  const session = await getCurrentUserSession();
  return session?.user?.id || null;
}
