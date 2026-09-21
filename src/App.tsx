import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import { X as CloseIcon } from "@phosphor-icons/react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header, BottomNav, RoleSwitcher, ThemeToggle, type View } from "./components/Nav";
import { StudentView, AlertsView } from "./components/StudentDashboard";
import { TeacherView, AdminView } from "./components/Portal";
import { SCHOOL_NAME, DB_KEY } from "./constants";

function Shell() {
  const { user, db } = useApp();
  const [view, setView] = useState<View>("home");
  const [switcher, setSwitcher] = useState(false);
  const [docOpen, setDocOpen] = useState(false);

  useEffect(() => {
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.type === "error") toast.error(detail.msg);
      else toast.success(detail?.msg ?? "Done");
    };
    window.addEventListener("rag-toast", onToast);
    return () => window.removeEventListener("rag-toast", onToast);
  }, []);

  const portalViews: View[] = ["home", "sections", "academics", "alerts", "portal"];
  const effective = view === "profile" && user.role !== "student" ? "home" : view;

  const renderBody = () => {
    if (effective === "alerts") return <AlertsView />;
    if (user.role === "teacher") return <TeacherView />;
    if (user.role === "admin") return <AdminView />;
    if (effective === "portal") return <StudentPortalRedirect setView={setView} />;
    return <StudentView view={effective} />;
  };

  const unread = db.notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-50 via-white to-emerald-50 text-emerald-950 dark:from-emerald-950 dark:via-emerald-950 dark:to-emerald-900">
      <PhoneFrame>
        <Header currentView={effective} onNav={setView} onOpenSwitcher={() => setSwitcher(true)} />
        <main key={effective} className="mx-auto flex max-w-xl flex-col">
          <AnimatePresence mode="wait">
            <motion.div key={effective} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28, ease: "easeOut" }}>
              {renderBody()}
            </motion.div>
          </AnimatePresence>
        </main>
        <BottomNav view={effective} onNav={setView} />

        {/* Docs bar */}
        {user.role === "admin" && (
          <button onClick={() => setDocOpen(true)} className="fixed right-4 top-20 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/30 transition hover:bg-amber-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
          </button>
        )}
      </PhoneFrame>

      <RoleSwitcher open={switcher} onClose={() => setSwitcher(false)} />
      {docOpen && <DocsModal onClose={() => setDocOpen(false)} />}
      <Toaster position="top-center" theme="light" toastOptions={{ style: { borderRadius: "16px", border: "1px solid oklch(0.84 0.09 165)", background: "#fff" } }} />
    </div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-lg sm:my-6 sm:min-h-0 sm:rounded-[2.6rem] sm:border-[10px] sm:border-emerald-950/90 sm:bg-white sm:shadow-2xl sm:shadow-emerald-900/30 sm:dark:bg-emerald-950">
      <div className="relative sm:aspect-auto">{children}</div>
    </div>
  );
}

function StudentPortalRedirect({ setView }: { setView: (v: View) => void }) {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 text-3xl text-white shadow-xl shadow-emerald-600/30">📘</div>
      <p className="text-lg font-bold text-emerald-950 dark:text-emerald-50">Student Portal</p>
      <p className="mt-1 max-w-xs text-sm text-emerald-900/60 dark:text-emerald-100/60">View your profile, courses and academic records for each of your three sections.</p>
      <button onClick={() => setView("home")} className="mt-5 rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 transition hover:bg-emerald-800">Open Dashboard</button>
    </div>
  );
}

function DocsModal({ onClose }: { onClose: () => void }) {
  const { db } = useApp();
  const tables = [
    ["Students", db.students.length], ["Teachers", db.teachers.length], ["Sections", db.sections.length],
    ["Subjects", db.subjects.length], ["Results", db.results.length], ["Attendance", db.attendance.length],
    ["Assignments", db.assignments.length], ["Announcements", db.announcements.length],
  ];
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-emerald-950/60 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[85dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-emerald-950 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-emerald-950 dark:text-emerald-50">System Documentation</p>
            <p className="text-xs text-emerald-900/55 dark:text-emerald-100/50">Database, local API and test credentials</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-emerald-900/60 hover:bg-emerald-50 dark:text-emerald-100/60 dark:hover:bg-white/10"><CloseIcon size={18} weight="bold" /></button>
        </div>
        <div className="space-y-5">
          <Section title="Mock Relational Database">
            <div className="grid grid-cols-2 gap-2">
              {tables.map(([name, count]) => (
                <div key={name as string} className="rounded-xl bg-emerald-50/70 px-3 py-2.5 dark:bg-white/5">
                  <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{count} rows</p>
                  <p className="text-[11px] text-emerald-900/55 dark:text-emerald-100/50">{name}</p>
                </div>
              ))}
            </div>
            <Code label="Persistence" value={`localStorage["${DB_KEY}"] = JSON.stringify(db)`} />
            <p className="text-xs text-emerald-900/60 dark:text-emerald-100/50">All changes persist locally and survive refresh. Use Admin to reset sample data.</p>
          </Section>
          <Section title="Test Credentials">
            <div className="space-y-2">
              <Cred role="Student" name="Abdullahi Dalhatu" id="CSCU/25/11592" hint="abdullahi@rag.edu.ng" />
              <Cred role="Teacher" name="Sadis Muhammad" id="TCH-001" hint="sadis@rag.edu.ng" />
              <Cred role="Admin" name="Misbahu Ahmad" id="ADM-001" hint="misbahu@rag.edu.ng" />
              <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300">Default password for all: demo1234</p>
            </div>
          </Section>
          <Section title="Deployment">
            <Code label="Preview" value={`bun install && bun run dev`} />
            <Code label="Build" value={`bun run build && bun run preview`} />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-emerald-950 dark:text-emerald-50">{title}</p>
      {children}
    </div>
  );
}

function Code({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2 overflow-x-auto rounded-xl bg-emerald-950 px-4 py-3 text-xs text-emerald-100">
      <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-emerald-400">{label}</p>
      <code className="font-mono">{value}</code>
    </div>
  );
}

function Cred({ role, name, id, hint }: { role: string; name: string; id: string; hint: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-emerald-50/70 px-3 py-2.5 dark:bg-white/5">
      <div>
        <p className="text-xs font-bold text-emerald-950 dark:text-emerald-50">{role} · {name}</p>
        <p className="text-[11px] text-emerald-900/55 dark:text-emerald-100/50">{id} · {hint}</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Toolbar />
      <Shell />
    </AppProvider>
  );
}

function Toolbar() {
  const { user } = useApp();
  const label = user.role === "student" ? "Student" : user.role === "teacher" ? "Teacher" : "Admin";
  return (
    <div className="fixed left-1/2 top-3 z-50 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-900/10 bg-white/80 px-3 py-1.5 text-[11px] font-bold text-emerald-700 shadow-lg backdrop-blur dark:border-white/10 dark:bg-emerald-950/80 dark:text-emerald-300 lg:flex">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {SCHOOL_NAME} · {label} Portal
    </div>
  );
}

export default App;