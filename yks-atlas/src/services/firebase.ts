import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  deleteDoc,
  QueryConstraint,
  writeBatch
} from 'firebase/firestore';
import { User, Task, Exam, Mistake, Book, Note, Subject } from '@/types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth Functions
export const googleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signOut = async () => {
  return firebaseSignOut(auth);
};

export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// User Functions
export const createUserProfile = async (user: FirebaseUser, displayName: string): Promise<User> => {
  const userDoc: User = {
    id: user.uid,
    email: user.email || '',
    displayName,
    photoURL: user.photoURL || undefined,
    createdAt: Date.now(),
    examDate: new Date(2027, 5, 18).toISOString().split('T')[0], // Default YKS date
    track: 'sayisal',
  };

  await setDoc(doc(db, 'users', user.uid), userDoc);
  return userDoc;
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
  const docSnap = await getDoc(doc(db, 'users', uid));
  return docSnap.exists() ? (docSnap.data() as User) : null;
};

export const updateUserProfile = async (uid: string, data: Partial<User>) => {
  return updateDoc(doc(db, 'users', uid), data);
};

// Task Functions
export const createTask = async (uid: string, task: Omit<Task, 'id' | 'userId'>): Promise<Task> => {
  const newTask: Task = {
    ...task,
    id: `task_${Date.now()}`,
    userId: uid,
  };
  await setDoc(doc(db, 'users', uid, 'tasks', newTask.id), newTask);
  return newTask;
};

export const getTasks = async (uid: string): Promise<Task[]> => {
  const q = query(collection(db, 'users', uid, 'tasks'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Task);
};

export const updateTask = async (uid: string, taskId: string, data: Partial<Task>) => {
  return updateDoc(doc(db, 'users', uid, 'tasks', taskId), {
    ...data,
    updatedAt: Date.now(),
  });
};

export const deleteTask = async (uid: string, taskId: string) => {
  return deleteDoc(doc(db, 'users', uid, 'tasks', taskId));
};

// Exam Functions
export const createExam = async (uid: string, exam: Omit<Exam, 'id' | 'userId'>): Promise<Exam> => {
  const newExam: Exam = {
    ...exam,
    id: `exam_${Date.now()}`,
    userId: uid,
  };
  await setDoc(doc(db, 'users', uid, 'exams', newExam.id), newExam);
  return newExam;
};

export const getExams = async (uid: string): Promise<Exam[]> => {
  const q = query(collection(db, 'users', uid, 'exams'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Exam);
};

export const updateExam = async (uid: string, examId: string, data: Partial<Exam>) => {
  return updateDoc(doc(db, 'users', uid, 'exams', examId), {
    ...data,
    updatedAt: Date.now(),
  });
};

export const deleteExam = async (uid: string, examId: string) => {
  return deleteDoc(doc(db, 'users', uid, 'exams', examId));
};

// Mistake Functions
export const createMistake = async (uid: string, mistake: Omit<Mistake, 'id' | 'userId'>): Promise<Mistake> => {
  const newMistake: Mistake = {
    ...mistake,
    id: `mistake_${Date.now()}`,
    userId: uid,
  };
  await setDoc(doc(db, 'users', uid, 'mistakes', newMistake.id), newMistake);
  return newMistake;
};

export const getMistakes = async (uid: string): Promise<Mistake[]> => {
  const q = query(collection(db, 'users', uid, 'mistakes'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Mistake);
};

export const updateMistake = async (uid: string, mistakeId: string, data: Partial<Mistake>) => {
  return updateDoc(doc(db, 'users', uid, 'mistakes', mistakeId), {
    ...data,
    updatedAt: Date.now(),
  });
};

export const deleteMistake = async (uid: string, mistakeId: string) => {
  return deleteDoc(doc(db, 'users', uid, 'mistakes', mistakeId));
};

// Book Functions
export const createBook = async (uid: string, book: Omit<Book, 'id' | 'userId'>): Promise<Book> => {
  const newBook: Book = {
    ...book,
    id: `book_${Date.now()}`,
    userId: uid,
  };
  await setDoc(doc(db, 'users', uid, 'books', newBook.id), newBook);
  return newBook;
};

export const getBooks = async (uid: string): Promise<Book[]> => {
  const q = query(collection(db, 'users', uid, 'books'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Book);
};

export const updateBook = async (uid: string, bookId: string, data: Partial<Book>) => {
  return updateDoc(doc(db, 'users', uid, 'books', bookId), {
    ...data,
    updatedAt: Date.now(),
  });
};

export const deleteBook = async (uid: string, bookId: string) => {
  return deleteDoc(doc(db, 'users', uid, 'books', bookId));
};

// Note Functions
export const createNote = async (uid: string, note: Omit<Note, 'id' | 'userId'>): Promise<Note> => {
  const newNote: Note = {
    ...note,
    id: `note_${Date.now()}`,
    userId: uid,
  };
  await setDoc(doc(db, 'users', uid, 'notes', newNote.id), newNote);
  return newNote;
};

export const getNotes = async (uid: string): Promise<Note[]> => {
  const q = query(collection(db, 'users', uid, 'notes'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Note);
};

export const updateNote = async (uid: string, noteId: string, data: Partial<Note>) => {
  return updateDoc(doc(db, 'users', uid, 'notes', noteId), {
    ...data,
    updatedAt: Date.now(),
  });
};

export const deleteNote = async (uid: string, noteId: string) => {
  return deleteDoc(doc(db, 'users', uid, 'notes', noteId));
};

// Subject Functions
export const upsertSubject = async (uid: string, subjectName: string, data: Partial<Subject>) => {
  const docRef = doc(db, 'users', uid, 'subjects', subjectName);
  return setDoc(docRef, {
    ...data,
    userId: uid,
    subjectName,
    updatedAt: Date.now(),
  }, { merge: true });
};

export const getSubjects = async (uid: string): Promise<Record<string, Subject>> => {
  const q = query(collection(db, 'users', uid, 'subjects'));
  const querySnapshot = await getDocs(q);
  const subjects: Record<string, Subject> = {};
  querySnapshot.docs.forEach(doc => {
    const data = doc.data() as Subject;
    subjects[data.subjectName] = data;
  });
  return subjects;
};

// Batch operations
export const batchUpdateData = async (uid: string, updates: {
  tasks?: Partial<Task>[];
  exams?: Partial<Exam>[];
  subjects?: { name: string; data: Partial<Subject> }[];
}) => {
  const batch = writeBatch(db);
  
  if (updates.tasks) {
    updates.tasks.forEach(task => {
      const docRef = doc(db, 'users', uid, 'tasks', task.id!);
      batch.set(docRef, { ...task, updatedAt: Date.now() }, { merge: true });
    });
  }

  if (updates.exams) {
    updates.exams.forEach(exam => {
      const docRef = doc(db, 'users', uid, 'exams', exam.id!);
      batch.set(docRef, { ...exam, updatedAt: Date.now() }, { merge: true });
    });
  }

  if (updates.subjects) {
    updates.subjects.forEach(({ name, data }) => {
      const docRef = doc(db, 'users', uid, 'subjects', name);
      batch.set(docRef, { ...data, updatedAt: Date.now() }, { merge: true });
    });
  }

  return batch.commit();
};
