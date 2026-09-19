import { RoleGate } from "@/components/shell/RoleGate";

/**
 * Stage 1 gates the admin area on the dev role switcher rather than auth.
 * Stage 2 replaces this with a server-side check on the session user's role,
 * backed by row-level security in Postgres.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleGate allow="admin">{children}</RoleGate>;
}
