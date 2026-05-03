<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Customer enquiries</h3>
        <p class="text-sm text-slate-500 font-medium tracking-tight">Manage contact form submissions</p>
      </div>
    </div>

    <div class="admin-card !p-0 overflow-hidden relative min-h-[400px]">
      <UiAdminLoadingState v-if="loading" />
      
      <template v-else-if="enquiries.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Sender</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Subject</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Status</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight text-right">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="item in enquiries" :key="item._id" @click="viewEnquiry(item)" class="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <td class="px-8 py-3">
                  <div class="flex flex-col gap-0.5">
                    <span class="font-bold text-slate-900 text-sm tracking-tight">{{ item.name }}</span>
                    <span class="text-xs text-slate-500 font-medium">{{ item.email }}</span>
                  </div>
                </td>
                <td class="px-8 py-3">
                  <p class="text-sm text-slate-600 truncate max-w-xs font-medium">{{ item.subject }}</p>
                </td>
                <td class="px-8 py-3">
                  <span :class="getStatusClass(item.status)" class="text-tiny font-bold tracking-wide px-3 py-1.5 rounded-lg border">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-8 py-3 text-right text-xs text-slate-500 font-medium">
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

    <!-- Enquiry Detail Drawer -->
    <UiDrawer 
      :model-value="!!selectedEnquiry" 
      :title="selectedEnquiry?.subject || 'Enquiry Detail'"
      :subtitle="`Message from ${selectedEnquiry?.name}`"
      @update:model-value="selectedEnquiry = null"
    >
      <div v-if="selectedEnquiry" class="space-y-12 py-4">
        <div class="flex flex-wrap gap-8">
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
               <LucideMail :size="18" />
             </div>
             <div class="flex flex-col">
               <span class="text-tiny font-bold text-slate-400 tracking-tight">Email Address</span>
               <p class="text-sm font-bold text-slate-900">{{ selectedEnquiry.email }}</p>
             </div>
          </div>
          <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
               <LucideCalendar :size="18" />
             </div>
             <div class="flex flex-col">
               <span class="text-tiny font-bold text-slate-400 tracking-tight">Submitted On</span>
               <p class="text-sm font-bold text-slate-900">{{ new Date(selectedEnquiry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}</p>
             </div>
          </div>
        </div>

        <div class="space-y-4">
          <label class="admin-label">Customer Message</label>
          <div class="p-8 bg-slate-50/50 rounded-[2rem] text-sm text-slate-600 leading-relaxed italic border border-slate-100 relative">
            <div class="absolute -top-3 -left-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-50 text-slate-200">
              <LucideMessageSquare :size="16" />
            </div>
            "{{ selectedEnquiry.message }}"
          </div>
        </div>

        <div v-if="selectedEnquiry.adminReply" class="space-y-4">
          <label class="admin-label text-brand-gold">Administrative Response</label>
          <div class="p-8 bg-brand-gold/5 border border-brand-gold/10 rounded-[2rem] text-sm text-slate-700 leading-relaxed shadow-sm">
            {{ selectedEnquiry.adminReply }}
          </div>
        </div>

        <div v-else class="space-y-6 pt-8 border-t border-slate-100">
          <label class="admin-label">Compose Artisanal Reply</label>
          <textarea 
            v-model="replyText" 
            rows="6" 
            placeholder="Type your thoughtful response here..." 
            class="w-full bg-white border border-slate-200 rounded-2xl p-6 text-sm font-medium focus:ring-1 focus:ring-brand-gold/20 outline-none transition-all shadow-sm"
          ></textarea>
        </div>
      </div>

      <template #footer v-if="!selectedEnquiry?.adminReply">
        <div class="flex justify-end gap-5">
          <button @click="selectedEnquiry = null" class="px-8 py-3.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Dismiss</button>
          <button @click="handleReply" :disabled="!replyText" class="btn-admin-primary px-12 py-3.5">
            Send Artisanal Reply
          </button>
        </div>
      </template>
    </UiDrawer>
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
