<template>
  <div class="space-y-8 animate-fade-in">
    <div>
      <h3 class="text-xl font-bold text-slate-900  tracking-tight">Sales & Fulfillment</h3>
      <p class="text-sm text-gray-800  tracking-tight">Monitor transactions and process orders</p>
    </div>

    <!-- Orders Table -->
    <div class="admin-card !p-0 relative min-h-[400px]">
      <UiAdminLoadingState v-if="loading" />
      
      <template v-else-if="orders.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 tracking-tight">Order ID</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 tracking-tight">Customer</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 tracking-tight">Amount</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 tracking-tight">Method</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 tracking-tight">Status</th>
                <th class="px-6 py-4 text-xs font-bold text-slate-500 tracking-tight text-right">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="order in orders" :key="order._id" @click="viewOrder(order)" class="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <td class="px-6 py-3 font-bold text-brand-gold text-sm tracking-wide">#{{ order._id.slice(-6) }}</td>
                <td class="px-6 py-3">
                  <div class="flex flex-col gap-0.5">
                    <span class="font-bold text-slate-900 text-sm">{{ order.shippingAddress.name }}</span>
                    <span class="text-xs text-slate-500 font-medium">{{ order.shippingAddress.phone }}</span>
                  </div>
                </td>
                <td class="px-6 py-3 font-bold text-slate-900 text-sm">₦{{ order.totalAmount.toLocaleString() }}</td>
                <td class="px-6 py-3">
                  <span class="text-tiny font-bold tracking-wide py-1.5 px-3 bg-slate-100 rounded-lg text-slate-600 inline-block">{{ formatLabel(order.paymentMethod) }}</span>
                </td>
                <td class="px-6 py-3" @click.stop>
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
                    class="w-36"
                  />
                </td>
                <td class="px-6 py-3 text-right text-xs text-slate-500 font-medium">
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
