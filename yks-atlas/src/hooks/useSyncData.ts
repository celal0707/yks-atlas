import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { googleDriveService } from '@/services/googleDrive';
import { 
  getTasks, getExams, getMistakes, getBooks, getNotes, getSubjects,
  batchUpdateData 
} from '@/services/firebase';

export const useSyncData = (userId: string | null) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);
  const store = useStore();

  // Auto-sync every 5 minutes
  useEffect(() => {
    if (!userId) return;

    const syncInterval = setInterval(async () => {
      await syncDataFromCloud();
    }, 5 * 60 * 1000);

    return () => clearInterval(syncInterval);
  }, [userId]);

  const syncDataFromCloud = async () => {
    if (!userId) return;
    
    try {
      setIsSyncing(true);
      setError(null);

      const [tasks, exams, mistakes, books, notes, subjects] = await Promise.all([
        getTasks(userId),
        getExams(userId),
        getMistakes(userId),
        getBooks(userId),
        getNotes(userId),
        getSubjects(userId),
      ]);

      store.loadAllData({
        tasks,
        exams,
        mistakes,
        books,
        notes,
        subjects,
      });

      setLastSyncTime(Date.now());
    } catch (err) {
      console.error('Sync from cloud failed:', err);
      setError('Buluttan senkronizasyon başarısız oldu');
    } finally {
      setIsSyncing(false);
    }
  };

  const syncDataToCloud = async () => {
    if (!userId) return;

    try {
      setIsSyncing(true);
      setError(null);

      const appState = useStore.getState();
      
      // Create backup
      const backup = {
        user: appState.user,
        stats: appState.stats,
        tasks: appState.tasks,
        exams: appState.exams,
        mistakes: appState.mistakes,
        books: appState.books,
        notes: appState.notes,
        subjects: appState.subjects,
        exportedAt: new Date().toISOString(),
      };

      // Upload to Google Drive
      await googleDriveService.syncToCloud(backup);

      // Also update Firebase with batch
      await batchUpdateData(userId, {
        tasks: appState.tasks,
        exams: appState.exams,
        subjects: Object.entries(appState.subjects).map(([name, data]) => ({
          name,
          data,
        })),
      });

      setLastSyncTime(Date.now());
    } catch (err) {
      console.error('Sync to cloud failed:', err);
      setError('Buluta senkronizasyon başarısız oldu');
    } finally {
      setIsSyncing(false);
    }
  };

  const downloadBackup = async () => {
    try {
      const data = await googleDriveService.downloadBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `yks-atlas-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download backup failed:', err);
      setError('Yedek indirme başarısız oldu');
    }
  };

  return {
    isSyncing,
    syncError,
    lastSyncTime,
    syncDataFromCloud,
    syncDataToCloud,
    downloadBackup,
  };
};
