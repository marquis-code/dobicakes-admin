<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in pb-20">
    <!-- Sophisticated Sidebar: Form Library -->
    <div class="lg:col-span-1 space-y-8">
      <div class="flex justify-between items-center px-4">
        <div>
          <h3 class="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Intelligence Hub</h3>
          <p class="text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-1">Global Form Repository</p>
        </div>
        <button @click="createNewForm" class="w-10 h-10 bg-brand-gold text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-gold/20 hover:scale-110 active:scale-95 transition-all">
          <LucidePlus :size="20" />
        </button>
      </div>
      
      <div class="space-y-4 px-2">
        <div v-for="form in forms" :key="form._id" 
             @click="selectedForm = form"
             class="admin-card !p-6 cursor-pointer transition-all hover:translate-x-2 border-l-4 group"
             :class="selectedForm?._id === form._id ? 'border-l-brand-gold bg-brand-gold/5 shadow-xl shadow-brand-gold/5' : 'border-l-transparent hover:border-l-slate-300'">
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <p class="text-[11px] font-black text-slate-900 tracking-widest uppercase">{{ form.title }}</p>
              <p class="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{{ form.fields?.length || 0 }} Components</p>
            </div>
            <div :class="form.isActive ? 'bg-emerald-500' : 'bg-slate-200'" class="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" v-if="form.isActive"></div>
          </div>
          <div class="flex justify-between items-center mt-6 pt-4 border-t border-slate-100/50">
            <div class="flex items-center gap-2">
              <LucideMessageSquare :size="10" class="text-slate-300" />
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ form.responses?.length || 0 }} Hits</span>
            </div>
            <LucideArrowRight :size="12" class="text-slate-300 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        <!-- Empty Library State -->
        <div v-if="forms.length === 0" class="py-20 text-center space-y-4">
           <LucideFolderOpen :size="32" class="mx-auto text-slate-200" />
           <p class="text-[9px] font-bold text-slate-300 uppercase tracking-widest">No forms deployed</p>
        </div>
      </div>
    </div>

    <!-- Master Workspace -->
    <div class="lg:col-span-3">
      <div v-if="!selectedForm" class="admin-card h-[600px] flex flex-col items-center justify-center text-center space-y-8 bg-slate-50/30 border-dashed border-2 border-slate-200 group">
        <div class="relative">
          <div class="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl shadow-slate-200 transition-transform group-hover:rotate-12 group-hover:scale-110 duration-500">
            <LucideLayers :size="40" class="text-slate-200" />
          </div>
          <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center text-white shadow-lg">
            <LucideZap :size="16" />
          </div>
        </div>
        <div class="space-y-2">
          <h4 class="text-sm font-black text-slate-400 tracking-[0.4em] uppercase">Designer Pro Hub</h4>
          <p class="text-[10px] text-slate-300 tracking-widest uppercase">Initialize a new deployment or select from the repository</p>
        </div>
        <button @click="createNewForm" class="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase hover:bg-brand-gold transition-all shadow-2xl shadow-slate-900/10">Launch Creator</button>
      </div>

      <div v-else class="space-y-12 animate-fade-in relative">
        <!-- Floating Header -->
        <div class="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 -mx-8 px-8 py-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 shadow-sm">
          <div class="space-y-3">
            <div class="flex items-center gap-4">
              <input v-model="selectedForm.title" class="text-3xl font-black text-slate-900 tracking-tighter bg-transparent border-none outline-none focus:ring-0 w-full xl:w-[500px]" placeholder="Form Prototype Title..." />
            </div>
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2 text-[10px] font-bold tracking-widest text-brand-gold uppercase">
                <LucideBox :size="12" /> Deployment v1.0
              </div>
              <div class="h-1 w-1 bg-slate-200 rounded-full"></div>
              <p class="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{{ selectedForm.fields.length }} Structural Elements</p>
            </div>
          </div>
          <div class="flex gap-4 w-full xl:w-auto">
            <button @click="confirmDeleteForm" class="px-8 py-3 text-[10px] font-black tracking-widest text-rose-400 hover:bg-rose-50 rounded-2xl transition-all uppercase">Retire Hub</button>
            <button @click="saveForm" :disabled="isSaving" class="flex-grow bg-slate-900 text-white px-12 py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase hover:bg-brand-gold transition-all shadow-2xl shadow-slate-900/20 disabled:opacity-50">
              {{ isSaving ? 'Compiling Hub...' : 'Synchronize Architecture' }}
            </button>
          </div>
        </div>

        <!-- Designer Navigation -->
        <div class="flex gap-12 border-b border-slate-50 relative">
          <button v-for="t in ['build', 'responses', 'config']" :key="t"
                  @click="tab = t"
                  :class="tab === t ? 'text-slate-900 border-brand-gold' : 'text-slate-400 border-transparent hover:text-slate-600'"
                  class="pb-5 border-b-2 text-[10px] font-black tracking-[0.2em] uppercase transition-all relative z-10">
            {{ t === 'build' ? 'Architecture' : t === 'responses' ? 'Intelligence' : 'Parameters' }}
          </button>
        </div>

        <!-- Architecture Workspace -->
        <div v-if="tab === 'build'" class="grid grid-cols-1 xl:grid-cols-12 gap-16">
          <!-- Component Builder -->
          <div class="xl:col-span-7 space-y-10">
            <div class="flex justify-between items-center px-2">
               <h4 class="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Core Components</h4>
               <button @click="addField" class="text-[10px] font-black text-brand-gold tracking-widest hover:scale-105 transition-transform uppercase">+ New Element</button>
            </div>

            <div class="space-y-8">
              <div v-for="(field, i) in selectedForm.fields" :key="i" 
                   class="admin-card !p-0 overflow-hidden group hover:border-slate-300 transition-all border-l-8"
                   :class="field.required ? 'border-l-brand-gold' : 'border-l-slate-200'">
                
                <div class="p-10 space-y-10">
                  <div class="flex justify-between items-start">
                    <div class="flex items-center gap-6">
                      <div class="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-2xl text-xs font-black shadow-xl shadow-slate-900/20">
                        {{ i + 1 }}
                      </div>
                      <div class="space-y-1">
                        <input v-model="field.label" class="text-base font-black text-slate-900 bg-transparent border-none outline-none focus:ring-0 w-80" placeholder="Component Label..." />
                        <div class="flex items-center gap-3">
                           <span class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Type: {{ field.type }}</span>
                           <div class="h-1 w-1 bg-slate-200 rounded-full"></div>
                           <span v-if="field.required" class="text-[9px] text-brand-gold font-bold uppercase tracking-widest">Mandatory Element</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button @click="duplicateField(i)" class="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"><LucideCopy :size="16" /></button>
                      <button @click="removeField(i)" class="w-10 h-10 bg-rose-50 flex items-center justify-center rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-100 transition-all"><LucideTrash2 :size="16" /></button>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div class="space-y-3">
                      <label class="text-[9px] font-black text-slate-400 tracking-widest uppercase">Mechanism</label>
                      <UiSelect 
                        v-model="field.type" 
                        :options="[
                          { label: 'Single Line Text', value: 'text' },
                          { label: 'Multilinear Prose', value: 'textarea' },
                          { label: 'Numeric Scalar', value: 'number' },
                          { label: 'Verified Email', value: 'email' },
                          { label: 'Selection Matrix (Dropdown)', value: 'select' },
                          { label: 'Boolean Toggle (Checkbox)', value: 'checkbox' }
                        ]"
                      />
                    </div>
                    <div class="flex items-end pb-1">
                      <label class="flex items-center gap-4 cursor-pointer group/label p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-brand-gold/20 transition-all w-full">
                        <input type="checkbox" v-model="field.required" class="w-5 h-5 text-brand-gold border-slate-200 rounded-lg focus:ring-brand-gold" />
                        <span class="text-[10px] font-black text-slate-500 tracking-widest uppercase group-hover/label:text-slate-900 transition-colors">Force Validation</span>
                      </label>
                    </div>
                  </div>

                  <!-- Advanced Selection Matrix Management -->
                  <div v-if="field.type === 'select'" class="space-y-6 animate-slide-up bg-slate-900 text-white p-8 rounded-3xl shadow-2xl shadow-slate-900/10">
                    <div class="flex justify-between items-center">
                      <div>
                        <p class="text-[9px] font-black text-brand-gold tracking-[0.3em] uppercase">Selection Matrix</p>
                        <p class="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">Define valid interaction parameters</p>
                      </div>
                      <button @click="addOption(field)" class="bg-brand-gold/10 text-brand-gold px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-brand-gold hover:text-white transition-all">+ Add Parameter</button>
                    </div>
                    <div class="grid grid-cols-1 gap-4">
                      <div v-for="(opt, optIdx) in (field.options || [])" :key="optIdx" class="relative group/opt">
                        <input 
                          v-model="field.options[optIdx]" 
                          class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white outline-none focus:border-brand-gold transition-all"
                          placeholder="Define parameter label..."
                        />
                        <button @click="removeOption(field, optIdx)" class="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-rose-500/10 text-rose-500 rounded-lg flex items-center justify-center opacity-0 group-hover/opt:opacity-100 transition-all hover:bg-rose-500 hover:text-white">
                          <LucideX :size="14" />
                        </button>
                      </div>
                    </div>
                    <div v-if="!field.options?.length" class="text-center py-8 text-slate-600 italic text-[10px] font-bold uppercase tracking-widest">
                      Zero parameters configured
                    </div>
                  </div>
                </div>
              </div>

              <!-- Append Trigger -->
              <button @click="addField" class="w-full py-10 border-4 border-dashed border-slate-100 rounded-[2.5rem] text-slate-300 text-[11px] font-black tracking-[0.5em] uppercase hover:border-brand-gold hover:text-brand-gold hover:bg-brand-gold/5 transition-all flex flex-col items-center justify-center gap-4 group">
                <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-slate-100 group-hover:scale-110 transition-transform">
                   <LucidePlus :size="24" />
                </div>
                Extend Architecture
              </button>
            </div>
          </div>

          <!-- Real-time Strategic Preview -->
          <div class="xl:col-span-5 space-y-10 sticky top-48">
             <h4 class="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase px-4">Live Deployment Echo</h4>
             <div class="admin-card !p-12 bg-[#0A0C10] text-white min-h-[700px] flex flex-col shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[3rem] border border-white/5 relative overflow-hidden group">
                <!-- Premium Glass Accents -->
                <div class="absolute -top-24 -right-24 w-64 h-64 bg-brand-gold/10 blur-[100px] rounded-full"></div>
                <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-gold/5 blur-[100px] rounded-full"></div>
                
                <div class="space-y-12 relative z-10 flex-grow">
                  <div class="space-y-4">
                    <div class="w-12 h-1 bg-brand-gold rounded-full"></div>
                    <h3 class="text-3xl font-black tracking-tight text-white leading-tight">{{ selectedForm.title || 'Architectural Hub' }}</h3>
                    <p class="text-[11px] text-slate-500 uppercase tracking-[0.2em] leading-relaxed font-bold italic">{{ selectedForm.description || 'System awaiting strategic definition...' }}</p>
                  </div>

                  <div class="space-y-10">
                    <div v-for="field in selectedForm.fields" :key="field.label" class="space-y-4">
                      <label class="text-[10px] font-black tracking-[0.3em] text-slate-600 uppercase flex items-center justify-between">
                        {{ field.label || 'Untitled Component' }}
                        <span v-if="field.required" class="text-rose-500 text-[14px] leading-none">*</span>
                      </label>
                      
                      <div v-if="field.type === 'select'" class="relative">
                        <div class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-xs text-slate-400 flex justify-between items-center group-hover:border-brand-gold/50 transition-all font-bold">
                          {{ field.options?.[0] || 'Awaiting Selection Matrix...' }}
                          <LucideChevronDown :size="16" class="text-brand-gold" />
                        </div>
                      </div>
                      <div v-else-if="field.type === 'textarea'" class="w-full bg-white/5 border border-white/10 rounded-2xl h-32 px-6 py-5 text-xs text-slate-600 font-bold italic">
                        Initialize multilinear discourse...
                      </div>
                      <div v-else class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-xs text-slate-600 font-bold italic">
                        {{ field.type === 'email' ? 'identity@network.com' : field.type === 'number' ? '0.00' : 'Awaiting data injection...' }}
                      </div>
                    </div>
                  </div>

                  <button class="w-full py-6 bg-brand-gold text-white rounded-[1.5rem] text-xs font-black tracking-[0.4em] uppercase shadow-2xl shadow-brand-gold/30 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-4 group">
                    Deploy Submission
                    <LucideZap :size="16" class="group-hover:animate-pulse" />
                  </button>
                </div>
                
                <!-- Designer Branding -->
                <div class="pt-16 text-center border-t border-white/5 mt-10">
                  <p class="text-[9px] font-black text-slate-800 tracking-[1em] uppercase">Adaobi Intelligence Hub v4.0</p>
                </div>
             </div>
          </div>
        </div>

        <!-- Intelligence Hub (Responses) -->
        <div v-else-if="tab === 'responses'" class="space-y-10 animate-fade-in">
          <div v-if="!selectedForm.responses?.length" class="flex flex-col items-center justify-center py-40 text-slate-300 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
             <LucideInbox :size="64" class="opacity-10 mb-6" />
             <p class="text-[11px] font-black tracking-[0.3em] uppercase text-slate-400">Hub contains zero captures</p>
          </div>
          <div v-for="(res, i) in selectedForm.responses" :key="i" class="admin-card !p-0 overflow-hidden group hover:shadow-2xl transition-all rounded-[2rem]">
             <div class="bg-slate-900 px-10 py-6 border-b border-white/5 flex justify-between items-center text-white">
                <div class="flex items-center gap-4">
                  <div class="w-2 h-2 bg-brand-gold rounded-full animate-pulse shadow-[0_0_10px_rgba(202,160,86,0.8)]"></div>
                  <span class="text-[11px] font-black tracking-[0.3em] uppercase">Intelligence Capture #{{ selectedForm.responses.length - i }}</span>
                </div>
                <span class="text-[10px] text-slate-400 font-black uppercase tracking-widest">{{ new Date(res.submittedAt).toLocaleDateString() }} | {{ new Date(res.submittedAt).toLocaleTimeString() }}</span>
             </div>
             <div class="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 bg-white">
                <div v-for="(val, key) in res.data" :key="key" class="space-y-2 p-6 bg-slate-50/50 rounded-2xl border border-slate-100/50 hover:bg-white hover:border-brand-gold/20 transition-all">
                   <p class="text-[9px] font-black text-slate-400 tracking-widest uppercase">{{ key }}</p>
                   <p class="text-xs text-slate-900 font-bold tracking-tight">{{ val || '—' }}</p>
                </div>
             </div>
          </div>
        </div>

        <!-- Parameter Configuration -->
        <div v-else class="max-w-3xl space-y-12 animate-fade-in pb-20">
          <div class="space-y-10">
            <div class="space-y-3">
              <label class="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase px-1">Global Hub Identity</label>
              <input v-model="selectedForm.title" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-xl font-black text-slate-900 outline-none focus:border-brand-gold focus:bg-white transition-all shadow-sm" />
            </div>
            <div class="space-y-3">
              <label class="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase px-1">Strategic Mission Statement</label>
              <textarea v-model="selectedForm.description" rows="6" class="w-full bg-slate-50 rounded-[2rem] p-8 text-xs text-slate-700 font-bold outline-none border border-slate-100 focus:border-brand-gold focus:bg-white transition-all shadow-sm leading-relaxed" placeholder="Define the core objective of this data capture hub..."></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <div class="flex items-center justify-between p-8 bg-slate-900 text-white rounded-[2rem] shadow-2xl shadow-slate-900/20 group">
                <div class="space-y-1">
                  <p class="text-sm font-black tracking-tight group-hover:text-brand-gold transition-colors">Active Deployment</p>
                  <p class="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Public availability toggle</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="selectedForm.isActive" class="sr-only peer">
                  <div class="w-14 h-8 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-gold"></div>
                </label>
              </div>

              <div class="flex items-center justify-between p-8 bg-rose-500 text-white rounded-[2rem] shadow-2xl shadow-rose-500/20 cursor-pointer hover:bg-rose-600 transition-all" @click="confirmDeleteForm">
                <div class="space-y-1">
                  <p class="text-sm font-black tracking-tight">Destroy Hub</p>
                  <p class="text-[9px] text-rose-200 uppercase tracking-widest font-bold">Permanent data erasure</p>
                </div>
                <LucideTrash2 :size="24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Sophisticated Confirmation Modal -->
    <ConfirmationModal
      :is-open="isDeleteModalOpen"
      title="Retire Strategic Hub"
      :message="`WARNING: You are about to permanently decommission '${selectedForm?.title}'. This action will result in the immediate and irreversible destruction of all structural elements and intelligence captures associated with this hub.`"
      confirm-text="Confirm Decommission"
      cancel-text="Abort Protocol"
      type="danger"
      :is-loading="isDeleting"
      @close="isDeleteModalOpen = false"
      @confirm="executeDeleteForm"
    />
  </div>
