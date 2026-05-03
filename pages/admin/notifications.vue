<template>
  <div class="space-y-8 animate-fade-in pb-20">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Notification Center</h3>
        <p class="text-[10px] text-gray-400 tracking-widest uppercase">Manage system alerts and support activity</p>
      </div>
      <div class="flex gap-4">
        <button @click="markAllAsRead" class="px-6 py-2.5 text-[10px] font-bold tracking-widest text-slate-400 hover:text-slate-900 uppercase transition-colors">Mark all as read</button>
        <button @click="clearAll" class="px-6 py-2.5 text-[10px] font-bold tracking-widest text-rose-400 hover:text-rose-600 uppercase transition-colors">Clear All</button>
      </div>
    </div>

    <div class="admin-card !p-0 overflow-hidden relative min-h-[500px]">
      <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center h-[500px] text-slate-300">
         <LucideBellOff :size="48" class="opacity-20 mb-4" />
         <p class="text-[10px] font-bold tracking-[0.2em] uppercase">Your inbox is clear</p>
      </div>

      <div v-else class="divide-y divide-slate-50">
        <div v-for="notif in notifications" :key="notif._id" 
             class="group px-8 py-6 hover:bg-slate-50/50 transition-all flex items-start gap-6 relative"
             :class="!notif.isRead ? 'bg-brand-gold/5' : ''">
          
          <div :class="getNotifColor(notif.type)" class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
            <component :is="getNotifIcon(notif.type)" :size="20" />
          </div>

          <div class="flex-grow space-y-1">
            <div class="flex justify-between items-start">
              <h4 class="text-sm font-bold text-slate-900 tracking-tight">{{ notif.title }}</h4>
              <span class="text-[9px] text-slate-400 font-medium">{{ formatDate(notif.createdAt) }}</span>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed max-w-2xl">{{ notif.message }}</p>
            
            <div class="flex gap-6 pt-3">
              <button v-if="notif.link" @click="$router.push(notif.link)" class="text-[9px] font-bold text-brand-gold tracking-widest uppercase hover:underline">View Details</button>
              <button v-if="!notif.isRead" @click="markAsRead(notif._id)" class="text-[9px] font-bold text-slate-400 tracking-widest uppercase hover:text-slate-900">Mark read</button>
            </div>
          </div>

          <div v-if="!notif.isRead" class="absolute left-0 top-0 bottom-0 w-1 bg-brand-gold"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  LucideBell, LucideShoppingBag, LucideMessageSquare, LucideCalendar, 
  LucideCreditCard, LucideBellOff 
} from 'lucide-vue-next';

const { notifications, markAsRead, loadNotifications } = useNotifications();
const { patchAdmin, deleteAdmin } = useAdminApi();
const { success: toastSuccess } = useToast();

const markAllAsRead = async () => {
  try {
    await patchAdmin('/notifications/read-all', {});
    notifications.value.forEach(n => n.isRead = true);
    toastSuccess('All marked as read');
  } catch (e) {}
};

const clearAll = async () => {
  // Optional: Implementation for clearing all notifications
};

const getNotifIcon = (type) => {
  switch (type) {
    case 'order': return LucideShoppingBag;
    case 'chat': return LucideMessageSquare;
    case 'payment': return LucideCreditCard;
    case 'appointment': return LucideCalendar;
    default: return LucideBell;
  }
};

const getNotifColor = (type) => {
  switch (type) {
    case 'order': return 'bg-blue-50 text-blue-500';
    case 'chat': return 'bg-emerald-50 text-emerald-500';
    case 'payment': return 'bg-amber-50 text-amber-500';
    case 'appointment': return 'bg-purple-50 text-purple-500';
    default: return 'bg-slate-50 text-slate-500';
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleString([], { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};

onMounted(loadNotifications);
definePageMeta({ layout: 'default' });
</script>
