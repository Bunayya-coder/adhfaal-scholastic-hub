import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ChalkboardTeacher, NotePencil, Megaphone, CheckCircle, ChartLineUp, Users, ShieldCheck,
  Plus, Star, ClipboardText, CalendarBlank, Timer, BookOpen, X, Graph, FileText,
} from "@phosphor-icons/react";
import { Avatar, ProgressBar, MotionList, MotionCard, child } from "./ui";

type Tab = "overview" | "attendance" | "results" | "assignments";

export function TeacherView() {
  const { db, save, user, fireToast } = useApp();
  const [tab, setTab] = useState<Tab>("overview");
  const teacher = db.teachers.find((t) => t.name === user.name) ?? db.teachers[0];
  const subjects = db.subjects.filter((s) => s.teacherId === teacher.id);
  const students = db.students;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <ChartLineUp size={16} weight="bold" /> },
    { id: "attendance", label: "Attendance", icon: <CheckCircle size={16} weight="bold" /> },
    { id: "results", label: "Results", icon: <Star size={16} weight="bold" /> },
    { id: "assignments", label: "Assignments", icon: <ClipboardText size={16} weight="bold" /> },
  ];

  return (
    <div className="min-h-[100dvh] px-4 pb-28 pt-5">
      <MotionList>
        <MotionCard>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-800 via-sky-700 to-emerald-900 p-5 text-white shadow-xl shadow-sky-900/30">
            <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-2xl" />
            <div className="relative flex items-center gap-4">
              <Avatar name={teacher.name} hue={210} />
              <div>
                <p className="text-sm font-bold">{teacher.name}</p>
                <p className="text-xs text-sky-200/80">{teacher.title}</p>
                <p className="mt-1 text-[11px] text-sky-200/60">{teacher.phone}</p>
              </div>
            </div>
            <div className="relative mt-4 flex gap-2">
              {subjects.slice(0, 3).map((s) => (
                <span key={s.id} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">{s.name}</span>
              ))}
            </div>
          </div>
        </MotionCard>

        <MotionCard>
          <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-emerald-900/8 bg-white/70 p-1.5 backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-[10px] font-semibold transition ${tab === t.id ? "bg-sky-600 text-white shadow" : "text-emerald-900/60 hover:bg-sky-50 dark:text-emerald-100/60 dark:hover:bg-white/5"}`}>{t.icon}{t.label}</button>
            ))}
          </div>
        </MotionCard>

        {tab === "overview" && <Overview teacherId={teacher.id} />}
        {tab === "attendance" && <AttendanceRegister />}
        {tab === "results" && <ResultEntry />}
        {tab === "assignments" && <Assignments />}
      </MotionList>
    </div>
  );
}

function Overview({ teacherId }: { teacherId: string }) {
  const { db, activeSectionId } = useApp();
  const classSize = db.students.filter((s) => s.sectionIds.includes(activeSectionId));
  const subjects = db.subjects.filter((s) => s.teacherId === teacherId);
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <MotionCard>
          <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white"><Users size={18} weight="bold" /></div>
            <p className="text-xl font-bold text-emerald-950 dark:text-emerald-50">{classSize.length}</p>
            <p className="text-xs font-medium text-emerald-900/55 dark:text-emerald-100/50">Students in class</p>
          </div>
        </MotionCard>
        <MotionCard>
          <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white"><BookOpen size={18} weight="bold" /></div>
            <p className="text-xl font-bold text-emerald-950 dark:text-emerald-50">{subjects.length}</p>
            <p className="text-xs font-medium text-emerald-900/55 dark:text-emerald-100/50">Subjects taught</p>
          </div>
        </MotionCard>
      </div>
      <MotionCard><ClassRoster /></MotionCard>
    </>
  );
}

function ClassRoster() {
  const { db, activeSectionId } = useApp();
  const roster = db.students.filter((s) => s.sectionIds.includes(activeSectionId));
  return (
    <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">Class Roster</p>
        <span className="text-xs font-semibold text-emerald-500 dark:text-emerald-300">{roster.length} students</span>
      </div>
      <div className="space-y-2.5">
        {roster.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 p-3 dark:bg-white/5">
            <Avatar name={s.name} hue={s.avatarHue} />
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{s.name}</p>
              {s.matric && <p className="text-xs text-emerald-900/55 dark:text-emerald-100/50">{s.matric}</p>}
            </div>
            <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttendanceRegister() {
  const { db, save, activeSectionId, fireToast } = useApp();
  const [marks, setMarks] = useState<Record<string, string>>({});
  const roster = db.students.filter((s) => s.sectionIds.includes(activeSectionId));
  const statuses = ["Present", "Absent", "Late", "Excused"];

  const markAll = (status: string) => {
    const next: Record<string, string> = {};
    roster.forEach((s) => (next[s.id] = status));
    setMarks(next);
  };

  const saveAttendance = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const existing = db.attendance.filter((a) => !(a.date === todayStr && a.sectionId === activeSectionId && roster.some((r) => r.id === a.studentId)));
    const fresh: typeof db.attendance = roster.map((s) => ({
      id: `att-${Date.now()}-${s.id}`, studentId: s.id, sectionId: activeSectionId, date: todayStr,
      status: (marks[s.id] as "Present" | "Absent" | "Late" | "Excused") ?? "Present",
    }));
    save({ ...db, attendance: [...fresh, ...existing] });
    fireToast("success", "Attendance saved successfully");
    setMarks({});
  };

  const statusColor: Record<string, string> = {
    Present: "bg-emerald-600 text-white", Absent: "bg-red-500 text-white", Late: "bg-amber-500 text-white", Excused: "bg-sky-600 text-white",
  };

  return (
    <>
      <MotionCard>
        <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
          <p className="mb-3 text-sm font-bold text-emerald-950 dark:text-emerald-50">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button key={s} onClick={() => markAll(s)} className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 dark:bg-white/10 dark:text-emerald-200 dark:hover:bg-white/15">Mark all {s}</button>
            ))}
            <button onClick={saveAttendance} className="rounded-full bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow transition hover:bg-emerald-800">Save register</button>
          </div>
        </div>
      </MotionCard>
      <MotionCard>
        <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
          <p className="mb-3 text-sm font-bold text-emerald-950 dark:text-emerald-50">Today's Register</p>
          <div className="space-y-2.5">
            {roster.map((s) => (
              <div key={s.id} className="rounded-2xl bg-emerald-50/70 p-3 dark:bg-white/5">
                <div className="mb-2 flex items-center gap-3">
                  <Avatar name={s.name} hue={s.avatarHue} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{s.name}</p>
                    {s.matric && <p className="text-[11px] text-emerald-900/55 dark:text-emerald-100/50">{s.matric}</p>}
                  </div>
                  {marks[s.id] && <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusColor[marks[s.id]]}`}>{marks[s.id]}</span>}
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {statuses.map((st) => (
                    <button key={st} onClick={() => setMarks((m) => ({ ...m, [s.id]: st }))} className={`rounded-lg py-1.5 text-[10px] font-bold transition ${marks[s.id] === st ? statusColor[st] : "bg-white/70 text-emerald-900/55 hover:bg-white dark:bg-white/5 dark:text-emerald-100/50 dark:hover:bg-white/10"}`}>{st}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </MotionCard>
    </>
  );
}

function ResultEntry() {
  const { db, save, activeSectionId, fireToast } = useApp();
  const roster = db.students.filter((s) => s.sectionIds.includes(activeSectionId));
  const sectionNames = db.sections.map((s) => s.name);
  const [form, setForm] = useState<{ studentId: string; subject: string; ca: string; exam: string }>({ studentId: roster[0]?.id ?? "", subject: sectionNames[0] ?? "", ca: "", exam: "" });

  const submit = () => {
    const ca = Number(form.ca), exam = Number(form.exam);
    if (!form.studentId || form.ca === "" || form.exam === "") { fireToast("error", "Please fill all fields before submitting"); return; }
    const total = ca + exam;
    const grade = total >= 80 ? "A" : total >= 70 ? "B" : total >= 60 ? "C" : total >= 50 ? "D" : "F";
    const subject = db.subjects.find((x) => x.name === form.subject) ?? db.subjects[0];
    save({
      ...db,
      results: [...db.results, { id: `res-${Date.now()}`, studentId: form.studentId, subjectId: subject.id, sectionId: subject.sectionId, term: "1st Term 2025/2026", ca, exam, grade }],
    });
    fireToast("success", `Result recorded: ${form.subject} - ${grade}`);
    setForm({ ...form, ca: "", exam: "" });
  };

  return (
    <>
      <MotionCard>
        <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
          <p className="mb-3 text-sm font-bold text-emerald-950 dark:text-emerald-50">Record Result / CA</p>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-emerald-950/70 dark:text-emerald-100/60">Student</label>
              <select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} className="w-full rounded-xl border border-emerald-900/12 bg-emerald-50/50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50">
                {roster.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-emerald-950/70 dark:text-emerald-100/60">Subject</label>
              <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-xl border border-emerald-900/12 bg-emerald-50/50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50">
                {db.subjects.filter((s) => s.sectionId === activeSectionId).map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-emerald-950/70 dark:text-emerald-100/60">CA Score (40)</label>
                <input type="number" value={form.ca} onChange={(e) => setForm({ ...form, ca: e.target.value })} className="w-full rounded-xl border border-emerald-900/12 bg-emerald-50/50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-emerald-950/70 dark:text-emerald-100/60">Exam Score (60)</label>
                <input type="number" value={form.exam} onChange={(e) => setForm({ ...form, exam: e.target.value })} className="w-full rounded-xl border border-emerald-900/12 bg-emerald-50/50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50" />
              </div>
            </div>
            <button onClick={submit} className="w-full rounded-2xl bg-emerald-700 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 transition hover:bg-emerald-800">Submit Result</button>
          </div>
        </div>
      </MotionCard>
      <MotionCard>
        <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
          <p className="mb-3 text-sm font-bold text-emerald-950 dark:text-emerald-50">Recent Submissions</p>
          <div className="space-y-2">
            {db.results.slice().reverse().slice(0, 4).map((r) => {
              const st = db.students.find((s) => s.id === r.studentId);
              const sub = db.subjects.find((s) => s.id === r.subjectId);
              return (
                <div key={r.id} className="flex items-center justify-between rounded-2xl bg-emerald-50/70 px-3 py-2.5 dark:bg-white/5">
                  <div>
                    <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">{st?.name}</p>
                    <p className="text-[11px] text-emerald-900/55 dark:text-emerald-100/50">{sub?.name}</p>
                  </div>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold text-white ${r.grade === "A" ? "bg-emerald-600" : r.grade === "B" ? "bg-teal-500" : r.grade === "C" ? "bg-amber-500" : r.grade === "D" ? "bg-orange-500" : "bg-red-500"}`}>{r.grade}</span>
                </div>
              );
            })}
          </div>
        </div>
      </MotionCard>
    </>
  );
}

function Assignments() {
  const { db, save, activeSectionId, fireToast } = useApp();
  const [form, setForm] = useState<{ title: string; subject: string; dueDate: string }>({ title: "", subject: "", dueDate: new Date().toISOString().slice(0, 10) });

  const publish = () => {
    if (!form.title || !form.subject) { fireToast("error", "Title and subject are required"); return; }
    save({
      ...db,
      assignments: [...db.assignments, {
        id: `asn-${Date.now()}`, sectionId: activeSectionId, title: form.title, description: "Posted by teacher, pending description", subject: form.subject, dueDate: form.dueDate, status: "Open",
      }],
    });
    fireToast("success", "Assignment published");
    setForm({ title: "", subject: "", dueDate: new Date().toISOString().slice(0, 10) });
  };

  return (
    <>
      <MotionCard>
        <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
          <p className="mb-3 text-sm font-bold text-emerald-950 dark:text-emerald-50">Publish Assignment</p>
          <div className="space-y-3">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Assignment title" className="w-full rounded-xl border border-emerald-900/12 bg-emerald-50/50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50" />
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="w-full rounded-xl border border-emerald-900/12 bg-emerald-50/50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50" />
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full rounded-xl border border-emerald-900/12 bg-emerald-50/50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50" />
            <button onClick={publish} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 transition hover:bg-emerald-800"><NotePencil size={16} weight="bold" /> Publish</button>
          </div>
        </div>
      </MotionCard>
      <MotionCard>
        <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
          <p className="mb-3 text-sm font-bold text-emerald-950 dark:text-emerald-50">Active Assignments</p>
          <div className="space-y-2">
            {db.assignments.filter((a) => a.sectionId === activeSectionId).map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-2xl bg-emerald-50/70 px-3 py-2.5 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white"><Clipped size={15} weight="bold" /></div>
                  <div>
                    <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{a.title}</p>
                    <p className="text-[11px] text-emerald-900/55 dark:text-emerald-100/50">{a.subject} · Due {a.dueDate.slice(5)}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      </MotionCard>
    </>
  );
}

function Clipped({ size, weight }: { size?: number; weight?: "bold" }) {
  return <ClipboardText size={size} weight={weight} />;
}

export function AdminView() {
  const { db, save, fireToast } = useApp();
  const [studentModal, setStudentModal] = useState(false);
  const [announceModal, setAnnounceModal] = useState(false);
  const [announceForm, setAnnounceForm] = useState({ title: "", body: "", section: db.sections[0].id });

  const stats = useMemo(() => {
    const total = db.students.length;
    const perSection = db.sections.map((s) => ({ name: s.name, count: db.students.filter((st) => st.sectionIds.includes(s.id)).length }));
    const teachers = db.teachers.length;
    const subjects = db.subjects.length;
    return { total, perSection, teachers, subjects };
  }, [db]);

  const publishAnnouncement = () => {
    if (!announceForm.title) { fireToast("error", "Announcement title is required"); return; }
    save({
      ...db,
      announcements: [...db.announcements, { id: `ann-${Date.now()}`, sectionId: announceForm.section, title: announceForm.title, body: announceForm.body || "No additional details.", date: new Date().toISOString().slice(0, 10), author: "Misbahu Ahmad", pinned: false }],
    });
    fireToast("success", "Announcement broadcast");
    setAnnounceModal(false);
  };

  return (
    <div className="min-h-[100dvh] px-4 pb-28 pt-5">
      <MotionList>
        <MotionCard>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 via-amber-700 to-emerald-900 p-5 text-white shadow-xl shadow-amber-900/30">
            <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-emerald-300/20 blur-2xl" />
            <div className="relative flex items-center gap-4">
              <Avatar name="Mi" hue={45} />
              <div>
                <p className="text-sm font-bold">Misbahu Ahmad</p>
                <p className="text-xs text-amber-100/80">School Administrator</p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold backdrop-blur"><ShieldCheck size={11} weight="bold" /> Full access</span>
              </div>
            </div>
          </div>
        </MotionCard>

        <div className="grid grid-cols-2 gap-3">
          {[["Students", stats.total, <Users key="u" size={18} weight="bold" />, "bg-emerald-700"], ["Teachers", stats.teachers, <ChalkboardTeacher key="t" size={18} weight="bold" />, "bg-sky-600"], ["Subjects", stats.subjects, <BookOpen key="s" size={18} weight="bold" />, "bg-amber-500"], ["Sections", db.sections.length, <ShieldCheck key="sc" size={18} weight="bold" />, "bg-teal-600"]].map(([label, value, icon, bg], i) => (
          <MotionCard key={i}>
            <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl text-white ${bg as string}`}>{icon as React.ReactNode}</div>
              <p className="text-2xl font-bold text-emerald-950 dark:text-emerald-50">{value}</p>
              <p className="text-xs font-medium text-emerald-900/55 dark:text-emerald-100/50">{label}</p>
            </div>
          </MotionCard>
        ))}
      </div>

      <MotionCard>
        <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
          <p className="mb-4 text-sm font-bold text-emerald-950 dark:text-emerald-50">Enrollment by Section</p>
          <div className="space-y-3">
            {stats.perSection.map((s) => {
              const pct = Math.round((s.count / Math.max(stats.total, 1)) * 100);
              const bar = s.name === "Islamiyya" ? "bg-emerald-600" : s.name === "Tarteel" ? "bg-amber-500" : "bg-teal-600";
              return (
                <div key={s.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-950 dark:text-emerald-50">{s.name}</span>
                    <span className="font-bold text-emerald-900/60 dark:text-emerald-100/60">{s.count} students</span>
                  </div>
                  <ProgressBar pct={pct} color={bar} />
                </div>
              );
            })}
          </div>
        </div>
      </MotionCard>

      <MotionCard><StudentTable onAdd={() => setStudentModal(true)} /></MotionCard>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <MotionCard>
          <button onClick={() => setAnnounceModal(true)} className="flex w-full flex-col items-center gap-2 rounded-3xl border border-dashed border-emerald-900/15 bg-emerald-50/60 p-5 text-emerald-700 transition hover:bg-emerald-50 dark:border-white/15 dark:bg-white/5 dark:text-emerald-300 dark:hover:bg-white/10">
            <Megaphone size={22} weight="duotone" />
            <span className="text-xs font-bold">Broadcast Announcement</span>
          </button>
        </MotionCard>
        <MotionCard>
          <button onClick={() => fireToast("success", "Report already up to date")} className="flex w-full flex-col items-center gap-2 rounded-3xl border border-dashed border-emerald-900/15 bg-emerald-50/60 p-5 text-emerald-700 transition hover:bg-emerald-50 dark:border-white/15 dark:bg-white/5 dark:text-emerald-300 dark:hover:bg-white/10">
            <FileText size={22} weight="duotone" />
            <span className="text-xs font-bold">Generate Report</span>
          </button>
        </MotionCard>
      </div>
      </MotionList>

      {studentModal && <StudentModal onClose={() => setStudentModal(false)} />}
      {announceModal && (
        <AnnouncementModal form={announceForm} setForm={setAnnounceForm} onPublish={publishAnnouncement} onClose={() => setAnnounceModal(false)} />
      )}
    </div>
  );
}

function StudentTable({ onAdd }: { onAdd: () => void }) {
  const { db, save, fireToast } = useApp();
  return (
    <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">Student Records</p>
        <button onClick={onAdd} className="flex items-center gap-1 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow"><Plus size={13} weight="bold" /> Add</button>
      </div>
      <div className="space-y-2">
        {db.students.map((s) => (
          <div key={s.id} className="group flex items-center gap-3 rounded-2xl bg-emerald-50/70 p-3 dark:bg-white/5">
            <Avatar name={s.name} hue={s.avatarHue} />
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{s.name}</p>
              {s.matric && <p className="text-[11px] text-emerald-900/55 dark:text-emerald-100/50">{s.matric}</p>}
            </div>
            <button onClick={() => { save({ ...db, students: db.students.filter((x) => x.id !== s.id), attendance: db.attendance.filter((a) => a.studentId !== s.id), results: db.results.filter((r) => r.studentId !== s.id) }); fireToast("success", `${s.name} removed`); }} className="rounded-full p-2 text-red-500/50 opacity-0 transition hover:bg-red-50 group-hover:opacity-100 dark:hover:bg-red-500/10"><X size={16} weight="bold" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentModal({ onClose }: { onClose: () => void }) {
  const { db, save, fireToast } = useApp();
  const [form, setForm] = useState({ name: "", matric: "", className: "" });
  const submit = () => {
    if (!form.name) { fireToast("error", "Name is required"); return; }
    save({
      ...db,
      students: [...db.students, { id: `stu-${Date.now()}`, name: form.name, matric: form.matric, className: form.className || "New Student", sectionIds: ["sec-islamiyya", "sec-tarteel", "sec-hadda"], guardian: "—", guardianPhone: "—", address: "—", avatarHue: Math.floor(Math.random() * 360) }],
    });
    fireToast("success", "Student added");
    onClose();
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-emerald-950/60 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-emerald-950 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-bold text-emerald-950 dark:text-emerald-50">Add Student</p>
          <button onClick={onClose} className="rounded-full p-2 text-emerald-900/60 hover:bg-emerald-50 dark:text-emerald-100/60 dark:hover:bg-white/10"><X size={18} weight="bold" /></button>
        </div>
        <div className="space-y-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full rounded-xl border border-emerald-900/12 bg-emerald-50/50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50" />
          <input value={form.matric} onChange={(e) => setForm({ ...form, matric: e.target.value })} placeholder="Matric / Registration No" className="w-full rounded-xl border border-emerald-900/12 bg-emerald-50/50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50" />
          <input value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} placeholder="Class / Tahfeez level" className="w-full rounded-xl border border-emerald-900/12 bg-emerald-50/50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50" />
          <button onClick={submit} className="w-full rounded-2xl bg-emerald-700 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 transition hover:bg-emerald-800">Save Student</button>
        </div>
      </div>
    </div>
  );
}

function AnnouncementModal({ form, setForm, onPublish, onClose }: {
  form: { title: string; body: string; section: string };
  setForm: (f: { title: string; body: string; section: string }) => void;
  onPublish: () => void;
  onClose: () => void;
}) {
  const { db } = useApp();
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-emerald-950/60 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-emerald-950 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-bold text-emerald-950 dark:text-emerald-50">Broadcast Announcement</p>
          <button onClick={onClose} className="rounded-full p-2 text-emerald-900/60 hover:bg-emerald-50 dark:text-emerald-100/60 dark:hover:bg-white/10"><X size={18} weight="bold" /></button>
        </div>
        <div className="space-y-3">
          <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="w-full rounded-xl border border-emerald-900/12 bg-emerald-50/50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50">
            {db.sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            <option value="broadcast">All Sections (Broadcast)</option>
          </select>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" className="w-full rounded-xl border border-emerald-900/12 bg-emerald-50/50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50" />
          <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Details..." rows={3} className="w-full rounded-xl border border-emerald-900/12 bg-emerald-50/50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50" />
          <button onClick={onPublish} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 transition hover:bg-emerald-800"><Megaphone size={15} weight="bold" /> Broadcast</button>
        </div>
      </div>
    </div>
  );
}