</template>

<script setup>
import { 
  LucideFileText, LucideTrash, LucidePlus, LucideChevronRight, 
  LucideLayers, LucideMessageSquare, LucideChevronDown, LucideInbox,
  LucideCopy, LucideTrash2, LucideX, LucideArrowRight, LucideFolderOpen,
  LucideZap, LucideBox
} from 'lucide-vue-next';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';

const { fetchAdmin, postAdmin, patchAdmin, deleteAdmin } = useAdminApi();
const { success: toastSuccess, error: toastError } = useToast();

const forms = ref([]);
const selectedForm = ref(null);
const tab = ref('build');
const isSaving = ref(false);

const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);

const loadForms = async () => {
  try {
    forms.value = await fetchAdmin('/forms');
  } catch (e) {
    forms.value = [];
  }
};

onMounted(loadForms);

const createNewForm = () => {
  selectedForm.value = {
    title: 'New Strategic Hub',
    description: 'Bespoke intelligence capture for your artisanal ecosystem.',
    fields: [{ label: 'Full Name', type: 'text', required: true, options: [] }],
    responses: [],
    isActive: true
  };
  tab.value = 'build';
};

const saveForm = async () => {
  isSaving.value = true;
  try {
    // Ensure all select fields have an options array
    selectedForm.value.fields.forEach(f => {
      if (f.type === 'select' && !f.options) f.options = [];
    });

    if (selectedForm.value._id) {
      await patchAdmin(`/forms/${selectedForm.value._id}`, selectedForm.value);
      toastSuccess('Hub synchronized successfully');
    } else {
      const res = await postAdmin('/forms', selectedForm.value);
      selectedForm.value = res;
      toastSuccess('Strategic Hub deployed');
    }
    await loadForms();
  } catch (e) {
    toastError('Synchronization failed');
  } finally {
    isSaving.value = false;
  }
};

