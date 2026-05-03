<template>
  <div class="space-y-8 animate-fade-in">
    <div>
      <h3 class="text-xl font-bold text-slate-900  tracking-tight">Sales & Fulfillment</h3>
      <p class="text-[10px] text-gray-400  tracking-widest">Monitor transactions and process orders</p>
    </div>

    <!-- Orders Table -->
    <div class="admin-card !p-0 relative min-h-[400px]">
      <UiAdminLoadingState v-if="loading" />
      
      <template v-else-if="orders.length > 0">
        <div>
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Order ID</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Customer</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Amount</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Method</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Status</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase text-right">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-sm">
              <tr v-for="order in orders" :key="order._id" @click="viewOrder(order)" class="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <td class="px-6 py-4 font-bold text-brand-gold text-[10px] tracking-widest">#{{ order._id.slice(-6) }}</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-900 text-[11px] tracking-widest">{{ order.shippingAddress.name }}</span>
                    <span class="text-[9px] text-slate-400 tracking-widest">{{ order.shippingAddress.phone }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 font-bold text-slate-900">₦{{ order.totalAmount.toLocaleString() }}</td>
                <td class="px-6 py-4">
                  <span class="text-[9px] font-bold tracking-widest py-1 px-2 bg-slate-100 rounded-md text-slate-600">{{ formatLabel(order.paymentMethod) }}</span>
                </td>
                <td class="px-6 py-4" @click.stop>
                  <UiSelect 
                    v-model="order.status" 
                    @update:model-value="updateStatus(order)"
                    :options="[
                      { label: 'Pending', value: 'PENDING' },
                      { label: 'Paid', value: 'PAID' },
                      { label: 'Processing', value: 'PROCESSING' },
                      { label: 'Delivered', value: 'DELIVERED' },
                      { label: 'Cancelled', value: 'CANCELLED' }
                    ]"
                    compact
                    class="w-32"
                  />
                </td>
                <td class="px-6 py-4 text-right text-[10px] text-slate-400 tracking-widest">
                  {{ new Date(order.createdAt).toLocaleDateString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <UiAdminEmptyState 
        v-else 
        title="No Orders Yet" 
        message="When customers start placing orders for your exquisite cakes, they will appear here."
        :icon="LucideShoppingBag"
      />
    </div>

    <OrdersOrderDetailModal 
      :is-open="showModal" 
      :order="selectedOrder" 
      @close="closeModal" 
    />
  </div>
</template>

<script setup>
import { LucideShoppingBag } from 'lucide-vue-next';
const { fetchAdmin, patchAdmin } = useAdminApi();

const orders = ref([]);
const loading = ref(true);
const showModal = ref(false);
const selectedOrder = ref(null);

const statusClasses = {
  PENDING: 'bg-amber-50 text-amber-600',
  PAID: 'bg-emerald-50 text-emerald-600',
  PROCESSING: 'bg-blue-50 text-blue-600',
  DELIVERED: 'bg-gray-50 text-gray-600',
  CANCELLED: 'bg-rose-50 text-rose-600',
};

const loadOrders = async () => {
  loading.value = true;
  try {
    orders.value = await fetchAdmin('/orders');
  } finally {
    loading.value = false;
  }
};

const viewOrder = (order) => {
  selectedOrder.value = order;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedOrder.value = null;
};

const updateStatus = async (order) => {
  await patchAdmin(`/orders/${order._id}`, { status: order.status });
};

onMounted(() => {
  loadOrders();
});

definePageMeta({ layout: 'default' });
</script>
