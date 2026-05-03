<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex flex-col gap-1">
      <h3 class="text-xl font-bold text-slate-900 tracking-tight">Customer management</h3>
      <p class="text-sm text-slate-500 font-medium tracking-tight">Monitor and manage your user base</p>
    </div>

    <!-- Users Table -->
    <div class="admin-card !p-0 relative min-h-[400px]">
      <UiAdminLoadingState v-if="loading" />
      
      <template v-else-if="customers.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Customer Name</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Email Address</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Account Role</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Registration</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Status</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="user in customers" :key="user._id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-8 py-3">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-sm font-bold border border-slate-100 text-slate-600 shadow-sm">
                      {{ user.firstName?.[0] }}
                    </div>
                    <span class="font-bold text-slate-900 text-sm tracking-tight">{{ user.firstName }} {{ user.lastName }}</span>
                  </div>
                </td>
                <td class="px-8 py-3 text-slate-500 text-sm font-medium">{{ user.email }}</td>
                <td class="px-8 py-3">
                  <span :class="user.role === 'ADMIN' ? 'text-brand-gold font-bold' : 'text-slate-400'" class="text-xs font-semibold tracking-wide">
                    {{ formatLabel(user.role) }}
                  </span>
                </td>
                <td class="px-8 py-3 text-sm text-slate-400 font-medium">
                  {{ new Date(user.createdAt || Date.now()).toLocaleDateString() }}
                </td>
                <td class="px-8 py-3">
                  <span :class="user.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'" 
                        class="text-tiny font-bold tracking-wide px-3 py-1.5 rounded-lg border">
                    {{ user.isActive ? 'Active' : 'Restricted' }}
                  </span>
                </td>
                <td class="px-8 py-3 text-right">
                  <button @click="confirmDelete(user)" class="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all border border-transparent hover:border-rose-500/10 opacity-60 group-hover:opacity-100">
                    <LucideShieldAlert :size="18" />
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
