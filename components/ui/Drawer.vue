<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="modelValue" class="fixed inset-0 z-[100] flex justify-end overflow-hidden">
        <!-- Backdrop (No click-to-close as requested) -->
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"></div>
        
        <!-- Drawer Content -->
        <div class="relative w-full lg:w-1/2 h-full bg-white shadow-2xl flex flex-col animate-drawer-in">
          <!-- Header -->
          <div class="h-24 px-8 lg:px-12 flex items-center justify-between border-b border-slate-100 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div class="flex flex-col gap-1">
              <span class="text-tiny font-bold text-brand-gold tracking-tight">{{ subtitle || 'Panel Detail' }}</span>
              <h3 class="text-xl font-bold text-slate-900 tracking-tight">{{ title }}</h3>
            </div>
            <button @click="$emit('update:modelValue', false)" class="w-12 h-12 rounded-2xl hover:bg-slate-50 flex items-center justify-center transition-all border border-transparent hover:border-slate-100 group">
              <LucideX :size="24" class="text-slate-400 group-hover:text-slate-900 transition-colors" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-grow overflow-y-auto p-8 lg:p-12 custom-scrollbar bg-slate-50/20">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="p-8 lg:px-12 border-t border-slate-100 bg-white shrink-0 shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.1)]">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { LucideX } from 'lucide-vue-next';

defineProps({
  modelValue: Boolean,
  title: String,
  subtitle: String
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.drawer-enter-active, .drawer-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-enter-from, .drawer-leave-to {
  opacity: 0;
}

@keyframes drawer-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-drawer-in {
  animation: drawer-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f5f9;
  border-radius: 10px;
}
</style>
