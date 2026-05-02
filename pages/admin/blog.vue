<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900  tracking-tight">Blog & Editorial</h3>
        <p class="text-[10px] text-gray-400  tracking-widest">Manage your website articles and updates</p>
      </div>
      <button @click="createNewPost" class="bg-brand-gold text-white px-6 py-2 rounded-sm text-xs font-bold  tracking-widest hover:bg-brand-gold-dark transition-colors flex items-center gap-2 shadow-sm">
        <LucidePlus :size="16" />
        New Article
      </button>
    </div>

    <!-- Blog Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="post in posts" :key="post._id" class="admin-card group hover:border-brand-gold transition-all duration-500 overflow-hidden !p-0">
        <div class="aspect-video bg-gray-50 overflow-hidden relative">
          <img :src="post.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div class="absolute top-4 right-4 flex gap-2">
            <span :class="post.isPublished ? 'bg-emerald-500' : 'bg-gray-400'" class="text-[8px] font-bold text-white  tracking-widest px-2 py-1 rounded-sm shadow-sm">
              {{ post.isPublished ? 'Live' : 'Draft' }}
            </span>
          </div>
        </div>
        <div class="p-6 space-y-4">
          <div class="space-y-1">
            <p class="text-[8px] text-brand-gold  tracking-[0.2em] font-bold">{{ new Date(post.createdAt).toLocaleDateString() }}</p>
            <h4 class="text-xs font-bold text-slate-900  tracking-widest line-clamp-2 leading-relaxed">{{ post.title }}</h4>
          </div>
            <div class="flex justify-between items-center pt-4 border-t border-gray-50">
            <span class="text-[9px] text-gray-400  tracking-widest font-medium">By {{ post.author }}</span>
            <div class="flex gap-4">
              <button class="text-gray-300 hover:text-brand-gold transition-colors"><LucideEdit :size="14" /></button>
              <button @click="confirmDelete(post)" class="text-gray-300 hover:text-rose-500 transition-colors"><LucideTrash :size="14" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :is-open="isDeleteModalOpen"
      title="Delete Article"
      :message="`Are you sure you want to delete the article '${postToDelete?.title}'? This action cannot be undone.`"
      confirm-text="Delete Article"
      cancel-text="Cancel"
      type="danger"
      :is-loading="isDeleting"
      @close="isDeleteModalOpen = false"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { LucidePlus, LucideEdit, LucideTrash } from 'lucide-vue-next';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
const { fetchAdmin, deleteAdmin } = useAdminApi();

const posts = ref([]);

// Delete Modal State
const isDeleteModalOpen = ref(false);
const postToDelete = ref(null);
const isDeleting = ref(false);

const loadPosts = async () => {
  posts.value = await fetchAdmin('/blog');
};

onMounted(() => {
  loadPosts();
});

const createNewPost = () => {
  // Logic to show post editor
};

const confirmDelete = (post) => {
  postToDelete.value = post;
  isDeleteModalOpen.value = true;
};

const executeDelete = async () => {
  if (!postToDelete.value) return;
  isDeleting.value = true;
  try {
    await deleteAdmin(`/blog/${postToDelete.value._id}`);
    await loadPosts();
  } finally {
    isDeleting.value = false;
    isDeleteModalOpen.value = false;
    postToDelete.value = null;
  }
};

definePageMeta({ layout: 'default' });
</script>
