export type Role = "student" | "teacher" | "admin";

export interface Teacher {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  sectionIds: string[];
  subjectIds: string[];
}

export interface Student {
  id: string;
  name: string;
  matric: string;
  className: string;
  sectionIds: string[];
  guardian: string;
  guardianPhone: string;
  address: string;
  avatarHue: number;
}

export interface Section {
  id: string;
  name: string; // Islamiyya, Tarteel, Hadda
  tagline: string;
  color: string; // tailwind accent key
  head: string;
}

export interface Subject {
  id: string;
  sectionId: string;
  name: string;
  code: string;
  teacherId: string;
  credit: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  sectionId: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Excused";
}

export interface Result {
  id: string;
  studentId: string;
  subjectId: string;
  sectionId: string;
  term: string;
  ca: number;
  exam: number;
  grade: string;
}

export interface Assignment {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: "Open" | "Submitted" | "Overdue";
}

export interface Announcement {
  id: string;
  sectionId: string;
  title: string;
  body: string;
  date: string;
  author: string;
  pinned: boolean;
}

export interface Notification {
  id: string;
  category: "announcement" | "assignment" | "result" | "attendance";
  title: string;
  body: string;
  date: string;
  read: boolean;
}

export interface TimetableSlot {
  id: string;
  sectionId: string;
  day: string;
  time: string;
  subject: string;
  room: string;
}

export interface DB {
  students: Student[];
  teachers: Teacher[];
  sections: Section[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  results: Result[];
  assignments: Assignment[];
  announcements: Announcement[];
  notifications: Notification[];
  timetable: TimetableSlot[];
}

export interface User {
  id: string;
  role: Role;
  name: string;
  title: string;
}

export interface SectionDatum {
  section: Section;
  subjects: Subject[];
  teacher: Teacher;
  attendance: { present: number; total: number; pct: number };
  results: Result[];
  assignments: Assignment[];
  announcements: Announcement[];
  timetable: TimetableSlot[];
}