<template>
  <UiDrawer 
    :model-value="isOpen" 
    :title="isEditing ? 'Edit Cake Creation' : 'New Cake Creation'"
    subtitle="Provide all the exquisite details for your cake"
    @update:model-value="closeModal"
  >
    <!-- Form Body -->
    <form @submit.prevent="handleSubmit" class="space-y-10">
      <!-- Basic Info Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div class="space-y-6">
          <label class="block space-y-1.5">
            <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Cake Name</span>
            <input v-model="form.name" type="text" required placeholder="e.g., Velvet Rose Tier" class="w-full admin-input" />
          </label>
          <div class="grid grid-cols-2 gap-6">
            <label class="block space-y-1.5">
              <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Base Price (₦)</span>
              <input v-model.number="form.price" type="number" required placeholder="0.00" class="w-full admin-input" />
            </label>
            <label class="block space-y-1.5">
              <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Stock</span>
              <input v-model.number="form.stock" type="number" required placeholder="10" class="w-full admin-input" />
            </label>
          </div>
          <div class="space-y-1.5">
            <UiSelect 
              v-model="form.category" 
              label="Category"
              :options="categories"
              placeholder="Select Category"
            />
          </div>
        </div>
        
        <div class="space-y-6">
          <label class="block space-y-1.5">
            <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Description</span>
            <textarea v-model="form.description" rows="7" required class="w-full resize-none admin-input" placeholder="Describe the flavors, texture, and inspiration..."></textarea>
          </label>
        </div>
      </div>

      <!-- Customization Options -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Flavors -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Available Flavors</span>
            <button type="button" @click="addFlavor" class="text-[10px] font-bold text-brand-gold tracking-widest hover:underline uppercase">+ Add</button>
          </div>
          <div class="flex flex-wrap gap-2">
            <div v-for="(flavor, idx) in form.flavors" :key="idx" class="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-lg px-3 py-1.5">
              <input v-model="form.flavors[idx]" class="bg-transparent border-none p-0 text-[11px] font-bold focus:ring-0 w-24 text-slate-700" />
              <button @click="removeFlavor(idx)" type="button" class="text-slate-300 hover:text-rose-500 transition-colors"><LucideX :size="12" /></button>
            </div>
          </div>
        </div>

        <!-- Availability -->
        <div class="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-200/60">
          <span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Order Availability</span>
          <div class="flex gap-8">
            <label class="flex items-center gap-3 cursor-pointer group">
              <input type="radio" value="NOW" v-model="form.availabilityType" class="w-4 h-4 text-brand-gold focus:ring-brand-gold border-slate-300" />
              <span class="text-[10px] font-bold tracking-widest text-slate-600 group-hover:text-brand-gold uppercase">Available Now</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer group">
              <input type="radio" value="PREORDER" v-model="form.availabilityType" class="w-4 h-4 text-brand-gold focus:ring-brand-gold border-slate-300" />
              <span class="text-[10px] font-bold tracking-widest text-slate-600 group-hover:text-brand-gold uppercase">Pre-order Only</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Sizes -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Size Variations</span>
          <button type="button" @click="addSize" class="text-[10px] font-bold text-brand-gold tracking-widest hover:underline uppercase">+ Add Size</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div v-for="(size, idx) in form.sizes" :key="idx" class="p-5 border border-slate-200/60 rounded-xl bg-slate-50/30 space-y-4 relative group hover:border-slate-300 transition-all">
            <button @click="removeSize(idx)" type="button" class="absolute top-3 right-3 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><LucideTrash :size="14" /></button>
            <div class="space-y-1">
              <span class="text-[8px] font-bold text-slate-400 tracking-widest uppercase">Label</span>
              <input v-model="size.name" class="w-full !bg-white admin-input" placeholder="e.g., 8 inch" />
            </div>
            <div class="space-y-1">
              <span class="text-[8px] font-bold text-slate-400 tracking-widest uppercase">Add-on Price (₦)</span>
              <input v-model.number="size.priceOffset" type="number" class="w-full !bg-white admin-input" placeholder="Extra Cost" />
            </div>
          </div>
        </div>
      </div>

      <!-- Image Upload -->
      <div class="space-y-4">
        <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Product Gallery</span>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
          <div v-for="(img, idx) in form.images" :key="idx" class="aspect-square bg-slate-50 rounded-xl border border-slate-200/60 relative group overflow-hidden">
            <img :src="img" class="w-full h-full object-cover" />
            <button @click="removeImage(idx)" type="button" class="absolute inset-0 bg-slate-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
              <div class="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <LucideTrash :size="18" />
              </div>
            </button>
          </div>
          <button type="button" @click="triggerUpload" class="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-brand-gold hover:text-brand-gold transition-all bg-slate-50/30 hover:bg-brand-gold/5 group">
            <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
              <LucideImagePlus :size="20" />
            </div>
            <span class="text-[9px] font-bold tracking-widest uppercase">Add Image</span>
          </button>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-4">
        <button @click="closeModal" class="px-6 py-2.5 text-[10px] font-bold tracking-widest text-slate-400 hover:text-slate-600 uppercase transition-colors">Cancel</button>
        <button @click="handleSubmit" :disabled="loading" class="bg-brand-gold text-white px-10 py-2.5 rounded-lg text-[10px] font-bold tracking-widest uppercase hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg shadow-brand-gold/20 disabled:opacity-50 active:scale-95">
          <LucideLoader2 v-if="loading" class="animate-spin" :size="14" />
          {{ isEditing ? 'Save Changes' : 'Create Cake' }}
        </button>
      </div>
    </template>
  </UiDrawer>
