import { useState } from 'react';
import { useStore } from '@/store';
import { createMistake, updateMistake, deleteMistake } from '@/services/firebase';
import { Card, CardHeader, Button, Input, Select, Textarea, Modal, ModalContent, ModalFooter, Badge } from '@/components/Common';
import { Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

const CATEGORIES = [
  { value: 'kavram_hatasi', label: 'Kavram Hatası' },
  { value: 'isllem_hatasi', label: 'İşlem Hatası' },
  { value: 'dikkatsizlik', label: 'Dikkatsizlik' },
  { value: 'bilgi_boslugu', label: 'Bilgi Boşluğu' },
];

const SUBJECTS = ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe', 'Sosyal'];

export default function MistakesPage() {
  const { user, mistakes, addMistake, updateMistake: updateMistakeState, deleteMistake: deleteMistakeState } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMistake, setEditingMistake] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    description: '',
    category: 'kavram_hatasi',
    difficulty: 'orta',
    notes: '',
  });

  const handleOpenModal = (mistake = null) => {
    if (mistake) {
      setEditingMistake(mistake);
      setFormData(mistake);
    } else {
      setEditingMistake(null);
      setFormData({
        subject: '',
        topic: '',
        description: '',
        category: 'kavram_hatasi',
        difficulty: 'orta',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveMistake = async () => {
    if (!user || !formData.subject || !formData.description) return;

    try {
      if (editingMistake) {
        await updateMistake(user.id, editingMistake.id, formData);
        updateMistakeState(editingMistake.id, formData);
      } else {
        const newMistake = await createMistake(user.id, {
          ...formData,
          reviewed: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        addMistake(newMistake);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving mistake:', error);
    }
  };

  const handleDeleteMistake = async (mistakeId: string) => {
    if (!user || !confirm('Hata silinsin mi?')) return;
    await deleteMistake(user.id, mistakeId);
    deleteMistakeState(mistakeId);
  };

  const filteredMistakes = mistakes.filter(m =>
    !filterCategory || m.category === filterCategory
  ).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const categoryStats = CATEGORIES.map(cat => ({
    ...cat,
    count: mistakes.filter(m => m.category === cat.value).length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Sıfır Hata Merkezi</h1>
          <p className="text-text-secondary">{mistakes.length} hata kaydedildi</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Hata Ekle
        </Button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categoryStats.map(cat => (
          <Card
            key={cat.value}
            clickable
            onClick={() => setFilterCategory(filterCategory === cat.value ? '' : cat.value)}
            className={filterCategory === cat.value ? 'ring-2 ring-primary-500' : ''}
          >
            <div>
              <div className="text-2xl font-bold text-primary-400">{cat.count}</div>
              <div className="text-xs text-text-secondary">{cat.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Mistakes List */}
      <Card>
        <CardHeader
          title="Hatalar"
          subtitle={filterCategory ? `${CATEGORIES.find(c => c.value === filterCategory)?.label} gösteriliyor` : 'Tümü'}
        />
        <div className="space-y-3">
          {filteredMistakes.length > 0 ? (
            filteredMistakes.map(mistake => (
              <div key={mistake.id} className="p-4 bg-dark-bg rounded-lg border border-dark-border hover:border-primary-500 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-text-primary flex gap-2 items-center">
                      {mistake.subject} - {mistake.topic}
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{mistake.description}</p>
                  </div>

                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => handleOpenModal(mistake)}
                      className="p-2 text-text-secondary hover:text-primary-500 hover:bg-dark-border rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMistake(mistake.id)}
                      className="p-2 text-text-secondary hover:text-accent-red hover:bg-accent-red/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="primary">
                    {CATEGORIES.find(c => c.value === mistake.category)?.label}
                  </Badge>
                  <Badge variant={mistake.difficulty === 'kolay' ? 'success' : mistake.difficulty === 'orta' ? 'warning' : 'danger'}>
                    {mistake.difficulty === 'kolay' ? 'Kolay' : mistake.difficulty === 'orta' ? 'Orta' : 'Zor'}
                  </Badge>
                  {mistake.reviewed && <Badge variant="success">✓ Gözden Geçirildi</Badge>}
                  <span className="text-xs text-text-muted">{formatDate(mistake.createdAt)}</span>
                </div>

                {mistake.notes && <p className="text-xs text-text-muted mt-2 italic">💡 {mistake.notes}</p>}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-text-muted">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              ✨ {filterCategory ? 'Bu kategoride hata yok' : 'Henüz hata kaydedilmedi'}
            </div>
          )}
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMistake ? 'Hatayı Düzenle' : 'Yeni Hata Ekle'}
        size="md"
      >
        <ModalContent>
          <div className="space-y-4">
            <Select
              label="Ders"
              options={SUBJECTS.map(s => ({ value: s, label: s }))}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />

            <Input
              label="Konu"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="Örn: Trigonometri"
            />

            <Textarea
              label="Hata Açıklaması"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Bu soruda nasıl bir hata yaptın?"
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Hata Kategorisi"
                options={CATEGORIES}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />

              <Select
                label="Zorluk"
                options={[
                  { value: 'kolay', label: 'Kolay' },
                  { value: 'orta', label: 'Orta' },
                  { value: 'zor', label: 'Zor' },
                ]}
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              />
            </div>

            <Textarea
              label="Çözüm & Notlar"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Sorunun doğru çözümü ve öğrendiklerin"
              rows={3}
            />
          </div>
        </ModalContent>

        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleSaveMistake}>
            {editingMistake ? 'Güncelle' : 'Kaydet'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
