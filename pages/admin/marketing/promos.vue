<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900  tracking-tight">Promo & Discounts</h3>
        <p class="text-[10px] text-gray-400  tracking-widest">Manage coupon codes and special offers</p>
      </div>
      <button @click="showModal = true" class="btn-primary !py-3 px-6 text-[10px]  tracking-widest font-bold">Create Promo</button>
    </div>

    <div class="bg-white border border-slate-100 rounded-sm overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b border-slate-100">
          <tr class="text-[10px] font-bold  tracking-widest text-slate-500">
            <th class="px-6 py-4">Code</th>
            <th class="px-6 py-4">Type</th>
            <th class="px-6 py-4">Value</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4">Usage</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="promo in promos" :key="promo._id" class="text-xs hover:bg-slate-50/50 transition-colors">
            <td class="px-6 py-4 font-bold text-brand-charcoal  tracking-widest">{{ promo.code }}</td>
            <td class="px-6 py-4  text-[10px] text-slate-400">{{ promo.discountType }}</td>
            <td class="px-6 py-4 font-medium">{{ promo.discountType === 'percentage' ? promo.value + '%' : '₦' + promo.value.toLocaleString() }}</td>
            <td class="px-6 py-4">
              <span :class="promo.isActive ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-50'" class="px-2 py-1 rounded-full text-[9px] font-bold  tracking-widest">
                {{ promo.isActive ? 'Active' : 'Expired' }}
              </span>
            </td>
            <td class="px-6 py-4 text-slate-400">{{ promo.usageCount }} / {{ promo.usageLimit || '∞' }}</td>
            <td class="px-6 py-4 text-right">
              <button class="text-brand-gold hover:text-brand-charcoal transition-colors">
                <LucideEdit :size="16" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { LucideEdit } from 'lucide-vue-next';
import { useManagePromos } from '@/composables/modules/marketing/useManagePromos';

const { promos, fetchPromos } = useManagePromos();
const showModal = ref(false);

onMounted(fetchPromos);
</script>
