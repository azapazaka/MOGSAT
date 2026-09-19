"use client";

import { ShieldAlert } from "lucide-react";
import { useRole } from "@/providers/role-provider";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import type { Role } from "@/lib/types";

/**
 * Stage 1 has no auth to redirect against, so an admin route viewed in the
 * student role shows an inline notice with a one-click switch rather than
 * bouncing the user somewhere else. Stage 2 replaces this with a real
 * server-side authorization check plus RLS.
 */
export function RoleGate({ allow, children }: { allow: Role; children: React.ReactNode }) {
  const { role, setRole, ready } = useRole();

  if (!ready) return null;
  if (role === allow) return <>{children}</>;

  return (
    <EmptyState
      icon={ShieldAlert}
      title={`This page is part of the ${allow} experience`}
      description={`You are previewing the app as a ${role}. Stage 1 has no authentication, so switch the dev role to continue.`}
      action={
        <Button variant="primary" onClick={() => setRole(allow)}>
          Switch to {allow}
        </Button>
      }
    />
  );
}
