import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, GraduationCap, Bell, Star, ClipboardText, Megaphone, CalendarBlank, CheckCircle,
  ChalkboardTeacher, Timer, Phone, MapPinLine, User, Tray,
} from "@phosphor-icons/react";
import { useApp } from "../context/AppContext";
import { STUDENT_ID } from "../constants";
import { Avatar, ProgressBar, SectionSwitcher, MotionList, MotionCard, child } from "./ui";
import type { View } from "./Nav";
import type { DB } from "../types";

const today = "Friday";
const gradeColor: Record<string, string> = { A: "bg-emerald-600", B: "bg-teal-500", C: "bg-amber-500", D: "bg-orange-500", F: "bg-red-500" };
const pcts: Record<string, number> = { "sec-islamiyya": 92, "sec-tarteel": 88, "sec-hadda": 85 };
const heroBg: Record<string, string> = {
  "sec-islamiyya": "from-emerald-700 via-emerald-600 to-teal-600",
  "sec-tarteel": "from-amber-500 via-amber-500 to-orange-500",
  "sec-hadda": "from-teal-600 via-teal-600 to-cyan-700",
};

function StudentsOf() {
  return null;
}

function useStudent() {
  const { db } = useApp();
  return db.students.find((s) => s.id === STUDENT_ID)!;
}
function ProfileHero() {
  const { db, activeSectionId } = useApp();
  const student = useStudent();
  const currentSection = db.sections.find((s) => s.id === activeSectionId)!;
  return (
    <motion.div variants={child} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 p-5 text-white shadow-xl shadow-emerald-900/30">
      <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-14 -left-6 h-36 w-36 rounded-full bg-emerald-400/20 blur-2xl" />
      <div className="relative flex items-center gap-4">
        <Avatar name={student.name} hue={160} />
        <div className="flex-1">
          <p className="text-sm font-bold">{student.name}</p>
          <p className="text-xs text-emerald-200/80">{student.className}</p>
          <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur">
            <GraduationCap size={12} weight="bold" /> {student.matric || "Student"}
          </div>
        </div>
        <span className="rounded-full bg-white/15 p-2.5 backdrop-blur"><Bell size={16} weight="duotone" /></span>
      </div>
      <div className="relative mt-5 flex items-center justify-between rounded-2xl bg-white/10 p-3 backdrop-blur">
        <div>
          <p className="text-[11px] text-emerald-200/80">Current Section</p>
          <p className="text-base font-bold">{currentSection.name}</p>
        </div>
        <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-emerald-950 shadow">Active</span>
      </div>
    </motion.div>
  );
}

function AttendanceCard() {
  const { db } = useApp();
  const records = db.attendance.filter((a) => a.studentId === STUDENT_ID);
  const present = records.filter((r) => r.status === "Present").length;
  const pct = Math.round((present / Math.max(records.length, 1)) * 100);
  return (
    <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">Attendance Rate</p>
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">{present}/{records.length} present</span>
      </div>
      <div className="mb-2 flex items-end justify-between">
        <span className="text-4xl font-bold text-emerald-950 dark:text-emerald-50">{pct}%</span>
        <span className="mb-1 rounded-full bg-emerald-600/10 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">Excellent</span>
      </div>
      <ProgressBar pct={pct} color="bg-gradient-to-r from-emerald-500 to-teal-400" />
    </div>
  );
}

