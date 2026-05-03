<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Banner Management</h3>
        <p class="text-[10px] text-gray-400 tracking-widest uppercase">Hero Sliders & Promotional Graphics</p>
      </div>
      <button @click="openCreateModal" class="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-brand-gold transition-all shadow-lg shadow-slate-900/10">Add Banner</button>
    </div>

    <div class="admin-card !p-0 relative min-h-[400px]">
      <UiAdminLoadingState v-if="loading" />
      
      <template v-else-if="banners.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
          <div v-for="banner in banners" :key="banner._id" class="bg-white border border-slate-100 rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div class="aspect-[16/9] relative overflow-hidden">
              <img :src="banner.imageUrl" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button @click="openEditModal(banner)" class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:scale-110 transition-transform">
                  <LucideEdit :size="18" />
                </button>
                <button @click="confirmDelete(banner)" class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-rose-500 shadow-xl hover:scale-110 transition-transform">
                  <LucideTrash :size="18" />
                </button>
              </div>
            </div>
            <div class="p-6 space-y-2">
              <div class="flex justify-between items-start">
                <h4 class="text-xs font-bold tracking-widest text-slate-900 uppercase truncate pr-4">{{ banner.title }}</h4>
                <button @click="toggleBannerStatus(banner)" :class="banner.active ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 bg-slate-50'" class="px-2 py-1 rounded-md text-[8px] font-bold tracking-widest uppercase transition-colors">
                  {{ banner.active ? 'Active' : 'Inactive' }}
                </button>
              </div>
              <p class="text-[10px] text-slate-400 tracking-widest line-clamp-1 italic">"{{ banner.subtitle }}"</p>
            </div>
          </div>
        </div>
      </template>

      <UiAdminEmptyState 
        v-else 
        title="No Banners Active" 
        message="Display your latest creations and offers by adding a hero banner."
        :icon="LucideImage"
      />
    </div>

    <!-- Banner Modal -->
    <UiModal v-model="showModal" :title="isEditing ? 'Edit Banner' : 'Create Banner'">
      <form @submit.prevent="saveBanner" class="space-y-6">
        <div class="space-y-2">
          <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Banner Title</label>
          <input v-model="form.title" type="text" required class="w-full border-b border-slate-100 py-3 outline-none focus:border-brand-gold transition-colors text-xs" placeholder="e.g. Artisan Cake Collection" />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Subtitle</label>
          <input v-model="form.subtitle" type="text" required class="w-full border-b border-slate-100 py-3 outline-none focus:border-brand-gold transition-colors text-xs" placeholder="e.g. Handcrafted for your special moments" />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Banner Overlay (Rich Text)</label>
          <UiRichEditor v-model="form.content" placeholder="Compose high-impact promotional copy..." />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Banner Image</label>
          <div class="relative group">
            <div class="aspect-[16/9] bg-slate-50 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center">
              <img v-if="form.imageUrl" :src="form.imageUrl" class="w-full h-full object-cover" />
              <div v-else class="text-center space-y-2">
                <LucideUpload class="mx-auto text-slate-300" :size="32" />
                <p class="text-[9px] text-slate-400 tracking-widest uppercase">Click to upload image</p>
              </div>
            </div>
            <input type="file" @change="handleFileUpload" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
          </div>
        </div>
        <div class="flex gap-4 pt-4">
          <button type="submit" :disabled="isSaving" class="flex-grow bg-slate-900 text-white py-4 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-brand-gold transition-all disabled:opacity-50">
            {{ isSaving ? 'Saving...' : 'Confirm Banner' }}
          </button>
        </div>
      </form>
    </UiModal>

    <!-- Delete Confirmation -->
    <ConfirmationModal
      :is-open="isDeleteModalOpen"
      title="Retire Banner"
      :message="`Are you sure you want to permanently delete '${bannerToDelete?.title}'?`"
      confirm-text="Delete Forever"
      @confirm="executeDelete"
      @close="isDeleteModalOpen = false"
      type="danger"
    />
  </div>
</template>

<script setup>
import { LucideEdit, LucideTrash, LucideUpload, LucideImage } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';

const { fetchAdmin, postAdmin, patchAdmin, deleteAdmin, uploadImage } = useAdminApi();
const { success: toastSuccess, error: toastError } = useToast();

const banners = ref([]);
const loading = ref(true);
const showModal = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const isDeleteModalOpen = ref(false);
const bannerToDelete = ref(null);

const form = ref({
  title: '',
  subtitle: '',
  imageUrl: '',
  active: true,
  order: 0
});

const loadBanners = async () => {
  loading.value = true;
  try {
    const data = await fetchAdmin('/marketing/banners/active');
    banners.value = data;
  } catch (e) {
    toastError('Failed to fetch banners');
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  form.value = { title: '', subtitle: '', imageUrl: '', active: true, order: banners.value.length };
  showModal.value = true;
};

const openEditModal = (banner) => {
  isEditing.value = true;
  form.value = { ...banner };
  showModal.value = true;
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  isSaving.value = true;
  try {
    const res = await uploadImage(file);
    form.value.imageUrl = res.url;
    toastSuccess('Image uploaded successfully');
  } catch (e) {
    toastError('Failed to upload image');
  } finally {
    isSaving.value = false;
  }
};

const saveBanner = async () => {
  isSaving.value = true;
  try {
    if (isEditing.value) {
      await patchAdmin(`/marketing/banners/${form.value._id}`, form.value);
      toastSuccess('Banner updated');
    } else {
      await postAdmin('/marketing/banners', form.value);
      toastSuccess('Banner created');
    }
    showModal.value = false;
    loadBanners();
  } catch (e) {
    toastError('Failed to save banner');
  } finally {
    isSaving.value = false;
  }
};

const toggleBannerStatus = async (banner) => {
  try {
    await patchAdmin(`/marketing/banners/${banner._id}`, { active: !banner.active });
    banner.active = !banner.active;
    toastSuccess(`Banner ${banner.active ? 'activated' : 'deactivated'}`);
  } catch (e) {
    toastError('Failed to toggle status');
  }
};

const confirmDelete = (banner) => {
  bannerToDelete.value = banner;
  isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
  try {
    await deleteAdmin(`/marketing/banners/${bannerToDelete.value._id}`);
    toastSuccess('Banner deleted');
    loadBanners();
  } catch (e) {
    toastError('Failed to delete banner');
  } finally {
    isDeleteModalOpen.value = false;
  }
};

onMounted(loadBanners);

definePageMeta({ layout: 'default' });
</script>
