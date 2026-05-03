<template>
 <div class="space-y-8 animate-fade-in">
 <div class="flex justify-between items-center">
 <div>
 <h3 class="text-xl font-bold text-slate-900 tracking-tight">Blog & editorial</h3>
 <p class="text-sm text-gray-800 tracking-tight ">Website articles & updates</p>
 </div>
 <button @click="openCreateModal" class="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-medium tracking-tight hover:bg-brand-gold transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
 <LucidePlus :size="16" />
 New Article
 </button>
 </div>

 <!-- Blog Table -->
 <div v-if="posts.length > 0" class="bg-white rounded-[2rem] border border-slate-200 overflow-hidden">
 <div class="overflow-x-auto">
 <table class="w-full text-left border-collapse">
 <thead>
 <tr class="bg-slate-50/50 border-b border-slate-100">
 <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Article</th>
 <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Author & Category</th>
 <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
 <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Engagement</th>
 <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
 <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-slate-50">
 <tr v-for="post in posts" :key="post._id" class="hover:bg-slate-50/30 transition-colors group">
 <td class="px-8 py-6">
 <div class="flex items-center gap-4">
 <div class="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-100">
 <img :src="post.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=200'" class="w-full h-full object-cover" />
 </div>
 <span class="text-sm font-bd text-slate-900 line-clamp-2 max-w-[200px]">{{ post.title }}</span>
 </div>
 </td>
 <td class="px-8 py-6">
 <div class="flex flex-col">
 <span class="text-sm font-semibold text-slate-900">{{ post.author }}</span>
 <span class="text-xs text-slate-400 font-medium">{{ post.category }}</span>
 </div>
 </td>
 <td class="px-8 py-6">
 <span :class="post.isPublished ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'" 
 class="text-[10px] font-semibold px-2 py-1 rounded-lg border uppercase tracking-tighter">
 {{ post.isPublished ? 'Live' : 'Draft' }}
 </span>
 </td>
 <td class="px-8 py-6">
 <div class="flex items-center gap-4">
 <div class="flex items-center gap-1.5 text-slate-400" :title="'Likes: ' + (post.likes || 0)">
 <LucideHeart :size="14" :class="{ 'text-rose-500 fill-current': post.likes > 0 }" />
 <span class="text-xs font-semibold">{{ post.likes || 0 }}</span>
 </div>
 <div class="flex items-center gap-1.5 text-slate-400" :title="'Comments: ' + (post.commentCount || 0)">
 <LucideMessageSquare :size="14" class="text-sky-500" />
 <span class="text-xs font-semibold">{{ post.commentCount || 0 }}</span>
 </div>
 </div>
 </td>
 <td class="px-8 py-6 text-sm font-semibold text-slate-900">
 {{ new Date(post.createdAt).toLocaleDateString() }}
 </td>
 <td class="px-8 py-6 text-right">
 <div class="flex justify-end gap-3">
 <button @click="copyShareLink(post)" class="p-2 bg-white text-slate-400 hover:text-brand-gold rounded-lg border border-slate-200 transition-colors" title="Copy Link">
 <LucideLink :size="14" />
 </button>
 <button @click="openEditModal(post)" class="p-2 bg-white text-slate-400 hover:text-slate-900 rounded-lg border border-slate-200 transition-colors" title="Edit Article">
 <LucideEdit :size="14" />
 </button>
 <button @click="confirmDelete(post)" class="p-2 bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg border border-rose-100 transition-colors" title="Delete Article">
 <LucideTrash :size="14" />
 </button>
 </div>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>

 <UiAdminEmptyState 
 v-else 
 title="No Articles Composed" 
 message="Your editorial space is empty. Share your cake stories, baking tips, and trends with your audience."
 :icon="LucideEdit"
 />

 <!-- Blog Drawer -->
 <UiDrawer 
 :model-value="showModal" 
 :title="isEditing ? 'Edit Article' : 'Compose Article'" 
 subtitle="Crafting artisanal narratives for your audience"
 @update:model-value="showModal = false"
 >
 <div class="flex flex-col h-full">
 <!-- Tabs -->
 <div class="flex border-b border-slate-100 mb-8">
 <button @click="activeTab = 'content'" :class="activeTab === 'content' ? 'border-brand-gold text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'" class="px-6 py-4 text-sm font-bold border-b-2 transition-all">Article Content</button>
 <button v-if="isEditing" @click="activeTab = 'engagement'" :class="activeTab === 'engagement' ? 'border-brand-gold text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'" class="px-6 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2">
 Engagement
 <span class="px-2 py-0.5 bg-slate-100 rounded-full text-tiny">{{ comments.length }}</span>
 </button>
 </div>

 <div v-show="activeTab === 'content'" class="space-y-10 py-2">
 <form @submit.prevent="savePost" class="space-y-10">
 <div class="flex flex-col gap-8">
 <!-- Main Content -->
 <div class="space-y-8">
 <div class="space-y-2.5">
 <label class="admin-label">Article Headline</label>
 <input v-model="form.title" type="text" required class="w-full text-xl font-bold border-none bg-slate-50/50 p-6 rounded-2xl focus:ring-1 focus:ring-brand-gold/20 outline-none" placeholder="Enter an evocative title..." />
 </div>
 
 <div class="space-y-2.5">
 <label class="admin-label">Artisanal Content</label>
 <UiRichEditor v-model="form.content" placeholder="Compose your editorial narrative..." />
 </div>
 </div>

 <!-- Settings Grid -->
 <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
 <div class="space-y-6">
 <div class="space-y-2.5">
 <label class="admin-label">Featured Cover</label>
 <div class="relative group aspect-video rounded-[2rem] overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 hover:border-brand-gold/50 transition-all cursor-pointer">
 <img v-if="form.image" :src="form.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
 <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-3">
 <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
 <LucideUpload class="text-slate-900" :size="24" />
 </div>
 <p class="text-tiny font-bold text-slate-400 tracking-tight">Select Cover</p>
 </div>
 <input type="file" @change="handleFileUpload" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
 </div>
 </div>
 </div>

 <div class="space-y-6">
 <div class="space-y-2.5">
 <label class="admin-label">Editorial Context</label>
 <div class="space-y-4">
 <div class="relative">
 <LucideUsers class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" :size="16" />
 <input v-model="form.author" type="text" required class="admin-input !pl-12 w-full" placeholder="Author Name" />
 </div>
 <div class="relative">
 <LucideTag class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" :size="16" />
 <input v-model="form.category" type="text" class="admin-input !pl-12 w-full" placeholder="Category (e.g. Trends)" />
 </div>
 </div>
 </div>

 <div class="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between group">
 <div class="flex flex-col">
 <span class="text-sm font-bold text-slate-900">Publish to Live</span>
 <p class="text-tiny text-slate-500 font-medium">Make this article visible to customers</p>
 </div>
 <label class="relative inline-flex items-center cursor-pointer">
 <input v-model="form.isPublished" type="checkbox" class="sr-only peer">
 <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
 </label>
 </div>
 </div>
 </div>
 </div>
 </form>
 </div>

 <!-- Engagement Tab -->
 <div v-show="activeTab === 'engagement'" class="space-y-10 py-2">
 <!-- Summary Stats -->
 <div class="grid grid-cols-2 gap-6">
 <div class="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center space-y-2">
 <p class="text-tiny font-bold text-slate-400 uppercase">Total Likes</p>
 <p class="text-3xl text-slate-900">{{ form.likes || 0 }}</p>
 </div>
 <div class="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center space-y-2">
 <p class="text-tiny font-bold text-slate-400 uppercase">Total Comments</p>
 <p class="text-3xl text-slate-900">{{ comments.length }}</p>
 </div>
 </div>

 <!-- Admin Reply Section -->
 <div class="space-y-6">
 <h4 class="text-sm font-bold text-slate-900 tracking-tight">Contribute to the conversation</h4>
 <div class="bg-white border border-slate-200 rounded-[2rem] p-6 space-y-4 shadow-sm">
 <textarea v-model="adminComment" placeholder="Share an administrative perspective or reply to the community..." class="w-full bg-slate-50 border-none rounded-xl p-6 text-sm font-medium outline-none focus:ring-1 focus:ring-brand-gold/20 transition-all resize-none" rows="3"></textarea>
 <div class="flex justify-end">
 <button @click="postAdminComment" :disabled="!adminComment || isSaving" class="bg-brand-charcoal text-white px-8 py-3 rounded-full text-sm font-bold tracking-tight hover:bg-brand-gold transition-all disabled:opacity-50">
 <LucideSend :size="16" class="inline-block mr-2" />
 Post as Admin
 </button>
 </div>
 </div>
 </div>

 <!-- Comments List -->
 <div class="space-y-6">
 <h4 class="text-sm font-bold text-slate-900 tracking-tight">Recent Comments</h4>
 <div v-if="comments.length > 0" class="space-y-4">
 <div v-for="comment in comments" :key="comment._id" class="p-6 bg-white border border-slate-100 rounded-2xl space-y-3 group">
 <div class="flex justify-between items-center">
 <div class="flex items-center gap-3">
 <div class="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-400">{{ comment.authorName[0] }}</div>
 <span class="text-sm font-bold text-slate-900">{{ comment.authorName }}</span>
 </div>
 <span class="text-tiny text-slate-400 font-medium">{{ new Date(comment.createdAt).toLocaleDateString() }}</span>
 </div>
 <p class="text-sm text-slate-600 leading-relaxed">{{ comment.content }}</p>
 <div class="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
 <button @click="deleteComment(comment._id)" class="text-rose-500 hover:text-rose-600 p-1">
 <LucideTrash :size="14" />
 </button>
 </div>
 </div>
 </div>
 <div v-else class="text-center py-12 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
 <p class="text-sm text-slate-400 font-medium italic">No comments yet. Be the first to start the conversation.</p>
 </div>
 </div>
 </div>
 </div>

 <template #footer>
 <div v-if="activeTab === 'content'" class="flex justify-end gap-5">
 <button @click="showModal = false" class="px-8 py-3.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
 <button @click="savePost" :disabled="isSaving" class="btn-admin-primary px-12 py-3.5">
 <LucideLoader2 v-if="isSaving" class="animate-spin mr-2" :size="18" />
 {{ isEditing ? 'Update Article' : 'Publish Article' }}
 </button>
 </div>
 </template>
 </UiDrawer>

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
import { 
 LucidePlus, LucideEdit, LucideTrash, LucideUpload, LucideLink, 
 LucideUsers, LucideTag, LucideLoader2, LucideHeart, LucideMessageSquare,
 LucideSend
} from 'lucide-vue-next';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
const { fetchAdmin, postAdmin, patchAdmin, deleteAdmin, uploadImage } = useAdminApi();
const { success: toastSuccess, error: toastError } = useToast();

