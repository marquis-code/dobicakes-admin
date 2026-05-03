<template>
  <UiDrawer 
    :model-value="isOpen" 
    :title="isEditing ? 'Edit Cake Creation' : 'New Cake Creation'"
    subtitle="Provide all the exquisite details for your cake"
    @update:model-value="closeModal"
  >
    <!-- Form Body -->
    <form @submit.prevent="handleSubmit" class="space-y-12">
      <!-- Section: Basic Identification -->
      <div class="space-y-8">
        <div class="pb-4 border-b border-slate-100">
          <h4 class="text-sm font-bold text-slate-900 tracking-tight">Basic identification</h4>
          <p class="text-tiny text-slate-400 font-medium mt-1">Core details that identify this artisanal creation</p>
        </div>
        
        <div class="space-y-6">
          <label class="block space-y-2">
            <span class="text-xs font-bold tracking-tight text-slate-500">Cake name</span>
            <input v-model="form.name" type="text" required placeholder="e.g., Velvet Rose Tier" class="w-full admin-input" />
          </label>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <label class="block space-y-2">
              <span class="text-xs font-bold tracking-tight text-slate-500">Base price (₦)</span>
              <input v-model.number="form.price" type="number" required placeholder="0.00" class="w-full admin-input" />
            </label>
            <label class="block space-y-2">
              <span class="text-xs font-bold tracking-tight text-slate-500">Stock units</span>
              <input v-model.number="form.stock" type="number" required placeholder="10" class="w-full admin-input" />
            </label>
          </div>

          <div class="space-y-2">
            <UiSelect 
              v-model="form.category" 
              label="Category"
              :options="categories"
              placeholder="Select Category"
            />
          </div>

          <label class="block space-y-2">
            <span class="text-xs font-bold tracking-tight text-slate-500">Artisanal description</span>
            <textarea v-model="form.description" rows="5" required class="w-full resize-none admin-input" placeholder="Describe the flavors, texture, and inspiration..."></textarea>
          </label>
        </div>
      </div>

      <!-- Section: Customization & Status -->
      <div class="space-y-8">
        <div class="pb-4 border-b border-slate-100">
          <h4 class="text-sm font-bold text-slate-900 tracking-tight">Customization & availability</h4>
          <p class="text-tiny text-slate-400 font-medium mt-1">Define how customers can personalize this creation</p>
        </div>

        <div class="space-y-8">
          <!-- Flavors -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold tracking-tight text-slate-500">Available flavors</span>
              <button type="button" @click="addFlavor" class="text-sm font-bold text-brand-gold tracking-tight hover:underline">+ Add</button>
            </div>
            <div class="flex flex-wrap gap-2">
              <div v-for="(flavor, idx) in form.flavors" :key="idx" class="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 transition-all hover:border-brand-gold/30">
                <input v-model="form.flavors[idx]" class="bg-transparent border-none p-0 text-xs font-bold focus:ring-0 w-28 text-slate-700" />
                <button @click="removeFlavor(idx)" type="button" class="text-slate-400 hover:text-rose-500 transition-colors"><LucideX :size="14" /></button>
              </div>
            </div>
          </div>

          <!-- Availability -->
          <div class="p-6 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 space-y-4">
            <span class="text-xs font-bold tracking-tight text-slate-500">Order availability mode</span>
            <div class="flex gap-10">
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" value="NOW" v-model="form.availabilityType" class="w-4 h-4 text-brand-gold focus:ring-brand-gold border-slate-300" />
                <span class="text-sm font-bold tracking-tight text-slate-600 group-hover:text-brand-gold transition-colors">Available now</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" value="PREORDER" v-model="form.availabilityType" class="w-4 h-4 text-brand-gold focus:ring-brand-gold border-slate-300" />
                <span class="text-sm font-bold tracking-tight text-slate-600 group-hover:text-brand-gold transition-colors">Pre-order only</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Size Variations -->
      <div class="space-y-8">
        <div class="pb-4 border-b border-slate-100 flex justify-between items-end">
          <div class="flex flex-col">
            <h4 class="text-sm font-bold text-slate-900 tracking-tight">Size variations</h4>
            <p class="text-tiny text-slate-400 font-medium mt-1">Configure dimensions and their respective price offsets</p>
          </div>
          <button type="button" @click="addSize" class="text-sm font-bold text-brand-gold tracking-tight hover:underline">+ Add size</button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(size, idx) in form.sizes" :key="idx" class="p-6 border border-slate-100 rounded-3xl bg-white space-y-5 relative group hover:border-brand-gold/20 transition-all shadow-sm">
            <button @click="removeSize(idx)" type="button" class="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><LucideTrash :size="16" /></button>
            <div class="space-y-2">
              <span class="text-tiny font-bold text-slate-400 tracking-tight">Label</span>
              <input v-model="size.name" class="w-full !bg-slate-50/50 admin-input" placeholder="e.g., 8 inch" />
            </div>
            <div class="space-y-2">
              <span class="text-tiny font-bold text-slate-400 tracking-tight">Add-on price (₦)</span>
              <input v-model.number="size.priceOffset" type="number" class="w-full !bg-slate-50/50 admin-input" placeholder="Extra cost" />
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Media Assets -->
      <div class="space-y-8">
        <div class="pb-4 border-b border-slate-100">
          <h4 class="text-sm font-bold text-slate-900 tracking-tight">Product gallery</h4>
          <p class="text-tiny text-slate-400 font-medium mt-1">High-quality visual representation of your creation</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="(img, idx) in form.images" :key="idx" class="aspect-square bg-slate-50 rounded-2xl border border-slate-100 relative group overflow-hidden">
            <img :src="img" class="w-full h-full object-cover" />
            <button @click="removeImage(idx)" type="button" class="absolute inset-0 bg-slate-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
              <div class="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <LucideTrash :size="18" />
              </div>
            </button>
          </div>
          <button type="button" @click="triggerUpload" class="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-brand-gold hover:text-brand-gold transition-all bg-slate-50/30 hover:bg-brand-gold/5 group">
            <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
              <LucideImagePlus :size="20" />
            </div>
            <span class="text-tiny font-bold tracking-tight">Add image</span>
          </button>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-4">
        <button @click="closeModal" class="px-6 py-2.5 text-sm font-bold tracking-tight text-slate-400 hover:text-slate-600  transition-colors">Cancel</button>
        <button @click="handleSubmit" :disabled="loading" class="bg-brand-gold text-white px-10 py-2.5 rounded-lg text-sm font-bold tracking-tight  hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg shadow-brand-gold/20 disabled:opacity-50 active:scale-95">
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
const { fetchAdmin, postAdmin, patchAdmin } = useAdminApi();

const loading = ref(false);
const isEditing = computed(() => !!props.product?._id);

const categories = ref([]);
const loadCategories = async () => {
  try {
    const response = await fetchAdmin('/categories');
    categories.value = response.map(c => ({ label: c.name, value: c.name }));
  } catch (e) {
    categories.value = [];
  }
};

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

watch(() => props.isOpen, (newVal) => {
  if (newVal) loadCategories();
}, { immediate: true });

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
