<template>
 <div class="flex h-screen bg-slate-50 overflow-hidden ">
 <!-- Mobile Sidebar Backdrop -->
 <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-500"></div>

 <!-- Sidebar -->
 <aside :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
 class="fixed lg:static inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col shrink-0 z-50 transition-transform duration-500 ease-in-out border-r border-slate-800/50">
 <div class="p-8 flex items-center justify-between border-b border-slate-800/40">
 <div class="flex items-center gap-3.5">
 <div class="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-brand-gold/20">A</div>
 <div class="flex flex-col">
 <span class="font-bold tracking-tight text-sm leading-tight">Adaobi <span class="text-brand-gold">Admin</span></span>
 <span class="text-tiny text-slate-500 font-medium tracking-tight">Management console</span>
 </div>
 </div>
 <button @click="isSidebarOpen = false" class="lg:hidden text-slate-400 hover:text-white">
 <LucideX :size="20" />
 </button>
 </div>

 <nav class="flex-grow p-5 space-y-1 overflow-y-auto custom-scrollbar">
 <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to" 
 @click="isSidebarOpen = false"
 class="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 text-xs font-medium group"
 :class="$route.path === link.to ? 'bg-brand-gold text-white shadow-lg shadow-brand-gold/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'">
 <component :is="link.icon" :size="18" class="group-hover:scale-110 transition-transform opacity-70 group-hover:opacity-100" />
 {{ link.label }}
 </NuxtLink>
 </nav>

 <div class="p-6 border-t border-slate-800/40">
 <button @click="confirmLogout" class="flex items-center gap-3.5 px-4 py-3.5 w-full text-slate-400 hover:text-white transition-colors text-xs font-bold hover:bg-rose-500/10 rounded-xl group">
 <LucideLogOut :size="18" class="group-hover:translate-x-1 transition-transform opacity-70 group-hover:opacity-100" />
 Logout session
 </button>
 </div>
 </aside>

 <!-- Main Content -->
 <div class="flex-grow flex flex-col overflow-hidden relative">
 <header class="h-20 bg-white border-b border-slate-200/60 flex items-center justify-between px-6 lg:px-10 shrink-0 relative z-30">
 <div class="flex items-center gap-6">
 <button @click="isSidebarOpen = true" class="lg:hidden p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
 <LucideMenu :size="22" />
 </button>
 <div class="flex flex-col">
 <h2 class="text-base font-bold text-slate-900 tracking-tight">{{ currentPageTitle }}</h2>
 <div class="flex items-center gap-2 text-tiny text-slate-400 font-medium">
 <span>Admin</span>
 <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
 <span>{{ new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</span>
 </div>
 </div>
 </div>

 <div class="flex items-center gap-8">
 <!-- Notification Bell -->
 <div class="relative">
 <button @click="isNotificationOpen = !isNotificationOpen" class="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all relative border border-transparent hover:border-slate-100">
 <LucideBell :size="22" />
 <span v-if="unreadCount > 0" class="absolute top-2 right-2 w-4.5 h-4.5 bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-white animate-bounce-subtle shadow-sm">
 {{ unreadCount }}
 </span>
 </button>
 
 <!-- Notification Dropdown -->
 <div v-if="isNotificationOpen" v-click-outside="() => isNotificationOpen = false" class="absolute right-0 mt-4 w-[400px] bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-slide-up rounded-3xl">
 <div class="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
 <div class="flex flex-col">
 <h4 class="text-sm font-bold text-slate-900">Recent notifications</h4>
 <p class="text-tiny text-slate-400 font-medium">Stay updated with system activity</p>
 </div>
 <NuxtLink to="/admin/notifications" @click="isNotificationOpen = false" class="text-tiny font-bold text-brand-gold hover:text-brand-gold-dark px-3 py-1.5 bg-brand-gold/5 rounded-lg transition-colors">View All</NuxtLink>
 </div>
 <div class="max-h-[440px] overflow-y-auto custom-scrollbar">
 <div v-if="notifications.length === 0" class="py-20 text-center">
 <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
 <LucideBellOff :size="28" class="text-slate-300" />
 </div>
 <p class="text-sm font-bold text-slate-900">Your inbox is clear</p>
 <p class="text-xs text-slate-400 mt-1">We'll alert you when something happens</p>
 </div>
 <div v-else v-for="notif in notifications.slice(0, 5)" :key="notif._id" 
 @click="handleNotificationClick(notif)"
 class="px-8 py-3 border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group"
 :class="!notif.isRead ? 'bg-brand-gold/5' : ''">
 <div class="flex gap-5">
 <div :class="getNotifColor(notif.type)" class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
 <component :is="getNotifIcon(notif.type)" :size="20" />
 </div>
 <div class="space-y-1 flex-grow overflow-hidden">
 <div class="flex justify-between items-start">
 <p class="text-sm font-bold text-slate-900 truncate pr-4">{{ notif.title }}</p>
 <span class="text-tiny text-slate-400 font-medium whitespace-nowrap">{{ formatTime(notif.createdAt) }}</span>
 </div>
 <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">{{ notif.message }}</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div class="flex items-center gap-5 border-l border-slate-100 pl-8">
 <div class="text-right hidden sm:flex flex-col">
 <span class="text-sm font-bold text-slate-900 leading-none mb-1">{{ admin?.firstName }} {{ admin?.lastName }}</span>
 <span class="text-tiny text-brand-gold font-bold tracking-tight">Super administrator</span>
 </div>
 <div class="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center text-sm font-bold text-slate-700 border border-slate-200/60 shadow-sm">
 {{ admin?.firstName?.[0] }}
 </div>
 </div>
 </div>
 </header>
 
 <main class="flex-grow overflow-y-auto p-6 lg:p-12 bg-slate-50/50 custom-scrollbar relative">
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
 confirm-text="Logout Session"
 cancel-text="Keep Working"
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
 case 'order': return 'bg-blue-50 text-blue-500 border border-blue-100';
 case 'chat': return 'bg-emerald-50 text-emerald-500 border border-emerald-100';
 case 'payment': return 'bg-amber-50 text-amber-500 border border-amber-100';
 case 'appointment': return 'bg-purple-50 text-purple-500 border border-purple-100';
 default: return 'bg-slate-50 text-slate-500 border border-slate-100';
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
 { to: '/admin/products/categories', label: 'Artisanal categories', icon: LucideTag },
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
 @apply bg-white border border-slate-200/60 p-6 transition-all duration-300;
 box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.02), 0 2px 4px -2px rgb(0 0 0 / 0.02);
 border-radius: 12px;
}

.admin-card:hover {
 @apply border-slate-300/60;
 box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.03), 0 4px 6px -4px rgb(0 0 0 / 0.03);
}

input, select, textarea {
 @apply border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/20 transition-all text-sm font-medium rounded-xl;
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
