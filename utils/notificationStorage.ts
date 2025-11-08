/**
 * Notification Storage Utility
 * Provides localStorage and IndexedDB persistence for notifications
 * Falls back to localStorage if IndexedDB is not available
 */

export interface StoredNotification {
  id: string;
  type: 'achievement' | 'reminder' | 'progress' | 'system' | 'social' | 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  icon?: string;
  color?: string;
}

const STORAGE_KEY = 'linguaai_notifications';
const DB_NAME = 'linguaai_db';
const DB_VERSION = 1;
const STORE_NAME = 'notifications';

class NotificationStorage {
  private db: IDBDatabase | null = null;
  private useIndexedDB = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve) => {
      if (typeof window === 'undefined') {
        this.useIndexedDB = false;
        resolve();
        return;
      }

      // Check if IndexedDB is available
      if ('indexedDB' in window) {
        try {
          const request = indexedDB.open(DB_NAME, DB_VERSION);

          request.onerror = () => {
            console.warn('IndexedDB not available, falling back to localStorage');
            this.useIndexedDB = false;
            resolve();
          };

          request.onsuccess = () => {
            this.db = request.result;
            this.useIndexedDB = true;
            resolve();
          };

          request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
              objectStore.createIndex('timestamp', 'timestamp', { unique: false });
              objectStore.createIndex('read', 'read', { unique: false });
            }
          };
        } catch (error) {
          console.warn('IndexedDB initialization failed, using localStorage:', error);
          this.useIndexedDB = false;
          resolve();
        }
      } else {
        this.useIndexedDB = false;
        resolve();
      }
    });

    return this.initPromise;
  }

  async getAll(): Promise<StoredNotification[]> {
    await this.init();

    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const notifications = request.result || [];
          // Sort by timestamp (newest first)
          notifications.sort((a: StoredNotification, b: StoredNotification) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          resolve(notifications);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } else {
      // Fallback to localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const notifications: StoredNotification[] = stored ? JSON.parse(stored) : [];
        // Sort by timestamp (newest first)
        notifications.sort((a: StoredNotification, b: StoredNotification) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        return notifications;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
      }
    }
  }

  async save(notification: StoredNotification): Promise<void> {
    await this.init();

    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(notification);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      // Fallback to localStorage
      try {
        const notifications = await this.getAll();
        const existingIndex = notifications.findIndex(n => n.id === notification.id);
        
        if (existingIndex >= 0) {
          notifications[existingIndex] = notification;
        } else {
          notifications.push(notification);
        }

        // Sort by timestamp (newest first)
        notifications.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        // Keep only last 100 notifications
        const limited = notifications.slice(0, 100);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }

  async saveAll(notifications: StoredNotification[]): Promise<void> {
    await this.init();

    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        // Clear existing
        store.clear();

        // Add all notifications
        notifications.forEach(notification => {
          store.put(notification);
        });

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } else {
      // Fallback to localStorage
      try {
        // Sort and limit
        const sorted = [...notifications].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        const limited = sorted.slice(0, 100);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
      } catch (error) {
        console.error('Error saving all to localStorage:', error);
      }
    }
  }

  async delete(id: string): Promise<void> {
    await this.init();

    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      // Fallback to localStorage
      try {
        const notifications = await this.getAll();
        const filtered = notifications.filter(n => n.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (error) {
        console.error('Error deleting from localStorage:', error);
      }
    }
  }

  async clearAll(): Promise<void> {
    await this.init();

    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } else {
      // Fallback to localStorage
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  }

  async markAsRead(id: string): Promise<void> {
    await this.init();

    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const getRequest = store.get(id);

        getRequest.onsuccess = () => {
          const notification = getRequest.result;
          if (notification) {
            notification.read = true;
            const putRequest = store.put(notification);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
          } else {
            resolve();
          }
        };

        getRequest.onerror = () => reject(getRequest.error);
      });
    } else {
      // Fallback to localStorage
      try {
        const notifications = await this.getAll();
        const index = notifications.findIndex(n => n.id === id);
        if (index >= 0) {
          notifications[index].read = true;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        }
      } catch (error) {
        console.error('Error marking as read in localStorage:', error);
      }
    }
  }

  async markAllAsRead(): Promise<void> {
    await this.init();

    if (this.useIndexedDB && this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.openCursor();

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            cursor.value.read = true;
            cursor.update(cursor.value);
            cursor.continue();
          } else {
            resolve();
          }
        };

        request.onerror = () => reject(request.error);
      });
    } else {
      // Fallback to localStorage
      try {
        const notifications = await this.getAll();
        notifications.forEach(n => n.read = true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      } catch (error) {
        console.error('Error marking all as read in localStorage:', error);
      }
    }
  }
}

// Export singleton instance
export const notificationStorage = new NotificationStorage();

