<template>
  <div class="space-y-12 animate-fade-in">
    <div>
      <h3 class="text-xl font-bold text-slate-900  tracking-tight">Settings & Configuration</h3>
      <p class="text-[10px] text-gray-400  tracking-widest">Manage your application preferences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Business Info -->
      <div class="admin-card space-y-6">
        <h4 class="text-xs font-bold  tracking-widest text-slate-400 border-b border-gray-100 pb-4">Business Information</h4>
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-[10px] font-bold  tracking-widest text-gray-400">Business Name</label>
            <input v-model="settings.businessName" type="text" class="w-full border border-gray-100 bg-gray-50 px-4 py-3 rounded-sm outline-none focus:border-brand-gold transition-colors text-xs" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold  tracking-widest text-gray-400">Contact Email</label>
            <input v-model="settings.contactEmail" type="email" class="w-full border border-gray-100 bg-gray-50 px-4 py-3 rounded-sm outline-none focus:border-brand-gold transition-colors text-xs" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold  tracking-widest text-gray-400">WhatsApp Number</label>
            <input v-model="settings.whatsapp" type="text" class="w-full border border-gray-100 bg-gray-50 px-4 py-3 rounded-sm outline-none focus:border-brand-gold transition-colors text-xs" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold  tracking-widest text-gray-400">Business Address</label>
            <textarea v-model="settings.address" rows="3" class="w-full border border-gray-100 bg-gray-50 px-4 py-3 rounded-sm outline-none focus:border-brand-gold transition-colors text-xs resize-none"></textarea>
          </div>
        </div>
      </div>

      <!-- Payment Settings -->
      <div class="admin-card space-y-6">
        <h4 class="text-xs font-bold  tracking-widest text-slate-400 border-b border-gray-100 pb-4">Payment Configuration</h4>
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-[10px] font-bold  tracking-widest text-gray-400">Paystack Secret Key</label>
            <input v-model="settings.paystackKey" type="password" class="w-full border border-gray-100 bg-gray-50 px-4 py-3 rounded-sm outline-none focus:border-brand-gold transition-colors text-xs font-mono" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold  tracking-widest text-gray-400">Bank Name</label>
            <input v-model="settings.bankName" type="text" class="w-full border border-gray-100 bg-gray-50 px-4 py-3 rounded-sm outline-none focus:border-brand-gold transition-colors text-xs" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold  tracking-widest text-gray-400">Account Number</label>
            <input v-model="settings.accountNumber" type="text" class="w-full border border-gray-100 bg-gray-50 px-4 py-3 rounded-sm outline-none focus:border-brand-gold transition-colors text-xs font-mono" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold  tracking-widest text-gray-400">Account Name</label>
            <input v-model="settings.accountName" type="text" class="w-full border border-gray-100 bg-gray-50 px-4 py-3 rounded-sm outline-none focus:border-brand-gold transition-colors text-xs" />
          </div>
        </div>
      </div>

      <!-- Shipping Configuration -->
      <div class="admin-card space-y-6">
        <h4 class="text-xs font-bold  tracking-widest text-slate-400 border-b border-gray-100 pb-4">Delivery & Shipping</h4>
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-[10px] font-bold  tracking-widest text-gray-400">Base Delivery Fee (₦)</label>
            <input v-model="settings.deliveryFee" type="number" class="w-full border border-gray-100 bg-gray-50 px-4 py-3 rounded-sm outline-none focus:border-brand-gold transition-colors text-xs" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold  tracking-widest text-gray-400">Free Delivery Threshold (₦)</label>
            <input v-model="settings.freeDeliveryThreshold" type="number" class="w-full border border-gray-100 bg-gray-50 px-4 py-3 rounded-sm outline-none focus:border-brand-gold transition-colors text-xs" />
          </div>
          <div class="flex items-center gap-3 pt-2">
            <input type="checkbox" v-model="settings.enableDelivery" class="accent-brand-gold w-4 h-4" />
            <label class="text-[10px] font-bold  tracking-widest text-gray-500">Enable delivery service</label>
          </div>
        </div>
      </div>

      <!-- Notification Preferences -->
      <div class="admin-card space-y-6">
        <h4 class="text-xs font-bold  tracking-widest text-slate-400 border-b border-gray-100 pb-4">Notification Preferences</h4>
        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b border-gray-50">
            <div>
              <p class="text-[11px] font-bold text-slate-900  tracking-widest">New Order Alerts</p>
              <p class="text-[9px] text-gray-400  tracking-widest">Get notified when a new order is placed</p>
            </div>
            <input type="checkbox" v-model="settings.notifyNewOrder" class="accent-brand-gold w-4 h-4" />
          </div>
          <div class="flex items-center justify-between py-3 border-b border-gray-50">
            <div>
              <p class="text-[11px] font-bold text-slate-900  tracking-widest">Chat Messages</p>
              <p class="text-[9px] text-gray-400  tracking-widest">Receive alerts for new customer messages</p>
            </div>
            <input type="checkbox" v-model="settings.notifyChat" class="accent-brand-gold w-4 h-4" />
          </div>
          <div class="flex items-center justify-between py-3">
            <div>
              <p class="text-[11px] font-bold text-slate-900  tracking-widest">Low Stock Warnings</p>
              <p class="text-[9px] text-gray-400  tracking-widest">Alert when inventory drops below threshold</p>
            </div>
            <input type="checkbox" v-model="settings.notifyLowStock" class="accent-brand-gold w-4 h-4" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button class="bg-brand-gold text-white px-12 py-3 rounded-sm text-xs font-bold  tracking-widest hover:bg-brand-gold-dark transition-colors shadow-sm">
        Save All Changes
      </button>
    </div>
  </div>
</template>

<script setup>
const settings = ref({
  businessName: 'Adaobi Cakes',
  contactEmail: 'orders@adaobicakes.com',
  whatsapp: '+234 812 345 6789',
  address: '123 Cake Lane, Ikeja, Lagos',
  paystackKey: '••••••••••••••••',
  bankName: 'Zenith Bank',
  accountNumber: '1234567890',
  accountName: 'Adaobi Cakes Ltd',
  deliveryFee: 2500,
  freeDeliveryThreshold: 100000,
  enableDelivery: true,
  notifyNewOrder: true,
  notifyChat: true,
  notifyLowStock: true,
});

definePageMeta({ layout: 'default' });
</script>