const WEBSITE_URL = 'http://localhost:3000';

const copyShareLink = (post) => {
 if (!post.slug) {
 toastError('Article needs a slug before it can be shared');
 return;
 }
 const url = `${WEBSITE_URL}/blog/${post.slug}`;
 navigator.clipboard.writeText(url);
 toastSuccess('Shareable link copied to clipboard');
};

const posts = ref([]);
const comments = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const isDeleteModalOpen = ref(false);
const postToDelete = ref(null);
const activeTab = ref('content');
const adminComment = ref('');

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

const loadComments = async (postId) => {
 try {
 comments.value = await fetchAdmin(`/blog/${postId}/comments`);
 } catch (e) {
 console.error('Failed to load comments');
 }
};

const openCreateModal = () => {
 isEditing.value = false;
 activeTab.value = 'content';
 form.value = { title: '', content: '', image: '', author: 'Adaobi Admin', category: 'News', isPublished: false };
 showModal.value = true;
};

const openEditModal = async (post) => {
 isEditing.value = true;
 activeTab.value = 'content';
 form.value = { ...post };
 showModal.value = true;
 await loadComments(post._id);
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

const postAdminComment = async () => {
 if (!adminComment.value || !form.value._id) return;
 isSaving.value = true;
 try {
 await postAdmin(`/blog/${form.value._id}/comments`, {
 authorName: 'Adaobi (Admin)',
 content: adminComment.value
 });
 adminComment.value = '';
 await loadComments(form.value._id);
 toastSuccess('Administrative perspective shared');
 } catch (e) {
 toastError('Failed to post comment');
 } finally {
 isSaving.value = false;
 }
};

const deleteComment = async (commentId) => {
 try {
 // Assuming there's a delete comment endpoint, if not I'll just skip for now or use generic delete
 await deleteAdmin(`/blog/comments/${commentId}`);
 await loadComments(form.value._id);
 toastSuccess('Comment removed');
 } catch (e) {
 toastError('Failed to delete comment');
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
 isDeleteModalOpen.value = false;
 }
};

onMounted(loadPosts);

definePageMeta({ layout: 'default' });
</script>
