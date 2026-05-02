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
        <button @click="handleLogout" class="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white transition-colors text-xs font-semibold hover:bg-rose-500/10 rounded-lg group">
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

        <div class="flex items-center gap-4">
          <div class="text-right hidden sm:flex flex-col">
            <span class="text-[11px] font-bold text-slate-900">{{ admin?.firstName }} {{ admin?.lastName }}</span>
            <span class="text-[9px] text-brand-gold tracking-widest font-medium uppercase">Super Admin</span>
          </div>
          <div class="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-700 border border-slate-200/60">
            {{ admin?.firstName?.[0] }}
          </div>
        </div>
      </header>
      
      <main class="flex-grow overflow-y-auto p-4 lg:p-10 bg-slate-50/50 custom-scrollbar relative">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { 
  LucideLayoutDashboard, LucideShoppingBag, LucideBox, LucideUsers, 
  LucideFileText, LucideLogOut, LucideFormInput, LucideCalendar, 
  LucideMessageSquare, LucideSettings, LucideMegaphone, LucideMail, LucideHelpCircle, LucideMenu, LucideX
} from 'lucide-vue-next';

const { admin, logout } = useAdminAuth();
const route = useRoute();
const isSidebarOpen = ref(false);

const navLinks = [
  { to: '/admin', label: 'Overview', icon: LucideLayoutDashboard },
  { to: '/admin/orders', label: 'Sales & Orders', icon: LucideShoppingBag },
  { to: '/admin/products', label: 'Inventory', icon: LucideBox },
  { to: '/admin/customers', label: 'Customers', icon: LucideUsers },
  { to: '/admin/blog', label: 'Blog & Content', icon: LucideFileText },
  { to: '/admin/forms', label: 'Form Builder', icon: LucideFormInput },
  { to: '/admin/appointments', label: 'Appointments', icon: LucideCalendar },
  { to: '/admin/chat', label: 'Support Chat', icon: LucideMessageSquare },
  { to: '/admin/enquiries', label: 'Enquiries', icon: LucideHelpCircle },
  { to: '/admin/newsletter', label: 'Newsletter', icon: LucideMail },
  { to: '/admin/marketing/promos', label: 'Promos', icon: LucideMegaphone },
  { to: '/admin/marketing/banners', label: 'Banners', icon: LucideMegaphone },
  { to: '/admin/settings', label: 'Settings', icon: LucideSettings },
];

const currentPageTitle = computed(() => {
  const link = navLinks.find(l => l.to === route.path);
  return link ? link.label : 'Dashboard';
});

const handleLogout = () => {
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
</style>
