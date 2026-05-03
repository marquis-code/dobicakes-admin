<template>
 <UiDrawer 
 :model-value="isOpen" 
 :title="`Order Detail #${order?._id.slice(-6)}`"
 subtitle="Reviewing fulfillment details and customer requirements"
 @update:model-value="closeModal"
 >
 <div v-if="order" class="space-y-12">
 <!-- Customer Info -->
 <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
 <div class="space-y-3 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
 <span class="text-xs font-bold tracking-tight text-slate-400">Customer Profile</span>
 <div class="flex flex-col gap-1">
 <p class="text-sm font-bold text-slate-900 tracking-tight">{{ order.shippingAddress.name }}</p>
 <p class="text-xs text-slate-500 font-medium">{{ order.shippingAddress.phone }}</p>
 </div>
 </div>
 <div class="space-y-3 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
 <span class="text-xs font-bold tracking-tight text-slate-400">Delivery Location</span>
 <p class="text-sm font-medium text-slate-700 leading-relaxed">
 {{ order.shippingAddress.address }}, {{ order.shippingAddress.city }}
 </p>
 </div>
 </div>

 <!-- Items -->
 <div class="space-y-6">
 <div class="flex items-center justify-between border-b border-slate-100 pb-3">
 <span class="text-xs font-bold tracking-tight text-slate-400">Artisanal Selection</span>
 <span class="text-tiny bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">{{ order.items.length }} Items</span>
 </div>
 <div class="space-y-5">
 <div v-for="(item, idx) in order.items" :key="idx" class="flex gap-6 p-6 bg-white border border-slate-100 rounded-3xl hover:border-brand-gold/20 transition-all shadow-sm group">
 <div class="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100 group-hover:scale-105 transition-transform">
 <img :src="item.product?.images?.[0]" class="w-full h-full object-cover" />
 </div>
 <div class="flex-grow space-y-4">
 <div class="flex justify-between items-start">
 <div class="flex flex-col gap-0.5">
 <h4 class="text-sm font-bold text-slate-900 tracking-tight group-hover:text-brand-gold transition-colors">{{ item.product?.name }}</h4>
 <span class="text-tiny text-slate-400 font-bold">Quantity: {{ item.quantity }}</span>
 </div>
 <span class="text-sm font-bold text-brand-gold">₦{{ item.price.toLocaleString() }}</span>
 </div>
 
 <div v-if="item.customization" class="grid grid-cols-2 gap-8 pt-4 border-t border-slate-50">
 <div class="space-y-1.5">
 <span class="text-tiny font-bold text-slate-400 tracking-tight">Flavor</span>
 <p class="text-xs font-bold text-slate-700">{{ item.customization.flavor }}</p>
 </div>
 <div class="space-y-1.5">
 <span class="text-tiny font-bold text-slate-400 tracking-tight">Dimension</span>
 <p class="text-xs font-bold text-slate-700">{{ item.customization.size }}</p>
 </div>
 </div>
 
 <div v-if="item.customization?.customMessage" class="pt-4 border-t border-slate-50">
 <span class="text-tiny font-bold text-slate-400 tracking-tight">Inscription</span>
 <p class="text-xs font-bold text-brand-gold italic mt-2 leading-relaxed">"{{ item.customization.customMessage }}"</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- Financial Summary -->
 <div class="relative group">
 <div class="absolute -inset-1 bg-gradient-to-r from-brand-gold/20 to-brand-gold-dark/20 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
 <div class="relative flex justify-between items-center bg-slate-900 text-white p-10 rounded-[1.75rem] shadow-2xl">
 <div class="space-y-1">
 <span class="text-tiny font-bold text-slate-400 tracking-tight">Grand Total</span>
 <p class="text-3xl font-bold text-brand-gold">₦{{ order.totalAmount.toLocaleString() }}</p>
 </div>
 <div class="text-right">
 <span class="text-tiny font-bold text-slate-400 tracking-tight">Payment Status</span>
 <div class="flex items-center justify-end gap-2.5 mt-1">
 <div class="w-2 h-2 rounded-full animate-pulse" :class="order.status === 'PAID' ? 'bg-emerald-400' : 'bg-amber-400'"></div>
 <p class="text-sm font-bold tracking-wide" :class="order.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'">{{ order.status === 'PAID' ? 'Fully Secured' : order.status }}</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </UiDrawer>
</template>

<script setup>
import { 
 TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle 
} from '@headlessui/vue';
import { LucideX } from 'lucide-vue-next';

const props = defineProps({
 isOpen: Boolean,
 order: Object
});

const emit = defineEmits(['close']);
const closeModal = () => emit('close');
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
 width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
 @apply bg-transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
 @apply bg-slate-200 rounded-full hover:bg-slate-300;
}
</style>
