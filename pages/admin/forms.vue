<template>
  <div class="min-h-screen animate-fade-in">
    <!-- Header: Only visible in List view -->
    <div v-if="view === 'list'" class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
      <div>
        <h1 class="text-xl font-bold text-slate-900">Form Management</h1>
        <p class="text-sm text-slate-500 mt-1">Design, deploy, and analyze custom data capture forms</p>
      </div>
      <button @click="createNewForm" class="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-brand-gold transition-all shadow-sm flex items-center justify-center gap-2">
        <LucidePlus :size="18" />
        Create New Form
      </button>
    </div>

    <!-- TABULAR LIST VIEW -->
    <div v-if="view === 'list'" class="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-50">
              <th class="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Form Identity</th>
              <th class="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Fields</th>
              <th class="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Entries</th>
              <th class="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th class="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="form in forms" :key="form._id" class="group hover:bg-slate-50/50 transition-colors">
              <td class="px-10 py-6">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-slate-900">{{ form.title }}</span>
                  <span class="text-xs text-slate-400 mt-0.5 line-clamp-1">{{ form.description }}</span>
                </div>
              </td>
              <td class="px-10 py-6 text-center">
                <span class="inline-flex items-center px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-[10px] font-bold">{{ form.fields?.length || 0 }}</span>
              </td>
              <td class="px-10 py-6 text-center">
                <span class="inline-flex items-center px-3 py-1 bg-brand-gold/5 text-brand-gold rounded-full text-[10px] font-bold">{{ form.responses?.length || 0 }}</span>
              </td>
              <td class="px-10 py-6 text-center">
                <div class="flex items-center justify-center gap-2">
                  <div :class="form.isActive ? 'bg-emerald-500' : 'bg-slate-300'" class="w-2 h-2 rounded-full"></div>
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{{ form.isActive ? 'Active' : 'Draft' }}</span>
                </div>
              </td>
              <td class="px-10 py-6">
                <div class="flex items-center justify-end gap-2">
                  <button @click="editForm(form)" class="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all" title="Edit Structure">
                    <LucideSettings2 :size="16" />
                  </button>
                  <button @click="copyPublicLink(form._id)" class="p-2.5 bg-slate-50 text-slate-400 hover:text-brand-gold rounded-xl transition-all" title="Copy Public Link">
                    <LucideLink :size="16" />
                  </button>
                  <button @click="viewResponses(form)" class="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all" title="View Submissions">
                    <LucideInbox :size="16" />
                  </button>
                  <button @click="openDeleteModal(form)" class="p-2.5 bg-rose-50 text-rose-400 hover:text-rose-600 rounded-xl transition-all" title="Delete Form">
                    <LucideTrash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="forms.length === 0" class="py-32 text-center">
        <LucideFileText :size="48" class="mx-auto text-slate-100 mb-6" />
        <h3 class="text-xl font-bold text-slate-900">No forms deployed yet</h3>
        <p class="text-slate-400 text-sm mt-2 mb-8">Start by creating your first artisanal data capture hub</p>
        <button @click="createNewForm" class="bg-slate-900 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-slate-900/10">Launch Creator</button>
      </div>
    </div>

    <!-- EDITOR / RESPONSES VIEW -->
    <div v-else class="max-w-6xl mx-auto animate-slide-up">
      <!-- Back Header -->
      <div class="flex items-center justify-between mb-10">
        <button @click="view = 'list'" class="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors group">
          <div class="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-slate-100 transition-colors">
            <LucideArrowLeft :size="18" />
          </div>
          <span class="text-sm font-bold">Back to Library</span>
        </button>
        <div class="flex items-center gap-4">
          <div class="hidden md:flex bg-slate-50 p-1 rounded-xl">
            <button @click="view = 'editor'" :class="view === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'" class="px-6 py-2 rounded-lg text-xs font-bold transition-all">Designer</button>
            <button @click="view = 'responses'" :class="view === 'responses' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'" class="px-6 py-2 rounded-lg text-xs font-bold transition-all">Entries</button>
          </div>
          <button v-if="view === 'editor'" @click="saveForm" :disabled="isSaving" class="bg-slate-900 text-white px-8 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-gold transition-all disabled:opacity-50">
            {{ isSaving ? 'Saving...' : 'Sync Architecture' }}
          </button>
        </div>
      </div>

      <!-- Form Designer Content -->
      <div v-if="view === 'editor'" class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div class="lg:col-span-7 space-y-8">
          <div class="bg-white border border-slate-100 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
            <div class="space-y-4">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Identity</label>
              <input v-model="selectedForm.title" class="text-3xl font-bold text-slate-900 bg-transparent border-none outline-none focus:ring-0 w-full" placeholder="Enter form title..." />
              <textarea v-model="selectedForm.description" rows="2" class="w-full bg-slate-50 rounded-2xl p-4 text-sm text-slate-600 outline-none border-none resize-none" placeholder="Add a short mission statement..."></textarea>
            </div>

            <div class="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                  <LucideCheckCircle :size="18" />
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-900">Active Deployment</p>
                  <p class="text-[10px] text-slate-500 font-medium">Currently visible to users</p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="selectedForm.isActive" class="sr-only peer">
                <div class="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-gold"></div>
              </label>
            </div>
          </div>

          <div class="space-y-4">
            <div v-for="(field, i) in selectedForm.fields" :key="i" class="bg-white border border-slate-100 rounded-3xl p-8 hover:border-slate-200 transition-all group shadow-sm">
              <div class="flex justify-between items-center mb-8">
                <div class="flex items-center gap-4">
                  <span class="text-xs font-black text-slate-300">#{{ i + 1 }}</span>
                  <input v-model="field.label" class="font-bold text-slate-900 bg-transparent border-none outline-none focus:ring-0 text-base" placeholder="Element Label..." />
                </div>
                <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button @click="duplicateField(i)" class="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all"><LucideCopy :size="16" /></button>
                  <button @click="removeField(i)" class="p-2.5 bg-rose-50 text-rose-400 hover:text-rose-600 rounded-xl transition-all"><LucideTrash2 :size="16" /></button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mechanism</label>
                  <UiSelect 
                    v-model="field.type" 
                    :options="[
                      { label: 'Single Line Text', value: 'text' },
                      { label: 'Multilinear Prose', value: 'textarea' },
                      { label: 'Numeric Scalar', value: 'number' },
                      { label: 'Verified Email', value: 'email' },
                      { label: 'Selection Matrix', value: 'select' },
                      { label: 'Boolean Toggle', value: 'checkbox' }
                    ]"
                  />
                </div>
                <div class="flex items-end pb-1">
                  <label class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 cursor-pointer transition-all w-full">
                    <input type="checkbox" v-model="field.required" class="w-5 h-5 text-brand-gold border-slate-300 rounded-lg focus:ring-brand-gold" />
                    <span class="text-xs font-bold text-slate-600">Strict Validation</span>
                  </label>
                </div>
              </div>

              <div v-if="field.type === 'select'" class="mt-8 p-8 bg-slate-50 rounded-2xl space-y-6">
                <div class="flex justify-between items-center">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parameter Matrix</span>
                  <button @click="addOption(field)" class="text-[10px] font-bold text-brand-gold hover:underline">+ Add Option</button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="(opt, optIdx) in (field.options || [])" :key="optIdx" class="flex gap-2 group/opt">
                    <input v-model="field.options[optIdx]" class="flex-grow bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-medium text-slate-700 outline-none focus:border-brand-gold" />
                    <button @click="removeOption(field, optIdx)" class="p-2 text-slate-300 hover:text-rose-500 transition-colors"><LucideX :size="16" /></button>
                  </div>
                </div>
              </div>
            </div>

            <button @click="addField" class="w-full py-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-slate-300 text-sm font-bold hover:border-brand-gold/30 hover:text-brand-gold hover:bg-brand-gold/5 transition-all flex flex-col items-center justify-center gap-4 group">
              <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                <LucidePlus :size="24" class="text-slate-400" />
              </div>
              <span class="tracking-widest uppercase text-[10px]">Add Component</span>
            </button>
          </div>
        </div>

        <!-- Preview Column -->
        <div class="lg:col-span-5">
          <div class="sticky top-40 bg-white border border-slate-100 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/10">
            <div class="w-12 h-1 bg-brand-gold rounded-full mb-8"></div>
            <h2 class="text-2xl font-bold text-slate-900 mb-2">{{ selectedForm.title || 'Architectural Hub' }}</h2>
            <p class="text-sm text-slate-500 mb-12">{{ selectedForm.description || 'System awaiting definition...' }}</p>

            <div class="space-y-8 mb-12">
              <div v-for="field in selectedForm.fields" :key="field.label" class="space-y-3">
                <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {{ field.label || 'Untitled Element' }}
                  <span v-if="field.required" class="text-rose-500 ml-1">*</span>
                </label>
                <div class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs text-slate-400 font-medium">
                  {{ field.type === 'select' ? (field.options?.[0] || 'Awaiting selection matrix...') : 'Awaiting injection...' }}
                </div>
              </div>
            </div>

            <button class="w-full py-5 bg-slate-900 text-white rounded-2xl text-xs font-black tracking-widest uppercase shadow-xl shadow-slate-900/10 transition-transform active:scale-95">
              Submit Form
            </button>
          </div>
        </div>
      </div>

      <!-- Submissions Tab Content -->
      <div v-else-if="view === 'responses'" class="space-y-6">
        <div v-if="!selectedForm.responses?.length" class="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 py-40 text-center flex flex-col items-center justify-center">
          <LucideInbox :size="48" class="text-slate-100 mb-6" />
          <h3 class="text-xl font-bold text-slate-900">Zero Captures</h3>
          <p class="text-slate-400 text-sm mt-2">This hub hasn't received any data injections yet</p>
        </div>
        
        <div v-for="(res, i) in selectedForm.responses" :key="i" class="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden group shadow-sm">
          <div class="bg-slate-50 px-10 py-5 border-b border-slate-100 flex justify-between items-center">
            <div class="flex items-center gap-4">
              <div class="w-2 h-2 bg-brand-gold rounded-full shadow-[0_0_8px_rgba(202,160,86,0.5)]"></div>
              <span class="text-xs font-black text-slate-900 uppercase tracking-widest">Intelligence Capture #{{ selectedForm.responses.length - i }}</span>
            </div>
            <span class="text-xs text-slate-400 font-bold tracking-tight">{{ new Date(res.submittedAt).toLocaleDateString() }} at {{ new Date(res.submittedAt).toLocaleTimeString() }}</span>
          </div>
          <div class="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            <div v-for="(val, key) in res.data" :key="key" class="space-y-2 p-5 bg-slate-50/30 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ key }}</p>
              <p class="text-sm text-slate-900 font-bold truncate">{{ val || '—' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <ConfirmationModal
      :is-open="isDeleteModalOpen"
      title="Destroy Hub"
      :message="`WARNING: Protocol Irreversible. You are about to permanently decommission '${formToDelete?.title}'. All data and captures will be erased.`"
      confirm-text="Confirm Destruction"
      cancel-text="Abort"
      type="danger"
      :is-loading="isDeleting"
      @close="isDeleteModalOpen = false"
      @confirm="executeDeleteForm"
    />
  </div>
</template>

<script setup>
import { 
  LucideFileText, LucidePlus, LucideLayers, LucideMessageSquare, 
  LucideChevronDown, LucideInbox, LucideCopy, LucideTrash2, 
  LucideX, LucideArrowLeft, LucideLink, LucideCheckCircle,
  LucideSettings2
} from 'lucide-vue-next';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';

const { fetchAdmin, postAdmin, patchAdmin, deleteAdmin } = useAdminApi();
const { success: toastSuccess, error: toastError } = useToast();

const forms = ref([]);
const view = ref('list'); // 'list' | 'editor' | 'responses'
const selectedForm = ref(null);
const formToDelete = ref(null);
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
    title: 'New Artisanal Form',
    description: 'Bespoke enquiry point for your cake ecosystem.',
    fields: [{ label: 'Full Name', type: 'text', required: true, options: [] }],
    responses: [],
    isActive: true
  };
  view.value = 'editor';
};

