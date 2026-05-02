<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in pb-10">
    <!-- Form List -->
    <div class="lg:col-span-1 space-y-6">
      <div class="flex justify-between items-center px-2">
        <h3 class="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Active Forms</h3>
        <button @click="createNewForm" class="text-[10px] font-bold text-brand-gold tracking-widest hover:underline uppercase">+ Create New</button>
      </div>
      
      <div class="space-y-4">
        <div v-for="form in forms" :key="form._id" 
             @click="selectedForm = form"
             class="admin-card !p-5 cursor-pointer transition-all hover:translate-x-1"
             :class="selectedForm?._id === form._id ? 'border-brand-gold bg-brand-gold/5 shadow-lg shadow-brand-gold/5' : 'hover:border-slate-300'">
          <div class="flex justify-between items-start">
            <p class="text-[11px] font-bold text-slate-900 tracking-widest uppercase">{{ form.title }}</p>
            <LucideChevronRight :size="14" class="text-slate-300" />
          </div>
          <div class="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
            <span class="text-[9px] tracking-widest text-slate-400 font-bold uppercase">{{ form.responses?.length || 0 }} Responses</span>
            <span :class="form.isActive ? 'text-emerald-500' : 'text-slate-300'" class="text-[8px] tracking-widest font-bold uppercase">
              ● {{ form.isActive ? 'Active' : 'Closed' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Builder / Response View -->
    <div class="lg:col-span-2 space-y-8">
      <div v-if="!selectedForm" class="admin-card h-96 flex flex-col items-center justify-center text-center space-y-6 text-slate-300 border-dashed border-2 bg-slate-50/30">
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
          <LucideFormInput :size="32" class="opacity-20" />
        </div>
        <div class="space-y-1">
          <p class="text-[10px] tracking-[0.3em] font-bold uppercase text-slate-400">Intelligence Hub</p>
          <p class="text-[9px] tracking-widest text-slate-300">Select or create a form to begin gathering insights</p>
        </div>
      </div>

      <div v-else class="space-y-8 animate-fade-in">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-100 pb-8 gap-6">
          <div class="space-y-2">
            <h2 class="text-2xl font-bold text-slate-900 tracking-tight">{{ selectedForm.title }}</h2>
            <p class="text-[10px] text-slate-400 tracking-widest uppercase">{{ selectedForm.description || 'No description provided' }}</p>
          </div>
          <div class="flex gap-4 w-full sm:w-auto">
            <button class="flex-grow sm:flex-grow-0 px-6 py-2.5 text-[10px] font-bold tracking-widest text-rose-400 hover:text-rose-600 uppercase transition-colors">Delete</button>
            <button class="flex-grow sm:flex-grow-0 bg-slate-900 text-white px-8 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-lg shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all">Share Link</button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-10 border-b border-slate-50">
          <button @click="tab = 'build'" :class="tab === 'build' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-slate-400'" class="pb-4 border-b-2 text-[10px] font-bold tracking-widest uppercase transition-all">Form Designer</button>
          <button @click="tab = 'responses'" :class="tab === 'responses' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-slate-400'" class="pb-4 border-b-2 text-[10px] font-bold tracking-widest uppercase transition-all">Submissions ({{ selectedForm.responses?.length || 0 }})</button>
        </div>

        <!-- Builder View -->
        <div v-if="tab === 'build'" class="space-y-6">
          <div v-for="(field, i) in selectedForm.fields" :key="i" class="admin-card !p-6 flex flex-col sm:flex-row gap-6 items-start group hover:border-slate-300 transition-all">
            <div class="w-10 h-10 bg-slate-50 flex items-center justify-center text-slate-300 rounded-xl font-bold text-[10px] shrink-0 border border-slate-100">
              {{ i + 1 }}
            </div>
            <div class="flex-grow space-y-4 w-full">
              <div class="space-y-1">
                <span class="text-[8px] font-bold text-slate-400 tracking-widest uppercase">Field Label</span>
                <input v-model="field.label" class="w-full font-bold text-[11px] tracking-widest outline-none bg-transparent border-b border-slate-100 pb-2 focus:border-brand-gold transition-colors" />
              </div>
              <div class="flex flex-wrap gap-6 items-center">
                <div class="space-y-1">
                  <span class="text-[8px] font-bold text-slate-400 tracking-widest uppercase">Input Type</span>
                  <select v-model="field.type" class="block w-full text-[9px] tracking-widest font-bold bg-slate-50 border-none rounded-lg p-2 outline-none">
                    <option value="text">Short Text</option>
                    <option value="textarea">Paragraph</option>
                    <option value="number">Number</option>
                    <option value="select">Dropdown</option>
                  </select>
                </div>
                <label class="flex items-center gap-3 text-[9px] tracking-widest font-bold text-slate-500 uppercase cursor-pointer mt-4">
                  <input type="checkbox" v-model="field.required" class="w-4 h-4 text-brand-gold focus:ring-brand-gold border-slate-300 rounded" /> 
                  Mandatory
                </label>
              </div>
            </div>
            <button class="p-2 text-slate-200 hover:text-rose-500 transition-all hover:bg-rose-50 rounded-lg sm:opacity-0 group-hover:opacity-100">
              <LucideTrash :size="16" />
            </button>
          </div>
          <button class="w-full py-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-[10px] font-bold tracking-widest uppercase hover:border-brand-gold hover:text-brand-gold hover:bg-brand-gold/5 transition-all flex items-center justify-center gap-3">
            <LucidePlus :size="16" />
            Add Designer Field
          </button>
        </div>

        <!-- Responses View -->
        <div v-else class="space-y-6">
          <div v-if="!selectedForm.responses?.length" class="text-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
             <p class="text-[10px] font-bold text-slate-300 tracking-[0.2em] uppercase">No submissions received yet</p>
          </div>
          <div v-for="(res, i) in selectedForm.responses" :key="i" class="admin-card !p-8 space-y-6">
            <div class="flex justify-between items-center border-b border-slate-50 pb-4">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 bg-brand-gold rounded-full"></div>
                <span class="text-[10px] font-bold tracking-widest text-slate-900 uppercase">Response #{{ i+1 }}</span>
              </div>
              <span class="text-[9px] text-slate-400 font-medium">{{ new Date(res.submittedAt).toLocaleString() }}</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div v-for="(val, key) in res.data" :key="key" class="space-y-1.5 p-4 bg-slate-50 rounded-xl">
                <p class="text-[8px] text-slate-400 tracking-widest font-bold uppercase">{{ key }}</p>
                <p class="text-[11px] text-slate-700 font-bold tracking-tight">{{ val || '—' }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { LucideFormInput, LucideTrash, LucidePlus, LucideChevronRight } from 'lucide-vue-next';
const { fetchAdmin } = useAdminApi();

const forms = ref([]);
const selectedForm = ref(null);
const tab = ref('build');

onMounted(async () => {
  try {
    forms.value = await fetchAdmin('/forms');
  } catch (e) {
    forms.value = [];
  }
});

const createNewForm = () => {
  selectedForm.value = {
    title: 'New Custom Form',
    description: 'Bespoke data collection for your clients',
    fields: [{ label: 'Full Name', type: 'text', required: true }],
    responses: [],
    isActive: true
  };
  tab.value = 'build';
};

definePageMeta({ layout: 'default' });
</script>
