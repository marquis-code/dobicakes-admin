<template>
  <div class="space-y-8 animate-fade-in">
    <div class="lg:flex space-y-3 lg:space-y-0 justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Promo & discounts</h3>
        <p class="text-sm text-gray-800 tracking-tight ">Manage coupon codes and special offers</p>
      </div>
      <button @click="openCreateModal" class="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-medium tracking-tight  hover:bg-brand-gold transition-all shadow-lg shadow-slate-900/10">Create Promo</button>
    </div>

    <div class="admin-card !p-0 relative min-h-[400px]">
      <UiAdminLoadingState v-if="loading" />
      
      <template v-else-if="promos.length > 0">
        <div class="overflow-visible">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr class="text-sm font-bold tracking-tight text-slate-500 ">
                <th class="px-6 py-3">Code</th>
                <th class="px-6 py-3">Type</th>
                <th class="px-6 py-3">Value</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3">Usage</th>
                <th class="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-xs text-slate-600">
              <tr v-for="promo in promos" :key="promo._id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-3 font-bold text-slate-900 tracking-tight ">{{ promo.code }}</td>
                <td class="px-6 py-3 tracking-tight  text-sm">{{ promo.discountType }}</td>
                <td class="px-6 py-3 font-bold text-brand-gold">
                  {{ promo.discountType === 'percentage' ? promo.value + '%' : '₦' + promo.value.toLocaleString() }}
                </td>
                <td class="px-6 py-3">
                  <span :class="promo.isActive ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-50'" class="px-3 py-1 rounded-md text-tiny font-bold tracking-tight ">
                    {{ promo.isActive ? 'Active' : 'Disabled' }}
                  </span>
                </td>
                <td class="px-6 py-3 text-slate-400 font-medium">{{ promo.usageCount }} / {{ promo.usageLimit || '∞' }}</td>
                <td class="px-6 py-3 text-right">
                  <div class="flex justify-end gap-3">
                    <button @click="openEditModal(promo)" class="text-slate-400 hover:text-brand-gold transition-colors">
                      <LucideEdit :size="16" />
                    </button>
                    <button @click="toggleStatus(promo)" class="text-slate-400 hover:text-emerald-500 transition-colors">
                      <LucideCheck :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <UiAdminEmptyState 
        v-else 
        title="No Promos Active" 
        message="Create your first discount code to boost your artisanal cake sales."
        :icon="LucideTag"
      />
    </div>

    <!-- Promo Drawer -->
    <UiDrawer 
      :model-value="showModal" 
      :title="isEditing ? 'Edit Promo' : 'Create Promo'"
      subtitle="Defining artisanal value propositions and discount rules"
      @update:model-value="showModal = false"
    >
      <form @submit.prevent="savePromo" class="space-y-10 py-2">
        <div class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2.5">
              <label class="admin-label">Unique Promo Code</label>
              <div class="relative">
                <LucideTag class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" :size="16" />
                <input v-model="form.code" type="text" required class="admin-input !pl-12 w-full font-bold" placeholder="e.g. DOBI20" />
              </div>
            </div>
            <div class="space-y-2.5">
              <label class="admin-label">Discount Type</label>
              <UiSelect v-model="form.discountType" :options="['percentage', 'fixed']" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2.5">
              <label class="admin-label">Discount Value</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">{{ form.discountType === 'percentage' ? '%' : '₦' }}</span>
                <input v-model="form.value" type="number" required class="admin-input !pl-10 w-full" />
              </div>
            </div>
            <div class="space-y-2.5">
              <label class="admin-label">Usage Cap (Redemptions)</label>
              <input v-model="form.usageLimit" type="number" class="admin-input w-full" placeholder="0 for unlimited" />
            </div>
          </div>

          <div class="space-y-2.5">
            <label class="admin-label">Expiry Deadline</label>
            <div class="relative">
              <LucideCalendar class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" :size="16" />
              <input v-model="form.expiryDate" type="date" required class="admin-input !pl-12 w-full" />
            </div>
          </div>

          <div class="space-y-2.5">
            <label class="admin-label">Promo Narrative</label>
            <UiRichEditor v-model="form.description" placeholder="Describe the conditions of this offer..." />
          </div>

          <div class="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between group">
            <div class="flex flex-col">
              <span class="text-sm font-bold text-slate-900">Campaign Status</span>
              <p class="text-tiny text-slate-500 font-medium">Allow customers to redeem this code</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="form.isActive" type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
            </label>
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-5">
          <button @click="showModal = false" class="px-8 py-3.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
          <button @click="savePromo" :disabled="isSaving" class="btn-admin-primary px-12 py-3.5">
            <LucideLoader2 v-if="isSaving" class="animate-spin mr-2" :size="18" />
            {{ isEditing ? 'Update Promo' : 'Launch Promo' }}
          </button>
        </div>
      </template>
    </UiDrawer>
  </div>
</template>

<script setup>
import { LucideEdit, LucideCheck, LucideTag } from 'lucide-vue-next';
const { fetchAdmin, postAdmin, patchAdmin } = useAdminApi();
const { success: toastSuccess, error: toastError } = useToast();

const promos = ref([]);
const loading = ref(true);
const showModal = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);

const form = ref({
  code: '',
  discountType: 'percentage',
  value: 0,
  usageLimit: 0,
  expiryDate: '',
  isActive: true
});

const loadPromos = async () => {
  loading.value = true;
  try {
    promos.value = await fetchAdmin('/marketing/promos');
  } catch (e) {
    toastError('Failed to fetch promos');
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  form.value = { code: '', discountType: 'percentage', value: 0, usageLimit: 0, expiryDate: '', isActive: true };
  showModal.value = true;
};

const openEditModal = (promo) => {
  isEditing.value = true;
  form.value = { ...promo };
  showModal.value = true;
};

const savePromo = async () => {
  isSaving.value = true;
  try {
    if (isEditing.value) {
      await patchAdmin(`/marketing/promos/${form.value._id}`, form.value);
      toastSuccess('Promo updated');
    } else {
      await postAdmin('/marketing/promos', form.value);
      toastSuccess('Promo created');
    }
    showModal.value = false;
    loadPromos();
  } catch (e) {
    toastError('Failed to save promo');
  } finally {
    isSaving.value = false;
  }
};

const toggleStatus = async (promo) => {
  try {
    await patchAdmin(`/marketing/promos/${promo._id}`, { isActive: !promo.isActive });
    promo.isActive = !promo.isActive;
    toastSuccess(`Promo ${promo.isActive ? 'activated' : 'deactivated'}`);
  } catch (e) {
    toastError('Failed to toggle status');
  }
};

onMounted(loadPromos);

definePageMeta({ layout: 'default' });
</script>
