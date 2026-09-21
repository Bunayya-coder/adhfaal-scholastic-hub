import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  House, GraduationCap, BookOpen, ChalkboardTeacher, Bell, Sun, Moon, User, CaretRight, PaintBrush,
} from "@phosphor-icons/react";
import { useApp } from "../context/AppContext";
import { SCHOOL_NAME, seedUsers } from "../constants";
import type { Role, User as UserType } from "../types";
import { Avatar } from "./ui";

export type View = "home" | "sections" | "academics" | "alerts" | "portal" | "profile";

export function Header({ currentView, onNav, onOpenSwitcher }: { currentView: View; onNav: (v: View) => void; onOpenSwitcher: () => void }) {
  const { user, db, activeSectionId } = useApp();
  const views: { id: View; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "sections", label: "Sections" },
    { id: "portal", label: "Portal" },
  ];
  const current = views.find((v) => v.id === currentView) ?? views[0];
  const activeSection = db.sections.find((s) => s.id === activeSectionId);
  const unread = db.notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/8 bg-emerald-900 text-white dark:border-white/10">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
        <button onClick={() => onNav("home")} className="flex items-center gap-3 text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 shadow-lg shadow-amber-500/30">
            <BookOpen weight="fill" size={22} />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">{SCHOOL_NAME}</p>
            <p className="text-[11px] text-emerald-200/80">{current.label} · {activeSection?.name}</p>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => onNav("alerts")} className="relative rounded-full p-2 transition hover:bg-white/10">
            <Bell size={20} weight="duotone" />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-emerald-950">
                {unread}
              </span>
            )}
          </button>
          <button onClick={onOpenSwitcher} className="flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-2 transition hover:bg-white/15">
            <Avatar name={user.name} hue={user.role === "student" ? 160 : user.role === "teacher" ? 210 : 45} />
            <CaretRight weight="bold" size={14} className="text-emerald-200/70" />
          </button>
        </div>
      </div>
    </header>
  );
}

export function BottomNav({ view, onNav }: { view: View; onNav: (v: View) => void }) {
  const { db } = useApp();
  const items: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <House weight="duotone" size={22} /> },
    { id: "sections", label: "Sections", icon: <BookOpen weight="duotone" size={22} /> },
    { id: "academics", label: "Academics", icon: <GraduationCap weight="duotone" size={22} /> },
    { id: "alerts", label: "Alerts", icon: <Bell weight="duotone" size={22} /> },
    { id: "portal", label: "Portal", icon: <ChalkboardTeacher weight="duotone" size={22} /> },
  ];
  const unread = db.notifications.filter((n) => !n.read).length;

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div className="pointer-events-auto mx-auto max-w-xl px-4 pb-4">
        <div className="flex items-center justify-around rounded-3xl border border-emerald-900/10 bg-white/95 px-2 py-2 shadow-2xl shadow-emerald-900/20 backdrop-blur-xl dark:border-white/10 dark:bg-emerald-950/95">
          {items.map((it) => {
            const active = view === it.id;
            return (
              <button
                key={it.id}
                onClick={() => onNav(it.id)}
                className={`relative flex w-16 flex-col items-center gap-0.5 rounded-2xl py-1.5 transition ${active ? "text-emerald-700 dark:text-emerald-300" : "text-emerald-900/40 hover:text-emerald-900/70 dark:text-emerald-100/40 dark:hover:text-emerald-100/70"}`}
              >
                {active && (
                  <motion.span layoutId="nav-pill" className="absolute inset-x-1 inset-y-0 -z-0 rounded-2xl bg-emerald-600/10 dark:bg-emerald-400/10" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{it.icon}</span>
                <span className={`relative z-10 text-[10px] font-semibold ${active ? "" : "font-medium"}`}>{it.label}</span>
                {it.id === "alerts" && unread > 0 && (
                  <span className="absolute right-3 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-emerald-950">{unread}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function RoleSwitcher({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { setUser, user } = useApp();
  const [mode, setMode] = useState<"toolbar" | "auth">("toolbar");

  // Render regardless so state stays mounted behind dialog
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-emerald-950/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-w-xl rounded-t-[2rem] border border-emerald-900/10 bg-white p-6 pb-8 shadow-2xl dark:border-white/10 dark:bg-emerald-950"
          >
            <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-emerald-900/15 dark:bg-white/20" />
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-50">Portal Access</h3>
                <p className="text-xs text-emerald-900/55 dark:text-emerald-100/50">Switch between Student, Teacher and Admin roles</p>
              </div>
              {mode === "auth" && (
                <button onClick={() => setMode("toolbar")} className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-300">Quick role picker</button>
              )}
            </div>

            {mode === "toolbar" ? (
              <div className="space-y-2.5">
                {seedUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => { setUser(u as UserType); onClose(); }}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${user.id === u.id ? "border-emerald-500 bg-emerald-50 dark:border-emerald-400/40 dark:bg-emerald-400/10" : "border-emerald-900/8 hover:bg-emerald-50/60 dark:border-white/10 dark:hover:bg-white/5"}`}
                  >
                    <Avatar name={u.name} hue={u.role === "student" ? 160 : u.role === "teacher" ? 210 : 45} />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{u.name}</p>
                      <p className="text-xs text-emerald-900/55 dark:text-emerald-100/50">{u.role === "student" ? "Student · CSCU/25/11592" : u.role === "teacher" ? "Teacher" : "Administrator"}</p>
                    </div>
                    {user.id === u.id && <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white">Active</span>}
                  </button>
                ))}
                <button
                  onClick={() => setMode("auth")}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-900/15 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-white/15 dark:text-emerald-300 dark:hover:bg-white/5"
                >
                  <PaintBrush size={16} /> Simulated sign-in flow
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-emerald-950 dark:text-emerald-100/70">Email / Matric No</label>
                  <input defaultValue={user.role === "student" ? "abdullahi@rag.edu.ng" : user.role === "teacher" ? "mansur@rag.edu.ng" : "ibrahim@rag.edu.ng"} className="w-full rounded-xl border border-emerald-900/12 bg-emerald-50/50 px-4 py-3 text-sm text-emerald-950 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-emerald-950 dark:text-emerald-100/70">Password</label>
                  <input type="password" defaultValue="demo1234" className="w-full rounded-xl border border-emerald-900/12 bg-emerald-50/50 px-4 py-3 text-sm text-emerald-950 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50" />
                </div>
                <button onClick={() => { setUser(user as UserType); onClose(); }} className="w-full rounded-2xl bg-emerald-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 transition hover:bg-emerald-800">
                  Sign in to {SCHOOL_NAME}
                </button>
                <button onClick={() => setMode("toolbar")} className="w-full text-center text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-300">Back</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);
  return (
    <button onClick={() => setDark((d) => !d)} className="rounded-full p-2 text-emerald-100/90 transition hover:bg-white/10" aria-label="Toggle theme">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}