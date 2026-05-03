<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900  tracking-tight">Appointment Management</h3>
        <p class="text-[10px] text-gray-400  tracking-widest">Track customer booking requests and consultations</p>
      </div>
      <button @click="showCreateModal = true" class="bg-brand-gold text-white px-6 py-2 rounded-sm text-xs font-bold  tracking-widest hover:bg-brand-gold-dark transition-all flex items-center gap-2">
        <LucidePlus :size="16" />
        New Slot
      </button>
    </div>

    <!-- Calendar-Style View -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Upcoming List -->
      <div class="lg:col-span-1 space-y-4">
        <h4 class="text-[10px] font-bold  tracking-widest text-slate-400 pb-2 border-b border-gray-100">Upcoming</h4>
        <div v-if="loading" class="space-y-4">
           <div v-for="i in 3" :key="i" class="admin-card !p-4 animate-pulse h-24 bg-slate-50/50 border-none"></div>
        </div>
        <template v-else-if="upcoming.length > 0">
          <div v-for="appt in upcoming" :key="appt._id"
               @click="selectedAppointment = appt"
               class="admin-card !p-4 cursor-pointer hover:border-brand-gold transition-all space-y-2"
               :class="selectedAppointment?._id === appt._id ? 'border-brand-gold bg-brand-gold/5' : ''">
            <div class="flex justify-between items-center">
              <p class="text-[10px] font-bold text-slate-900 tracking-widest uppercase">{{ appt.customerName }}</p>
              <span :class="getStatusClass(appt.status)" class="text-[8px] tracking-widest font-bold px-2 py-1 rounded-sm uppercase">{{ appt.status }}</span>
            </div>
            <p class="text-[9px] text-slate-400 tracking-widest">{{ new Date(appt.date).toLocaleDateString() }} • {{ appt.time }}</p>
            <div class="flex justify-between items-center pt-2">
              <p class="text-[9px] text-brand-gold tracking-widest font-bold uppercase">{{ appt.type }}</p>
              <span v-if="appt.paymentStatus === 'paid'" class="text-[7px] font-bold text-emerald-500 uppercase tracking-widest">Paid ✓</span>
            </div>
          </div>
        </template>
        <div v-else class="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
           <p class="text-[9px] text-slate-300 font-bold tracking-widest uppercase">No Upcoming Sessions</p>
        </div>
      </div>

      <!-- Details Panel -->
      <div class="lg:col-span-3">
        <div v-if="!selectedAppointment" class="admin-card h-96 flex flex-col items-center justify-center text-center text-slate-300 space-y-6 border-dashed border-2 bg-slate-50/30">
          <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
            <LucideCalendar :size="32" class="opacity-20" />
          </div>
          <div class="space-y-1">
            <p class="text-[10px] tracking-[0.3em] font-bold uppercase text-slate-400">Calendar Hub</p>
            <p class="text-[9px] tracking-widest text-slate-300">Select an appointment to manage the schedule</p>
          </div>
        </div>

        <div v-else class="admin-card space-y-10 animate-fade-in relative">
          <div v-if="selectedAppointment.googleCalendarEventId" class="absolute top-0 right-0 p-4">
             <div class="flex items-center gap-2 text-[8px] font-bold text-emerald-500 tracking-widest uppercase bg-emerald-50 px-3 py-1.5 rounded-bl-xl border-b border-l border-emerald-100">
               <LucideCheck :size="10" /> Sync'd to Google Calendar
             </div>
          </div>

          <div class="flex justify-between items-start">
            <div class="space-y-3">
              <h2 class="text-2xl font-bold text-slate-900 tracking-tight">{{ selectedAppointment.customerName }}</h2>
              <div class="flex gap-4">
                <p class="text-[10px] text-slate-400 tracking-widest uppercase flex items-center gap-2"><LucideClock :size="10" /> {{ selectedAppointment.customerEmail }}</p>
                <p class="text-[10px] text-slate-400 tracking-widest uppercase">{{ selectedAppointment.customerPhone }}</p>
              </div>
            </div>
            <span :class="getStatusClass(selectedAppointment.status)" class="text-[10px] font-bold tracking-widest px-4 py-2 rounded-lg uppercase shadow-sm">
              {{ selectedAppointment.status }}
            </span>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-10 py-10 border-y border-slate-50">
            <div class="space-y-2">
              <p class="text-[8px] text-slate-400 tracking-widest font-bold uppercase">Booking Date</p>
              <p class="text-xs font-bold text-slate-900">{{ new Date(selectedAppointment.date).toLocaleDateString() }}</p>
            </div>
            <div class="space-y-2">
              <p class="text-[8px] text-slate-400 tracking-widest font-bold uppercase">Time Slot</p>
              <p class="text-xs font-bold text-slate-900">{{ selectedAppointment.time }}</p>
            </div>
            <div class="space-y-2">
              <p class="text-[8px] text-slate-400 tracking-widest font-bold uppercase">Service Type</p>
              <p class="text-xs font-bold text-brand-gold">{{ selectedAppointment.type }}</p>
            </div>
            <div class="space-y-2">
              <p class="text-[8px] text-slate-400 tracking-widest font-bold uppercase">Fee Status</p>
              <div class="flex flex-col">
                <p class="text-xs font-bold text-slate-900">₦{{ selectedAppointment.price?.toLocaleString() }}</p>
                <span class="text-[8px] font-bold tracking-widest uppercase" :class="selectedAppointment.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'">{{ selectedAppointment.paymentStatus }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <p class="text-[8px] text-slate-400 tracking-widest font-bold uppercase">Consultation Notes</p>
            <div class="p-6 bg-slate-50 rounded-2xl text-xs text-slate-600 leading-relaxed italic border border-slate-100">
              "{{ selectedAppointment.notes || 'No additional details provided for this session.' }}"
            </div>
          </div>

          <div class="flex gap-4 pt-6">
            <button v-if="selectedAppointment.status === 'pending'" @click="updateStatus(selectedAppointment._id, 'confirmed')" class="bg-slate-900 text-white px-10 py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-brand-gold transition-all shadow-lg shadow-slate-900/10">Confirm Session</button>
            <button v-if="selectedAppointment.status !== 'cancelled'" @click="updateStatus(selectedAppointment._id, 'cancelled')" class="text-rose-400 px-8 py-3 text-[10px] font-bold tracking-widest uppercase hover:text-rose-600 transition-colors">Cancel</button>
            <button @click="selectedAppointment = null" class="ml-auto text-slate-300 hover:text-slate-500 transition-colors">
              <LucidePlus class="rotate-45" :size="24" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Appointment Modal -->
    <UiModal v-model="showCreateModal" title="New Appointment Slot">
      <form @submit.prevent="createAppointment" class="space-y-8 py-4">
        <div class="grid grid-cols-2 gap-8">
           <div class="space-y-3">
             <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Customer Name</label>
             <input v-model="createForm.customerName" type="text" required class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-xs font-bold outline-none focus:border-brand-gold focus:bg-white transition-all" placeholder="e.g. Sarah Jenkins" />
           </div>
           <div class="space-y-3">
             <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Service Type</label>
             <UiSelect v-model="createForm.type" :options="['Consultation', 'Tasting', 'Delivery Set-up']" />
           </div>
        </div>
        <div class="grid grid-cols-2 gap-8">
           <div class="space-y-3">
             <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Preferred Date</label>
             <input v-model="createForm.date" type="date" required class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-xs font-bold outline-none focus:border-brand-gold focus:bg-white transition-all" />
           </div>
           <div class="space-y-3">
             <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Start Time</label>
             <input v-model="createForm.time" type="time" required class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-xs font-bold outline-none focus:border-brand-gold focus:bg-white transition-all" />
           </div>
        </div>
        <div class="space-y-3">
           <label class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Consultation Fee (₦)</label>
           <div class="relative">
             <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₦</span>
             <input v-model="createForm.price" type="number" required class="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-4 py-3.5 text-xs font-bold outline-none focus:border-brand-gold focus:bg-white transition-all" />
           </div>
        </div>
        
        <div class="pt-4">
          <button type="submit" :disabled="isSaving" class="w-full bg-slate-900 text-white py-5 rounded-2xl text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-brand-gold transition-all shadow-xl shadow-slate-900/10 hover:shadow-brand-gold/20 flex items-center justify-center gap-3">
            <LucideCalendar v-if="!isSaving" :size="16" />
            <LucideLoader2 v-else class="animate-spin" :size="16" />
            {{ isSaving ? 'Scheduling...' : 'Reserve Appointment Slot' }}
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>

<script setup>
import { LucidePlus, LucideCalendar, LucideCheck, LucideClock, LucideAlertCircle, LucideLoader2 } from 'lucide-vue-next';
const { fetchAdmin, postAdmin, patchAdmin } = useAdminApi();
const { success: toastSuccess, error: toastError } = useToast();

const appointments = ref([]);
const loading = ref(true);
const selectedAppointment = ref(null);
const showCreateModal = ref(false);
const isSaving = ref(false);

const createForm = ref({
  customerName: '',
  customerEmail: 'admin@dobicakes.com',
  customerPhone: 'N/A',
  type: 'Consultation',
  date: '',
  time: '',
  price: 0,
  notes: 'Manually scheduled by administrator.',
  status: 'confirmed',
  paymentStatus: 'paid'
});

const loadAppointments = async () => {
  loading.value = true;
  try {
    appointments.value = await fetchAdmin('/appointments');
  } catch (e) {
    toastError('Failed to load appointments');
  } finally {
    loading.value = false;
  }
};

const createAppointment = async () => {
  isSaving.value = true;
  try {
    await postAdmin('/appointments', createForm.value);
    toastSuccess('Appointment scheduled successfully');
    showCreateModal.value = false;
    loadAppointments();
  } catch (e) {
    toastError('Failed to schedule appointment');
  } finally {
    isSaving.value = false;
  }
};

const updateStatus = async (id, status) => {
  try {
    await patchAdmin(`/appointments/${id}/status`, { status });
    if (selectedAppointment.value) selectedAppointment.value.status = status;
    toastSuccess(`Appointment ${status} successfully`);
    loadAppointments();
  } catch (e) {
    toastError('Failed to update status');
  }
};

const upcoming = computed(() => {
  return appointments.value.filter(a => a.status === 'pending' || a.status === 'confirmed');
});

const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed': return 'bg-emerald-50 text-emerald-600';
    case 'pending': return 'bg-amber-50 text-amber-600';
    case 'cancelled': return 'bg-rose-50 text-rose-600';
    default: return 'bg-gray-50 text-gray-600';
  }
};

onMounted(loadAppointments);

definePageMeta({ layout: 'default' });
</script>
