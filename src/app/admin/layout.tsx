import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      {session ? <AdminShell>{children}</AdminShell> : children}
    </SessionProvider>
  );
}
