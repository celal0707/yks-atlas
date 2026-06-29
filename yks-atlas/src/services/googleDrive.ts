import axios from 'axios';

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const FOLDER_NAME = 'YKS Atlas Data';
const BACKUP_FILENAME = 'yks-atlas-backup.json';

export interface DriveBackup {
  fileId: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  size: string;
}

class GoogleDriveService {
  private accessToken: string | null = null;
  private folderId: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Ensures YKS Atlas folder exists on Google Drive
   */
  async ensureFolder(): Promise<string> {
    if (this.folderId) return this.folderId;

    try {
      // Check if folder exists
      const response = await axios.get(`${DRIVE_API_URL}/files`, {
        headers: this.getHeaders(),
        params: {
          q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
          spaces: 'drive',
          fields: 'files(id, name)',
        },
      });

      if (response.data.files.length > 0) {
        this.folderId = response.data.files[0].id;
        return this.folderId;
      }

      // Create folder if it doesn't exist
      const createResponse = await axios.post(
        `${DRIVE_API_URL}/files`,
        {
          name: FOLDER_NAME,
          mimeType: 'application/vnd.google-apps.folder',
        },
        { headers: this.getHeaders() }
      );

      this.folderId = createResponse.data.id;
      return this.folderId;
    } catch (error) {
      console.error('Error ensuring folder:', error);
      throw error;
    }
  }

  /**
   * Upload backup to Google Drive
   */
  async uploadBackup(data: any): Promise<DriveBackup> {
    try {
      const folderId = await this.ensureFolder();
      const timestamp = new Date().toISOString();
      const fileName = `${BACKUP_FILENAME.split('.')[0]}-${timestamp}.json`;
      const fileContent = JSON.stringify(data, null, 2);

      // Check if backup exists
      const existingResponse = await axios.get(`${DRIVE_API_URL}/files`, {
        headers: this.getHeaders(),
        params: {
          q: `name='${fileName}' and trashed=false`,
          spaces: 'drive',
          fields: 'files(id)',
        },
      });

      if (existingResponse.data.files.length > 0) {
        // Update existing file
        const fileId = existingResponse.data.files[0].id;
        await axios.patch(
          `${DRIVE_API_URL}/files/${fileId}`,
          { data: fileContent },
          {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return {
          fileId,
          name: fileName,
          createdTime: new Date().toISOString(),
          modifiedTime: new Date().toISOString(),
          size: fileContent.length.toString(),
        };
      }

      // Upload new file
      const uploadResponse = await axios.post(
        `${DRIVE_API_URL}/files?uploadType=multipart`,
        fileContent,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          params: {
            parents: folderId,
            name: fileName,
          },
        }
      );

      return {
        fileId: uploadResponse.data.id,
        name: fileName,
        createdTime: uploadResponse.data.createdTime,
        modifiedTime: uploadResponse.data.modifiedTime,
        size: uploadResponse.data.size,
      };
    } catch (error) {
      console.error('Error uploading backup:', error);
      throw error;
    }
  }

  /**
   * Download backup from Google Drive
   */
  async downloadBackup(fileId?: string): Promise<any> {
    try {
      const folderId = await this.ensureFolder();
      let backupFileId = fileId;

      // Get latest backup if not specified
      if (!backupFileId) {
        const response = await axios.get(`${DRIVE_API_URL}/files`, {
          headers: this.getHeaders(),
          params: {
            q: `'${folderId}' in parents and name contains '${BACKUP_FILENAME.split('.')[0]}'`,
            orderBy: 'modifiedTime desc',
            pageSize: 1,
            fields: 'files(id)',
          },
        });

        if (response.data.files.length === 0) {
          throw new Error('No backup found');
        }

        backupFileId = response.data.files[0].id;
      }

      const downloadResponse = await axios.get(
        `${DRIVE_API_URL}/files/${backupFileId}?alt=media`,
        {
          headers: this.getHeaders(),
        }
      );

      return downloadResponse.data;
    } catch (error) {
      console.error('Error downloading backup:', error);
      throw error;
    }
  }

  /**
   * List all backups
   */
  async listBackups(): Promise<DriveBackup[]> {
    try {
      const folderId = await this.ensureFolder();

      const response = await axios.get(`${DRIVE_API_URL}/files`, {
        headers: this.getHeaders(),
        params: {
          q: `'${folderId}' in parents and name contains '${BACKUP_FILENAME.split('.')[0]}'`,
          orderBy: 'modifiedTime desc',
          fields: 'files(id, name, createdTime, modifiedTime, size)',
        },
      });

      return response.data.files.map((file: any) => ({
        fileId: file.id,
        name: file.name,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
        size: file.size,
      }));
    } catch (error) {
      console.error('Error listing backups:', error);
      throw error;
    }
  }

  /**
   * Delete backup
   */
  async deleteBackup(fileId: string): Promise<void> {
    try {
      await axios.delete(`${DRIVE_API_URL}/files/${fileId}`, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Error deleting backup:', error);
      throw error;
    }
  }

  /**
   * Sync data from cloud to local
   */
  async syncFromCloud(fileId?: string): Promise<any> {
    try {
      return await this.downloadBackup(fileId);
    } catch (error) {
      console.error('Error syncing from cloud:', error);
      throw error;
    }
  }

  /**
   * Sync data from local to cloud
   */
  async syncToCloud(data: any): Promise<DriveBackup> {
    try {
      return await this.uploadBackup(data);
    } catch (error) {
      console.error('Error syncing to cloud:', error);
      throw error;
    }
  }
}

export const googleDriveService = new GoogleDriveService();
