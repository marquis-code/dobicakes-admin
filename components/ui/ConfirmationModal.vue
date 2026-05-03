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
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95 translate-y-4"
            enter-to="opacity-100 scale-100 translate-y-0"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100 translate-y-0"
            leave-to="opacity-0 scale-95 translate-y-4"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-slate-100">
              <div class="flex flex-col items-center text-center space-y-4">
                <div 
                  class="w-16 h-16 rounded-full flex items-center justify-center"
                  :class="type === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-brand-gold/10 text-brand-gold'"
                >
                  <component :is="icon" :size="32" stroke-width="1.5" />
                </div>
                
                <DialogTitle as="h3" class="text-lg font-medium text-slate-900 tracking-tight">
                  {{ title }}
                </DialogTitle>
                
                <p class="text-xs text-slate-500 leading-relaxed font-medium">
                  {{ message }}
                </p>
              </div>

              <div class="mt-8 flex gap-3">
                <button
                  type="button"
                  class="flex-1 inline-flex justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium tracking-tight text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none transition-colors "
                  @click="closeModal"
                  :disabled="isLoading"
                >
                  {{ cancelText }}
                </button>
                <button
                  type="button"
                  class="flex-1 inline-flex justify-center rounded-xl border border-transparent px-4 py-3 text-sm font-medium tracking-tight text-white focus:outline-none transition-all shadow-sm  items-center gap-2"
                  :class="[
                    type === 'danger' 
                      ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' 
                      : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20',
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  ]"
                  @click="confirmAction"
                  :disabled="isLoading"
                >
                  <LucideLoader2 v-if="isLoading" class="animate-spin" :size="14" />
                  {{ isLoading ? 'Processing...' : confirmText }}
                </button>
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
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import { LucideAlertTriangle, LucideLoader2 } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Confirm Action',
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?',
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  type: {
    type: String,
    default: 'danger', // 'danger' or 'warning'
  },
  icon: {
    type: [Object, Function],
    default: () => LucideAlertTriangle,
  },
  isLoading: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['close', 'confirm']);

const closeModal = () => {
  if (!props.isLoading) {
    emit('close');
  }
};

const confirmAction = () => {
  emit('confirm');
};
</script>
