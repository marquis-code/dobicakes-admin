<template>
 <div class="space-y-8 animate-fade-in">
 <div class="flex justify-between items-center">
 <div>
 <h3 class="text-xl font-bold text-slate-900 tracking-tight">Email Marketing</h3>
 <p class="text-sm text-gray-800 tracking-tight">Compose campaigns and manage templates</p>
 </div>
 <div class="flex gap-4">
 <button class="btn-outline !py-3 px-6 text-sm tracking-tight font-bold">New Template</button>
 <button class="btn-primary !py-3 px-6 text-sm tracking-tight font-bold">New Campaign</button>
 </div>
 </div>

 <!-- Stats -->
 <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div v-for="stat in stats" :key="stat.label" class="p-6 bg-white border border-slate-100 rounded-sm space-y-2">
 <p class="text-sm font-bold tracking-tight text-slate-400">{{ stat.label }}</p>
 <p class="text-3xl text-slate-900">{{ stat.value }}</p>
 </div>
 </div>

 <!-- Campaigns Table -->
 <div class="bg-white border border-slate-100 rounded-sm overflow-hidden">
 <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
 <h4 class="text-xs font-bold tracking-tight text-slate-900">Recent Campaigns</h4>
 </div>
 <table class="w-full text-left">
 <thead class="bg-slate-50 border-b border-slate-100">
 <tr class="text-sm font-bold tracking-tight text-slate-500">
 <th class="px-6 py-4">Campaign Name</th>
 <th class="px-6 py-4">Status</th>
 <th class="px-6 py-4">Sent At</th>
 <th class="px-6 py-4">Recipients</th>
 <th class="px-6 py-4 text-right">Actions</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-slate-50">
 <tr v-for="camp in campaigns" :key="camp._id" class="text-xs group hover:bg-slate-50/50 transition-colors">
 <td class="px-6 py-4">
 <p class="font-bold text-slate-900 tracking-tight">{{ camp.name }}</p>
 <p class="text-tiny text-slate-400">Template: {{ camp.templateName }}</p>
 </td>
 <td class="px-6 py-4">
 <span :class="camp.status === 'sent' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'" class="px-2 py-1 rounded-full text-tiny font-bold tracking-tight">
 {{ camp.status }}
 </span>
 </td>
 <td class="px-6 py-4 text-slate-400">{{ camp.sentAt }}</td>
 <td class="px-6 py-4 text-slate-400">{{ camp.recipients }}</td>
 <td class="px-6 py-4 text-right">
 <button class="text-slate-400 hover:text-brand-gold transition-colors">
 <LucideEye :size="16" />
 </button>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>
</template>

<script setup>
import { LucideEye } from 'lucide-vue-next';

const stats = [
 { label: 'Total Recipients', value: '12,450' },
 { label: 'Avg Open Rate', value: '24.8%' },
 { label: 'Total Campaigns', value: '42' },
];

const campaigns = [
 { _id: '1', name: 'Easter Specials 2026', templateName: 'Holiday Promo V2', status: 'sent', sentAt: '2026-03-10', recipients: '4,200' },
 { _id: '2', name: 'Wedding Season Launch', templateName: 'Elegant Invite', status: 'draft', sentAt: '-', recipients: '8,250' },
];
</script>
