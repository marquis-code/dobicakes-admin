import { io, Socket } from 'socket.io-client';
import { ref, onMounted, onUnmounted } from 'vue';

export const useNotifications = () => {
  const notifications = ref([]);
  const unreadCount = ref(0);
  const socket = ref<Socket | null>(null);
  const { fetchAdmin, patchAdmin } = useAdminApi();
  const runtimeConfig = useRuntimeConfig();

  const loadNotifications = async () => {
    try {
      const data = await fetchAdmin('/notifications');
      notifications.value = data;
      unreadCount.value = data.filter((n: any) => !n.isRead).length;
    } catch (e) {
      console.error('Failed to load notifications');
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.error('Audio play failed', e));
  };

  const markAsRead = async (id: string) => {
    try {
      await patchAdmin(`/notifications/${id}/read`, {});
      const notification = notifications.value.find((n: any) => n._id === id);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        unreadCount.value--;
      }
    } catch (e) {
      console.error('Failed to mark as read');
    }
  };

  onMounted(() => {
    loadNotifications();

    // Connect to websocket
    socket.value = io(`${runtimeConfig.public.apiBase}/notifications`, {
      transports: ['websocket']
    });

    socket.value.on('connect', () => {
      console.log('Connected to notification socket');
    });

    socket.value.on('newNotification', (notification: any) => {
      notifications.value.unshift(notification);
      unreadCount.value++;
      playNotificationSound();
      
      // Use browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico'
        });
      }
    });

    // Request permission for browser notifications
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  });

  onUnmounted(() => {
    if (socket.value) {
      socket.value.disconnect();
    }
  });

  return {
    notifications,
    unreadCount,
    markAsRead,
    loadNotifications
  };
};
