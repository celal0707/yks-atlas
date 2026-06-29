import { useEffect, useState } from 'react';
import { useStore } from './store';
import { onAuthChange } from './services/firebase';
import { useAuthContext } from './hooks/useAuthContext';
import Layout from './components/Layout';
import AuthPage from './pages/AuthPage';
import LoadingScreen from './components/LoadingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const { user, isLoading, setUser, setLoading } = useStore();
  const { initializeAuth } = useAuthContext();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Initialize Firebase auth
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setLoading(true);
      try {
        if (firebaseUser) {
          // User logged in
          await initializeAuth(firebaseUser);
        } else {
          // User logged out
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
        setIsInitializing(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading, initializeAuth]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <ErrorBoundary>
      <Layout />
    </ErrorBoundary>
  );
}

export default App;
