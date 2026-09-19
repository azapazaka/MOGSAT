import { getCurrentUser } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { SettingsForm } from "@/components/SettingsForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const profile = await getCurrentUser("student");

  return (
    <div className="max-w-[820px] space-y-8">
      <PageHeader
        title="Settings"
        description="Your profile, your target, and what the app tells you about."
      />
      <SettingsForm profile={profile} />
    </div>
  );
}
