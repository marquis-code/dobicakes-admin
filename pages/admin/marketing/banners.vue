<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Banner management</h3>
        <p class="text-sm text-gray-800 tracking-tight ">Hero sliders & promotional graphics</p>
      </div>
      <button @click="openCreateModal" class="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-medium tracking-tight  hover:bg-brand-gold transition-all shadow-lg shadow-slate-900/10">Add Banner</button>
    </div>

    <div class="admin-card !p-0 relative min-h-[400px]">
      <UiAdminLoadingState v-if="loading" />
      
      <template v-else-if="banners.length > 0">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr class="text-sm font-bold tracking-tight text-slate-500">
                <th class="px-6 py-3">Visual Asset</th>
                <th class="px-6 py-3">Headline & Subtitle</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-xs text-slate-600">
              <tr v-for="banner in banners" :key="banner._id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-6 py-3 w-48">
                  <div class="aspect-[16/9] rounded-lg overflow-hidden border border-slate-100">
                    <img :src="banner.imageUrl" class="w-full h-full object-cover" />
                  </div>
                </td>
                <td class="px-6 py-3">
                  <div class="flex flex-col space-y-1">
                    <span class="font-bold text-slate-900 tracking-tight text-sm">{{ banner.title }}</span>
                    <span class="text-slate-400 font-medium italic line-clamp-1 max-w-md">"{{ banner.subtitle }}"</span>
                  </div>
                </td>
                <td class="px-6 py-3">
                  <button @click="toggleBannerStatus(banner)" :class="banner.active ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-50'" class="px-3 py-1 rounded-md text-tiny font-bold tracking-tight transition-colors">
                    {{ banner.active ? 'Active' : 'Disabled' }}
                  </button>
                </td>
                <td class="px-6 py-3 text-right">
                  <div class="flex justify-end gap-3">
                    <button @click="openEditModal(banner)" class="text-slate-400 hover:text-brand-gold transition-colors">
                      <LucideEdit :size="16" />
                    </button>
                    <button @click="confirmDelete(banner)" class="text-slate-400 hover:text-rose-500 transition-colors">
                      <LucideTrash :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <UiAdminEmptyState 
        v-else 
        title="No Banners Active" 
        message="Display your latest creations and offers by adding a hero banner."
        :icon="LucideImage"
      />
    </div>

    <!-- Banner Drawer -->
    <UiDrawer 
      :model-value="showModal" 
      :title="isEditing ? 'Edit Banner' : 'Create Banner'"
      subtitle="Designing high-impact hero graphics for your storefront"
      @update:model-value="showModal = false"
    >
      <form @submit.prevent="saveBanner" class="space-y-10 py-2">
        <div class="space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2.5">
              <label class="admin-label">Banner Headline</label>
              <input v-model="form.title" type="text" required class="admin-input w-full" placeholder="e.g. Artisan Collection" />
            </div>
            <div class="space-y-2.5">
              <label class="admin-label">Promotional Subtitle</label>
              <input v-model="form.subtitle" type="text" required class="admin-input w-full" placeholder="e.g. Handcrafted Excellence" />
            </div>
          </div>

          <div class="space-y-2.5">
            <label class="admin-label">Banner Overlay Copy</label>
            <UiRichEditor v-model="form.content" placeholder="Compose high-impact promotional copy..." />
          </div>

          <div class="space-y-2.5">
            <label class="admin-label">Creative Asset (16:9 recommended)</label>
            <div class="relative group aspect-video rounded-[2rem] overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 hover:border-brand-gold/50 transition-all cursor-pointer">
              <img v-if="form.imageUrl" :src="form.imageUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  <LucideUpload class="text-slate-900" :size="28" />
                </div>
                <p class="text-tiny font-bold text-slate-400 tracking-tight">Select Visual Asset</p>
              </div>
              <input type="file" @change="handleFileUpload" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            </div>
          </div>

          <div class="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between group">
            <div class="flex flex-col">
              <span class="text-sm font-bold text-slate-900">Active Campaign</span>
              <p class="text-tiny text-slate-500 font-medium">Display this banner in the hero slider</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="form.active" type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
            </label>
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-5">
          <button @click="showModal = false" class="px-8 py-3.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
          <button @click="saveBanner" :disabled="isSaving" class="btn-admin-primary px-12 py-3.5">
            <LucideLoader2 v-if="isSaving" class="animate-spin mr-2" :size="18" />
            {{ isEditing ? 'Update Banner' : 'Create Banner' }}
          </button>
        </div>
      </template>
    </UiDrawer>

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
