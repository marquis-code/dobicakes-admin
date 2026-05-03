<template>
  <div class="flex flex-col items-center justify-center py-24 px-6 text-center space-y-6 animate-fade-in">
    <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
      <component :is="icon || LucideInbox" :size="40" stroke-width="1" />
    </div>
    <div class="space-y-2 max-w-xs">
      <h4 class="text-sm font-bold text-slate-900 tracking-tight">{{ title || 'No Records Found' }}</h4>
      <p class="text-xs text-slate-400 leading-relaxed">{{ message || 'Your collection is currently empty. Start by adding your first entry.' }}</p>
    </div>
    <slot name="action" />
  </div>
</template>

<script setup>
import { LucideInbox } from 'lucide-vue-next';
defineProps({
  title: String,
  message: String,
  icon: Object
});
</script>
