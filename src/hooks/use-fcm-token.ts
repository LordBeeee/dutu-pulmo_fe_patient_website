import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { onMessageListener, requestForToken } from '@/config/firebase';
import { authService } from '@/services/auth.service';

export const useFcmToken = (isAuthenticated: boolean) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    const fetchToken = async () => {
      try {
        const token = await requestForToken();
        if (token && !cancelled) {
          setFcmToken(token);
          await authService.addFcmToken(token);
        }
      } catch (error) {
        console.error('Failed to fetch FCM token:', error);
      }
    };

    void fetchToken();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!fcmToken) return;

    const listenToMessage = () => {
      onMessageListener()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((payload: any) => {
          console.log('Received foreground message:', payload);
          const notificationData = payload.notification || payload.data;
          
          if (notificationData) {
            toast(notificationData.title || 'Thông báo mới', {
              description: notificationData.body || notificationData.content,
            });
          }
          listenToMessage();
        })
        .catch((err: any) => console.log('failed: ', err));
    };

    listenToMessage();
  }, [fcmToken]);

  return { fcmToken };
};