function TodayClasses() {
  const { db, activeSectionId } = useApp();
  const slots = db.timetable.filter((t) => t.day === today && t.sectionId === activeSectionId).slice(0, 3);
  return (
    <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">Today's Classes</p>
        <span className="text-xs font-semibold text-emerald-500 dark:text-emerald-300">{today}</span>
      </div>
      <div className="space-y-2.5">
        {slots.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 p-3 dark:bg-white/5">
            <div className="flex h-10 w-11 flex-col items-center justify-center rounded-xl bg-emerald-700 text-white">
              <Timer size={14} weight="bold" />
              <span className="text-[10px] font-bold">{s.time}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{s.subject}</p>
              <p className="text-xs text-emerald-900/55 dark:text-emerald-100/50">{s.room}</p>
            </div>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentResults() {
  const { db, activeSectionId } = useApp();
  const results = db.results.filter((r) => r.studentId === STUDENT_ID && r.sectionId === activeSectionId);
  return (
    <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">Recent Results</p>
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 dark:text-emerald-300"><Star size={13} weight="fill" />1st Term</span>
      </div>
      <div className="space-y-2">
        {results.slice(0, 4).map((r) => {
          const sub = db.subjects.find((s) => s.id === r.subjectId);
          return (
            <div key={r.id} className="flex items-center justify-between rounded-2xl bg-emerald-50/70 px-3 py-2.5 dark:bg-white/5">
              <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">{sub?.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-900/70 dark:text-emerald-100/60">{r.ca + r.exam}%</span>
                <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold text-white ${gradeColor[r.grade] ?? "bg-emerald-600"}`}>{r.grade}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpcomingAssignments() {
  const { db, activeSectionId } = useApp();
  const due = db.assignments.filter((a) => a.sectionId === activeSectionId && a.status === "Open");
  return (
    <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">Upcoming Assignments</p>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-300">{due.length} due</span>
      </div>
      <div className="space-y-2.5">
        {due.slice(0, 3).map((a) => (
          <div key={a.id} className="flex items-center gap-3 rounded-2xl border border-emerald-900/6 bg-emerald-50/70 p-3 dark:border-white/10 dark:bg-white/5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white"><ClipboardText size={18} weight="bold" /></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{a.title}</p>
              <p className="text-xs text-emerald-900/55 dark:text-emerald-100/50">{a.subject}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold text-emerald-900/50 dark:text-emerald-100/40">Due</p>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-300">{a.dueDate.slice(5)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LatestAnnouncements() {
  const { db } = useApp();
  const pinned = db.announcements.filter((a) => a.pinned);
  const latest = [...pinned, ...db.announcements.filter((a) => !a.pinned)].slice(0, 2);
  return (
    <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-700 text-white"><Megaphone size={16} weight="bold" /></span>
        <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">Latest Announcements</p>
      </div>
      <div className="space-y-3">
        {latest.map((a) => (
          <div key={a.id} className="rounded-2xl bg-emerald-50/70 p-3.5 dark:bg-white/5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{a.title}</p>
              {a.pinned && <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">Pinned</span>}
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-emerald-900/60 dark:text-emerald-100/50">{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeView() {
  return (
    <MotionList>
      <ProfileHero />
      <div className="grid grid-cols-2 gap-3">
        <MotionCard><AttendanceCard /></MotionCard>
        <MotionCard>
          <div className="flex h-full flex-col justify-center rounded-3xl border border-emerald-900/8 bg-gradient-to-br from-amber-400 to-amber-500 p-5 text-emerald-950 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/40"><Star size={18} weight="fill" /></div>
            <p className="text-lg font-bold leading-tight">3 Sections</p>
            <p className="text-xs font-semibold text-emerald-950/70">Islamiyya · Tarteel · Hadda</p>
          </div>
        </MotionCard>
      </div>
      <MotionCard><TodayClasses /></MotionCard>
      <MotionCard><RecentResults /></MotionCard>
      <MotionCard><UpcomingAssignments /></MotionCard>
      <MotionCard><LatestAnnouncements /></MotionCard>
    </MotionList>
  );
}

function SectionsView() {
  const { db, activeSectionId, setActiveSectionId } = useApp();
  const section = db.sections.find((s) => s.id === activeSectionId)!;
  const subjects = db.subjects.filter((s) => s.sectionId === activeSectionId);
  const teacherIds = [...new Set(subjects.map((s) => s.teacherId))];
  const hero = heroBg[activeSectionId] ?? heroBg["sec-islamiyya"];

  return (
    <MotionList>
      <motion.div variants={child}>
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${hero} p-5 text-white shadow-xl`}>
          <div className="pointer-events-none absolute -right-6 -top-8 h-36 w-36 rounded-full bg-white/15 blur-2xl" />
          <p className="text-xs font-semibold text-white/80">Academic Section</p>
          <p className="mt-1 text-2xl font-bold">{section.name}</p>
          <p className="mt-1 max-w-xs text-xs text-white/85">{section.tagline}</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">Head: {section.head}</span>
          </div>
        </div>
      </motion.div>

      <MotionCard className="pt-1"><SectionSwitcher value={activeSectionId} onChange={setActiveSectionId} /></MotionCard>

      <MotionCard><StudentInfoCard /></MotionCard>
      <MotionCard><SubjectsCard /></MotionCard>

      <MotionCard>
        <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">Attendance</p>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-300">{pcts[activeSectionId]}%</span>
          </div>
          <ProgressBar pct={pcts[activeSectionId]} color="bg-gradient-to-r from-emerald-500 to-teal-400" />
          <div className="mt-3 grid grid-cols-4 gap-2 text-center">
            {[["Present", 90], ["Late", 3], ["Absent", 4], ["Excused", 3]].map(([k, v]) => (
              <div key={k as string} className="rounded-xl bg-emerald-50/70 py-2 dark:bg-white/5">
                <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{v}</p>
                <p className="text-[10px] font-medium text-emerald-900/55 dark:text-emerald-100/50">{k}</p>
              </div>
            ))}
          </div>
        </div>
      </MotionCard>

      <MotionCard><RecentResults /></MotionCard>
      <MotionCard><UpcomingAssignments /></MotionCard>
      <MotionCard><LatestAnnouncements /></MotionCard>

      <MotionCard>
        <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
          <p className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-950 dark:text-emerald-50"><ChalkboardTeacher size={18} weight="bold" className="text-emerald-600 dark:text-emerald-300" /> Teachers</p>
          <div className="space-y-2.5">
            {teacherIds.map((tid) => {
              const t = db.teachers.find((x) => x.id === tid)!;
              return (
                <div key={tid} className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 p-3 dark:bg-white/5">
                  <Avatar name={t.name} hue={tid === "t-sadis" ? 210 : tid === "t-aisha" ? 320 : 130} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{t.name}</p>
                    <p className="text-xs text-emerald-900/55 dark:text-emerald-100/50">{t.title} · {t.phone}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </MotionCard>
    </MotionList>
  );
}

function StudentInfoCard() {
  const student = useStudent();
  return (
    <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">Student Information</p>
        <GraduationCap size={18} weight="bold" className="text-emerald-600 dark:text-emerald-300" />
      </div>
      <div className="space-y-2 text-sm">
        {[["Student", student.name], ...(student.matric ? [["Matric No", student.matric] as [string, string]] : []), ["Class", student.className]].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between rounded-xl bg-emerald-50/70 px-3 py-2.5 dark:bg-white/5">
            <span className="text-xs font-medium text-emerald-900/55 dark:text-emerald-100/50">{k}</span>
            <span className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubjectsCard() {
  const { db, activeSectionId } = useApp();
  const subjects = db.subjects.filter((s) => s.sectionId === activeSectionId);
  return (
    <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
      <p className="mb-1 text-sm font-bold text-emerald-950 dark:text-emerald-50">Subjects</p>
      <p className="mb-3 text-xs text-emerald-900/55 dark:text-emerald-100/50">{subjects.length} courses in this section</p>
      <div className="grid grid-cols-1 gap-2">
        {subjects.map((sub) => {
          const t = db.teachers.find((x) => x.id === sub.teacherId);
          return (
            <div key={sub.id} className="flex items-center gap-3 rounded-2xl border border-emerald-900/6 bg-emerald-50/70 p-3 dark:border-white/10 dark:bg-white/5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white"><BookOpen size={18} weight="duotone" /></div>
              <div className="flex-1">
                <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{sub.name}</p>
                <p className="text-xs text-emerald-900/55 dark:text-emerald-100/50">{sub.code} · {sub.credit} credits · {t?.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AcademicsView() {
  const { db, activeSectionId } = useApp();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const daySlots = db.timetable.filter((t) => t.sectionId === activeSectionId);
  const results = db.results.filter((r) => r.studentId === STUDENT_ID && r.sectionId === activeSectionId);
  const avg = results.length ? (results.reduce((a, r) => a + r.ca + r.exam, 0) / results.length).toFixed(1) : "—";
  return (
    <MotionList>
      <MotionCard><RecentResults /></MotionCard>
      <MotionCard>
        <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
          <p className="mb-3 text-sm font-bold text-emerald-950 dark:text-emerald-50">Weekly Timetable</p>
          <p className="mb-3 text-xs text-emerald-900/55 dark:text-emerald-100/50">Average score: <span className="font-bold text-emerald-700 dark:text-emerald-300">{avg}%</span></p>
          <div className="space-y-3">
            {days.map((d) => {
              const s = daySlots.filter((x) => x.day === d);
              return (
                <div key={d}>
                  <p className="mb-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-300">{d}</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {s.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between rounded-xl bg-emerald-50/70 px-3 py-2 text-sm dark:bg-white/5">
                        <span className="flex items-center gap-2 font-semibold text-emerald-950 dark:text-emerald-50"><Timer size={14} /> {slot.subject}</span>
                        <span className="text-xs font-medium text-emerald-900/55 dark:text-emerald-100/50">{slot.time} · {slot.room}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </MotionCard>
    </MotionList>
  );
}

function ProfileView() {
  const student = useStudent();
  const rows = [
    { icon: <User size={16} weight="bold" />, k: "Student Name", v: student.name },
    { icon: <GraduationCap size={16} weight="bold" />, k: "Matric Number", v: student.matric },
    { icon: <BookOpen size={16} weight="bold" />, k: "Class", v: student.className },
    { icon: <Phone size={16} weight="bold" />, k: "Guardian", v: student.guardian },
    { icon: <Phone size={16} weight="bold" />, k: "Guardian Phone", v: student.guardianPhone },
    { icon: <MapPinLine size={16} weight="bold" />, k: "Address", v: student.address },
  ];
  return (
    <MotionList>
      <motion.div variants={child} className="flex flex-col items-center rounded-3xl bg-gradient-to-br from-emerald-800 to-emerald-900 p-6 text-center text-white shadow-xl shadow-emerald-900/30">
        <Avatar name={student.name} hue={160} />
        <p className="mt-3 text-lg font-bold">{student.name}</p>
        {student.matric && <p className="text-xs text-emerald-200/80">{student.matric}</p>}
        <span className="mt-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">{student.className}</span>
      </motion.div>
      <MotionCard>
        <div className="rounded-3xl border border-emerald-900/8 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
          <p className="mb-3 text-sm font-bold text-emerald-950 dark:text-emerald-50">Personal Details</p>
          <div className="space-y-2.5">
            {rows.map(({ icon, k, v }, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 p-3 dark:bg-white/5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">{icon}</div>
                <div className="flex-1">
                  <p className="text-[11px] text-emerald-900/55 dark:text-emerald-100/50">{k}</p>
                  <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{v}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MotionCard>
    </MotionList>
  );
}

export function StudentView({ view }: { view: View }) {
  return (
    <div className="min-h-[100dvh] px-4 pb-28 pt-5">
      {view === "home" && <HomeView />}
      {view === "sections" && <SectionsView />}
      {view === "academics" && <AcademicsView />}
      {view === "profile" && <ProfileView />}
    </div>
  );
}

const catColor: Record<string, string> = {
  announcement: "bg-emerald-700 text-white",
  assignment: "bg-amber-500 text-white",
  result: "bg-teal-600 text-white",
  attendance: "bg-sky-600 text-white",
};
const catIcon: Record<string, React.ReactNode> = {
  announcement: <Megaphone size={18} weight="bold" />,
  assignment: <ClipboardText size={18} weight="bold" />,
  result: <CheckCircle size={18} weight="bold" />,
  attendance: <CalendarBlank size={18} weight="bold" />,
};
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function AlertsView() {
  const { db, save } = useApp();
  const cats = ["All", "Announcement", "Assignment", "Result", "Attendance"];
  const [filter, setFilter] = useState("All");
  const unread = db.notifications.filter((n) => !n.read).length;
  const list = filter === "All" ? db.notifications : db.notifications.filter((n) => n.category === filter.toLowerCase());
  return (
    <div className="min-h-[100dvh] px-4 pb-28 pt-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-50">Notifications</h2>
          <p className="text-xs text-emerald-900/55 dark:text-emerald-100/50">{unread} unread</p>
        </div>
        <button onClick={() => save({ ...db, notifications: db.notifications.map((n) => ({ ...n, read: true })) })} className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow">Mark all read</button>
      </div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === c ? "bg-emerald-700 text-white shadow" : "bg-emerald-50 text-emerald-900/60 hover:bg-emerald-100 dark:bg-white/5 dark:text-emerald-100/60 dark:hover:bg-white/10"}`}>{c}</button>
        ))}
      </div>
      {list.length === 0 && (
        <div className="flex flex-col items-center rounded-3xl border border-emerald-900/8 bg-white/60 py-12 text-center dark:border-white/10 dark:bg-emerald-950/30">
          <Tray size={32} className="mb-2 text-emerald-900/30 dark:text-emerald-100/30" />
          <p className="text-sm font-semibold text-emerald-900/60 dark:text-emerald-100/60">No notifications in this category</p>
        </div>
      )}
      <MotionList>
        {list.map((n) => (
          <MotionCard key={n.id}>
            <div className="flex gap-3 rounded-2xl border border-emerald-900/8 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${catColor[n.category] ?? catColor.announcement}`}>{catIcon[n.category] ?? catIcon.announcement}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />}
                </div>
                <p className="mt-0.5 text-xs text-emerald-900/60 dark:text-emerald-100/50">{n.body}</p>
                <p className="mt-1 text-[11px] font-medium text-emerald-900/45 dark:text-emerald-100/40">{capitalize(n.category)} · {n.date}</p>
              </div>
            </div>
          </MotionCard>
        ))}
      </MotionList>
    </div>
  );
}

export type { DB };