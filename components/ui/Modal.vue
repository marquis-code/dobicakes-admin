<template>
  <TransitionRoot as="template" :show="modelValue">
    <Dialog as="div" class="relative z-[100]" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              :class="[
                size === 'xl' ? 'sm:max-w-4xl' : size === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-lg',
                'relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full m-4'
              ]"
            >
              <!-- Header -->
              <div class="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <div>
                  <DialogTitle as="h3" class="text-sm font-bold text-slate-900 tracking-tight uppercase">
                    {{ title }}
                  </DialogTitle>
                </div>
                <button
                  type="button"
                  class="rounded-full p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                  @click="closeModal"
                >
                  <LucideX class="h-4 w-4" />
                </button>
              </div>

              <!-- Body -->
              <div class="px-8 py-8">
                <slot />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { LucideX } from 'lucide-vue-next';

defineProps({
  modelValue: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: 'Modal Title'
  },
  size: {
    type: String,
    default: 'md' // md, lg, xl
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const closeModal = () => {
  emit('update:modelValue', false);
  emit('close');
};
</script>
