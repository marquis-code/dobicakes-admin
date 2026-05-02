<template>
  <div class="space-y-8 animate-fade-in">
    <div>
      <h3 class="text-xl font-bold text-slate-900  tracking-tight">Customer Management</h3>
      <p class="text-[10px] text-gray-400  tracking-widest">Monitor and manage your user base</p>
    </div>

    <!-- Users Table -->
    <div class="admin-card !p-0 overflow-hidden relative min-h-[400px]">
      <UiAdminLoadingState v-if="loading" />
      
      <template v-else-if="customers.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Customer</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Email Address</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Role</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Joined</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Status</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-sm">
              <tr v-for="user in customers" :key="user._id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold tracking-widest border border-slate-200/60 text-slate-600">
                      {{ user.firstName?.[0] }}
                    </div>
                    <span class="font-bold text-slate-900 text-[11px] tracking-widest">{{ user.firstName }} {{ user.lastName }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-500 text-[11px] tracking-tight">{{ user.email }}</td>
                <td class="px-6 py-4">
                  <span :class="user.role === 'ADMIN' ? 'text-brand-gold font-bold' : 'text-slate-400'" class="text-[10px] tracking-widest uppercase">
                    {{ formatLabel(user.role) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-[10px] text-slate-400 tracking-widest">
                  {{ new Date(user.createdAt || Date.now()).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4">
                  <span :class="user.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'" 
                        class="text-[9px] font-bold tracking-widest px-2 py-1 rounded-md uppercase">
                    {{ user.isActive ? 'Active' : 'Banned' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button @click="confirmDelete(user)" class="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50/50 rounded-lg transition-all">
                    <LucideShieldAlert :size="16" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <UiAdminEmptyState 
        v-else 
        title="No Customers Yet" 
        message="Your community is just beginning. When users register on your website, they will appear here."
        :icon="LucideUsers"
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :is-open="isDeleteModalOpen"
      title="Remove Customer"
      :message="`Are you sure you want to remove ${customerToDelete?.firstName || 'this customer'}? They will lose access to their account and order history.`"
      confirm-text="Remove Customer"
      cancel-text="Cancel"
      type="danger"
      :is-loading="isDeleting"
      @close="isDeleteModalOpen = false"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { LucideShieldAlert, LucideUsers } from 'lucide-vue-next';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
const { fetchAdmin, deleteAdmin } = useAdminApi();

const customers = ref([]);
const loading = ref(true);

// Delete Modal State
const isDeleteModalOpen = ref(false);
const customerToDelete = ref(null);
const isDeleting = ref(false);

const loadCustomers = async () => {
  loading.value = true;
  try {
    customers.value = await fetchAdmin('/users');
  } catch (e) {
    customers.value = [];
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (customer) => {
  customerToDelete.value = customer;
  isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
  if (!customerToDelete.value) return;
  isDeleting.value = true;
  try {
    await deleteAdmin(`/users/${customerToDelete.value._id}`);
    await loadCustomers();
  } finally {
    isDeleting.value = false;
    isDeleteModalOpen.value = false;
    customerToDelete.value = null;
  }
};

onMounted(() => {
  loadCustomers();
});

definePageMeta({ layout: 'default' });
</script>
