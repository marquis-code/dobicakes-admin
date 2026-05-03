<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Artisanal categories</h3>
        <p class="text-sm text-slate-500 font-medium tracking-tight">Organize your creations into distinct collections</p>
      </div>
      <button @click="openCreateModal" class="btn-admin-primary flex items-center gap-2.5">
        <LucidePlus :size="18" />
        <span class="tracking-tight">New category</span>
      </button>
    </div>

    <div class="admin-card !p-0 relative min-h-[400px]">
      <UiAdminLoadingState v-if="loading" />
      
      <template v-else-if="categories.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Category name</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Description</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight">Status</th>
                <th class="px-8 py-3 text-xs font-bold text-slate-500 tracking-tight text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="category in categories" :key="category._id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-8 py-3">
                  <span class="font-bold text-slate-900 text-sm tracking-tight">{{ category.name }}</span>
                </td>
                <td class="px-8 py-3 text-slate-500 text-sm font-medium">{{ category.description || 'No description provided' }}</td>
                <td class="px-8 py-3">
                  <span :class="category.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'" 
                        class="text-tiny font-bold tracking-tight px-3 py-1.5 rounded-lg border">
                    {{ category.isActive ? 'Active' : 'Hidden' }}
                  </span>
                </td>
                <td class="px-8 py-3 text-right">
                  <div class="flex justify-end gap-3.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button @click="openEditModal(category)" class="p-2.5 text-slate-400 hover:text-brand-gold hover:bg-brand-gold/5 rounded-xl transition-all border border-transparent hover:border-brand-gold/10"><LucideEdit :size="18" /></button>
                    <button @click="confirmDelete(category)" class="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all border border-transparent hover:border-rose-500/10"><LucideTrash :size="18" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <UiAdminEmptyState 
        v-else 
        title="No Categories Defined" 
        message="Start organizing your inventory by creating your first artisanal category."
        :icon="LucideTag"
      />
    </div>

    <!-- Category Modal (Side Drawer) -->
    <UiDrawer 
      :model-value="showModal" 
      :title="isEditing ? 'Edit Category' : 'New Category'"
      subtitle="Define a new artisanal collection for your cakes"
      @update:model-value="showModal = false"
    >
      <form @submit.prevent="saveCategory" class="space-y-10 py-2">
        <div class="space-y-6">
          <label class="block space-y-2">
            <span class="text-xs font-bold tracking-tight text-slate-500">Category name</span>
            <input v-model="form.name" type="text" required placeholder="e.g., Wedding Cakes" class="w-full admin-input" />
          </label>
          <label class="block space-y-2">
            <span class="text-xs font-bold tracking-tight text-slate-500">Description</span>
            <textarea v-model="form.description" rows="4" class="w-full resize-none admin-input" placeholder="Briefly describe what this collection represents..."></textarea>
          </label>

          <div class="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between group">
            <div class="flex flex-col">
              <span class="text-sm font-bold text-slate-900">Collection visibility</span>
              <p class="text-tiny text-slate-500 font-medium mt-0.5">Show or hide this category in the shop</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="form.isActive" type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
            </label>
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-5">
          <button @click="showModal = false" class="px-8 py-3.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
          <button @click="saveCategory" :disabled="isSaving" class="btn-admin-primary px-12 py-3.5">
            <LucideLoader2 v-if="isSaving" class="animate-spin mr-2" :size="18" />
            {{ isEditing ? 'Save Changes' : 'Create Category' }}
          </button>
        </div>
      </template>
    </UiDrawer>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :is-open="isDeleteModalOpen"
      title="Delete Category"
      :message="`Are you sure you want to delete the '${categoryToDelete?.name}' category? This will not delete the products within it, but they will become uncategorized.`"
      confirm-text="Delete Category"
      cancel-text="Cancel"
      type="danger"
      :is-loading="isDeleting"
      @close="isDeleteModalOpen = false"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { LucidePlus, LucideEdit, LucideTrash, LucideTag, LucideLoader2 } from 'lucide-vue-next';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';

const { fetchAdmin, postAdmin, patchAdmin, deleteAdmin } = useAdminApi();

const categories = ref([]);
const loading = ref(true);
const showModal = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);

const form = ref({
  name: '',
  description: '',
  isActive: true
});

const loadCategories = async () => {
  loading.value = true;
  try {
    categories.value = await fetchAdmin('/categories');
  } catch (e) {
    categories.value = [];
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  form.value = { name: '', description: '', isActive: true };
  showModal.value = true;
};

const openEditModal = (category) => {
  isEditing.value = true;
  form.value = { ...category };
  showModal.value = true;
};

const saveCategory = async () => {
  isSaving.value = true;
  try {
    if (isEditing.value) {
      await patchAdmin(`/categories/${form.value._id}`, form.value);
    } else {
      await postAdmin('/categories', form.value);
    }
    showModal.value = false;
    await loadCategories();
  } catch (e) {
    console.error('Failed to save category', e);
  } finally {
    isSaving.value = false;
  }
};

// Delete logic
const isDeleteModalOpen = ref(false);
const categoryToDelete = ref(null);
const isDeleting = ref(false);

const confirmDelete = (category) => {
  categoryToDelete.value = category;
  isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
  if (!categoryToDelete.value) return;
  isDeleting.value = true;
  try {
    await deleteAdmin(`/categories/${categoryToDelete.value._id}`);
    await loadCategories();
  } finally {
    isDeleting.value = false;
    isDeleteModalOpen.value = false;
    categoryToDelete.value = null;
  }
};

onMounted(loadCategories);
definePageMeta({ layout: 'default' });
</script>
