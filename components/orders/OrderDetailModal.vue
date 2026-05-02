<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-0 shadow-2xl shadow-slate-900/10 transition-all border border-slate-200/60">
              <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <DialogTitle as="h3" class="text-lg font-bold text-slate-900 tracking-tight">
                    Order Details #{{ order?._id.slice(-6) }}
                  </DialogTitle>
                  <p class="text-[10px] text-slate-400 tracking-widest uppercase">Processing fulfillment for customer order</p>
                </div>
                <button @click="closeModal" class="p-2 text-slate-400 hover:text-rose-500 transition-all hover:bg-rose-50 rounded-lg">
                  <LucideX :size="20" />
                </button>
              </div>

              <div v-if="order" class="p-8 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <!-- Customer Info -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div class="space-y-1.5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span class="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Customer Information</span>
                    <p class="text-[11px] font-bold text-slate-900 tracking-widest">{{ order.shippingAddress.name }}</p>
                    <p class="text-[10px] text-slate-500">{{ order.shippingAddress.phone }}</p>
                  </div>
                  <div class="space-y-1.5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span class="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Delivery Destination</span>
                    <p class="text-[10px] font-medium text-slate-700 tracking-widest leading-relaxed">
                      {{ order.shippingAddress.address }}, {{ order.shippingAddress.city }}
                    </p>
                  </div>
                </div>

                <!-- Items -->
                <div class="space-y-4">
                  <span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Artisanal Selection</span>
                  <div class="space-y-4">
                    <div v-for="(item, idx) in order.items" :key="idx" class="flex gap-6 p-5 bg-white border border-slate-200/60 rounded-xl hover:border-slate-300 transition-all shadow-sm shadow-slate-900/5">
                      <div class="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                        <img :src="item.product?.images?.[0]" class="w-full h-full object-cover" />
                      </div>
                      <div class="flex-grow space-y-3">
                        <div class="flex justify-between items-start">
                          <h4 class="text-[11px] font-bold text-slate-900 tracking-widest uppercase">{{ item.product?.name }} <span class="text-slate-300 ml-2">x{{ item.quantity }}</span></h4>
                          <span class="text-[11px] font-bold text-brand-gold">₦{{ item.price.toLocaleString() }}</span>
                        </div>
                        
                        <div v-if="item.customization" class="grid grid-cols-2 gap-6 pt-2 border-t border-slate-50">
                          <div class="space-y-1">
                            <span class="text-[8px] tracking-widest text-slate-400 uppercase font-bold">Flavor Profile</span>
                            <p class="text-[10px] font-bold text-slate-700 tracking-widest uppercase">{{ item.customization.flavor }}</p>
                          </div>
                          <div class="space-y-1">
                            <span class="text-[8px] tracking-widest text-slate-400 uppercase font-bold">Cake Dimension</span>
                            <p class="text-[10px] font-bold text-slate-700 tracking-widest uppercase">{{ item.customization.size }}</p>
                          </div>
                        </div>
                        
                        <div v-if="item.customization?.customMessage" class="pt-3 border-t border-slate-50">
                          <span class="text-[8px] tracking-widest text-slate-400 uppercase font-bold">Personalized Inscription</span>
                          <p class="text-[11px] font-bold text-brand-gold italic mt-1 font-serif">"{{ item.customization.customMessage }}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Summary -->
                <div class="flex justify-between items-center bg-slate-900 text-white p-8 rounded-2xl shadow-xl shadow-slate-900/20">
                  <div class="space-y-1">
                    <span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Grand Total</span>
                    <p class="text-2xl font-serif italic text-brand-gold">₦{{ order.totalAmount.toLocaleString() }}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Payment Intelligence</span>
                    <p class="text-[11px] font-bold tracking-widest text-emerald-400 uppercase">{{ order.status === 'PAID' ? 'Fully Secured' : order.status }}</p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
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
