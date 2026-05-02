<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Newsletter Subscriptions</h3>
        <p class="text-[10px] text-slate-400 tracking-widest uppercase">Grow and engage your audience</p>
      </div>
      <div class="flex gap-4">
        <button class="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center gap-2">
          <LucideDownload :size="14" />
          Export CSV
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="admin-card">
        <p class="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Total Subscribers</p>
        <h4 class="text-3xl font-serif text-slate-900">{{ subscriptions.length }}</h4>
      </div>
      <div class="admin-card">
        <p class="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Active Now</p>
        <h4 class="text-3xl font-serif text-emerald-600">{{ subscriptions.filter(s => s.isActive).length }}</h4>
      </div>
      <div class="admin-card">
        <p class="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Retention Rate</p>
        <h4 class="text-3xl font-serif text-brand-gold">98.2%</h4>
      </div>
    </div>

    <div class="admin-card !p-0 overflow-hidden relative min-h-[400px]">
      <UiAdminLoadingState v-if="loading" />
      
      <template v-else-if="subscriptions.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Email Address</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Source</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Status</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-sm">
              <tr v-for="item in subscriptions" :key="item._id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4 font-bold text-slate-900 text-[11px] tracking-widest">
                  {{ item.email }}
                </td>
                <td class="px-6 py-4">
                  <span class="text-[10px] text-slate-400 uppercase tracking-widest font-medium">{{ item.source || 'Website' }}</span>
                </td>
                <td class="px-6 py-4">
                  <span :class="item.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'" 
                        class="text-[9px] font-bold tracking-widest px-2 py-1 rounded-md uppercase">
                    {{ item.isActive ? 'Active' : 'Unsubscribed' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right text-[10px] text-slate-400 tracking-widest">
                  {{ new Date(item.createdAt).toLocaleDateString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <UiAdminEmptyState 
        v-else 
        title="No Subscribers" 
        message="Your newsletter list is currently empty. Start growing your audience through your website's signup form."
        :icon="LucideMail"
      />
    </div>
  </div>
</template>

<script setup>
import { LucideMail, LucideDownload } from 'lucide-vue-next';
const { fetchAdmin } = useAdminApi();

const subscriptions = ref([]);
const loading = ref(true);

const loadSubscriptions = async () => {
  loading.value = true;
  try {
    subscriptions.value = await fetchAdmin('/marketing/subscriptions');
  } finally {
    loading.value = false;
  }
};

onMounted(loadSubscriptions);

definePageMeta({ layout: 'default' });
</script>
