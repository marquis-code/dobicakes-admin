<template>
  <!-- Main Container -->
  <div class="flex h-full w-full overflow-hidden relative">
    <!-- Sidebar / Contact List -->
    <div :class="[
           'w-full md:w-[400px] flex flex-col border-r border-[#d1d7db] bg-white h-full shrink-0 transition-transform duration-300 z-20',
           selectedRoom && 'hidden md:flex'
         ]">
      <!-- User Profile Header -->
      <div class="h-[60px] bg-[#f0f2f5] px-4 flex items-center justify-between border-b border-[#e9edef] shrink-0">
        <div class="flex items-center gap-3">
          <NuxtLink to="/admin" class="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-brand-gold transition-all group shadow-lg shadow-slate-900/10">
            <LucideLayoutDashboard :size="14" />
          </NuxtLink>
          <span class="text-xs font-bold text-slate-400 tracking-tight ">Concierge</span>
        </div>
        <div class="flex gap-4 text-[#54656f]">
          <LucideMessageSquare :size="20" class="cursor-pointer hover:text-brand-gold transition-colors" />
          <LucideMoreVertical :size="20" class="cursor-pointer hover:text-brand-gold transition-colors" />
        </div>
      </div>

      <!-- Search / Filter -->
      <div class="p-2 bg-white shrink-0">
        <div class="bg-[#f0f2f5] flex items-center px-3 py-1.5 rounded-lg">
          <LucideSearch :size="16" class="text-[#54656f] mr-4" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search or start new chat" 
            class="bg-transparent border-none outline-none text-sm w-full text-[#3b4a54] placeholder:text-[#667781]"
          />
        </div>
      </div>

      <!-- Contact List -->
      <div class="flex-grow overflow-y-auto bg-white custom-scrollbar">
        <div v-for="room in filteredRooms" :key="room._id" 
             @click="selectRoom(room)"
             :class="selectedRoom?._id === room._id ? 'bg-[#f0f2f5]' : 'hover:bg-[#f5f6f6]'"
             class="h-[72px] px-3 flex items-center gap-3 cursor-pointer border-b border-[#f5f6f6] transition-colors group">
          <div class="w-12 h-12 bg-[#dfe5e7] rounded-full flex items-center justify-center text-slate-500 text-lg font-bold shrink-0">
            {{ room.userName?.[0] || '?' }}
          </div>
          <div class="flex-grow min-w-0 pr-2">
            <div class="flex justify-between items-baseline mb-1">
              <h3 class="text-[#111b21] text-base font-normal truncate">{{ room.userName }}</h3>
              <span class="text-xs text-[#667781]">{{ formatTimeShort(room.createdAt) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <p class="text-sm text-[#667781] truncate">{{ room.displayMessage }}</p>
              <div v-if="room.unreadCount > 0" class="bg-[#25d366] text-white text-xs font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                {{ room.unreadCount }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Chat Window -->
    <div :class="[
           'flex-grow flex flex-col h-full bg-[#efeae2] relative overflow-hidden transition-transform duration-300',
           !selectedRoom && 'hidden md:flex'
         ]">
      <!-- Chat Header -->
      <div v-if="selectedRoom" class="h-[60px] bg-[#f0f2f5] px-4 flex items-center justify-between border-b border-[#e9edef] shrink-0 z-10">
        <div class="flex items-center gap-3">
          <!-- Mobile Back Button -->
          <button @click="selectedRoom = null" class="md:hidden p-2 -ml-2 text-[#54656f] hover:text-brand-gold transition-colors">
            <LucideArrowLeft :size="20" />
          </button>
          <div class="w-10 h-10 bg-[#dfe5e7] rounded-full flex items-center justify-center text-slate-500 font-bold">
            {{ selectedRoom.userName?.[0] }}
          </div>
          <div>
            <h4 class="text-base text-[#111b21] leading-tight font-normal">{{ selectedRoom.userName }}</h4>
            <p class="text-xs text-[#667781]">{{ isOnline ? 'online' : 'last seen recently' }}</p>
          </div>
        </div>
        <div class="flex gap-4 text-[#54656f]">
          <button @click="showAutoResponder = true" class="p-2 hover:bg-slate-200 rounded-full transition-colors" title="Auto-Responder Settings">
            <LucideSettings :size="20" />
          </button>
          <LucideMoreVertical :size="20" class="cursor-pointer" />
        </div>
      </div>

      <!-- Empty State (Desktop only) -->
      <div v-if="!selectedRoom" class="hidden md:flex flex-grow flex flex-col items-center justify-center text-center p-12 space-y-4">
        <div class="w-[300px] h-[300px] rounded-full bg-[#f0f2f5] flex items-center justify-center mb-8 relative">
          <LucideMessageSquare :size="100" class="text-[#d1d7db]" />
          <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center animate-bounce-subtle">
             <LucideHeart :size="40" class="text-brand-gold opacity-40" />
          </div>
        </div>
        <h2 class="text-3xl text-[#41525d] font-light">Artisan Chat Intelligence</h2>
        <p class="text-sm text-[#667781] max-w-md">Connect with your customers in real-time. Manage enquiries, provide consultations, and share the artisanal story of Adaobi Cakes.</p>
        
        <div class="grid grid-cols-2 gap-4 mt-12 max-w-xl">
           <div class="p-6 bg-white/50 rounded-2xl border border-slate-200/50 text-left">
              <p class="text-sm font-bold text-slate-400  tracking-tight mb-2">Auto-Responder</p>
              <p class="text-xs text-slate-500 leading-relaxed">Configure automated greetings and delay messages to ensure no customer feels neglected.</p>
           </div>
           <div class="p-6 bg-white/50 rounded-2xl border border-slate-200/50 text-left">
              <p class="text-sm font-bold text-slate-400  tracking-tight mb-2">Quick Responses</p>
              <p class="text-xs text-slate-500 leading-relaxed">Save frequently used artisanal descriptions and consultation details for rapid dispatch.</p>
           </div>
        </div>
      </div>

      <!-- Chat Messages -->
      <div v-if="selectedRoom" class="flex-grow overflow-y-auto p-4 md:p-8 lg:p-12 space-y-2 chat-bg custom-scrollbar" ref="messageContainer">
        <div v-for="(msg, idx) in messages" :key="idx" 
             :class="msg.senderType === 'ADMIN' ? 'justify-end' : 'justify-start'"
             class="flex mb-1 animate-fade-in">
          <div :class="msg.senderType === 'ADMIN' ? 'bg-[#d9fdd3] text-[#111b21]' : 'bg-white text-[#111b21]'"
               class="max-w-[90%] md:max-w-[85%] lg:max-w-[65%] rounded-lg shadow-sm relative text-sm leading-normal min-w-[60px] overflow-hidden">
            <!-- Media Attachment -->
            <div v-if="msg.attachments && Array.isArray(msg.attachments) && msg.attachments.length > 0" class="p-1">
              <img v-for="url in msg.attachments" :key="url" :src="url" class="w-full rounded-md object-cover max-h-[400px] cursor-zoom-in" />
            </div>
            <!-- Text Content -->
            <div v-if="msg.message" class="px-3 py-2">
              <p>{{ msg.message }}</p>
            </div>
            <div class="flex items-center justify-end gap-1 px-3 pb-2">
              <span class="text-tiny text-[#667781] ">{{ formatTimeShort(msg.createdAt) }}</span>
              <LucideCheck v-if="msg.senderType === 'ADMIN'" :size="12" class="text-[#53bdeb]" />
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Input Area -->
      <div v-if="selectedRoom" class="flex flex-col shrink-0 z-10 shadow-2xl">
        <!-- Quick Responses Strip -->
        <div class="bg-[#f0f2f5]/80 backdrop-blur-md px-4 py-2 border-t border-[#e9edef] flex gap-2 overflow-x-auto no-scrollbar">
          <button v-for="resp in quickResponses" :key="resp" 
                  @click="newMessage = resp; sendMessage()"
                  class="whitespace-nowrap px-4 py-1.5 bg-white rounded-full text-sm font-bold text-slate-600 border border-slate-200 hover:border-brand-gold hover:text-brand-gold transition-all shadow-sm">
            {{ resp }}
          </button>
        </div>

        <!-- Main Input Area -->
        <div v-if="pendingAdminImage" class="min-h-[62px] bg-[#f0f2f5] px-4 py-2 flex items-center gap-4 relative animate-slide-up">
           <div class="relative shrink-0">
             <img :src="pendingAdminImage" class="w-12 h-12 rounded-lg object-cover shadow-sm" />
             <button @click="pendingAdminImage = null; pendingAdminFile = null" class="absolute -top-2 -right-2 bg-slate-200 rounded-full hover:bg-slate-300 p-0.5">
                <LucideX :size="12" />
             </button>
             <div v-if="isAdminUploading" class="absolute inset-0 bg-white/60 flex items-center justify-center rounded-lg">
                <div class="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
             </div>
           </div>
           <input 
             v-model="newMessage" 
             @keyup.enter="isAdminUploading ? null : uploadAndSendAdmin()" 
             type="text" 
             placeholder="Add a caption..." 
             class="flex-grow bg-white border-none outline-none px-4 py-2.5 rounded-lg text-sm text-[#3b4a54] shadow-inner" 
           />
           <button @click="uploadAndSendAdmin()" 
                   :disabled="isAdminUploading"
                   class="shrink-0 p-2 bg-brand-gold text-white rounded-full hover:scale-110 transition-transform disabled:opacity-50">
             <LucideSendHorizontal :size="20" />
           </button>
        </div>
        <div v-else class="min-h-[62px] bg-[#f0f2f5] px-4 py-2 flex items-center gap-4">
          <div class="flex gap-4 text-[#54656f] shrink-0 items-center relative">
            <div class="relative">
              <LucideSmile :size="24" class="cursor-pointer hover:text-brand-gold transition-colors hidden sm:block" @click="showEmojiPicker = !showEmojiPicker" />
              
              <div v-if="showEmojiPicker" class="absolute bottom-[40px] left-0 bg-white p-2 rounded-xl shadow-2xl border border-slate-200 z-50 w-[240px] animate-fade-in">
                <div class="flex justify-between items-center mb-2 px-1">
                  <span class="text-sm font-bold text-slate-400  tracking-tight">Emojis</span>
                  <button @click="showEmojiPicker = false" class="text-slate-400 hover:text-brand-gold">
                    <LucideX :size="14" />
                  </button>
                </div>
                <div class="grid grid-cols-6 gap-1 h-[180px] overflow-y-auto custom-scrollbar p-1">
                  <button v-for="emoji in emojis" :key="emoji" @click="newMessage += emoji" class="text-lg hover:bg-slate-100 p-1 rounded transition-colors text-center focus:outline-none">
                    {{ emoji }}
                  </button>
                </div>
              </div>
            </div>
            
            <button @click="$refs.adminFileInput.click()" class="text-[#54656f] hover:text-brand-gold transition-colors focus:outline-none">
              <LucideImage :size="24" />
            </button>
            <input type="file" ref="adminFileInput" hidden accept="image/*" @change="handleAdminFileSelect" />
          </div>

          <input 
            v-model="newMessage" 
            @keyup.enter="sendMessage()" 
            type="text" 
            placeholder="Type a message..." 
            class="flex-grow bg-white border-none outline-none px-4 py-2.5 rounded-lg text-sm text-[#3b4a54] shadow-inner" 
          />
          <div class="shrink-0 text-[#54656f]">
            <button v-if="newMessage.trim()" 
                    @click="sendMessage()" 
                    class="p-2 bg-brand-gold text-white rounded-full hover:scale-110 transition-transform">
              <LucideSendHorizontal :size="20" />
            </button>
            <LucideMic v-else :size="24" class="cursor-pointer hover:text-brand-gold transition-colors" />
          </div>
        </div>
      </div>

      <!-- Auto-Responder Settings Drawer -->
      <UiDrawer 
        :model-value="showAutoResponder" 
        title="Concierge Intelligence"
        subtitle="Automate your customer greeting and delay logic"
        @update:model-value="showAutoResponder = false"
      >
        <div class="space-y-10 py-4">
           <div class="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-6">
              <div class="flex justify-between items-center">
                 <div class="flex flex-col">
                   <span class="text-sm font-bold text-slate-900">Automation Status</span>
                   <p class="text-tiny text-slate-500 font-medium">Toggle all automated responses</p>
                 </div>
                 <label class="relative inline-flex items-center cursor-pointer">
                   <input v-model="autoResponder.enabled" type="checkbox" class="sr-only peer">
                   <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-gold"></div>
                 </label>
              </div>
           </div>

           <div class="space-y-4">
              <label class="admin-label">Greeting Narrative</label>
              <textarea v-model="autoResponder.greeting" rows="4" class="admin-input !bg-white" placeholder="Hello! Welcome to Adaobi Cakes..."></textarea>
              <p class="text-tiny text-slate-400 font-medium leading-relaxed italic">Sent instantly when a new customer initiates a conversation.</p>
           </div>

           <div class="space-y-4">
              <label class="admin-label">Delayed Response Strategy</label>
              <textarea v-model="autoResponder.delayMessage" rows="4" class="admin-input !bg-white" placeholder="Our artisans are currently busy crafting..."></textarea>
              <p class="text-tiny text-slate-400 font-medium leading-relaxed italic">Dispatched after 5 minutes of inactivity to maintain customer engagement.</p>
           </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-5">
            <button @click="showAutoResponder = false" class="px-8 py-3.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Dismiss</button>
            <button @click="saveResponderSettings" class="btn-admin-primary px-10 py-3.5">
              Sync Intelligence
            </button>
          </div>
        </template>
      </UiDrawer>
    </div>
  </div>
</template>

<script setup>
import { 
  LucideLayoutDashboard,
  LucideMessageSquare, 
  LucideMoreVertical, 
  LucideSearch, 
  LucideSmile, 
  LucidePaperclip, 
  LucideMic, 
  LucideSendHorizontal, 
  LucideCheck,
  LucideLock,
  LucideSettings,
  LucideHeart,
  LucideArrowLeft,
  LucideX,
  LucideImage
} from 'lucide-vue-next';
import { io } from 'socket.io-client';

definePageMeta({
  layout: 'chat'
});

const { fetchAdmin, patchAdmin } = useAdminApi();
const runtimeConfig = useRuntimeConfig();
const { uploadImage } = useCloudinary();
const { success: toastSuccess } = useToast();

const selectedRoom = ref(null);
const newMessage = ref('');
const messages = ref([]);
const activeRooms = ref([]);
const searchQuery = ref('');
const messageContainer = ref(null);
const isOnline = ref(true);

// Media State
const pendingAdminImage = ref(null);
const pendingAdminFile = ref(null);
const isAdminUploading = ref(false);

// Automation State
const showAutoResponder = ref(false);
const autoResponder = ref({
  enabled: true,
  greeting: "Welcome to Adaobi Cakes! Our artisans have received your message and will be with you momentarily to discuss your celebration requirements.",
  delayMessage: "We apologize for the delay. We are currently experiencing a high volume of enquiries. Your patience is valued as we ensure every detail is handled with precision."
});

const quickResponses = [
  "Hello! How can we help today?",
  "We are currently fully booked for this date.",
  "Our signature flavor is the Sicilian Lemon.",
  "Delivery typically takes 48 hours for bespoke orders.",
  "Please share your preferred delivery date.",
  "Thank you for choosing Adaobi Cakes!"
];

const showEmojiPicker = ref(false);
const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
  '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍪',
  '🎉', '🎊', '🎈', '🎁', '🎀', '✨', '💖', '💝', '👏', '🙌'
];

