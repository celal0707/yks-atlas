import { useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { useStore } from '@/store';
import { 
  getUserProfile, 
  createUserProfile, 
  getTasks, 
  getExams, 
  getMistakes, 
  getBooks, 
  getNotes, 
  getSubjects 
} from '@/services/firebase';
import { User } from '@/types';

export const useAuthContext = () => {
  const { setUser, setTasks, setExams, setMistakes, setBooks, setNotes, setSubjects } = useStore();

  const initializeAuth = useCallback(async (firebaseUser: FirebaseUser) => {
    try {
      // Get or create user profile
      let userProfile = await getUserProfile(firebaseUser.uid);
      
      if (!userProfile) {
        userProfile = await createUserProfile(firebaseUser, firebaseUser.displayName || 'Öğrenci');
      }

      setUser(userProfile);

      // Load user data
      const [tasks, exams, mistakes, books, notes, subjects] = await Promise.all([
        getTasks(firebaseUser.uid),
        getExams(firebaseUser.uid),
        getMistakes(firebaseUser.uid),
        getBooks(firebaseUser.uid),
        getNotes(firebaseUser.uid),
        getSubjects(firebaseUser.uid),
      ]);

      setTasks(tasks);
      setExams(exams);
      setMistakes(mistakes);
      setBooks(books);
      setNotes(notes);
      setSubjects(subjects);
    } catch (error) {
      console.error('Error initializing auth:', error);
      throw error;
    }
  }, [setUser, setTasks, setExams, setMistakes, setBooks, setNotes, setSubjects]);

  return { initializeAuth };
};
