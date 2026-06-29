import { useStore } from '@/store';
import AuthPage from '@/pages/AuthPage';

export default function App() {
  const { user } = useStore();

  // Demo mode: direkt gir
  if (!user) {
    return <AuthPage />;
  }

  // Buraya gelirse dashboard açılacak (şimdilik koyma)
  return <div>Loading...</div>;
}
