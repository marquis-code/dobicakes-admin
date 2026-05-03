<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Cakes & Inventory</h3>
        <p class="text-[10px] text-gray-400 tracking-widest uppercase">Manage your products and stock levels</p>
      </div>
      <button @click="showModal = true" class="bg-brand-gold text-white px-6 py-2.5 rounded-lg text-[10px] font-bold tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg shadow-brand-gold/20 active:scale-95">
        <LucidePlus :size="16" />
        NEW CREATION
      </button>
    </div>

    <!-- Inventory Table -->
    <div class="admin-card !p-0 overflow-hidden relative min-h-[400px] flex flex-col">
      <UiAdminLoadingState v-if="loading" />
      
      <template v-else-if="products.length > 0">
        <div class="overflow-x-auto flex-grow">
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
                    <button @click="confirmDelete(product)" class="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-all"><LucideTrash :size="16" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer -->
        <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div class="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
            Showing {{ pagination.data?.length || 0 }} of {{ pagination.total || 0 }} Creations
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="changePage(pagination.page - 1)" 
              :disabled="!pagination.hasPrev"
              class="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-brand-gold hover:border-brand-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <LucideChevronLeft :size="16" />
            </button>
            <div class="flex items-center gap-1">
              <span class="text-[10px] font-bold text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm min-w-[32px] text-center">
                {{ pagination.page }}
              </span>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">of {{ pagination.totalPages }}</span>
            </div>
            <button 
              @click="changePage(pagination.page + 1)" 
              :disabled="!pagination.hasNext"
              class="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-brand-gold hover:border-brand-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <LucideChevronRight :size="16" />
            </button>
          </div>
        </div>
      </template>

      <UiAdminEmptyState 
        v-else 
        title="No Cakes in Oven" 
        message="Your inventory is empty. Start adding your artisanal creations to the shop."
        :icon="LucideBox"
      />
    </div>

    <ClientOnly>
      <ProductsProductModal 
        :is-open="showModal" 
        :product="selectedProduct"
        @close="closeModal" 
        @saved="loadProducts" 
      />

      <!-- Delete Confirmation Modal -->
      <ConfirmationModal
        :is-open="isDeleteModalOpen"
        title="Delete Product"
        :message="`Are you sure you want to delete ${productToDelete?.name || 'this product'}? This action cannot be undone.`"
        confirm-text="Delete Product"
        cancel-text="Cancel"
        type="danger"
        :is-loading="isDeleting"
        @close="isDeleteModalOpen = false"
        @confirm="executeDelete"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
import { 
  LucidePlus, LucideEdit, LucideTrash, LucideBox, 
  LucideChevronLeft, LucideChevronRight 
} from 'lucide-vue-next';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
const { fetchAdmin, deleteAdmin } = useAdminApi();

const products = ref([]);
const pagination = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNext: false,
  hasPrev: false
});
const loading = ref(true);
const showModal = ref(false);
const selectedProduct = ref(null);

// Delete Modal State
const isDeleteModalOpen = ref(false);
const productToDelete = ref(null);
const isDeleting = ref(false);

const loadProducts = async (page = 1) => {
  loading.value = true;
  try {
    const response = await fetchAdmin(`/products?page=${page}&limit=10`);
    products.value = response.data || [];
    pagination.value = response;
  } catch (e) {
    console.error('Failed to load products', e);
  } finally {
    loading.value = false;
  }
};

const changePage = (newPage) => {
  if (newPage < 1 || newPage > pagination.value.totalPages) return;
  loadProducts(newPage);
};

const editProduct = (product) => {
  selectedProduct.value = product;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedProduct.value = null;
};

const confirmDelete = (product) => {
  productToDelete.value = product;
  isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
  if (!productToDelete.value) return;
  isDeleting.value = true;
  try {
    await deleteAdmin(`/products/${productToDelete.value._id}`);
    await loadProducts(pagination.value.page);
  } finally {
    isDeleting.value = false;
    isDeleteModalOpen.value = false;
    productToDelete.value = null;
  }
};

onMounted(() => {
  loadProducts();
});

definePageMeta({ layout: 'default' });
</script>
