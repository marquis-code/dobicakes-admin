<template>
  <div class="space-y-8 animate-fade-in">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-xl font-bold text-slate-900  tracking-tight">Appointment Management</h3>
        <p class="text-[10px] text-gray-400  tracking-widest">Track customer booking requests and consultations</p>
      </div>
      <button class="bg-brand-gold text-white px-6 py-2 rounded-sm text-xs font-bold  tracking-widest hover:bg-brand-gold-dark transition-colors flex items-center gap-2">
        <LucidePlus :size="16" />
        New Slot
      </button>
    </div>

    <!-- Calendar-Style View -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Upcoming List -->
      <div class="lg:col-span-1 space-y-4">
        <h4 class="text-[10px] font-bold  tracking-widest text-slate-400 pb-2 border-b border-gray-100">Upcoming</h4>
        <div v-for="appt in upcoming" :key="appt.id"
             @click="selectedAppointment = appt"
             class="admin-card !p-4 cursor-pointer hover:border-brand-gold transition-colors space-y-2"
             :class="selectedAppointment?.id === appt.id ? 'border-brand-gold bg-brand-cream/10' : ''">
          <div class="flex justify-between items-center">
            <p class="text-[10px] font-bold text-slate-900  tracking-widest">{{ appt.customer }}</p>
            <span :class="appt.status === 'confirmed' ? 'text-emerald-500' : 'text-amber-500'" class="text-[8px]  tracking-widest font-bold">{{ appt.status }}</span>
          </div>
          <p class="text-[9px] text-gray-400  tracking-widest">{{ appt.date }} • {{ appt.time }}</p>
          <p class="text-[9px] text-brand-gold  tracking-widest font-bold">{{ appt.type }}</p>
        </div>
      </div>

      <!-- Details Panel -->
      <div class="lg:col-span-3">
        <div v-if="!selectedAppointment" class="admin-card h-96 flex flex-col items-center justify-center text-center text-gray-300 italic space-y-4">
          <LucideCalendar :size="48" class="opacity-20" />
          <p class="text-xs  tracking-widest">Select an appointment to manage</p>
        </div>

        <div v-else class="admin-card space-y-8 animate-fade-in">
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <h2 class="text-xl font-bold text-slate-900  tracking-tight">{{ selectedAppointment.customer }}</h2>
              <p class="text-[10px] text-gray-400  tracking-widest">{{ selectedAppointment.email }} • {{ selectedAppointment.phone }}</p>
            </div>
            <span :class="selectedAppointment.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'" class="text-[9px] font-bold  tracking-widest px-3 py-1 rounded-sm">
              {{ selectedAppointment.status }}
            </span>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-gray-50">
            <div class="space-y-1">
              <p class="text-[8px] text-gray-400  tracking-widest font-bold">Date</p>
              <p class="text-xs font-bold text-slate-900">{{ selectedAppointment.date }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-[8px] text-gray-400  tracking-widest font-bold">Time</p>
              <p class="text-xs font-bold text-slate-900">{{ selectedAppointment.time }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-[8px] text-gray-400  tracking-widest font-bold">Type</p>
              <p class="text-xs font-bold text-brand-gold">{{ selectedAppointment.type }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-[8px] text-gray-400  tracking-widest font-bold">Duration</p>
              <p class="text-xs font-bold text-slate-900">45 mins</p>
            </div>
          </div>

          <div class="space-y-2">
            <p class="text-[8px] text-gray-400  tracking-widest font-bold">Notes</p>
            <p class="text-xs text-gray-600 leading-relaxed">{{ selectedAppointment.notes || 'No additional notes from customer.' }}</p>
          </div>

          <div class="flex gap-4 pt-4">
            <button class="bg-emerald-500 text-white px-6 py-2 rounded-sm text-[10px] font-bold  tracking-widest hover:bg-emerald-600 transition-colors">Confirm</button>
            <button class="bg-white text-slate-600 border border-gray-200 px-6 py-2 rounded-sm text-[10px] font-bold  tracking-widest hover:border-brand-gold hover:text-brand-gold transition-colors">Reschedule</button>
            <button class="text-rose-400 px-6 py-2 text-[10px] font-bold  tracking-widest hover:text-rose-600 transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucidePlus, LucideCalendar } from 'lucide-vue-next';

const selectedAppointment = ref(null);

const upcoming = [
  { id: '1', customer: 'Chioma Okeke', email: 'chioma@mail.com', phone: '+234 801 234 5678', date: 'Mar 18, 2026', time: '10:00 AM', type: 'Wedding Tasting', status: 'confirmed', notes: 'Bride wants to try 3 flavours: red velvet, carrot, and chocolate.' },
  { id: '2', customer: 'Adebayo Tunde', email: 'adebayo@mail.com', phone: '+234 803 456 7890', date: 'Mar 19, 2026', time: '2:00 PM', type: 'Custom Order Discussion', status: 'pending', notes: '5-tier cake for corporate event. Needs logo branding.' },
  { id: '3', customer: 'Fatima Yusuf', email: 'fatima@mail.com', phone: '+234 805 678 9012', date: 'Mar 20, 2026', time: '11:00 AM', type: 'Birthday Consultation', status: 'pending', notes: '' },
];

definePageMeta({ layout: 'default' });
</script>
