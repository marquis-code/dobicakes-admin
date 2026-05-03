<template>
  <div class="space-y-12 animate-fade-in p-2">
    <!-- Header with Tabs -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="flex flex-col gap-1">
        <h3 class="text-2xl font-bold text-slate-900">Appointment Management</h3>
        <p class="text-sm text-slate-500 font-medium">Manage consultation products and customer bookings</p>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
          <button @click="activeTab = 'bookings'" :class="activeTab === 'bookings' ? 'bg-white text-slate-900 border border-slate-200' : 'text-slate-400'" class="px-8 py-2.5 rounded-xl text-xs font-bold transition-all">Bookings</button>
          <button @click="activeTab = 'products'" :class="activeTab === 'products' ? 'bg-white text-slate-900 border border-slate-200' : 'text-slate-400'" class="px-8 py-2.5 rounded-xl text-xs font-bold transition-all">Service Products</button>
        </div>
        <button v-if="activeTab === 'products'" @click="openCreateProduct" class="bg-slate-900 text-white px-8 py-3 rounded-xl text-xs font-bold hover:bg-brand-gold transition-all">New Service</button>
      </div>
    </div>

    <!-- BOOKINGS TABLE -->
    <div v-if="activeTab === 'bookings'" class="bg-white rounded-[2rem] border border-slate-200 overflow-hidden">
      <div v-if="loading" class="p-20 text-center space-y-4">
        <LucideLoader2 class="animate-spin mx-auto text-brand-gold" :size="32" />
        <p class="text-sm text-slate-400 font-medium">Synchronizing bookings...</p>
      </div>
      <div v-else-if="appointments.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100">
              <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
              <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
              <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</th>
              <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Investment</th>
              <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment</th>
              <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="appt in appointments" :key="appt._id" class="hover:bg-slate-50/30 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-slate-900">{{ appt.customerName }}</span>
                  <span class="text-xs text-slate-400 font-medium">{{ appt.customerEmail }}</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-slate-900">{{ new Date(appt.scheduledAt).toLocaleDateString() }}</span>
                  <span class="text-xs text-slate-400 font-medium">{{ new Date(appt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
                </div>
              </td>
              <td class="px-8 py-6 text-sm font-bold text-slate-900">{{ appt.duration }} min</td>
              <td class="px-8 py-6 text-sm font-bold text-slate-900">₦{{ appt.price?.toLocaleString() }}</td>
              <td class="px-8 py-6">
                <span :class="appt.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'" class="text-[10px] font-bold uppercase tracking-tight flex items-center gap-1.5">
                  <div class="w-1.5 h-1.5 rounded-full" :class="appt.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'"></div>
                  {{ appt.paymentStatus }}
                </span>
              </td>
              <td class="px-8 py-6">
                <span :class="getStatusClass(appt.status)" class="text-[10px] font-bold px-2 py-1 rounded-lg border uppercase tracking-tighter">
                  {{ appt.status }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a v-if="appt.googleMeetLink" :href="appt.googleMeetLink" target="_blank" class="p-2 bg-slate-900 text-white rounded-lg hover:bg-brand-gold transition-colors" title="Join Meeting">
                    <LucideVideo :size="14" />
                  </a>
                  <button @click="selectedAppointment = appt" class="p-2 bg-slate-100 text-slate-400 hover:text-slate-900 rounded-lg border border-slate-200 transition-colors" title="View Details">
                    <LucideEye :size="14" />
                  </button>
                  <button v-if="appt.status !== 'cancelled'" @click="updateStatus(appt._id, 'cancelled')" class="p-2 bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg border border-rose-100 transition-colors" title="Cancel Booking">
                    <LucideX :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-32 text-center space-y-6">
        <div class="w-20 h-20 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-center mx-auto mb-4">
          <LucideCalendar :size="32" class="text-slate-200" />
        </div>
        <p class="text-sm text-slate-400 font-bold">Zero Sessions Logged</p>
      </div>
    </div>

    <!-- PRODUCTS TABLE -->
    <div v-else class="bg-white rounded-[2rem] border border-slate-200 overflow-hidden">
      <div v-if="loading" class="p-20 text-center space-y-4">
        <LucideLoader2 class="animate-spin mx-auto text-brand-gold" :size="32" />
        <p class="text-sm text-slate-400 font-medium">Loading artisanal services...</p>
      </div>
      <div v-else-if="products.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-100">
              <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Title</th>
              <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Investment</th>
              <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</th>
              <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weekly Availability</th>
              <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Schedule</th>
              <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="product in products" :key="product._id" class="hover:bg-slate-50/30 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-slate-900">{{ product.title }}</span>
                  <span class="text-xs text-slate-400 font-medium line-clamp-1 max-w-xs">{{ product.description }}</span>
                </div>
              </td>
              <td class="px-8 py-6 text-sm font-bold text-slate-900">₦{{ product.price?.toLocaleString() }}</td>
              <td class="px-8 py-6 text-sm font-bold text-slate-900">{{ product.duration }} min</td>
              <td class="px-8 py-6">
                <div class="flex flex-wrap gap-1">
                  <span v-for="day in product.availability.days" :key="day" class="px-2 py-0.5 bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-400 rounded-md capitalize">
                    {{ day.slice(0,3) }}
                  </span>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
                  {{ product.availability.startTime }} - {{ product.availability.endTime }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="editProduct(product)" class="p-2 bg-white text-slate-400 hover:text-slate-900 rounded-lg border border-slate-200 transition-colors">
                    <LucideEdit3 :size="14" />
                  </button>
                  <button @click="deleteProduct(product._id)" class="p-2 bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg border border-rose-100 transition-colors">
                    <LucideTrash2 :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="p-32 text-center space-y-6">
        <div class="w-20 h-20 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-center mx-auto mb-4">
          <LucideTag :size="32" class="text-slate-200" />
        </div>
        <p class="text-sm text-slate-400 font-bold">No Artisanal Services Configured</p>
        <button @click="openCreateProduct" class="text-brand-gold text-xs font-bold hover:underline">Deploy First Service</button>
      </div>
    </div>

    <!-- Booking Details Drawer -->
    <UiDrawer 
      :model-value="!!selectedAppointment" 
      title="Booking Intelligence"
      subtitle="Full analytical details for this consultation session"
      @update:model-value="selectedAppointment = null"
    >
      <div v-if="selectedAppointment" class="space-y-12 py-6">
        <div class="space-y-6">
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <span class="text-xs font-bold text-brand-gold uppercase tracking-widest">Customer Identity</span>
              <h2 class="text-2xl font-bold text-slate-900">{{ selectedAppointment.customerName }}</h2>
            </div>
            <div :class="getStatusClass(selectedAppointment.status)" class="px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest">
              {{ selectedAppointment.status }}
            </div>
          </div>
          <div class="grid grid-cols-2 gap-8 pt-4">
            <div class="flex items-center gap-3 text-sm text-slate-500 font-bold">
              <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100"><LucideMail :size="16" /></div>
              {{ selectedAppointment.customerEmail }}
            </div>
            <div class="flex items-center gap-3 text-sm text-slate-500 font-bold">
              <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100"><LucidePhone :size="16" /></div>
              {{ selectedAppointment.customerPhone }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8 p-10 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
          <div class="space-y-2">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Temporal Node</p>
            <p class="text-sm font-bold text-slate-900">{{ new Date(selectedAppointment.scheduledAt).toLocaleDateString() }}</p>
            <p class="text-xs font-medium text-slate-500">{{ new Date(selectedAppointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
          </div>
          <div class="space-y-2">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
            <p class="text-sm font-bold text-slate-900">{{ selectedAppointment.duration }} Minutes</p>
          </div>
        </div>

        <div class="space-y-4">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Client Directives</p>
          <div class="p-8 bg-white rounded-3xl text-sm text-slate-600 leading-relaxed font-medium border border-slate-200 italic">
            "{{ selectedAppointment.notes || 'No additional notes provided.' }}"
          </div>
        </div>

        <div v-if="selectedAppointment.googleMeetLink" class="p-6 bg-slate-900 rounded-[2rem] flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white"><LucideVideo :size="18" /></div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Virtual Workspace</p>
              <p class="text-xs font-bold text-white truncate max-w-[200px]">Google Meet Session</p>
            </div>
          </div>
          <a :href="selectedAppointment.googleMeetLink" target="_blank" class="bg-brand-gold text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-transform active:scale-95">Launch Meet</a>
        </div>
      </div>
    </UiDrawer>

    <!-- Create/Edit Product Drawer -->
    <UiDrawer 
      :model-value="showProductDrawer" 
      :title="editingProduct ? 'Refine Service' : 'Design Consultation Service'"
      subtitle="Specify the financial and temporal parameters for this artisanal service."
      @update:model-value="showProductDrawer = false"
    >
      <div class="space-y-10 py-6">
        <div class="space-y-3">
          <label class="text-xs font-bold text-slate-400 ml-1">Service Title</label>
          <input v-model="productForm.title" class="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-brand-gold transition-all" placeholder="e.g. Wedding Cake Tasting" />
          <textarea v-model="productForm.description" rows="3" class="w-full bg-white border border-slate-200 rounded-2xl p-6 text-sm font-medium text-slate-600 outline-none focus:border-brand-gold transition-all resize-none" placeholder="Describe the consultation experience..."></textarea>
        </div>

        <div class="grid grid-cols-2 gap-8">
          <div class="space-y-3">
            <label class="text-xs font-bold text-slate-400 ml-1">Price (₦)</label>
            <input v-model="productForm.price" type="number" class="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-brand-gold transition-all" />
          </div>
          <div class="space-y-3">
            <label class="text-xs font-bold text-slate-400 ml-1">Duration (Minutes)</label>
            <input v-model="productForm.duration" type="number" class="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-brand-gold transition-all" />
          </div>
        </div>

        <div class="space-y-6">
          <label class="text-xs font-bold text-slate-400 ml-1">Weekly Availability</label>
          <div class="flex flex-wrap gap-2">
            <button v-for="day in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']" :key="day"
                    @click="toggleDay(day)"
                    :class="productForm.availability.days.includes(day) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200'"
                    class="px-5 py-2 rounded-xl text-xs font-bold border transition-all">
              {{ day.slice(0,3) }}
            </button>
          </div>
          <div class="grid grid-cols-2 gap-8 pt-2">
            <div class="space-y-2">
              <p class="text-xs font-bold text-slate-300 ml-1">Daily Start Time</p>
              <input v-model="productForm.availability.startTime" type="time" class="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-brand-gold" />
            </div>
            <div class="space-y-2">
              <p class="text-xs font-bold text-slate-300 ml-1">Daily End Time</p>
              <input v-model="productForm.availability.endTime" type="time" class="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-brand-gold" />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-4">
          <button @click="showProductDrawer = false" class="px-8 py-4 text-xs font-bold text-slate-400">Cancel</button>
          <button @click="saveProduct" :disabled="isSaving" class="bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-bold hover:bg-brand-gold transition-all shadow-none">
            {{ editingProduct ? 'Sync Changes' : 'Deploy Service' }}
          </button>
        </div>
      </template>
    </UiDrawer>
  </div>
</template>

<script setup>
import { 
  LucidePlus, LucideCalendar, LucideCheck, LucideClock, 
  LucideVideo, LucideMail, LucidePhone, LucideEdit3, 
  LucideTrash2, LucideTag, LucideX, LucideLoader2, LucideEye
} from 'lucide-vue-next';

const { fetchAdmin, postAdmin, patchAdmin, deleteAdmin } = useAdminApi();
const { success: toastSuccess, error: toastError } = useToast();

const activeTab = ref('bookings');
const appointments = ref([]);
const products = ref([]);
const loading = ref(true);
const selectedAppointment = ref(null);
const showProductDrawer = ref(false);
const editingProduct = ref(null);
const isSaving = ref(false);

const productForm = ref({
  title: '',
  description: '',
  price: 0,
  duration: 60,
  availability: {
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    startTime: '09:00',
    endTime: '17:00'
  }
});

const loadData = async () => {
  loading.value = true;
  try {
    const [apptRes, prodRes] = await Promise.all([
      fetchAdmin('/appointments'),
      fetchAdmin('/appointments/products')
    ]);
    appointments.value = apptRes;
    products.value = prodRes;
  } catch (e) {
    toastError('Failed to load appointment data');
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);

const openCreateProduct = () => {
  editingProduct.value = null;
  productForm.value = {
    title: '',
    description: '',
    price: 0,
    duration: 60,
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '09:00',
      endTime: '17:00'
    }
  };
  showProductDrawer.value = true;
};

const editProduct = (product) => {
  editingProduct.value = product._id;
  productForm.value = JSON.parse(JSON.stringify(product));
  showProductDrawer.value = true;
};

const saveProduct = async () => {
  isSaving.value = true;
  try {
    if (editingProduct.value) {
      await patchAdmin(`/appointments/products/${editingProduct.value}`, productForm.value);
      toastSuccess('Service updated successfully');
    } else {
      await postAdmin('/appointments/products', productForm.value);
      toastSuccess('New service created successfully');
    }
    await loadData();
    showProductDrawer.value = false;
  } catch (e) {
    toastError('Failed to save service');
  } finally {
    isSaving.value = false;
  }
};

const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this service?')) {
    try {
      await deleteAdmin(`/appointments/products/${id}`);
      toastSuccess('Service deleted');
      await loadData();
    } catch (e) {
      toastError('Failed to delete service');
    }
  }
};

const updateStatus = async (id, status) => {
  try {
    await patchAdmin(`/appointments/${id}/status`, { status });
    if (selectedAppointment.value) selectedAppointment.value.status = status;
    toastSuccess(`Appointment marked as ${status}`);
    await loadData();
  } catch (e) {
    toastError('Failed to update status');
  }
};

const toggleDay = (day) => {
  const index = productForm.value.availability.days.indexOf(day);
  if (index > -1) productForm.value.availability.days.splice(index, 1);
  else productForm.value.availability.days.push(day);
};

const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
    default: return 'bg-slate-50 text-slate-400 border-slate-100';
  }
};

definePageMeta({ layout: 'default' });
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
.animate-slide-up {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Aggressive shadow removal */
* {
  box-shadow: none !important;
}

input, textarea, select {
  border: 1px solid #e2e8f0 !important;
}

input:focus, textarea:focus, select:focus {
  border-color: #c5a059 !important;
}

table th {
  white-space: nowrap;
}
</style>
