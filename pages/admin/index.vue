<template>
  <div class="space-y-10 animate-fade-in pb-10">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <template v-if="loading">
        <div v-for="i in 4" :key="i" class="admin-card !p-6 h-40 animate-pulse-slow bg-white/50 border-slate-100"></div>
      </template>
      <template v-else>
        <div v-for="stat in dashboardData.stats" :key="stat.label" class="admin-card !p-6 flex flex-col justify-between group hover:border-brand-gold transition-all duration-500">
          <div class="flex justify-between items-start">
            <div class="p-3 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-brand-gold group-hover:text-white transition-all duration-500 border border-slate-100 shadow-sm">
              <component :is="getStatIcon(stat.icon)" :size="20" />
            </div>
            <span :class="stat.trend > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'" 
                  class="text-xs font-bold px-2.5 py-1 rounded-full border border-white/50 shadow-sm">
              {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
            </span>
          </div>
          <div class="mt-8">
            <p class="text-xs text-slate-500 font-bold tracking-tight mb-1">{{ stat.label }}</p>
            <h3 class="text-xl font-bold text-slate-900">{{ stat.value }}</h3>
          </div>
        </div>
      </template>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Revenue Visualizer -->
      <div class="lg:col-span-2 admin-card !p-8 space-y-8 flex flex-col min-h-[500px]">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="text-base font-bold text-slate-900">Financial Intelligence</h4>
            <p class="text-xs text-slate-500 font-medium">Revenue performance tracking</p>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="flex-grow flex items-end justify-between gap-4 pt-10">
          <div v-for="i in 12" :key="i" class="flex-grow bg-slate-50 animate-pulse-slow rounded-t-lg" :style="{ height: `${Math.random() * 50 + 20}%` }"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!dashboardData.revenueData || dashboardData.revenueData.every(v => v === 0)" class="flex-grow flex flex-col items-center justify-center text-center space-y-4 pt-10">
          <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
            <LucideDollarSign :size="32" class="text-slate-300" />
          </div>
          <div class="space-y-1">
            <p class="text-sm font-bold text-slate-900">Awaiting financial data</p>
            <p class="text-xs text-slate-500 max-w-[240px] mx-auto leading-relaxed">Your revenue chart will populate automatically as you process paid orders.</p>
          </div>
        </div>

        <!-- Chart Data -->
        <div v-else class="flex-grow flex items-end justify-between gap-3 lg:gap-4 pt-10">
          <div v-for="(val, idx) in dashboardData.revenueData" :key="idx" 
               :style="{ height: `${(val / Math.max(...dashboardData.revenueData, 1)) * 100}%` }" 
               class="flex-grow bg-brand-gold rounded-t-lg transition-all duration-500 relative border border-brand-gold/20 shadow-sm hover:brightness-110">
            <div class="absolute -top-7 left-1/2 -translate-x-1/2 text-slate-600 text-[10px] font-bold whitespace-nowrap pointer-events-none">
              {{ val > 0 ? '₦' + (val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : val >= 1000 ? (val/1000).toFixed(1) + 'k' : val) : '₦0' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Curator Sales -->
      <div class="admin-card !p-8 space-y-8">
        <div class="flex justify-between items-center">
          <h4 class="text-base font-bold text-slate-900">Recent Sales</h4>
          <LucideActivity :size="16" class="text-brand-gold" />
        </div>
        
        <div v-if="loading" class="space-y-6">
          <div v-for="i in 5" :key="i" class="h-14 bg-slate-50 animate-pulse-slow rounded-xl"></div>
        </div>
        <div v-else-if="dashboardData.recentOrders.length === 0" class="py-20 text-center space-y-4">
           <LucideAlertCircle :size="32" class="text-slate-200 mx-auto" />
           <p class="text-sm font-bold text-slate-400">No recent transactions</p>
        </div>
        <div v-else class="space-y-8">
          <div v-for="order in dashboardData.recentOrders" :key="order.id" class="flex items-center gap-5 group cursor-pointer">
            <div class="w-11 h-11 bg-slate-50 rounded-full flex items-center justify-center text-xs font-bold border border-slate-100 group-hover:bg-brand-gold group-hover:text-white transition-all shadow-sm">
              {{ order.customer[0] }}
            </div>
            <div class="flex-grow">
              <p class="text-sm font-semibold text-slate-900">{{ order.customer }}</p>
              <p class="text-xs text-slate-500 font-medium mt-0.5">{{ order.date }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-brand-gold">₦{{ order.amount.toLocaleString() }}</p>
              <div :class="order.status === 'PAID' || order.status === 'PROCESSING' ? 'text-emerald-600' : 'text-amber-600'" class="text-tiny lowercase font-medium mt-1">{{ order.status }}</div>
            </div>
          </div>
        </div>
        <NuxtLink to="/admin/orders" class="block w-full py-4 text-center text-xs font-bold text-slate-400 border-t border-slate-50 hover:text-brand-gold transition-all mt-4 tracking-wide">
          Access all transactions
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  LucideShoppingBag, LucideUsers, LucideBox, LucideDollarSign, 
  LucideActivity, LucideAlertCircle 
} from 'lucide-vue-next';

const { fetchAdmin } = useAdminApi();
const timeframe = ref('Last 30 Days');
const loading = ref(true);
const dashboardData = ref({
  stats: [],
  recentOrders: [],
  revenueData: []
});

const loadDashboard = async () => {
  loading.value = true;
  try {
    const res = await fetchAdmin('/dashboard/stats');
    dashboardData.value = res;
  } catch (e) {
    console.error('Failed to load dashboard data');
  } finally {
    loading.value = false;
  }
};

const getStatIcon = (iconName) => {
  switch (iconName) {
    case 'LucideDollarSign': return LucideDollarSign;
    case 'LucideShoppingBag': return LucideShoppingBag;
    case 'LucideUsers': return LucideUsers;
    case 'LucideBox': return LucideBox;
    default: return LucideActivity;
  }
};

onMounted(loadDashboard);

definePageMeta({ layout: 'default' });
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
