import { useStore } from '@/store';
import AuthPage from '@/pages/AuthPage';
import Layout from '@/components/Layout';

export default function App() {
  const { user } = useStore();

  if (!user) {
    return <AuthPage />;
  }

  // Demo user varsa Layout'u göster
  return <Layout />;
}
