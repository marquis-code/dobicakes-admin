<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900  tracking-tight">Cakes & Inventory</h3>
        <p class="text-[10px] text-gray-400  tracking-widest">Manage your products and stock levels</p>
      </div>
      <button @click="showModal = true" class="bg-brand-gold text-white px-6 py-2 rounded-sm text-xs font-bold  tracking-widest hover:bg-brand-gold-dark transition-colors flex items-center gap-2 shadow-sm">
        <LucidePlus :size="16" />
        New Product
      </button>
    </div>

    <!-- Inventory Table -->
    <div class="admin-card !p-0 overflow-hidden relative min-h-[400px]">
      <UiAdminLoadingState v-if="loading" />
      
      <template v-else-if="products.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Product</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Category</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Price</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Stock</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase">Status</th>
                <th class="px-6 py-4 text-[10px] tracking-widest font-bold text-slate-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-sm">
              <tr v-for="product in products" :key="product._id" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                      <img :src="product.images?.[0]" class="w-full h-full object-cover" />
                    </div>
                    <span class="font-bold text-slate-900 text-[11px] tracking-widest">{{ product.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-500 text-[10px] tracking-widest uppercase font-medium">{{ product.category }}</td>
                <td class="px-6 py-4 font-bold text-brand-gold">₦{{ product.price.toLocaleString() }}</td>
                <td class="px-6 py-4">
                  <span :class="product.stock < 10 ? 'text-rose-500 font-bold' : 'text-slate-600'" class="text-[11px] tracking-widest font-mono">
                    {{ product.stock.toString().padStart(2, '0') }} pcs
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="product.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'" 
                        class="text-[9px] font-bold tracking-widest px-2.5 py-1.5 rounded-lg uppercase">
                    {{ product.isAvailable ? 'In Shop' : 'Hidden' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-3">
                    <button @click="editProduct(product)" class="p-2 text-slate-400 hover:text-brand-gold hover:bg-brand-gold/5 rounded-lg transition-all"><LucideEdit :size="16" /></button>
                    <button @click="deleteProduct(product._id)" class="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-all"><LucideTrash :size="16" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <UiAdminEmptyState 
        v-else 
        title="No Cakes in Oven" 
        message="Your inventory is empty. Start adding your artisanal creations to the shop."
        :icon="LucideBox"
      />
    </div>

    <ProductsProductModal 
      :is-open="showModal" 
      :product="selectedProduct"
      @close="closeModal" 
      @saved="loadProducts" 
    />
  </div>
</template>

<script setup>
import { LucidePlus, LucideEdit, LucideTrash, LucideBox } from 'lucide-vue-next';
const { fetchAdmin, deleteAdmin } = useAdminApi();

const products = ref([]);
const loading = ref(true);
const showModal = ref(false);
const selectedProduct = ref(null);

const loadProducts = async () => {
  loading.value = true;
  try {
    products.value = await fetchAdmin('/products');
  } finally {
    loading.value = false;
  }
};

const editProduct = (product) => {
  selectedProduct.value = product;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedProduct.value = null;
};

const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this exquisite creation?')) {
    await deleteAdmin(`/products/${id}`);
    await loadProducts();
  }
};

onMounted(() => {
  loadProducts();
});

definePageMeta({ layout: 'default' });
</script>
