import { useState } from 'react';
import { useStore } from '@/store';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dark-bg text-text-primary overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <div className="lg:hidden bg-dark-card border-b border-dark-border px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">YKS Atlas</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-dark-border rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {/* Router outlet would go here */}
            <div className="text-center py-12">
              <h1 className="text-3xl font-display font-bold mb-2">YKS Atlas</h1>
              <p className="text-text-secondary">Akıllı YKS Takip Sistemi</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
