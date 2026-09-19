import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Database,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Settings,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Role } from "@/lib/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const STUDENT_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/question-bank", label: "Question bank", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: GraduationCap },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/assignments", label: "Assignments", icon: ClipboardList },
  { href: "/admin/questions", label: "Questions", icon: Database },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function navForRole(role: Role): NavItem[] {
  return role === "admin" ? ADMIN_NAV : STUDENT_NAV;
}
