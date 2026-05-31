import { AdminShell } from "@/components/admin/shell";
import { AuthProvider } from "@/components/auth-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  // Login page handles its own layout; if not signed in, middleware will redirect.
  if (!session?.user?.email) {
    return <AuthProvider>{children}</AuthProvider>;
  }
  return (
    <AuthProvider>
      <AdminShell email={session.user.email}>{children}</AdminShell>
    </AuthProvider>
  );
}
