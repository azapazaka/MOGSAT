"use client";

import { useState } from "react";
import type { UserProfile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SectionHeading } from "@/components/PageHeader";

/**
 * Settings UI. Nothing persists in Stage 1 — saving shows a confirmation and
 * the state lives in the component. Stage 2 wires the same form to a Supabase
 * update on the profile row.
 */

const NOTIFICATION_FIELDS = [
  { key: "studyReminders", label: "Daily study reminder", hint: "A nudge if you have not practised by the evening." },
  { key: "weeklyReport", label: "Weekly progress report", hint: "A summary of accuracy and score movement every Sunday." },
  { key: "assignmentAlerts", label: "Assignment alerts", hint: "When your tutor sets work, and the day before it is due." },
  { key: "tutorMessages", label: "Tutor messages", hint: "Notes your tutor leaves on your progress." },
] as const;

export function SettingsForm({ profile }: { profile: UserProfile }) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [targetScore, setTargetScore] = useState(String(profile.targetScore));
  const [testDate, setTestDate] = useState(profile.testDate.slice(0, 10));
  const [timeZone, setTimeZone] = useState(profile.timeZone);
  const [notifications, setNotifications] = useState(profile.notifications);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="space-y-6">
          <SectionHeading title="Profile" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-timezone">Time zone</Label>
              <Select
                id="profile-timezone"
                value={timeZone}
                onChange={(event) => setTimeZone(event.target.value)}
              >
                {["Europe/London", "Europe/Berlin", "America/New_York", "America/Los_Angeles", "Asia/Tokyo"].map(
                  (zone) => (
                    <option key={zone} value={zone}>
                      {zone.replace("_", " ")}
                    </option>
                  ),
                )}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-6">
          <SectionHeading title="Test plan" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="target-score">Target score</Label>
              <Input
                id="target-score"
                type="number"
                min={400}
                max={1600}
                step={10}
                value={targetScore}
                onChange={(event) => setTargetScore(event.target.value)}
                className="tabular-nums"
              />
              <p className="text-meta text-ink-muted">Between 400 and 1600, in steps of 10.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-date">Test date</Label>
              <Input
                id="test-date"
                type="date"
                value={testDate}
                onChange={(event) => setTestDate(event.target.value)}
              />
              <p className="text-meta text-ink-muted">
                Used to pace your plan and count down on the dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-6">
          <SectionHeading title="Notifications" />
          <ul className="space-y-4">
            {NOTIFICATION_FIELDS.map((field) => (
              <li
                key={field.key}
                className="flex items-start justify-between gap-6 border-b border-line pb-4 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-[14px] text-ink">{field.label}</p>
                  <p className="mt-0.5 text-meta text-ink-muted">{field.hint}</p>
                </div>
                <Switch
                  checked={notifications[field.key]}
                  onCheckedChange={(checked) =>
                    setNotifications((current) => ({ ...current, [field.key]: checked === true }))
                  }
                  aria-label={field.label}
                />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="primary">
          Save changes
        </Button>
        {saved ? (
          <p role="status" className="text-meta text-ink-muted">
            Saved locally. Persistence arrives in Stage 2.
          </p>
        ) : null}
      </div>
    </form>
  );
}
