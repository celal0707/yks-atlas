import { useState } from 'react';
import { useStore } from '@/store';
import { Card, CardHeader, Button } from '@/components/Common';

export default function AuthPage() {
  const { setUser } = useStore();
  
  const handleDemoClick = () => {
    // Demo user oluştur
    const demoUser = {
      id: 'demo-user',
      email: 'demo@example.com',
      displayName: 'Demo Kullanıcı',
      createdAt: Date.now(),
      examDate: '2027-06-18',
      track: 'sayisal',
    };
    
    setUser(demoUser);
    // Dashboard'a yönlendir (sonra yapacağız)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-bg">
      <Card>
        <CardHeader title="YKS Atlas" subtitle="Akıllı YKS Takip Sistemi" />
        
        <div className="space-y-4 mt-6">
          <Button 
            variant="primary" 
            fullWidth
            onClick={handleDemoClick}
          >
            Demo ile Dene
          </Button>

          <Button 
            variant="secondary" 
            fullWidth
            disabled
          >
            Google ile Giriş (Yakında)
          </Button>
        </div>
      </Card>
    </div>
  );
}
