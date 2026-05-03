<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900 tracking-tight">Blog & Editorial</h3>
        <p class="text-[10px] text-gray-400 tracking-widest uppercase">Website Articles & Updates</p>
      </div>
      <button @click="openCreateModal" class="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-brand-gold transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
        <LucidePlus :size="16" />
        New Article
      </button>
    </div>

    <!-- Blog Grid -->
    <div v-if="posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="post in posts" :key="post._id" class="bg-white border border-slate-100 rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-500">
        <div class="aspect-video relative overflow-hidden">
          <img :src="post.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button @click="openEditModal(post)" class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:scale-110 transition-transform">
              <LucideEdit :size="18" />
            </button>
            <button @click="confirmDelete(post)" class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-rose-500 shadow-xl hover:scale-110 transition-transform">
              <LucideTrash :size="18" />
            </button>
          </div>
          <div class="absolute top-4 right-4 flex gap-2">
            <span :class="post.isPublished ? 'bg-emerald-500' : 'bg-amber-500'" class="text-[8px] font-bold text-white tracking-widest px-2 py-1 rounded-md uppercase shadow-sm">
              {{ post.isPublished ? 'Live' : 'Draft' }}
            </span>
          </div>
        </div>
        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <p class="text-[8px] text-brand-gold tracking-[0.2em] font-bold uppercase">{{ new Date(post.createdAt).toLocaleDateString() }}</p>
            <h4 class="text-[13px] font-bold text-slate-900 tracking-widest line-clamp-2 leading-relaxed uppercase">{{ post.title }}</h4>
          </div>
          <div class="flex justify-between items-center pt-4 border-t border-slate-50">
            <span class="text-[10px] text-slate-400 tracking-widest font-bold uppercase italic">By {{ post.author }}</span>
          </div>
        </div>
      </div>
    </div>

    <UiAdminEmptyState 
      v-else 
      title="No Articles Composed" 
      message="Your editorial space is empty. Share your cake stories, baking tips, and trends with your audience."
      :icon="LucideEdit"
    />

    <!-- Blog Modal -->
    <UiModal v-if="showModal" @close="showModal = false" :title="isEditing ? 'Edit Article' : 'Compose Article'" size="xl">
      <form @submit.prevent="savePost" class="space-y-8 p-2">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Article Title</label>
              <input v-model="form.title" type="text" required class="admin-input text-lg font-bold" placeholder="Enter headline..." />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Artisanal Content</label>
              <UiRichEditor v-model="form.content" placeholder="Compose your editorial narrative..." />
            </div>
          </div>

          <!-- Sidebar Settings -->
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Featured Image</label>
              <div class="relative group">
                <div class="aspect-video bg-slate-50 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center">
                  <img v-if="form.image" :src="form.image" class="w-full h-full object-cover" />
                  <div v-else class="text-center space-y-1">
                    <LucideUpload class="mx-auto text-slate-300" :size="24" />
                    <p class="text-[8px] text-slate-400 tracking-widest uppercase">Upload Image</p>
                  </div>
                </div>
                <input type="file" @change="handleFileUpload" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Author Name</label>
              <input v-model="form.author" type="text" required class="admin-input" placeholder="e.g. Head Chef" />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Category Tag</label>
              <input v-model="form.category" type="text" class="admin-input" placeholder="e.g. Trends" />
            </div>

            <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
               <input v-model="form.isPublished" type="checkbox" class="w-4 h-4 accent-brand-gold" />
               <span class="text-[10px] font-bold tracking-widest text-slate-900 uppercase">Publish Article</span>
            </div>
          </div>
        </div>

        <button type="submit" :disabled="isSaving" class="w-full bg-slate-900 text-white py-5 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-brand-gold transition-all disabled:opacity-50 shadow-xl">
          {{ isSaving ? 'Processing...' : 'Confirm Editorial' }}
        </button>
      </form>
    </UiModal>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :is-open="isDeleteModalOpen"
      title="Delete Article"
      :message="`Are you sure you want to permanently delete '${postToDelete?.title}'?`"
      confirm-text="Delete Forever"
      @confirm="executeDelete"
      @close="isDeleteModalOpen = false"
      type="danger"
    />
  </div>
</template>

<script setup>
import { LucidePlus, LucideEdit, LucideTrash, LucideUpload } from 'lucide-vue-next';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
const { fetchAdmin, postAdmin, patchAdmin, deleteAdmin, uploadImage } = useAdminApi();
const { success: toastSuccess, error: toastError } = useToast();

const posts = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const isDeleteModalOpen = ref(false);
const postToDelete = ref(null);

const form = ref({
  title: '',
  content: '',
  image: '',
  author: 'Adaobi Admin',
  category: 'News',
  isPublished: false
});

const loadPosts = async () => {
  try {
    posts.value = await fetchAdmin('/blog');
  } catch (e) {
    toastError('Failed to load articles');
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  form.value = { title: '', content: '', image: '', author: 'Adaobi Admin', category: 'News', isPublished: false };
  showModal.value = true;
};

const openEditModal = (post) => {
  isEditing.value = true;
  form.value = { ...post };
  showModal.value = true;
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  isSaving.value = true;
  try {
    const res = await uploadImage(file);
    form.value.image = res.url;
    toastSuccess('Cover image uploaded');
  } catch (e) {
    toastError('Upload failed');
  } finally {
    isSaving.value = false;
  }
};

const savePost = async () => {
  isSaving.value = true;
  try {
    if (isEditing.value) {
      await patchAdmin(`/blog/${form.value._id}`, form.value);
      toastSuccess('Article updated');
    } else {
      await postAdmin('/blog', form.value);
      toastSuccess('Article published');
    }
    showModal.value = false;
    loadPosts();
  } catch (e) {
    toastError('Failed to save article');
  } finally {
    isSaving.value = false;
  }
};

const confirmDelete = (post) => {
  postToDelete.value = post;
  isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
  try {
    await deleteAdmin(`/blog/${postToDelete.value._id}`);
    toastSuccess('Article deleted');
    loadPosts();
  } catch (e) {
    toastError('Delete failed');
  } finally {
    isDeleteModalOpen = false;
  }
};

onMounted(loadPosts);

definePageMeta({ layout: 'default' });
</script>
