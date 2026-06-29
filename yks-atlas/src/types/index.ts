// User & Auth
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: number;
  examDate: string; // ISO date string
  track: 'sayisal' | 'sozel' | 'esit_agirlik' | 'ozel';
}

// Gamification
export interface UserStats {
  xp: number;
  level: number;
  badges: string[];
  streak: number;
  totalStudyMinutes: number;
  lastActivityDate: string;
}

// Task
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  subject?: string;
  priority: 'düşük' | 'normal' | 'yüksek';
  dueDate?: string;
  done: boolean;
  doneAt?: number;
  createdAt: number;
  updatedAt: number;
}

// Subject & Topic
export interface TopicData {
  status: 'yok' | 'devam' | 'bitti';
  correct: number;
  wrong: number;
  blank: number;
  solved: number;
  lastStudied?: number;
  notes?: string;
}

export interface Subject {
  userId: string;
  subjectName: string;
  topics: Record<string, TopicData>;
  createdAt: number;
  updatedAt: number;
}

// Exam
export interface ExamSection {
  name: string;
  correct: number;
  wrong: number;
  blank: number;
  total?: number;
}

export interface Exam {
  id: string;
  userId: string;
  name: string;
  type: 'TYT' | 'AYT';
  date: string;
  sections: ExamSection[];
  notes?: string;
  simulatedRank?: number;
  createdAt: number;
  updatedAt: number;
}

// Mistake
export interface Mistake {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  examId?: string;
  description: string;
  notes?: string;
  imageURLs?: string[];
  category?: 'kavram_hatasi' | 'isllem_hatasi' | 'dikkatsizlik' | 'bilgi_boslugu';
  difficulty: 'kolay' | 'orta' | 'zor';
  reviewed: boolean;
  reviewedAt?: number;
  createdAt: number;
  updatedAt: number;
}

// Book
export interface BookTopicProgress {
  status: 'yok' | 'devam' | 'bitti';
  solvedCount: number;
  correctCount?: number;
}

export interface Book {
  id: string;
  userId: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  coverURL?: string;
  subject: string;
  topicsProgress: Record<string, BookTopicProgress>;
  addedAt: number;
  updatedAt: number;
}

// Note
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  subject?: string;
  tags?: string[];
  attachments?: {
    name: string;
    url: string;
    type: 'image' | 'pdf';
  }[];
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
}

// Study Session / Pomodoro
export interface StudySession {
  id: string;
  userId: string;
  duration: number; // minutes
  subject?: string;
  topic?: string;
  type: 'pomodoro' | 'custom';
  focusMode: boolean;
  startedAt: number;
  completedAt?: number;
  paused: boolean;
}

// Google Drive Sync
export interface SyncMetadata {
  lastSyncTime: number;
  driveFileId?: string;
  cloudFileId?: string;
  isDirty: boolean;
  conflictResolution?: 'local' | 'cloud';
}

// Plan / Schedule
export interface StudyPlan {
  id: string;
  userId: string;
  weekStartDate: string;
  subjects: {
    subjectName: string;
    topics: string[];
    dailyTargets: Record<string, number>; // day -> target questions
  }[];
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

// Analytics
export interface DailyStats {
  date: string;
  questionsAttempted: number;
  correct: number;
  wrong: number;
  blank: number;
  studyMinutes: number;
  topicsStudied: string[];
  streak: boolean;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalQuestions: number;
  averageAccuracy: number;
  totalStudyHours: number;
  topicsCompleted: string[];
}

export interface SubjectPerformance {
  subjectName: string;
  topicCount: number;
  completedCount: number;
  avgAccuracy: number;
  netScore: number;
  lastUpdated: number;
}

// Settings
export interface UserSettings {
  userId: string;
  theme: 'dark' | 'light';
  notifications: boolean;
  soundEnabled: boolean;
  language: 'tr' | 'en';
  autoSync: boolean;
  syncInterval: number; // minutes
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  createdAt: number;
  updatedAt: number;
}

// Store State
export interface AppState {
  user: User | null;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  tasks: Task[];
  exams: Exam[];
  mistakes: Mistake[];
  books: Book[];
  notes: Note[];
  subjects: Record<string, Subject>;
  settings: UserSettings | null;
  stats: UserStats | null;
  selectedDate: string;
  filters: {
    taskPriority?: 'düşük' | 'normal' | 'yüksek';
    examType?: 'TYT' | 'AYT';
    mistakeCategory?: string;
  };
}

// Firebase types
export type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};
