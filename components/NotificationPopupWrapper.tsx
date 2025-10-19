'use client';

import { useNotificationPopup } from '../hooks/useNotificationPopup';
import NotificationPopup from './NotificationPopup';

interface NotificationPopupWrapperProps {
  children: React.ReactNode;
}

export default function NotificationPopupWrapper({ children }: NotificationPopupWrapperProps) {
  const { showPopup, closePopup } = useNotificationPopup();

  return (
    <>
      {children}
      <NotificationPopup show={showPopup} onClose={closePopup} />
    </>
  );
}