let socket;

const handleAdminFileSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    pendingAdminFile.value = file;
    pendingAdminImage.value = URL.createObjectURL(file);
  }
};

const uploadAndSendAdmin = async () => {
  if (!pendingAdminFile.value || isAdminUploading.value || !selectedRoom.value) return;
  isAdminUploading.value = true;
  try {
    const url = await uploadImage(pendingAdminFile.value);
    const payload = {
      userName: 'Admin',
      userEmail: 'admin@adaobicakes.com',
      message: newMessage.value,
      roomId: selectedRoom.value._id,
      senderType: 'ADMIN',
      attachments: [url],
      createdAt: new Date()
    };
    socket.emit('sendMessage', payload);
    newMessage.value = '';
    pendingAdminImage.value = null;
    pendingAdminFile.value = null;
  } catch (e) {
    console.error('Upload failed', e);
  } finally {
    isAdminUploading.value = false;
  }
};

const fetchRooms = async () => {
  try {
    const data = await fetchAdmin('/chat/rooms');
    activeRooms.value = data;
  } catch (e) {
    console.error('Failed to fetch rooms', e);
  }
};

const filteredRooms = computed(() => {
  if (!searchQuery.value) return activeRooms.value;
  return activeRooms.value.filter(r => 
    r.userName?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const selectRoom = async (room) => {
  selectedRoom.value = room;
  try {
    const data = await fetchAdmin(`/chat/history/${room._id}`);
    messages.value = data;
    
    // Join room for real-time
    if (socket) {
      socket.emit('joinRoom', room._id);
    }
    
    // Mark as read
    await patchAdmin(`/chat/read/${room._id}`, {});
    fetchRooms(); // Refresh counts
    scrollToBottom();
  } catch (e) {
    console.error('Failed to fetch history', e);
  }
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !socket || !selectedRoom.value) return;
  
  const payload = {
    userName: 'Admin',
    userEmail: 'admin@adaobicakes.com',
    message: newMessage.value,
    roomId: selectedRoom.value._id,
    senderType: 'ADMIN',
    attachments: [],
    createdAt: new Date()
  };

  socket.emit('sendMessage', payload);
  newMessage.value = '';
};

const saveResponderSettings = () => {
  localStorage.setItem('dobi_responder', JSON.stringify(autoResponder.value));
  showAutoResponder.value = false;
  toastSuccess('Intelligence settings updated');
};

const formatTimeShort = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

onMounted(() => {
  fetchRooms();
  
  const savedResponder = localStorage.getItem('dobi_responder');
  if (savedResponder) autoResponder.value = JSON.parse(savedResponder);
  
  socket = io(runtimeConfig.public.apiBase);
  
  socket.on('message', (msg) => {
    if (selectedRoom.value && msg.roomId === selectedRoom.value._id) {
      messages.value.push(msg);
      scrollToBottom();
    }
    fetchRooms(); // Refresh last message in list
  });

  socket.on('adminNotification', (data) => {
    fetchRooms();
    // Play notification sound
    const audio = new Audio('/sounds/notification.mp3');
    audio.play().catch(() => {});
  });
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #ced0d1;
}

.chat-bg {
  background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
  background-blend-mode: overlay;
  background-color: rgba(239, 234, 226, 0.9);
}

.clip-tail-right {
  clip-path: polygon(0 0, 0 100%, 100% 0);
}

.clip-tail-left {
  clip-path: polygon(100% 0, 100% 100%, 0 0);
}
</style>
