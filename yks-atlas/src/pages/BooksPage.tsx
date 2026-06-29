import { useState } from 'react';
import { useStore } from '@/store';
import { createBook, updateBook, deleteBook } from '@/services/firebase';
import { Card, CardHeader, Button, Input, Select, Modal, ModalContent, ModalFooter, Badge, Progress } from '@/components/Common';
import { Plus, Trash2, Edit2, BookOpen } from 'lucide-react';

const SUBJECTS = ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe', 'Sosyal', 'İngilizce'];

export default function BooksPage() {
  const { user, books, addBook, updateBook: updateBookState, deleteBook: deleteBookState } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    subject: '',
  });

  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        subject: book.subject,
      });
    } else {
      setEditingBook(null);
      setFormData({ isbn: '', title: '', author: '', publisher: '', subject: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveBook = async () => {
    if (!user || !formData.title) return;

    try {
      if (editingBook) {
        await updateBook(user.id, editingBook.id, formData);
        updateBookState(editingBook.id, formData);
      } else {
        const newBook = await createBook(user.id, {
          ...formData,
          topicsProgress: {},
          addedAt: Date.now(),
          updatedAt: Date.now(),
        });
        addBook(newBook);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!user || !confirm('Kitap silinsin mi?')) return;
    await deleteBook(user.id, bookId);
    deleteBookState(bookId);
  };

  const handleUpdateProgress = async (bookId: string, progress: number) => {
    if (!user) return;
    // Update logic here
    updateBookState(bookId, {});
  };

  const booksBySubject = SUBJECTS.map(subject => ({
    subject,
    books: books.filter(b => b.subject === subject),
  })).filter(g => g.books.length > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Kütüphane</h1>
          <p className="text-text-secondary">{books.length} kitap</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="primary" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Kitap Ekle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div>
            <div className="text-3xl font-bold text-primary-400">{books.length}</div>
            <div className="text-sm text-text-secondary">Toplam Kitap</div>
          </div>
        </Card>
        <Card>
          <div>
            <div className="text-3xl font-bold text-accent-green">
              {Math.round(books.reduce((a, b) => a + (Object.values(b.topicsProgress || {}).filter((t: any) => t.status === 'bitti').length / (Object.keys(b.topicsProgress || {}).length || 1)) * 100, 0) / (books.length || 1))}%
            </div>
            <div className="text-sm text-text-secondary">Ortalama İlerleme</div>
          </div>
        </Card>
        <Card>
          <div>
            <div className="text-3xl font-bold text-accent-orange">
              {books.reduce((a, b) => a + Object.keys(b.topicsProgress || {}).length, 0)}
            </div>
            <div className="text-sm text-text-secondary">Toplam Konu</div>
          </div>
        </Card>
      </div>

      {/* Books by Subject */}
      <div className="space-y-6">
        {booksBySubject.length > 0 ? (
          booksBySubject.map(group => (
            <div key={group.subject}>
              <h2 className="text-lg font-semibold text-text-primary mb-3">{group.subject}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.books.map(book => {
                  const completed = Object.values(book.topicsProgress || {}).filter((t: any) => t.status === 'bitti').length;
                  const total = Object.keys(book.topicsProgress || {}).length;
                  const progress = total > 0 ? (completed / total) * 100 : 0;

                  return (
                    <Card key={book.id}>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-text-primary truncate">{book.title}</h3>
                            <p className="text-xs text-text-muted">{book.author}</p>
                            {book.publisher && <p className="text-xs text-text-muted">{book.publisher}</p>}
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleOpenModal(book)}
                              className="p-2 text-text-secondary hover:text-primary-500 hover:bg-dark-border rounded transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book.id)}
                              className="p-2 text-text-secondary hover:text-accent-red hover:bg-accent-red/10 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {total > 0 && (
                          <>
                            <Progress label="Tamamlanma" value={completed} max={total} color="success" />
                            <div className="text-xs text-text-muted">
                              {completed}/{total} konu
                            </div>
                          </>
                        )}

                        {book.isbn && <Badge variant="primary">{book.isbn}</Badge>}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <Card>
            <div className="text-center py-12 text-text-muted">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              📚 Henüz kitap eklenmedi
            </div>
          </Card>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBook ? 'Kitabı Düzenle' : 'Yeni Kitap Ekle'}
        size="md"
      >
        <ModalContent>
          <div className="space-y-4">
            <Input
              label="Kitap Başlığı"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Örn: Matematik Fen"
            />

            <Input
              label="Yazar"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Örn: Adı Soyadı"
            />

            <Input
              label="Yayınevi"
              value={formData.publisher}
              onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
              placeholder="Yayınevi adı"
            />

            <Input
              label="ISBN"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              placeholder="ISBN (opsiyonel)"
            />

            <Select
              label="Ders"
              options={SUBJECTS.map(s => ({ value: s, label: s }))}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>
        </ModalContent>

        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleSaveBook}>
            {editingBook ? 'Güncelle' : 'Ekle'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
