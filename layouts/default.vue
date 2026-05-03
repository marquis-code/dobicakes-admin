<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden font-sans">
    <!-- Mobile Sidebar Backdrop -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-500"></div>

    <!-- Sidebar -->
    <aside :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
           class="fixed lg:static inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col shrink-0 z-50 transition-transform duration-500 ease-in-out border-r border-slate-800/50">
      <div class="p-8 flex items-center justify-between border-b border-slate-800/50">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-brand-gold rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-brand-gold/10">A</div>
          <span class="font-bold tracking-tight text-sm">Adaobi <span class="text-brand-gold">Admin</span></span>
        </div>
        <button @click="isSidebarOpen = false" class="lg:hidden text-slate-400 hover:text-white">
          <LucideX :size="20" />
        </button>
      </div>

      <nav class="flex-grow p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to" 
                  @click="isSidebarOpen = false"
                  class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-xs font-semibold group"
                  :class="$route.path === link.to ? 'bg-brand-gold text-white shadow-lg shadow-brand-gold/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'">
          <component :is="link.icon" :size="16" class="group-hover:scale-110 transition-transform" />
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="p-6 border-t border-slate-800/50">
        <button @click="confirmLogout" class="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white transition-colors text-xs font-semibold hover:bg-rose-500/10 rounded-lg group">
          <LucideLogOut :size="16" class="group-hover:translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-grow flex flex-col overflow-hidden relative">
      <header class="h-16 bg-white border-b border-slate-200/60 flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-30">
        <div class="flex items-center gap-4">
          <button @click="isSidebarOpen = true" class="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
            <LucideMenu :size="20" />
          </button>
          <h2 class="text-xs font-bold tracking-widest text-slate-400 uppercase">{{ currentPageTitle }}</h2>
        </div>

        <div class="flex items-center gap-6">
          <!-- Notification Bell -->
          <div class="relative">
            <button @click="isNotificationOpen = !isNotificationOpen" class="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all relative">
              <LucideBell :size="20" />
              <span v-if="unreadCount > 0" class="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center rounded-full border-2 border-white animate-bounce-subtle">
                {{ unreadCount }}
              </span>
            </button>
            
            <!-- Notification Dropdown -->
            <div v-if="isNotificationOpen" v-click-outside="() => isNotificationOpen = false" class="absolute right-0 mt-4 w-96 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up">
              <div class="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h4 class="text-[10px] font-bold text-slate-900 tracking-widest uppercase">Notifications</h4>
                <NuxtLink to="/admin/notifications" @click="isNotificationOpen = false" class="text-[9px] font-bold text-brand-gold hover:underline uppercase tracking-widest">View All</NuxtLink>
              </div>
              <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
                <div v-if="notifications.length === 0" class="py-12 text-center text-slate-300">
                  <LucideBellOff :size="32" class="mx-auto mb-3 opacity-20" />
                  <p class="text-[9px] font-bold uppercase tracking-widest">No notifications yet</p>
                </div>
                <div v-else v-for="notif in notifications.slice(0, 5)" :key="notif._id" 
                     @click="handleNotificationClick(notif)"
                     class="px-6 py-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                     :class="!notif.isRead ? 'bg-brand-gold/5' : ''">
                  <div class="flex gap-4">
                    <div :class="getNotifColor(notif.type)" class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                      <component :is="getNotifIcon(notif.type)" :size="18" />
                    </div>
                    <div class="space-y-1 overflow-hidden">
                      <p class="text-[11px] font-bold text-slate-900 truncate pr-4">{{ notif.title }}</p>
                      <p class="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{{ notif.message }}</p>
                      <p class="text-[8px] text-slate-400 font-medium">{{ formatTime(notif.createdAt) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right hidden sm:flex flex-col">
              <span class="text-[11px] font-bold text-slate-900">{{ admin?.firstName }} {{ admin?.lastName }}</span>
              <span class="text-[9px] text-brand-gold tracking-widest font-medium uppercase">Super Admin</span>
            </div>
            <div class="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-700 border border-slate-200/60">
              {{ admin?.firstName?.[0] }}
            </div>
          </div>
        </div>
      </header>
      
      <main class="flex-grow overflow-y-auto p-4 lg:p-10 bg-slate-50/50 custom-scrollbar relative">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>

    <!-- Logout Confirmation Modal -->
    <ConfirmationModal
      :is-open="isLogoutModalOpen"
      title="Confirm Logout"
      message="Are you sure you want to end your current session? You will need to sign in again to access the dashboard."
      confirm-text="Logout"
      cancel-text="Cancel"
      type="danger"
      @close="isLogoutModalOpen = false"
      @confirm="handleLogout"
    />
  </div>
</template>

<script setup>
import { 
  LucideLayoutDashboard, LucideShoppingBag, LucideBox, LucideUsers, 
  LucideFileText, LucideLogOut, LucideClipboardList, LucideCalendar, 
  LucideMessageSquare, LucideSettings, LucideMegaphone, LucideMail, LucideHelpCircle, LucideMenu, LucideX,
  LucideBell, LucideBellOff, LucideTag, LucideCreditCard, LucideShieldCheck
} from 'lucide-vue-next';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';

const { admin, logout } = useAdminAuth();
const { notifications, unreadCount, markAsRead } = useNotifications();
const route = useRoute();
const router = useRouter();

const isSidebarOpen = ref(false);
const isNotificationOpen = ref(false);
const isLogoutModalOpen = ref(false);

const handleNotificationClick = (notif) => {
  markAsRead(notif._id);
  isNotificationOpen.value = false;
  if (notif.link) router.push(notif.link);
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

const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const navLinks = [
  { to: '/admin', label: 'Overview', icon: LucideLayoutDashboard },
  { to: '/admin/orders', label: 'Sales & Orders', icon: LucideShoppingBag },
  { to: '/admin/products', label: 'Inventory', icon: LucideBox },
  { to: '/admin/customers', label: 'Customers', icon: LucideUsers },
  { to: '/admin/blog', label: 'Blog & Content', icon: LucideFileText },
  { to: '/admin/forms', label: 'Form Builder', icon: LucideClipboardList },
  { to: '/admin/appointments', label: 'Appointments', icon: LucideCalendar },
  { to: '/admin/chat', label: 'Support Chat', icon: LucideMessageSquare },
  { to: '/admin/enquiries', label: 'Enquiries', icon: LucideHelpCircle },
  { to: '/admin/newsletter', label: 'Newsletter', icon: LucideMail },
  { to: '/admin/notifications', label: 'Notifications', icon: LucideBell },
  { to: '/admin/marketing/promos', label: 'Promos', icon: LucideMegaphone },
  { to: '/admin/marketing/banners', label: 'Banners', icon: LucideMegaphone },
  { to: '/admin/settings', label: 'Settings', icon: LucideSettings },
];

const currentPageTitle = computed(() => {
  const link = navLinks.find(l => l.to === route.path);
  return link ? link.label : 'Dashboard';
});

const confirmLogout = () => {
  isLogoutModalOpen.value = true;
};

const handleLogout = () => {
  isLogoutModalOpen.value = false;
  logout();
};
</script>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 rounded-full hover:bg-slate-300 transition-colors;
}

.admin-card {
  @apply bg-white border border-slate-200/60 p-8 transition-all duration-300;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.02), 0 2px 4px -2px rgb(0 0 0 / 0.02);
}

.admin-card:hover {
  @apply border-slate-300/60;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.03), 0 4px 6px -4px rgb(0 0 0 / 0.03);
}

input, select, textarea {
  @apply border border-slate-200 bg-slate-50/50 px-4 py-3 outline-none focus:border-brand-gold focus:bg-white transition-all text-xs font-medium rounded-lg;
}
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}
.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s ease-out forwards;
}
</style>
