<template>
  <div class="space-y-10 animate-fade-in pb-10">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="admin-card !p-6 flex flex-col justify-between group hover:border-brand-gold transition-all duration-500">
        <div class="flex justify-between items-start">
          <div class="p-3 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-brand-gold group-hover:text-white transition-all duration-500 border border-slate-100 shadow-sm">
            <component :is="stat.icon" :size="20" />
          </div>
          <span :class="stat.trend > 0 ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'" 
                class="text-[9px] font-bold tracking-widest px-2 py-1 rounded-md border border-white/50 uppercase shadow-sm">
            {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
          </span>
        </div>
        <div class="mt-6">
          <p class="text-[10px] text-slate-400 tracking-widest font-bold uppercase">{{ stat.label }}</p>
          <h3 class="text-2xl font-bold text-slate-900 mt-1">{{ stat.value }}</h3>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Revenue Visualizer -->
      <div class="lg:col-span-2 admin-card !p-8 space-y-8 flex flex-col">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="text-[11px] font-bold tracking-widest text-slate-900 uppercase">Financial Intelligence</h4>
            <p class="text-[9px] text-slate-400 tracking-widest uppercase">Revenue performance tracking</p>
          </div>
          <select class="text-[10px] bg-slate-50 border-none outline-none font-bold tracking-widest px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
            <option>Last 30 Days</option>
            <option>Annual View</option>
          </select>
        </div>
        <div class="flex-grow min-h-[300px] flex items-end justify-between gap-3 lg:gap-4 pt-10">
          <div v-for="i in 12" :key="i" 
               :style="{ height: `${Math.random() * 70 + 30}%` }" 
               class="flex-grow bg-slate-50 rounded-t-lg hover:bg-brand-gold transition-all duration-500 group relative border-x border-t border-slate-100/50">
            <div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl z-10 whitespace-nowrap">
              ₦{{ Math.floor(Math.random() * 1000000).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Curator Sales -->
      <div class="admin-card !p-8 space-y-8">
        <div class="flex justify-between items-center">
          <h4 class="text-[11px] font-bold tracking-widest text-slate-900 uppercase">Recent Sales</h4>
          <LucideActivity :size="16" class="text-brand-gold" />
        </div>
        <div class="space-y-8">
          <div v-for="order in recentOrders" :key="order.id" class="flex items-center gap-5 group cursor-pointer">
            <div class="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-[10px] font-bold tracking-widest border border-slate-100 group-hover:bg-brand-gold group-hover:text-white transition-all shadow-sm">
              {{ order.customer[0] }}
            </div>
            <div class="flex-grow">
              <p class="text-[10px] font-bold text-slate-900 tracking-widest uppercase">{{ order.customer }}</p>
              <p class="text-[8px] text-slate-400 tracking-widest uppercase font-medium mt-0.5">{{ order.date }}</p>
            </div>
            <div class="text-right">
              <p class="text-[11px] font-bold text-brand-gold">₦{{ order.amount.toLocaleString() }}</p>
              <div class="text-[7px] text-emerald-500 font-bold uppercase mt-0.5">Success</div>
            </div>
          </div>
        </div>
        <button class="w-full py-4 text-[10px] font-bold tracking-widest text-slate-400 border-t border-slate-50 hover:text-brand-gold transition-all uppercase mt-4">
          Access All Transactions
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucideShoppingBag, LucideUsers, LucideBox, LucideDollarSign, LucideActivity } from 'lucide-vue-next';

const stats = [
  { label: 'Monthly Revenue', value: '₦2,450,000', trend: 12, icon: LucideDollarSign },
  { label: 'Pending Requests', value: '45', trend: 5, icon: LucideShoppingBag },
  { label: 'Artisanal Reach', value: '1,204', trend: -2, icon: LucideUsers },
  { label: 'Inventory Alert', value: '18', trend: 0, icon: LucideBox },
];

const recentOrders = [
  { id: '1', customer: 'Adebayo Tunde', date: '2 Mins Ago', amount: 45000 },
  { id: '2', customer: 'Chioma Okeke', date: '1 Hour Ago', amount: 15000 },
  { id: '3', customer: 'Fatima Yusuf', date: '3 Hours Ago', amount: 82000 },
  { id: '4', customer: 'John Doe', date: 'Yesterday', amount: 12000 },
  { id: '5', customer: 'Michael Smith', date: 'Yesterday', amount: 25000 },
];

definePageMeta({ layout: 'default' });
</script>
