import { useStore } from '@/store';
import { signOut } from '@/services/firebase';
import { Home, CheckSquare, BookOpen, TrendingUp, AlertCircle, BookMarked, FileText, Settings, LogOut, Zap } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, setUser } = useStore();

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: Home },
    { id: 'tasks', label: 'Görevler', icon: CheckSquare },
    { id: 'subjects', label: 'Konular', icon: BookOpen },
    { id: 'exams', label: 'Denemeler', icon: TrendingUp },
    { id: 'mistakes', label: 'Hatalar', icon: AlertCircle },
    { id: 'books', label: 'Kütüphane', icon: BookMarked },
    { id: 'notes', label: 'Notlar', icon: FileText },
    { id: 'pomodoro', label: 'Pomodoro', icon: Zap },
  ];

  return (
    <>
      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative w-64 h-screen bg-dark-card border-r border-dark-border flex flex-col
          transition-transform duration-300 z-50 lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-green flex items-center justify-center text-white font-bold">
              Y
            </div>
            <div>
              <div className="font-semibold">YKS Atlas</div>
              <div className="text-xs text-text-muted">Akıllı Takip</div>
            </div>
          </div>

          {/* User card */}
          <div className="bg-dark-bg rounded-lg p-3 text-sm">
            <div className="font-medium truncate">{user?.displayName}</div>
            <div className="text-xs text-text-muted truncate">{user?.email}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={onClose}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-dark-border transition-colors"
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-dark-border p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-dark-border transition-colors">
            <Settings size={18} />
            <span className="text-sm font-medium">Ayarlar</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-accent-red hover:bg-accent-red/10 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Çıkış Yap</span>
          </button>
        </div>
      </div>
    </>
  );
}
