<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900  tracking-tight">Banner Management</h3>
        <p class="text-[10px] text-gray-400  tracking-widest">Manage hero sliders and promotional graphics</p>
      </div>
      <button class="btn-primary !py-3 px-6 text-[10px]  tracking-widest font-bold">Add Banner</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="banner in banners" :key="banner._id" class="bg-white border border-slate-100 rounded-sm overflow-hidden group">
        <div class="aspect-[16/9] relative">
          <img :src="banner.imageUrl" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:scale-110 transition-transform">
              <LucideEdit :size="18" />
            </button>
            <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 shadow-xl hover:scale-110 transition-transform">
              <LucideTrash :size="18" />
            </button>
          </div>
        </div>
        <div class="p-6 space-y-2">
          <div class="flex justify-between items-start">
            <h4 class="text-xs font-bold  tracking-widest text-slate-900">{{ banner.title }}</h4>
            <span :class="banner.active ? 'text-emerald-600' : 'text-slate-300'" class="text-[9px] font-bold  tracking-widest">
              {{ banner.active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <p class="text-[10px] text-slate-400  tracking-widest line-clamp-1">{{ banner.subtitle }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucideEdit, LucideTrash } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';

// Use Fetch logic directly as it's a simple CRUD
const banners = ref([
  { _id: '1', title: 'Artisan Cakes', subtitle: 'Handcrafted for Your Special Moments', imageUrl: 'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&q=80&w=2000', active: true },
  { _id: '2', title: 'Wedding Collection', subtitle: 'Exquisite designs for your big day', imageUrl: 'https://images.unsplash.com/photo-1535254973040-607b474cb80d?auto=format&fit=crop&q=80&w=800', active: true }
]);
</script>