</template>

<script setup>
import { 
  TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle 
} from '@headlessui/vue';
import { 
  LucideX, LucidePlus, LucideTrash, LucideImagePlus, LucideLoader2 
} from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  product: Object
});

const emit = defineEmits(['close', 'saved']);

const { uploadImage } = useCloudinary();
const { postAdmin, patchAdmin } = useAdminApi();

const loading = ref(false);
const isEditing = computed(() => !!props.product?._id);

const categories = ['Birthday', 'Wedding', 'Cupcakes', 'Brownies', 'Cheesecake', 'Occasion'];

const form = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  images: [],
  flavors: ['Vanilla', 'Chocolate', 'Red Velvet'],
  tags: ['Best Seller'],
  sizes: [
    { name: '6 inch', priceOffset: 0 },
    { name: '8 inch', priceOffset: 5000 },
    { name: '10 inch', priceOffset: 10000 }
  ],
  fillings: [],
  availabilityType: 'NOW'
});

watch(() => props.product, (newVal) => {
  if (newVal) {
    form.value = { 
      ...newVal,
      availabilityType: newVal.availabilityType || 'NOW'
    };
  } else {
    resetForm();
  }
}, { immediate: true });

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    price: 0,
    stock: 10,
    category: '',
    images: [],
    flavors: ['Vanilla', 'Chocolate', 'Red Velvet'],
    tags: ['New Arrival'],
    sizes: [{ name: '6 inch', priceOffset: 0 }],
    fillings: [],
    availabilityType: 'NOW'
  };
};

const closeModal = () => emit('close');

const addFlavor = () => form.value.flavors.push('');
const removeFlavor = (idx) => form.value.flavors.splice(idx, 1);

const addTag = () => form.value.tags.push('');
const removeTag = (idx) => form.value.tags.splice(idx, 1);

const addSize = () => form.value.sizes.push({ name: '', priceOffset: 0 });
const removeSize = (idx) => form.value.sizes.splice(idx, 1);

const removeImage = (idx) => form.value.images.splice(idx, 1);

const triggerUpload = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      loading.value = true;
      try {
        const url = await uploadImage(file);
        form.value.images.push(url);
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        loading.value = false;
      }
    }
  };
  input.click();
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (isEditing.value) {
      await patchAdmin(`/products/${props.product._id}`, form.value);
    } else {
      await postAdmin('/products', form.value);
    }
    emit('saved');
    closeModal();
  } catch (err) {
    console.error('Submission failed:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-slate-200 rounded-full hover:bg-slate-300;
}
</style>