const removeField = (index) => {
  selectedForm.value.fields.splice(index, 1);
};

const duplicateField = (index) => {
  const field = JSON.parse(JSON.stringify(selectedForm.value.fields[index]));
  selectedForm.value.fields.splice(index + 1, 0, field);
};

const addField = () => {
  selectedForm.value.fields.push({ label: 'New Component', type: 'text', required: false, options: [] });
};

const addOption = (field) => {
  if (!field.options) field.options = [];
  field.options.push(`Parameter ${field.options.length + 1}`);
};

const removeOption = (field, index) => {
  field.options.splice(index, 1);
};

const confirmDeleteForm = () => {
  isDeleteModalOpen.value = true;
};

const executeDeleteForm = async () => {
  if (!selectedForm.value?._id) {
    selectedForm.value = null;
    isDeleteModalOpen.value = false;
    return;
  }
  
  isDeleting.value = true;
  try {
    await deleteAdmin(`/forms/${selectedForm.value._id}`);
    toastSuccess('Hub decommissioned successfully');
    await loadForms();
    selectedForm.value = null;
  } catch (e) {
    toastError('Decommissioning failed');
  } finally {
    isDeleting.value = false;
    isDeleteModalOpen.value = false;
  }
};

definePageMeta({ layout: 'default' });
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Custom scrollbar for glassmorphic dropdowns */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
