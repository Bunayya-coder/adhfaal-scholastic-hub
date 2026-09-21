import type { DB, User } from "./types";

export const SCHOOL_NAME = "Riyadul Adhfaal Gwallaga";

export const STUDENT_ID = "stu-abdullahi";
export const DB_KEY = "rag_school_db_v2";

export const seedUsers: User[] = [
  { id: "u-student", role: "student", name: "Abdullahi Dalhatu", title: "Student" },
  { id: "u-teacher", role: "teacher", name: "Sadis Muhammad", title: "Teacher" },
  { id: "u-admin", role: "admin", name: "Misbahu Ahmad", title: "Admin" },
];

export function seedDB(): DB {
  const sinya = "sec-islamiyya";
  const tarteel = "sec-tarteel";
  const hadda = "sec-hadda";

  const teachers = [
    { id: "t-sadis", name: "Sadis Muhammad", title: "HOD, Islamiyya", email: "sadis@rag.edu.ng", phone: "0803 111 2233", sectionIds: [sinya, tarteel, hadda], subjectIds: ["sub-fiqh", "sub-tawheed", "sub-hadith", "sub-arabic"] },
    { id: "t-aliyu", name: "Aliyu M. Bello", title: "Hadda & Tahfeez", email: "aliyu@rag.edu.ng", phone: "0806 555 7788", sectionIds: [hadda], subjectIds: ["sub-hizb", "sub-rub", "sub-mutash"] },
    { id: "t-aisha", name: "Aisha Musa", title: "Tajweed Specialist", email: "aisha@rag.edu.ng", phone: "0807 222 3344", sectionIds: [tarteel], subjectIds: ["sub-tajweed", "sub-makharij", "sub-sifat", "sub-tilawah"] },
  ];
  const teachersMap = Object.fromEntries(teachers.map((t) => [t.id, t]));

  const subjects = [
    { id: "sub-fiqh", sectionId: sinya, name: "Fiqh", code: "ISL-101", teacherId: "t-sadis", credit: 3 },
    { id: "sub-hadith", sectionId: sinya, name: "Hadith", code: "ISL-102", teacherId: "t-sadis", credit: 3 },
    { id: "sub-tawheed", sectionId: sinya, name: "Tawheed", code: "ISL-103", teacherId: "t-sadis", credit: 3 },
    { id: "sub-arabic", sectionId: sinya, name: "Arabic Language", code: "ISL-104", teacherId: "t-sadis", credit: 2 },
    { id: "sub-tajweed", sectionId: tarteel, name: "Ahkam Al-Tajweed", code: "TAR-201", teacherId: "t-aisha", credit: 3 },
    { id: "sub-makharij", sectionId: tarteel, name: "Makharij Al-Huruf", code: "TAR-202", teacherId: "t-aisha", credit: 2 },
    { id: "sub-sifat", sectionId: tarteel, name: "Sifat Al-Huruf", code: "TAR-203", teacherId: "t-aisha", credit: 2 },
    { id: "sub-tilawah", sectionId: tarteel, name: "Tilawah Practice", code: "TAR-204", teacherId: "t-aisha", credit: 1 },
    { id: "sub-hizb", sectionId: hadda, name: "Hizb Memorization", code: "HAD-301", teacherId: "t-aliyu", credit: 4 },
    { id: "sub-rub", sectionId: hadda, name: "Rub' Revision", code: "HAD-302", teacherId: "t-aliyu", credit: 2 },
    { id: "sub-mutash", sectionId: hadda, name: "Mutashabihat Notes", code: "HAD-303", teacherId: "t-aliyu", credit: 2 },
  ];

  const sections = [
    { id: sinya, name: "Islamiyya", tagline: "Core Islamic sciences, jurisprudence and Arabic", color: "emerald", head: "Sadis Muhammad" },
    { id: tarteel, name: "Tarteel", tagline: "Recitation science, tajweed rules and tilawah", color: "amber", head: "Aisha Musa" },
    { id: hadda, name: "Hadda", tagline: "Tahfeez and online memorization milestones", color: "teal", head: "Aliyu M. Bello" },
  ];

  const students = [
    { id: STUDENT_ID, name: "Abdullahi Dalhatu", matric: "CSCU/25/11592", className: "JSS 3 / Tahfeez Level 4", sectionIds: [sinya, tarteel, hadda], guardian: "Alhaji Dalhat Usman", guardianPhone: "0802 444 5566", address: "12 Ahmadu Bello Way, Gwallaga, Gombe", avatarHue: 160 },
    { id: "stu-umar", name: "Umar Ahmad Musa", matric: "", className: "JSS 3 / Tahfeez Level 3", sectionIds: [sinya, tarteel, hadda], guardian: "Malam Ahmad Musa", guardianPhone: "0807 222 3344", address: "5 Isa Kaita Street, Gwallaga", avatarHue: 40 },
    { id: "stu-hassan", name: "Hassan Yakubu", matric: "", className: "JSS 2 / Tahfeez Level 2", sectionIds: [sinya, tarteel, hadda], guardian: "Alhaji Yakubu Sani", guardianPhone: "0810 999 8877", address: "3 Dukku Road, Gombe", avatarHue: 280 },
    { id: "stu-jaafar", name: "Ja'afar Albashir Tahir", matric: "", className: "JSS 2 / Tahfeez Level 2", sectionIds: [sinya, tarteel], guardian: "Malama Tahir Bala", guardianPhone: "0816 777 1122", address: "9 Potiskum Avenue, Gombe", avatarHue: 320 },
    { id: "stu-abubakar", name: "Abubakar Hakimi", matric: "", className: "JSS 1 / Tahfeez Level 1", sectionIds: [sinya, hadda], guardian: "Ustaz Hakimi Garba", guardianPhone: "0809 555 9900", address: "18 Jauro Yadi, Gwallaga", avatarHue: 200 },
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const attendance: DB["attendance"] = [];
  const results: DB["results"] = [];
  let ai = 1;
  let ri = 1;
  for (const s of students) {
    for (const day of days) {
      const present = day !== "Wednesday" || s.id === STUDENT_ID;
      attendance.push({
        id: `att-${ai++}`,
        studentId: s.id,
        sectionId: sinya,
        date: `2025-11-${10 + (ai % 9)}`,
        status: present ? "Present" : ai % 7 === 0 ? "Excused" : "Absent",
      });
    }
  }
  for (const s of students) {
    for (const sub of subjects.filter((x) => s.sectionIds.includes(x.sectionId))) {
      const ca = Math.round(20 + Math.random() * 15);
      const exam = Math.round(35 + Math.random() * 30);
      const total = ca + exam;
      const grade = total >= 80 ? "A" : total >= 70 ? "B" : total >= 60 ? "C" : total >= 50 ? "D" : "F";
      results.push({ id: `res-${ri++}`, studentId: s.id, subjectId: sub.id, sectionId: sub.sectionId, term: "1st Term 2025/2026", ca, exam, grade });
    }
  }

  const assignments: DB["assignments"] = [
    { id: "asn-1", sectionId: sinya, title: "Fiqh Homework: Purification", description: "Write a summary of wudu and ghusl rulings with evidence.", subject: "Fiqh", dueDate: "2025-11-20", status: "Open" },
    { id: "asn-2", sectionId: sinya, title: "Tawheed Essay", description: "Essay on the categories of Tawheed with Quranic verses.", subject: "Tawheed", dueDate: "2025-11-22", status: "Open" },
    { id: "asn-3", sectionId: tarteel, title: "Tajweed Chart Recital", description: "Record and submit tilawah applying madd rules.", subject: "Ahkam Al-Tajweed", dueDate: "2025-11-18", status: "Submitted" },
    { id: "asn-4", sectionId: hadda, title: "Memorize Hizb 12", description: "Complete memorization of Hizb 12 for oral test.", subject: "Hizb Memorization", dueDate: "2025-11-25", status: "Open" },
    { id: "asn-5", sectionId: hadda, title: "Rub' 40 Revision", description: "Daily revision drill for Rub' 40 all pages.", subject: "Rub' Revision", dueDate: "2025-11-16", status: "Overdue" },
  ];

  const announcements: DB["announcements"] = [
    { id: "ann-1", sectionId: sinya, title: "Islamic Quiz Competition", body: "Inter-section Islamic quiz holds Friday at 10am in the main hall. All Islamiyya students are encouraged to participate.", date: "2025-11-12", author: "Sadis Muhammad", pinned: true },
    { id: "ann-2", sectionId: hadda, title: "Hadda Graduation Ceremony", body: "Tahfeez graduation for Level 4 students will hold on November 28. Parents are invited.", date: "2025-11-10", author: "Misbahu Ahmad", pinned: false },
    { id: "ann-3", sectionId: tarteel, title: "New Tajweed Audio Library", body: "We have uploaded new tilawah practice audios for Ahkam Al-Tajweed. Access them from your course page.", date: "2025-11-08", author: "Aisha Musa", pinned: false },
  ];

  const notifications: DB["notifications"] = [
    { id: "not-1", category: "announcement", title: "Islamic Quiz Competition", body: "New announcement in Islamiyya section.", date: "2025-11-12", read: false },
    { id: "not-2", category: "attendance", title: "Attendance Updated", body: "Your attendance for Juma'ah week has been recorded.", date: "2025-11-12", read: false },
    { id: "not-3", category: "result", title: "1st Term Results Out", body: "Results are now available across all three sections.", date: "2025-11-11", read: false },
    { id: "not-4", category: "assignment", title: "Hizb 12 Due Soon", body: "Memorization test approaches. Submit by Nov 25.", date: "2025-11-11", read: true },
  ];

  const timetable: DB["timetable"] = [];
  let ti = 1;
  const slots = [
    [sinya, "08:00", "Tawheed"], [tarteel, "08:00", "Ahkam Al-Tajweed"], [hadda, "08:00", "Hizb Memorization"],
    [sinya, "10:00", "Fiqh"], [tarteel, "10:00", "Makharij Al-Huruf"], [hadda, "10:00", "Rub' Revision"],
    [sinya, "12:00", "Arabic"], [tarteel, "12:00", "Tilawah"], [hadda, "12:00", "Mutashabihat"],
    [sinya, "14:00", "Hadith"], [tarteel, "14:00", "Sifat Al-Huruf"], [hadda, "14:00", "Hizb Review"],
  ];
  for (const day of days) {
    for (const [sid, time, name] of slots) {
      timetable.push({ id: `tt-${ti++}`, sectionId: sid as string, day, time, subject: name as string, room: (sid as string) === "sec-islamiyya" ? "Room A" : (sid as string) === "sec-tarteel" ? "Room B" : "Lab" });
    }
  }

  return { students, teachers, sections, subjects, attendance, results, assignments, announcements, notifications, timetable };
}

export function loadDB(): DB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as DB;
  } catch {
    /* ignore */
  }
  const fresh = seedDB();
  localStorage.setItem(DB_KEY, JSON.stringify(fresh));
  return fresh;
}

export function saveDB(db: DB) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function resetDB(): DB {
  const fresh = seedDB();
  localStorage.setItem(DB_KEY, JSON.stringify(fresh));
  return fresh;
}

function strip<T>(t: T): T {
  return JSON.parse(JSON.stringify(t)) as T;
}

export const teacherBySubject = (db: DB, subjectId: string) => {
  const sub = db.subjects.find((s) => s.id === subjectId);
  const t = sub ? db.teachers.find((x) => x.id === sub.teacherId) : undefined;
  return strip(t);
};

export const sectionById = (db: DB, id: string) => strip(db.sections.find((s) => s.id === id));

export const studentById = (db: DB, id: string) => strip(db.students.find((s) => s.id === id));

export const teacherById = (db: DB, id: string) => strip(db.teachers.find((t) => t.id === id));