import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, User, Task, Exam, Mistake, Book, Note, UserStats, Subject } from '@/types';

interface Store extends AppState {
  // Auth actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsSyncing: (isSyncing: boolean) => void;

  // Task actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, data: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;

  // Exam actions
  setExams: (exams: Exam[]) => void;
  addExam: (exam: Exam) => void;
  updateExam: (examId: string, data: Partial<Exam>) => void;
  deleteExam: (examId: string) => void;

  // Mistake actions
  setMistakes: (mistakes: Mistake[]) => void;
  addMistake: (mistake: Mistake) => void;
  updateMistake: (mistakeId: string, data: Partial<Mistake>) => void;
  deleteMistake: (mistakeId: string) => void;

  // Book actions
  setBooks: (books: Book[]) => void;
  addBook: (book: Book) => void;
  updateBook: (bookId: string, data: Partial<Book>) => void;
  deleteBook: (bookId: string) => void;

  // Note actions
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (noteId: string, data: Partial<Note>) => void;
  deleteNote: (noteId: string) => void;

  // Subject actions
  setSubjects: (subjects: Record<string, Subject>) => void;
  updateSubject: (subjectName: string, data: Partial<Subject>) => void;

  // Stats actions
  setStats: (stats: UserStats) => void;

  // UI actions
  setSelectedDate: (date: string) => void;
  setFilters: (filters: Partial<AppState['filters']>) => void;

  // Batch actions
  loadAllData: (data: Partial<AppState>) => void;
  clearAllData: () => void;
}

const initialState: AppState = {
  user: null,
  isLoading: false,
  isSyncing: false,
  error: null,
  tasks: [],
  exams: [],
  mistakes: [],
  books: [],
  notes: [],
  subjects: {},
  settings: null,
  stats: null,
  selectedDate: new Date().toISOString().split('T')[0],
  filters: {},
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      ...initialState,

      // Auth
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setIsSyncing: (isSyncing) => set({ isSyncing }),

      // Tasks
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),
      updateTask: (taskId, data) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...data } : t)),
        })),
      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        })),

      // Exams
      setExams: (exams) => set({ exams }),
      addExam: (exam) =>
        set((state) => ({
          exams: [...state.exams, exam],
        })),
      updateExam: (examId, data) =>
        set((state) => ({
          exams: state.exams.map((e) => (e.id === examId ? { ...e, ...data } : e)),
        })),
      deleteExam: (examId) =>
        set((state) => ({
          exams: state.exams.filter((e) => e.id !== examId),
        })),

      // Mistakes
      setMistakes: (mistakes) => set({ mistakes }),
      addMistake: (mistake) =>
        set((state) => ({
          mistakes: [...state.mistakes, mistake],
        })),
      updateMistake: (mistakeId, data) =>
        set((state) => ({
          mistakes: state.mistakes.map((m) =>
            m.id === mistakeId ? { ...m, ...data } : m
          ),
        })),
      deleteMistake: (mistakeId) =>
        set((state) => ({
          mistakes: state.mistakes.filter((m) => m.id !== mistakeId),
        })),

      // Books
      setBooks: (books) => set({ books }),
      addBook: (book) =>
        set((state) => ({
          books: [...state.books, book],
        })),
      updateBook: (bookId, data) =>
        set((state) => ({
          books: state.books.map((b) => (b.id === bookId ? { ...b, ...data } : b)),
        })),
      deleteBook: (bookId) =>
        set((state) => ({
          books: state.books.filter((b) => b.id !== bookId),
        })),

      // Notes
      setNotes: (notes) => set({ notes }),
      addNote: (note) =>
        set((state) => ({
          notes: [...state.notes, note],
        })),
      updateNote: (noteId, data) =>
        set((state) => ({
          notes: state.notes.map((n) => (n.id === noteId ? { ...n, ...data } : n)),
        })),
      deleteNote: (noteId) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== noteId),
        })),

      // Subjects
      setSubjects: (subjects) => set({ subjects }),
      updateSubject: (subjectName, data) =>
        set((state) => ({
          subjects: {
            ...state.subjects,
            [subjectName]: {
              ...(state.subjects[subjectName] || {}),
              ...data,
            } as Subject,
          },
        })),

      // Stats
      setStats: (stats) => set({ stats }),

      // UI
      setSelectedDate: (selectedDate) => set({ selectedDate }),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      // Batch
      loadAllData: (data) => set(data),
      clearAllData: () => set(initialState),
    }),
    {
      name: 'yks-atlas-store',
      version: 1,
    }
  )
);
