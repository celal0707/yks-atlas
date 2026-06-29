import { useState } from 'react';
import { useStore } from '@/store';
import { upsertSubject } from '@/services/firebase';
import { Card, CardHeader, Button, Input, Modal, ModalContent, ModalFooter, Progress, Metric } from '@/components/Common';
import { Plus, Edit2, ChevronDown } from 'lucide-react';
import { calculateNet, calculateAccuracy } from '@/utils/helpers';

const SUBJECTS = {
  'TYT': ['Matematik', 'Fen Bilimleri', 'Türkçe', 'Sosyal Bilimler'],
  'AYT': ['Matematik', 'Fizik', 'Kimya', 'Biyoloji'],
};

export default function SubjectsPage() {
  const { user, subjects, updateSubject } = useStore();
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [formData, setFormData] = useState({ topicName: '', correct: 0, wrong: 0, blank: 0 });

  const handleAddTopic = async (subjectName: string) => {
    if (!user || !formData.topicName) return;

    const updatedTopics = {
      ...(subjects[subjectName]?.topics || {}),
      [formData.topicName]: {
        status: 'devam',
        solved: parseInt(formData.correct) + parseInt(formData.wrong) + parseInt(formData.blank),
        correct: parseInt(formData.correct),
        wrong: parseInt(formData.wrong),
        blank: parseInt(formData.blank),
        lastStudied: Date.now(),
      },
    };

    await upsertSubject(user.id, subjectName, { topics: updatedTopics });
    updateSubject(subjectName, { topics: updatedTopics });
    setIsModalOpen(false);
    setFormData({ topicName: '', correct: 0, wrong: 0, blank: 0 });
  };

  const getSubjectProgress = (subjectName: string) => {
    const topics = subjects[subjectName]?.topics || {};
    const total = Object.keys(topics).length;
    const completed = Object.values(topics).filter(t => t.status === 'bitti').length;
    return { completed, total };
  };

  const getSubjectNet = (subjectName: string) => {
    const topics = subjects[subjectName]?.topics || {};
    const totalCorrect = Object.values(topics).reduce((a, t) => a + (t.correct || 0), 0);
    const totalWrong = Object.values(topics).reduce((a, t) => a + (t.wrong || 0), 0);
    return calculateNet(totalCorrect, totalWrong);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary">Konu Takibi</h1>
        <p className="text-text-secondary">Konuları takip et, soru çöz, ilerleme izle</p>
      </div>

      {/* TYT Subjects */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">TYT (Temel Yeterlilik Testi)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUBJECTS.TYT.map(subject => {
            const { completed, total } = getSubjectProgress(subject);
            const net = getSubjectNet(subject);
            const isExpanded = expandedSubject === subject;

            return (
              <Card key={subject} className="cursor-pointer" clickable onClick={() => setExpandedSubject(isExpanded ? null : subject)}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-text-primary">{subject}</h3>
                      <p className="text-xs text-text-muted">{completed}/{total} konu</p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-primary-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>

                  <Progress label="İlerleme" value={completed} max={total} />

                  {total > 0 && (
                    <div className="text-sm text-accent-green font-semibold">
                      {net.toFixed(1)} net
                    </div>
                  )}

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-dark-border space-y-3">
                      {Object.entries(subjects[subject]?.topics || {}).map(([topic, data]: any) => (
                        <div key={topic} className="p-2 bg-dark-bg rounded text-sm">
                          <div className="font-medium text-text-primary mb-1">{topic}</div>
                          <div className="text-xs text-text-muted">
                            D: {data.correct} Y: {data.wrong} B: {data.blank}
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubject(subject);
                          setIsModalOpen(true);
                        }}
                        fullWidth
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Konu Ekle
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AYT Subjects */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary">AYT (Alan Yeterlilik Testi)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUBJECTS.AYT.map(subject => {
            const { completed, total } = getSubjectProgress(subject);
            const net = getSubjectNet(subject);
            const isExpanded = expandedSubject === subject;

            return (
              <Card key={subject} className="cursor-pointer" clickable onClick={() => setExpandedSubject(isExpanded ? null : subject)}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-text-primary">{subject}</h3>
                      <p className="text-xs text-text-muted">{completed}/{total} konu</p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-primary-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>

                  <Progress label="İlerleme" value={completed} max={total} />

                  {total > 0 && (
                    <div className="text-sm text-accent-green font-semibold">
                      {net.toFixed(1)} net
                    </div>
                  )}

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-dark-border space-y-3">
                      {Object.entries(subjects[subject]?.topics || {}).map(([topic, data]: any) => (
                        <div key={topic} className="p-2 bg-dark-bg rounded text-sm">
                          <div className="font-medium text-text-primary mb-1">{topic}</div>
                          <div className="text-xs text-text-muted">
                            D: {data.correct} Y: {data.wrong} B: {data.blank}
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubject(subject);
                          setIsModalOpen(true);
                        }}
                        fullWidth
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Konu Ekle
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${selectedSubject} - Konu Ekle`}
        size="md"
      >
        <ModalContent>
          <div className="space-y-4">
            <Input
              label="Konu Adı"
              value={formData.topicName}
              onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
              placeholder="Örn: Trigonometri"
            />

            <div className="grid grid-cols-3 gap-2">
              <Input
                label="Doğru"
                type="number"
                value={formData.correct}
                onChange={(e) => setFormData({ ...formData, correct: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="Yanlış"
                type="number"
                value={formData.wrong}
                onChange={(e) => setFormData({ ...formData, wrong: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="Boş"
                type="number"
                value={formData.blank}
                onChange={(e) => setFormData({ ...formData, blank: parseInt(e.target.value) || 0 })}
              />
            </div>

            {formData.correct + formData.wrong + formData.blank > 0 && (
              <div className="p-3 bg-dark-bg rounded">
                <div className="text-sm text-text-secondary mb-1">Net</div>
                <div className="text-xl font-bold text-accent-green">
                  {calculateNet(formData.correct, formData.wrong).toFixed(1)}
                </div>
              </div>
            )}
          </div>
        </ModalContent>

        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={() => handleAddTopic(selectedSubject!)}>
            Ekle
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
