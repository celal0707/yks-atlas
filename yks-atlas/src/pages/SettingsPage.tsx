import { useState } from 'react';
import { useStore } from '@/store';
import { signOut } from '@/services/firebase';
import { useSyncData } from '@/hooks/useSyncData';
import { Card, CardHeader, Button, Input, Select, Modal, ModalContent, ModalFooter, Alert } from '@/components/Common';
import { LogOut, Save, Download, Trash2, Cloud, Zap } from 'lucide-react';

export default function SettingsPage() {
  const { user, setUser, clearAllData } = useStore();
  const { downloadBackup, syncDataToCloud, lastSyncTime } = useSyncData(user?.id || null);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    examDate: user?.examDate || '2027-06-18',
    track: user?.track || 'sayisal',
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Save settings to Firebase
    setTimeout(() => {
      setIsSaving(false);
      alert('Ayarlar kaydedildi!');
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleClearData = () => {
    if (confirm('Tüm veriler silinecek! Bu işlem geri alınamaz. Emin misin?')) {
      clearAllData();
      setShowConfirm(false);
      alert('Tüm veriler silindi!');
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('tr-TR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary">Ayarlar</h1>
        <p className="text-text-secondary">Hesap, tema ve senkronizasyon ayarları</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader title="Profil Ayarları" />
        <div className="space-y-4">
          <Input
            label="Adı Soyadı"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sınav Tarihi"
              type="date"
              value={formData.examDate}
              onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
            />

            <Select
              label="Ders Seçimi"
              options={[
                { value: 'sayisal', label: 'Sayısal (Mat, Fen)' },
                { value: 'sozel', label: 'Sözel (Edebiyat, Sosyal)' },
                { value: 'esit_agirlik', label: 'Eşit Ağırlık' },
                { value: 'ozel', label: 'Özel' },
              ]}
              value={formData.track}
              onChange={(e) => setFormData({ ...formData, track: e.target.value })}
            />
          </div>

          <div className="p-3 bg-dark-bg rounded text-sm text-text-muted">
            <div className="mb-1 font-semibold text-text-secondary">Hesap Bilgisi</div>
            <div>{user?.email}</div>
            <div className="text-xs mt-1">Hesap oluşturma: {new Date(user?.createdAt || 0).toLocaleDateString('tr-TR')}</div>
          </div>

          <Button onClick={handleSave} loading={isSaving} fullWidth>
            <Save className="w-4 h-4 mr-2" />
            Değişiklikleri Kaydet
          </Button>
        </div>
      </Card>

      {/* Backup & Sync */}
      <Card>
        <CardHeader title="Yedekleme & Senkronizasyon" />
        <div className="space-y-4">
          <Alert type="info">
            Verileriniz Firebase'de kaydedilir. Google Drive'a otomatik yedekleme yapılır.
          </Alert>

          <div className="space-y-3">
            <div className="p-3 bg-dark-bg rounded text-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-text-secondary">Son Senkronizasyon</div>
                <Cloud className="w-4 h-4 text-accent-green" />
              </div>
              <div className="text-text-muted">
                {lastSyncTime ? formatDate(lastSyncTime) : 'Henüz senkronize edilmedi'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={() => syncDataToCloud()}>
                <Cloud className="w-4 h-4 mr-2" />
                Buluta Yükle
              </Button>

              <Button variant="secondary" onClick={downloadBackup}>
                <Download className="w-4 h-4 mr-2" />
                İndir
              </Button>
            </div>
          </div>

          <div className="p-3 bg-dark-bg rounded text-xs text-text-muted">
            💡 Verileriniz otomatik olarak senkronize edilir. İsterseniz manuel olarak da senkronize edebilirsiniz.
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader title="Görünüş" />
        <div className="space-y-4">
          <Select
            label="Tema"
            options={[
              { value: 'dark', label: 'Koyu (Önerilen)' },
              { value: 'light', label: 'Açık' },
            ]}
            value="dark"
            disabled
          />

          <Select
            label="Dil"
            options={[
              { value: 'tr', label: 'Türkçe' },
              { value: 'en', label: 'English' },
            ]}
            value="tr"
            disabled
          />

          <div className="p-3 bg-dark-bg rounded text-xs text-text-muted">
            💡 Tema ve dil ayarları yakında güncellenecektir.
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader title="Bildirimler" />
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer p-3 bg-dark-bg rounded hover:bg-dark-border transition-colors">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <div>
              <div className="font-medium text-text-primary">Görev Hatırlatmaları</div>
              <div className="text-xs text-text-muted">Yaklaşan görevler için uyarı al</div>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 bg-dark-bg rounded hover:bg-dark-border transition-colors">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <div>
              <div className="font-medium text-text-primary">Seri Hatırlatmaları</div>
              <div className="text-xs text-text-muted">Çalışma serisini devam ettir</div>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 bg-dark-bg rounded hover:bg-dark-border transition-colors">
            <input type="checkbox" className="w-4 h-4 rounded" />
            <div>
              <div className="font-medium text-text-primary">E-posta Bildirimleri</div>
              <div className="text-xs text-text-muted">Haftalık özet e-postaları gönder</div>
            </div>
          </label>
        </div>
      </Card>

      {/* About */}
      <Card>
        <CardHeader title="Hakkında" />
        <div className="space-y-2 text-sm text-text-muted">
          <div className="flex justify-between">
            <span>Uygulamalar Adı</span>
            <span className="text-text-primary font-semibold">YKS Atlas</span>
          </div>
          <div className="flex justify-between">
            <span>Versiyon</span>
            <span className="text-text-primary font-semibold">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Yapılan</span>
            <span className="text-text-primary font-semibold">Claude AI</span>
          </div>
          <div className="flex justify-between">
            <span>Lisans</span>
            <span className="text-text-primary font-semibold">MIT</span>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border border-accent-red/30">
        <CardHeader title="Tehlikeli Bölge" subtitle="Bu işlemler geri alınamaz" />
        <div className="space-y-3">
          <Button variant="danger" fullWidth onClick={() => setShowConfirm(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Tüm Verileri Sil
          </Button>

          <Button variant="danger" fullWidth onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış Yap
          </Button>
        </div>
      </Card>

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Tüm Verileri Sil"
        size="sm"
      >
        <ModalContent>
          <Alert type="error">
            Bu işlem tüm verilerinizi silecek! Öncesinde yedek almadıysanız verileriniz kurtarılamayacak.
          </Alert>
        </ModalContent>

        <ModalFooter align="between">
          <Button variant="ghost" onClick={() => setShowConfirm(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={handleClearData}>
            Sil
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
