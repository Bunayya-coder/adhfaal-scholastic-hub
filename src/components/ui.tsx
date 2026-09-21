import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import {
  House, GraduationCap, BookOpen, ChalkboardTeacher, Bell, Sun, Moon, ArrowRight,
  CalendarBlank, Megaphone, CheckCircle, ClipboardText,
} from "@phosphor-icons/react";
import { useApp } from "../context/AppContext";
import { SCHOOL_NAME } from "../constants";
import type { Notification } from "../types";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const child = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function MotionList({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
      {children}
    </motion.div>
  );
}

export function MotionCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={child} whileTap={{ scale: 0.99 }} className={className}>
      {children}
    </motion.div>
  );
}

export function SectionBadge({ name, dot }: { name: string; dot: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/20 bg-emerald-600/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {name}
    </span>
  );
}

export function StatPill({ icon, label, value, accent }: { icon: ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-emerald-900/8 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}>{icon}</div>
      <p className="text-xl font-bold text-emerald-950 dark:text-emerald-50">{value}</p>
      <p className="text-xs font-medium text-emerald-900/55 dark:text-emerald-100/50">{label}</p>
    </div>
  );
}

export function SectionSwitcher({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const { db } = useApp();
  const colors: Record<string, { active: string; dot: string }> = {
    "sec-islamiyya": { active: "bg-emerald-700 text-white shadow-lg shadow-emerald-700/30", dot: "bg-emerald-500" },
    "sec-tarteel": { active: "bg-amber-500 text-white shadow-lg shadow-amber-500/30", dot: "bg-amber-400" },
    "sec-hadda": { active: "bg-teal-600 text-white shadow-lg shadow-teal-600/30", dot: "bg-teal-400" },
  };
  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl border border-emerald-900/8 bg-white/70 p-1.5 backdrop-blur dark:border-white/10 dark:bg-emerald-950/40">
      {db.sections.map((s) => {
        const c = colors[s.id] ?? colors["sec-islamiyya"];
        const active = value === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition-all ${active ? c.active : "text-emerald-900/60 hover:bg-emerald-700/5 dark:text-emerald-100/60 dark:hover:bg-white/5"}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-white/80" : c.dot}`} />
            {s.name}
          </button>
        );
      })}
    </div>
  );
}

export function ProgressBar({ pct, color = "bg-emerald-500" }: { pct: number; color?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-900/8 dark:bg-white/10">
      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" as const }} className={`h-full rounded-full ${color}`} />
    </div>
  );
}

export function Avatar({ name, hue }: { name: string; hue: number }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("");
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-md" style={{ background: `linear-gradient(135deg, hsl(${hue} 55% 35%), hsl(${hue + 40} 60% 45%))` }}>
      {initials}
    </div>
  );
}

export function ToastTray() {
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className="pointer-events-none fixed right-4 top-16 z-[90]">
      <div id="rag-toast-slot" />
    </motion.div>
  );
}

export { fade, SCHOOL_NAME };