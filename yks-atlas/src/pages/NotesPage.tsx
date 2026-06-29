import { useState } from 'react';
import { useStore } from '@/store';
import { createNote, updateNote, deleteNote } from '@/services/firebase';
import { Card, CardHeader, Button, Input, Textarea, Modal, ModalContent, ModalFooter, Badge } from '@/components/Common';
import { Plus, Trash2, Edit2, Pin, Search } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

const SUBJECTS = ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe', 'Sosyal', 'Diğer'];

export default function NotesPage() {
  const { user, notes, addNote, updateNote: updateNoteState, deleteNote: deleteNoteState } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subject: '',
    tags: '',
    pinned: false,
  });

  const handleOpenModal = (note = null) => {
    if (note) {
      setEditingNote(note);
      setFormData({
        title: note.title,
        content: note.content,
        subject: note.subject || '',
        tags: (note.tags || []).join(', '),
        pinned: note.pinned || false,
      });
    } else {
      setEditingNote(null);
      setFormData({ title: '', content: '', subject: '', tags: '', pinned: false });
    }
    setIsModalOpen(true);
  };

  const handleSaveNote = async () => {
    if (!user || !formData.title) return;

    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

      if (editingNote) {
        await updateNote(user.id, editingNote.id, {
          title: formData.title,
          content: formData.content,
          subject: formData.subject,
          tags,
          pinned: formData.pinned,
          updatedAt: Date.now(),
        });
        updateNoteState(editingNote.id, {
          title: formData.title,
          content: formData.content,
          subject: formData.subject,
          tags,
          pinned: formData.pinned,
        });
      } else {
        const newNote = await createNote(user.id, {
          title: formData.title,
          content: formData.content,
          subject: formData.subject,
          tags,
          pinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        addNote(newNote);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!user || !confirm('Not silinsin mi?')) return;
    await deleteNote(user.id, noteId);
    deleteNoteState(noteId);
  };

  const filteredNotes = notes
    .filter(n =>
      (n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (!filterSubject || n.subject === filterSubject)
    )
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Notlar</h1>
          <p className="text-text-secondary">{notes.length} not</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Not
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ara..."
            className="pl-9"
          />
        </div>
        <select className="input w-40" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
          <option value="">Tümü</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map(note => (
            <Card key={note.id} className="flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary truncate">{note.title}</h3>
                  <p className="text-xs text-text-muted">{formatDate(note.updatedAt || Date.now())}</p>
                </div>
                {note.pinned && <Pin className="w-4 h-4 text-accent-orange flex-shrink-0 ml-2" />}
              </div>

              <p className="text-sm text-text-secondary flex-1 line-clamp-3 mb-3">{note.content}</p>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {note.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="primary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {note.subject && (
                <Badge variant="success" size="sm" className="mb-3 w-fit">
                  {note.subject}
                </Badge>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenModal(note)}
                  fullWidth
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Düzenle
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteNote(note.id)}
                  fullWidth
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <div className="text-center py-12 text-text-muted">
                📝 {searchQuery || filterSubject ? 'Sonuç bulunamadı' : 'Henüz not eklenmedi'}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNote ? 'Notı Düzenle' : 'Yeni Not Oluştur'}
        size="lg"
      >
        <ModalContent>
          <div className="space-y-4">
            <Input
              label="Başlık"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Not başlığı"
            />

            <Textarea
              label="İçerik"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Not yazısı..."
              rows={6}
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                className="input"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="">Ders seç</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pinned}
                  onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                  className="w-4 h-4 rounded border border-dark-border bg-dark-bg"
                />
                <span className="text-sm">Sabitle</span>
              </label>
            </div>

            <Input
              label="Etiketler"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Virgülle ayrıl: etiket1, etiket2"
            />
          </div>
        </ModalContent>

        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleSaveNote}>
            {editingNote ? 'Güncelle' : 'Oluştur'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
