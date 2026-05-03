<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Promo & Discounts</h3>
        <p class="text-[10px] text-gray-400 tracking-widest uppercase">Manage coupon codes and special offers</p>
      </div>
      <button @click="openCreateModal" class="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-brand-gold transition-all shadow-lg shadow-slate-900/10">Create Promo</button>
    </div>

    <div class="admin-card !p-0 relative min-h-[400px]">
      <UiAdminLoadingState v-if="loading" />
      
      <template v-else-if="promos.length > 0">
        <div class="overflow-visible">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr class="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                <th class="px-6 py-5">Code</th>
                <th class="px-6 py-5">Type</th>
                <th class="px-6 py-5">Value</th>
                <th class="px-6 py-5">Status</th>
                <th class="px-6 py-5">Usage</th>
                <th class="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-[11px] text-slate-600">
              <tr v-for="promo in promos" :key="promo._id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-5 font-bold text-slate-900 tracking-widest uppercase">{{ promo.code }}</td>
                <td class="px-6 py-5 tracking-widest uppercase text-[10px]">{{ promo.discountType }}</td>
                <td class="px-6 py-5 font-bold text-brand-gold">
                  {{ promo.discountType === 'percentage' ? promo.value + '%' : '₦' + promo.value.toLocaleString() }}
                </td>
                <td class="px-6 py-5">
                  <span :class="promo.isActive ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-50'" class="px-3 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase">
                    {{ promo.isActive ? 'Active' : 'Disabled' }}
                  </span>
                </td>
                <td class="px-6 py-5 text-slate-400 font-medium">{{ promo.usageCount }} / {{ promo.usageLimit || '∞' }}</td>
                <td class="px-6 py-5 text-right">
                  <div class="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
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

    <!-- Promo Modal -->
    <UiModal v-model="showModal" :title="isEditing ? 'Edit Promo' : 'Create Promo'">
      <form @submit.prevent="savePromo" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Promo Code</label>
            <input v-model="form.code" type="text" required class="w-full border-b border-slate-100 py-3 outline-none focus:border-brand-gold transition-colors text-xs uppercase font-bold" placeholder="DOBI20" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Discount Type</label>
            <UiSelect v-model="form.discountType" :options="['percentage', 'fixed']" class="!border-b !border-slate-100" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Discount Value</label>
            <input v-model="form.value" type="number" required class="w-full border-b border-slate-100 py-3 outline-none focus:border-brand-gold transition-colors text-xs" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Usage Limit</label>
            <input v-model="form.usageLimit" type="number" class="w-full border-b border-slate-100 py-3 outline-none focus:border-brand-gold transition-colors text-xs" placeholder="0 for unlimited" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Expiry Date</label>
          <input v-model="form.expiryDate" type="date" required class="w-full border-b border-slate-100 py-3 outline-none focus:border-brand-gold transition-colors text-xs" />
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Promo Narrative (Rich Text)</label>
          <UiRichEditor v-model="form.description" placeholder="Define the artisanal value proposition..." />
        </div>

        <button type="submit" :disabled="isSaving" class="w-full bg-slate-900 text-white py-4 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-brand-gold transition-all disabled:opacity-50">
          {{ isSaving ? 'Saving...' : 'Confirm Promo' }}
        </button>
      </form>
    </UiModal>
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
