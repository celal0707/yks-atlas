import { useState } from 'react';
import { useStore } from '@/store';
import { createTask, updateTask, deleteTask } from '@/services/firebase';
import { Card, CardHeader, Button, Input, Select, Modal, ModalContent, ModalFooter, Badge } from '@/components/Common';
import { Plus, Trash2, CheckCircle, Circle, Edit2 } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

export default function TasksPage() {
  const { user, tasks, addTask, updateTask: updateTaskState, deleteTask: deleteTaskState } = useStore();
  const [filter, setFilter] = useState<'all' | 'open' | 'done'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '', subject: '', priority: 'normal', dueDate: '' });

  const filteredTasks = tasks.filter(t => {
    if (filter === 'open') return !t.done;
    if (filter === 'done') return t.done;
    return true;
  }).sort((a, b) => {
    if (a.done === b.done) {
      if (a.priority === 'yüksek' && b.priority !== 'yüksek') return -1;
      if (a.priority !== 'yüksek' && b.priority === 'yüksek') return 1;
    }
    return a.done ? 1 : -1;
  });

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData(task);
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', subject: '', priority: 'normal', dueDate: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveTask = async () => {
    if (!user || !formData.title) return;

    try {
      if (editingTask) {
        await updateTask(user.id, editingTask.id, formData);
        updateTaskState(editingTask.id, formData);
      } else {
        const newTask = await createTask(user.id, { ...formData, createdAt: Date.now(), updatedAt: Date.now(), done: false });
        addTask(newTask);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleToggleTask = async (taskId: string, done: boolean) => {
    if (!user) return;
    await updateTask(user.id, taskId, { done: !done, doneAt: !done ? Date.now() : undefined });
    updateTaskState(taskId, { done: !done });
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user || !confirm('Görev silinsin mi?')) return;
    await deleteTask(user.id, taskId);
    deleteTaskState(taskId);
  };

  const priorityColor = {
    'düşük': 'text-text-muted',
    'normal': 'text-accent-orange',
    'yüksek': 'text-accent-red',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Görevler</h1>
          <p className="text-text-secondary">{tasks.length} toplam, {tasks.filter(t => !t.done).length} açık</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Görev
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'open', 'done'] as const).map(f => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Tümü' : f === 'open' ? 'Açık' : 'Yapıldı'} ({tasks.filter(t => f === 'all' ? true : f === 'open' ? !t.done : t.done).length})
          </Button>
        ))}
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader title="Görev Listesi" />
        <div className="space-y-2">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg hover:bg-dark-border transition-colors group">
                <button
                  onClick={() => handleToggleTask(task.id, task.done)}
                  className="flex-shrink-0 text-text-secondary hover:text-primary-500 transition-colors"
                >
                  {task.done ? <CheckCircle className="w-5 h-5 text-accent-green" /> : <Circle className="w-5 h-5" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className={task.done ? 'line-through text-text-muted' : 'text-text-primary font-medium'}>
                    {task.title}
                  </div>
                  <div className="flex gap-2 items-center mt-1">
                    {task.subject && <Badge variant="primary">{task.subject}</Badge>}
                    {task.dueDate && <span className="text-xs text-text-muted">{formatDate(task.dueDate)}</span>}
                  </div>
                </div>

                <div className={`text-xs font-semibold ${priorityColor[task.priority as keyof typeof priorityColor]}`}>
                  {task.priority === 'düşük' ? '↓' : task.priority === 'yüksek' ? '↑' : '•'}
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenModal(task)}
                    className="p-2 text-text-secondary hover:text-primary-500 hover:bg-dark-border rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-text-secondary hover:text-accent-red hover:bg-accent-red/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-text-muted">
              {filter === 'done' ? '✨ Henüz görev tamamlanmadı' : '🎉 Tüm görevler tamamlandı!'}
            </div>
          )}
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}
        size="md"
      >
        <ModalContent>
          <div className="space-y-4">
            <Input
              label="Görev Başlığı"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Örn: Matematik soru çöz"
            />

            <Input
              label="Açıklama"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Görev detayları (opsiyonel)"
            />

            <Select
              label="Ders"
              options={[
                { value: '', label: 'Seçim yok' },
                { value: 'Matematik', label: 'Matematik' },
                { value: 'Fizik', label: 'Fizik' },
                { value: 'Kimya', label: 'Kimya' },
                { value: 'Biyoloji', label: 'Biyoloji' },
                { value: 'Türkçe', label: 'Türkçe' },
                { value: 'Sosyal', label: 'Sosyal' },
              ]}
              value={formData.subject || ''}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />

            <Select
              label="Öncelik"
              options={[
                { value: 'düşük', label: 'Düşük' },
                { value: 'normal', label: 'Normal' },
                { value: 'yüksek', label: 'Yüksek' },
              ]}
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            />

            <Input
              label="Son Tarih"
              type="date"
              value={formData.dueDate || ''}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
        </ModalContent>

        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleSaveTask}>
            {editingTask ? 'Güncelle' : 'Oluştur'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
