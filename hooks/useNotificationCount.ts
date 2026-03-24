import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export const useNotificationCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const docRef = doc(db, 'notifications', notificationId);
      await updateDoc(docRef, { read: true });
      // Local state will be updated by the onSnapshot listener
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return;

    try {
      const batch = writeBatch(db);
      notifications.forEach(notification => {
        const docRef = doc(db, 'notifications', notification.id);
        batch.update(docRef, { read: true });
      });
      await batch.commit();
      // Local state will be updated by the onSnapshot listener
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user || !db || (db as any)._type !== 'Firestore' && typeof (db as any).collection !== 'function') {
      setUnreadCount(0);
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Query for unread notifications for the current user
    const q = query(
      collection(db, 'notifications'),
      where('user_id', '==', user.id),
      where('read', '==', false),
      orderBy('created_at', 'desc')
    );

    // Set up the listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.length);
      setLoading(false);
    }, (error) => {
      console.error('Error in notifications snapshot:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return {
    unreadCount,
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications: async () => {}, // Not strictly needed with onSnapshot, but keeping interface
  };

};
