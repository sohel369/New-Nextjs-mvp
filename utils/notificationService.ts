import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  doc, 
  deleteDoc, 
  writeBatch,
  getDoc,
  getCountFromServer
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface CreateNotificationData {
  user_id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export class NotificationService {
  /**
   * Create a new notification for a user
   */
  static async createNotification(data: CreateNotificationData) {
    try {
      const notification = {
        user_id: data.user_id,
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        read: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'notifications'), notification);
      return { id: docRef.id, ...notification };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Create notifications for multiple users
   */
  static async createBulkNotifications(
    userIds: string[],
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) {
    try {
      const batch = writeBatch(db);
      const notifications = userIds.map(userId => {
        const docRef = doc(collection(db, 'notifications'));
        const notification = {
          user_id: userId,
          title,
          message,
          type,
          read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        batch.set(docRef, notification);
        return { id: docRef.id, ...notification };
      });

      await batch.commit();
      return notifications;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      throw error;
    }
  }

  /**
   * Create notification for all users
   */
  static async createGlobalNotification(
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) {
    try {
      // Get all user IDs from profiles collection
      const querySnapshot = await getDocs(collection(db, 'profiles'));
      const userIds = querySnapshot.docs.map(doc => doc.id);

      if (userIds.length === 0) {
        return [];
      }

      return await this.createBulkNotifications(userIds, title, message, type);
    } catch (error) {
      console.error('Error creating global notification:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    try {
      const docRef = doc(db, 'notifications', notificationId);
      await updateDoc(docRef, { 
        read: true, 
        updated_at: new Date().toISOString() 
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    try {
      const q = query(
        collection(db, 'notifications'), 
        where('user_id', '==', userId), 
        where('read', '==', false)
      );
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, { 
          read: true, 
          updated_at: new Date().toISOString() 
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string, userId: string) {
    try {
      const docRef = doc(db, 'notifications', notificationId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  /**
   * Get user's notifications
   */
  static async getUserNotifications(userId: string, limitCount: number = 50) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(userId: string) {
    try {
      const q = query(
        collection(db, 'notifications'), 
        where('user_id', '==', userId), 
        where('read', '==', false)
      );
      
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }
}
