<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Customer Enquiries</h3>
        <p class="text-[10px] text-slate-400 tracking-widest uppercase">Manage contact form submissions</p>
      </div>
    </div>

    <div class="admin-card !p-0 overflow-hidden relative min-h-[400px]">
      <UiAdminLoadingState v-if="loading" />
      
      <template v-else-if="enquiries.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Sender</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Subject</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Status</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase text-right">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-sm">
              <tr v-for="item in enquiries" :key="item._id" @click="viewEnquiry(item)" class="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-900 text-[11px] tracking-widest">{{ item.name }}</span>
                    <span class="text-[9px] text-slate-400 tracking-widest">{{ item.email }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-[11px] text-slate-600 truncate max-w-xs">{{ item.subject }}</p>
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(item.status)" class="text-[9px] font-bold tracking-widest px-2 py-1 rounded-md uppercase">
                    {{ item.status }}
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
        title="No Enquiries" 
        message="You haven't received any enquiries yet. Customer messages from your contact form will appear here."
        :icon="LucideHelpCircle"
      />
    </div>

    <!-- Enquiry Detail Modal -->
    <div v-if="selectedEnquiry" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="selectedEnquiry = null"></div>
      <div class="bg-white w-full max-w-2xl rounded-xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div class="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h4 class="text-lg font-bold text-slate-900 tracking-tight">{{ selectedEnquiry.subject }}</h4>
            <p class="text-[10px] text-slate-400 tracking-widest uppercase">From {{ selectedEnquiry.name }}</p>
          </div>
          <button @click="selectedEnquiry = null" class="text-slate-400 hover:text-slate-600 transition-colors">
            <LucideX :size="20" />
          </button>
        </div>
        
        <div class="p-8 space-y-8">
          <div class="space-y-2">
            <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Message Body</label>
            <div class="p-4 bg-slate-50 rounded-lg text-xs text-slate-600 leading-relaxed italic">
              "{{ selectedEnquiry.message }}"
            </div>
          </div>

          <div v-if="selectedEnquiry.adminReply" class="space-y-2">
            <label class="text-[10px] font-bold tracking-widest text-brand-gold uppercase">Your Response</label>
            <div class="p-4 bg-brand-gold/5 border border-brand-gold/10 rounded-lg text-xs text-slate-700 leading-relaxed">
              {{ selectedEnquiry.adminReply }}
            </div>
          </div>

          <div v-else class="space-y-4">
            <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Compose Reply</label>
            <textarea v-model="replyText" rows="4" placeholder="Type your response here..." class="w-full"></textarea>
            <div class="flex justify-end gap-4">
              <button @click="selectedEnquiry = null" class="px-6 py-2.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase hover:text-slate-600">Cancel</button>
              <button @click="handleReply" :disabled="!replyText" class="bg-brand-gold text-white px-8 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-lg shadow-lg shadow-brand-gold/20 hover:bg-brand-gold-dark transition-all disabled:opacity-50">Send Reply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucideHelpCircle, LucideX } from 'lucide-vue-next';
const { fetchAdmin, patchAdmin } = useAdminApi();

const enquiries = ref([]);
const loading = ref(true);
const selectedEnquiry = ref(null);
const replyText = ref('');

const loadEnquiries = async () => {
  loading.value = true;
  try {
    enquiries.value = await fetchAdmin('/enquiries');
  } finally {
    loading.value = false;
  }
};

const viewEnquiry = async (item) => {
  selectedEnquiry.value = item;
  if (item.status === 'pending') {
    await patchAdmin(`/enquiries/${item._id}/read`);
    item.status = 'read';
  }
};

const handleReply = async () => {
  if (!replyText.value) return;
  try {
    await patchAdmin(`/enquiries/${selectedEnquiry.value._id}/reply`, { adminReply: replyText.value });
    selectedEnquiry.value.adminReply = replyText.value;
    selectedEnquiry.value.status = 'replied';
    replyText.value = '';
    const { success } = useToast();
    success('Reply sent successfully');
  } catch (e) {
    const { error } = useToast();
    error('Failed to send reply');
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-amber-50 text-amber-600';
    case 'read': return 'bg-blue-50 text-blue-600';
    case 'replied': return 'bg-emerald-50 text-emerald-600';
    default: return 'bg-slate-50 text-slate-400';
  }
};

onMounted(loadEnquiries);

definePageMeta({ layout: 'default' });
</script>
