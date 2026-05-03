<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Cakes & inventory</h3>
        <p class="text-sm text-slate-500 font-medium tracking-tight">Manage your products and stock levels</p>
      </div>
      <div class="flex items-center gap-4">
        <NuxtLink to="/admin/products/categories" class="px-6 py-3 rounded-xl text-sm font-medium tracking-tight text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 flex items-center gap-2">
          <LucideTag :size="18" />
          Categories
        </NuxtLink>
        <button @click="showModal = true" class="btn-admin-primary flex items-center gap-2.5">
          <LucidePlus :size="18" />
          <span class="tracking-wide">New Creation</span>
        </button>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="admin-card !p-0 relative min-h-[400px]">
      <UiAdminLoadingState v-if="loading" />
      
      <template v-else-if="products.length > 0">
        <div class="overflow-x-auto flex-grow">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Product Detail</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Category</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Pricing</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Stock Level</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Shop Status</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="product in products" :key="product._id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-8 py-3">
                  <div class="flex items-center gap-5">
                    <div class="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm transition-transform group-hover:scale-105">
                      <img :src="product.images?.[0]" class="w-full h-full object-cover" />
                    </div>
                    <span class="font-bold text-slate-900 text-sm tracking-tight">{{ product.name }}</span>
                  </div>
                </td>
                <td class="px-8 py-3 text-slate-500 text-sm font-medium">{{ product.category }}</td>
                <td class="px-8 py-3 font-bold text-brand-gold text-sm">₦{{ product.price.toLocaleString() }}</td>
                <td class="px-8 py-3">
                  <span :class="product.stock < 10 ? 'text-rose-500 font-bold' : 'text-slate-600'" class="text-xs font-semibold">
                    {{ product.stock.toString().padStart(2, '0') }} units
                  </span>
                </td>
                <td class="px-8 py-3">
                  <span :class="product.isAvailable ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'" 
                        class="text-tiny font-bold tracking-wide px-3 py-1.5 rounded-lg border">
                    {{ product.isAvailable ? 'Active' : 'Archived' }}
                  </span>
                </td>
                <td class="px-8 py-3 text-right">
                  <div class="flex justify-end gap-3.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button @click="editProduct(product)" class="p-2.5 text-slate-400 hover:text-brand-gold hover:bg-brand-gold/5 rounded-xl transition-all border border-transparent hover:border-brand-gold/10"><LucideEdit :size="18" /></button>
                    <button @click="confirmDelete(product)" class="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all border border-transparent hover:border-rose-500/10"><LucideTrash :size="18" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer -->
        <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div class="text-sm text-slate-400 font-bold tracking-tight ">
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
              <span class="text-sm font-bold text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm min-w-[32px] text-center">
                {{ pagination.page }}
              </span>
              <span class="text-sm font-bold text-slate-400  tracking-tight px-2">of {{ pagination.totalPages }}</span>
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
  LucideChevronLeft, LucideChevronRight, LucideTag
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
