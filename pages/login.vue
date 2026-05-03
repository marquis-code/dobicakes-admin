<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-900 p-8">
    <div class="max-w-md w-full space-y-12 animate-fade-in bg-white p-12 rounded-lg shadow-2xl">
      <div class="text-center space-y-4">
        <div class="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center font-bold text-white text-2xl mx-auto shadow-lg">A</div>
        <h1 class="text-2xl font-bold text-slate-900  tracking-tight">Daobicakes <span class="text-brand-gold">Admin</span></h1>
        <p class="text-sm text-gray-800  tracking-[0.3em] font-medium">Dashboard Authentication</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-2">
          <label class="text-sm font-bold  tracking-tight text-slate-400">Email</label>
          <input v-model="form.email" type="email" required class="w-full border border-gray-100 bg-gray-50 px-4 py-4 outline-none focus:border-brand-gold transition-colors text-xs font-medium rounded-sm" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-bold  tracking-tight text-slate-400">Password</label>
          <div class="relative">
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required class="w-full border border-gray-100 bg-gray-50 px-4 py-4 pr-12 outline-none focus:border-brand-gold transition-colors text-xs font-medium rounded-sm" />
            <button @click="showPassword = !showPassword" type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-brand-gold transition-colors">
              <LucideEye v-if="!showPassword" :size="16" />
              <LucideEyeOff v-else :size="16" />
            </button>
          </div>
        </div>

        <button :disabled="loading" class="bg-brand-gold text-white w-full py-3 tracking-[0.3em] text-sm font-bold hover:bg-brand-gold-dark transition-all rounded-sm shadow-md">
          <span v-if="loading" class="animate-pulse">Authorizing...</span>
          <span v-else>Login</span>
        </button>
      </form>

      <p class="text-center text-tiny  tracking-tight text-gray-300 italic">
        Authorized Access Only. All actions are logged.
      </p>
    </div>
  </div>
</template>

<script setup>
import { LucideEye, LucideEyeOff } from 'lucide-vue-next';
const { login } = useAdminAuth();
const loading = ref(false);
const showPassword = ref(false);

const form = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  loading.value = true;
  try {
    await login(form.value);
    navigateTo('/admin');
  } catch (error) {
    const { error: toastError } = useToast();
    toastError('Access Denied: Invalid admin credentials');
  } finally {
    loading.value = false;
  }
};

definePageMeta({ layout: false }); // No sidebar for login
</script>
