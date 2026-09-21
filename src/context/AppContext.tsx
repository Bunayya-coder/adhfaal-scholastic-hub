import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { DB, Role, SectionDatum, User } from "../types";
import { DB_KEY, loadDB, resetDB, saveDB, studentById, teacherById, sectionById, STUDENT_ID } from "../constants";

interface AppState {
  db: DB;
  user: User;
  setUser: (u: User) => void;
  activeSectionId: string;
  setActiveSectionId: (id: string) => void;
  persisted: boolean;
  setPersisted: (b: boolean) => void;
  save: (db: DB) => void;
  reset: () => void;
  sectionData: (sid: string) => SectionDatum;
  fireToast: (type: "success" | "error", msg: string) => void;
}

const AppCtx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(() => loadDB());
  const [user, setUser] = useState<User>({ id: "u-student", role: "student", name: "Abdullahi Dalhatu", title: "Student" });
  const [activeSectionId, setActiveSectionId] = useState<string>("sec-islamiyya");
  const [persisted, setPersisted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(DB_KEY) !== null;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    saveDB(db);
    setPersisted(true);
  }, [db]);

  const save = (next: DB) => setDb(next);
  const reset = () => setDb(resetDB());

  const sectionData = (sid: string): SectionDatum => {
    const section = sectionById(db, sid)!;
    const subjects = db.subjects.filter((s) => s.sectionId === sid);
    const records = db.attendance.filter((a) => a.studentId === (user.role === "teacher" ? db.students[0].id : user.role === "admin" ? db.students[0].id : "stu-abdullahi") && a.sectionId === sid);
    const present = records.filter((r) => r.status === "Present").length;
    const total = records.length || 1;
    const teacherId = subjects[0]?.teacherId ?? db.teachers[0].id;
    return {
      section,
      subjects,
      teacher: teacherById(db, teacherId)!,
      attendance: { present, total, pct: Math.round((present / total) * 100) },
      results: db.results.filter((r) => r.studentId === STUDENT_ID && r.sectionId === sid),
      assignments: db.assignments.filter((a) => a.sectionId === sid),
      announcements: db.announcements.filter((a) => a.sectionId === sid),
      timetable: db.timetable.filter((t) => t.sectionId === sid),
    };
  };

  const fireToast = (type: "success" | "error", msg: string) => {
    const evt = new CustomEvent("rag-toast", { detail: { type, msg } });
    window.dispatchEvent(evt);
  };

  const value = useMemo(
    () => ({ db, user, setUser, activeSectionId, setActiveSectionId, persisted, setPersisted, save, reset, sectionData, fireToast }),
    [db, user, activeSectionId, persisted],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}