import { AppSidebar } from "@/components/shell/AppSidebar";
import { TopBar } from "@/components/shell/TopBar";

/**
 * The student and admin shell: a persistent 240px sidebar with the nav and a
 * top bar, with the content area scrolling independently. The test-taking
 * screen deliberately lives outside this layout, in the (exam) route group.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-paper">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main id="main" className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1200px] px-4 py-8 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
