import Link from "next/link";
import { ArrowRight, BarChart3, BookOpen, ClipboardList, Timer as TimerIcon } from "lucide-react";
import { MATH_DOMAINS, RW_DOMAINS, SKILLS_BY_DOMAIN } from "@/lib/taxonomy";

export const metadata = {
  title: "Digital SAT preparation",
};

const FEATURES = [
  {
    icon: BookOpen,
    title: "A question bank you can actually navigate",
    body: "Filter by section, domain, skill, difficulty and your own history. Every question comes with a worked explanation, not just a letter.",
  },
  {
    icon: TimerIcon,
    title: "Practice tests that behave like the real thing",
    body: "Two adaptive-style modules per section, a countdown you can hide, annotation, answer elimination and a reference sheet — modelled on the digital testing app.",
  },
  {
    icon: BarChart3,
    title: "Progress you can read at a glance",
    body: "Score trend, accuracy by domain, time per question and your hardest skills, tracked over months rather than sessions.",
  },
  {
    icon: ClipboardList,
    title: "Your tutor sees the same picture",
    body: "Tutors assign targeted work, watch completion, and spot the skills a student keeps losing marks on.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-16 lg:px-8 lg:py-24">
          <p className="text-badge font-medium uppercase tracking-[0.04em] text-ink-muted">
            Digital SAT preparation
          </p>
          <h1 className="mt-4 max-w-[20ch] text-[40px] font-semibold leading-[1.1] text-ink lg:text-[52px]">
            Practice the test you are actually going to sit.
          </h1>
          <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed text-ink-muted">
            MOGSAT pairs a filterable question bank with full-length, adaptive-style practice
            tests and long-term progress tracking. Work on your own, or with a tutor who can
            see exactly where the marks are going.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-input border border-accent bg-accent px-6 py-3 text-[15px] font-medium text-on-accent transition-ui hover:opacity-90"
            >
              Create an account
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-input border border-line px-6 py-3 text-[15px] text-ink transition-ui hover:border-ink-muted"
            >
              Explore the demo
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-16 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title}>
                <feature.icon size={20} className="text-ink-muted" aria-hidden />
                <h2 className="mt-4 text-[17px] font-medium text-ink">{feature.title}</h2>
                <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-ink-muted">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-16 lg:px-8">
          <h2 className="text-[24px] font-semibold text-ink">Every domain on the test</h2>
          <p className="mt-2 max-w-[62ch] text-[14px] text-ink-muted">
            The bank is organised by the same eight domains the exam reports against, so a weak
            score band maps directly onto something you can practise.
          </p>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {[
              { title: "Math", domains: MATH_DOMAINS },
              { title: "Reading and Writing", domains: RW_DOMAINS },
            ].map((group) => (
              <div key={group.title} className="rounded-card border border-line bg-surface p-6">
                <h3 className="text-label font-medium uppercase tracking-[0.04em] text-ink-muted">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-4">
                  {group.domains.map((domain) => (
                    <li key={domain} className="border-b border-line pb-4 last:border-0 last:pb-0">
                      <p className="text-[15px] text-ink">{domain}</p>
                      <p className="mt-1 text-meta text-ink-muted">
                        {SKILLS_BY_DOMAIN[domain].join(" · ")}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-16 lg:px-8">
          <h2 className="text-[24px] font-semibold text-ink">Inside the app</h2>
          <p className="mt-2 max-w-[62ch] text-[14px] text-ink-muted">
            Screenshots go here once the interface is signed off.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {["Test-taking screen", "Progress tracking", "Tutor cohort view"].map((caption) => (
              <figure key={caption}>
                <div
                  role="img"
                  aria-label={`Screenshot placeholder: ${caption}`}
                  className="flex aspect-[4/3] items-center justify-center rounded-card border border-dashed border-line bg-surface"
                >
                  <span className="text-meta text-ink-muted">Screenshot placeholder</span>
                </div>
                <figcaption className="mt-2 text-meta text-ink-muted">{caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-[1200px] px-4 py-16 lg:px-8">
          <div className="rounded-card border border-line bg-surface p-8 lg:p-12">
            <h2 className="max-w-[24ch] text-[24px] font-semibold text-ink">
              Start with a diagnostic and find out where you actually stand.
            </h2>
            <p className="mt-3 max-w-[62ch] text-[14px] text-ink-muted">
              One full-length practice test gives you a score estimate with a range, a per-domain
              breakdown, and a first set of drills aimed at the skills costing you the most.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-input border border-accent bg-accent px-6 py-3 text-[15px] font-medium text-on-accent transition-ui hover:opacity-90"
            >
              Create an account
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
