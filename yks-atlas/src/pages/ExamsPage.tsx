import { useState } from 'react';
import { useStore } from '@/store';
import { createExam, updateExam, deleteExam } from '@/services/firebase';
import { Card, CardHeader, Button, Input, Select, Modal, ModalContent, ModalFooter, Badge } from '@/components/Common';
import { Plus, Trash2, Edit2, TrendingUp } from 'lucide-react';
import { formatDate, calculateNet } from '@/utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SECTIONS = {
  TYT: ['Matematik', 'Fen Bilimleri', 'Türkçe', 'Sosyal Bilimler'],
  AYT: ['Matematik', 'Fizik', 'Kimya', 'Biyoloji'],
};

export default function ExamsPage() {
  const { user, exams, addExam, updateExam: updateExamState, deleteExam: deleteExamState } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [examType, setExamType] = useState<'TYT' | 'AYT'>('TYT');
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    sections: {} as Record<string, { correct: number; wrong: number; blank: number }>,
    notes: '',
  });

  const handleOpenModal = (exam = null) => {
    if (exam) {
      setEditingExam(exam);
      setExamType(exam.type);
      setFormData({
        name: exam.name,
        date: exam.date,
        sections: exam.sections.reduce((acc: any, s: any) => ({ ...acc, [s.name]: { correct: s.correct, wrong: s.wrong, blank: s.blank } }), {}),
        notes: exam.notes || '',
      });
    } else {
      setEditingExam(null);
      const sections: Record<string, any> = {};
      SECTIONS.TYT.forEach(s => { sections[s] = { correct: 0, wrong: 0, blank: 0 }; });
      setFormData({ name: '', date: new Date().toISOString().split('T')[0], sections, notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveExam = async () => {
    if (!user || !formData.name) return;

    try {
      const sections = Object.entries(formData.sections).map(([name, data]: any) => ({
        name,
        correct: data.correct,
        wrong: data.wrong,
        blank: data.blank,
        total: data.correct + data.wrong + data.blank,
      }));

      if (editingExam) {
        await updateExam(user.id, editingExam.id, { name: formData.name, sections, notes: formData.notes, date: formData.date });
        updateExamState(editingExam.id, { name: formData.name, sections, notes: formData.notes, date: formData.date });
      } else {
        const newExam = await createExam(user.id, {
          name: formData.name,
          type: examType,
          date: formData.date,
          sections,
          notes: formData.notes,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        addExam(newExam);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!user || !confirm('Deneme silinsin mi?')) return;
    await deleteExam(user.id, examId);
    deleteExamState(examId);
  };

  const chartData = exams
    .filter(e => e.type === examType)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((e, i) => {
      const totalCorrect = e.sections.reduce((a: number, s: any) => a + s.correct, 0);
      const totalWrong = e.sections.reduce((a: number, s: any) => a + s.wrong, 0);
      return { name: `${e.name}`, net: calculateNet(totalCorrect, totalWrong) };
    });

  const filteredExams = exams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Deneme Sınavları</h1>
          <p className="text-text-secondary">{exams.length} deneme kaydedildi</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Deneme
        </Button>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader title="Net Gelişimi" subtitle={examType} />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E2740" />
                <XAxis dataKey="name" stroke="#B6B0BF" fontSize={12} />
                <YAxis stroke="#B6B0BF" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1B1828', border: '1px solid #2E2740' }} />
                <Line type="monotone" dataKey="net" stroke="#A593D6" dot={{ fill: '#A593D6' }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Exams List */}
      <Card>
        <CardHeader title="Tüm Denemeler" subtitle={`${exams.length} toplam`} />
        <div className="space-y-2">
          {filteredExams.length > 0 ? (
            filteredExams.map(exam => {
              const totalCorrect = exam.sections.reduce((a: number, s: any) => a + s.correct, 0);
              const totalWrong = exam.sections.reduce((a: number, s: any) => a + s.wrong, 0);
              const net = calculateNet(totalCorrect, totalWrong);

              return (
                <div key={exam.id} className="p-4 bg-dark-bg rounded-lg hover:bg-dark-border transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-text-primary flex gap-2 items-center">
                        {exam.name}
                        <Badge variant={exam.type === 'TYT' ? 'primary' : 'success'}>{exam.type}</Badge>
                      </div>
                      <div className="text-sm text-text-muted">{formatDate(exam.date)}</div>
                    </div>

                    <div className="text-right mr-4">
                      <div className="text-2xl font-bold text-accent-green">{net.toFixed(1)}</div>
                      <div className="text-xs text-text-muted">net</div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenModal(exam)}
                        className="p-2 text-text-secondary hover:text-primary-500 hover:bg-dark-border rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="p-2 text-text-secondary hover:text-accent-red hover:bg-accent-red/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {exam.sections.map((section: any) => (
                      <div key={section.name} className="text-xs bg-dark-card rounded p-2">
                        <div className="font-medium text-text-secondary mb-1">{section.name}</div>
                        <div className="text-text-muted">
                          D: {section.correct} Y: {section.wrong} B: {section.blank}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-text-muted">
              📝 Henüz deneme kaydedilmedi
            </div>
          )}
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExam ? 'Denemeyi Düzenle' : 'Yeni Deneme Ekle'}
        size="lg"
      >
        <ModalContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Deneme Adı"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Örn: Deneme 1"
              />
              <Input
                label="Tarih"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            {!editingExam && (
              <Select
                label="Deneme Türü"
                options={[
                  { value: 'TYT', label: 'TYT' },
                  { value: 'AYT', label: 'AYT' },
                ]}
                value={examType}
                onChange={(e) => {
                  setExamType(e.target.value as 'TYT' | 'AYT');
                  const sections: Record<string, any> = {};
                  SECTIONS[e.target.value as 'TYT' | 'AYT'].forEach(s => {
                    sections[s] = { correct: 0, wrong: 0, blank: 0 };
                  });
                  setFormData({ ...formData, sections });
                }}
              />
            )}

            <div className="space-y-3">
              <div className="text-sm font-semibold text-text-secondary">Bölüm Sonuçları</div>
              {Object.entries(formData.sections).map(([sectionName, data]: any) => (
                <div key={sectionName} className="grid grid-cols-4 gap-2">
                  <div className="col-span-1 text-sm font-medium text-text-secondary pt-2">{sectionName}</div>
                  <Input
                    type="number"
                    placeholder="Doğru"
                    value={data.correct}
                    onChange={(e) => setFormData({
                      ...formData,
                      sections: { ...formData.sections, [sectionName]: { ...data, correct: parseInt(e.target.value) || 0 } }
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Yanlış"
                    value={data.wrong}
                    onChange={(e) => setFormData({
                      ...formData,
                      sections: { ...formData.sections, [sectionName]: { ...data, wrong: parseInt(e.target.value) || 0 } }
                    })}
                  />
                  <Input
                    type="number"
                    placeholder="Boş"
                    value={data.blank}
                    onChange={(e) => setFormData({
                      ...formData,
                      sections: { ...formData.sections, [sectionName]: { ...data, blank: parseInt(e.target.value) || 0 } }
                    })}
                  />
                </div>
              ))}
            </div>

            <Input
              label="Notlar"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Deneme hakkında notlar (opsiyonel)"
            />
          </div>
        </ModalContent>

        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleSaveExam}>
            {editingExam ? 'Güncelle' : 'Kaydet'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
