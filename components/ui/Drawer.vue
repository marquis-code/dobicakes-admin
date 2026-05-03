<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="modelValue" class="fixed inset-0 z-[100] flex justify-end">
        <!-- Backdrop -->
        <div @click="$emit('update:modelValue', false)" class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"></div>
        
        <!-- Drawer Content -->
        <div class="relative w-full md:w-1/2 h-full bg-white shadow-2xl flex flex-col animate-drawer-in">
          <!-- Header -->
          <div class="h-[80px] px-8 flex items-center justify-between border-b border-slate-50 shrink-0">
            <div class="space-y-1">
              <h3 class="text-xl font-serif italic text-slate-900">{{ title }}</h3>
              <p v-if="subtitle" class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{{ subtitle }}</p>
            </div>
            <button @click="$emit('update:modelValue', false)" class="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors">
              <LucideX :size="20" class="text-slate-400" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-grow overflow-y-auto p-8 lg:p-12 custom-scrollbar">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="p-8 border-t border-slate-50 bg-slate-50/30 shrink-0">
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