const editForm = (form) => {
  selectedForm.value = JSON.parse(JSON.stringify(form));
  view.value = 'editor';
};

const viewResponses = (form) => {
  selectedForm.value = JSON.parse(JSON.stringify(form));
  view.value = 'responses';
};

const copyPublicLink = (id) => {
  const url = `http://localhost:3002/forms/${id}`;
  navigator.clipboard.writeText(url);
  toastSuccess('Public link copied to clipboard');
};

const saveForm = async () => {
  isSaving.value = true;
  try {
    selectedForm.value.fields.forEach(f => {
      if (f.type === 'select' && !f.options) f.options = [];
    });

    if (selectedForm.value._id) {
      await patchAdmin(`/forms/${selectedForm.value._id}`, selectedForm.value);
      toastSuccess('Architecture synchronized');
    } else {
      const res = await postAdmin('/forms', selectedForm.value);
      selectedForm.value = res;
      toastSuccess('New hub deployed successfully');
    }
    await loadForms();
    view.value = 'list';
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
  selectedForm.value.fields.push({ label: 'New Element', type: 'text', required: false, options: [] });
};

const addOption = (field) => {
  if (!field.options) field.options = [];
  field.options.push(`Option ${field.options.length + 1}`);
};

const removeOption = (field, index) => {
  field.options.splice(index, 1);
};

const openDeleteModal = (form) => {
  formToDelete.value = form;
  isDeleteModalOpen.value = true;
};

const executeDeleteForm = async () => {
  if (!formToDelete.value?._id) {
    isDeleteModalOpen.value = false;
    return;
  }
  
  isDeleting.value = true;
  try {
    await deleteAdmin(`/forms/${formToDelete.value._id}`);
    toastSuccess('Hub decommissioned');
    await loadForms();
    if (selectedForm.value?._id === formToDelete.value._id) {
      selectedForm.value = null;
      view.value = 'list';
    }
  } catch (e) {
    toastError('Decommissioning protocol failed');
  } finally {
    isDeleting.value = false;
    isDeleteModalOpen.value = false;
  }
};

definePageMeta({ layout: 'default' });
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}
.animate-slide-up {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Custom scrollbar for tabular view */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #f1f5f9;
  border-radius: 10px;
}
</style>
