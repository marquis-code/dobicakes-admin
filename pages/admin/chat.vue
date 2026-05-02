<template>
  <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 h-[calc(100vh-10rem)] animate-fade-in relative">
    <!-- Chat List -->
    <div :class="selectedRoom ? 'hidden lg:flex' : 'flex'" 
         class="lg:w-80 lg:shrink-0 admin-card !p-0 flex flex-col overflow-hidden bg-white border border-slate-200/60 rounded-2xl">
      <div class="p-6 border-b border-slate-50 bg-slate-50/50">
        <h3 class="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Support Rooms</h3>
      </div>
      <div class="flex-grow overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
        <div v-for="room in activeRooms" :key="room._id" 
             @click="selectRoom(room)"
             class="p-5 cursor-pointer hover:bg-slate-50 transition-all flex gap-4 items-center relative group"
             :class="selectedRoom?._id === room._id ? 'bg-brand-gold/5 border-r-4 border-brand-gold' : ''">
          <div class="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-[10px] font-bold tracking-widest text-brand-gold border border-slate-800 shadow-sm shrink-0">
            {{ room.userName?.[0] || '?' }}
          </div>
          <div class="flex-grow space-y-1 overflow-hidden">
            <div class="flex justify-between items-center">
              <span class="text-[11px] font-bold text-slate-900 tracking-widest truncate">{{ room.userName }}</span>
              <span class="text-[8px] text-slate-400 font-medium">{{ formatTime(room.createdAt) }}</span>
            </div>
            <p class="text-[10px] text-slate-500 line-clamp-1 italic font-light">"{{ room.lastMessage }}"</p>
            <div v-if="room.unreadCount > 0" class="absolute top-4 right-4 bg-brand-gold text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-brand-gold/20">
              {{ room.unreadCount }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Box -->
    <div :class="selectedRoom ? 'flex' : 'hidden lg:flex'" 
         class="flex-grow admin-card !p-0 flex flex-col overflow-hidden bg-white border border-slate-200/60 rounded-2xl relative shadow-sm shadow-slate-900/5">
      <!-- Empty State -->
      <div v-if="!selectedRoom" class="flex-grow flex flex-col items-center justify-center text-center space-y-6 text-slate-300 p-12 bg-slate-50/30">
        <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner">
          <LucideMessageSquare :size="40" class="text-slate-100" />
        </div>
        <div class="space-y-2">
          <p class="text-[11px] tracking-[0.3em] font-bold text-slate-400 uppercase">Select a room</p>
          <p class="text-[9px] tracking-widest text-slate-300">Choose a customer conversation to begin responding</p>
        </div>
      </div>

      <div v-else class="flex flex-col h-full bg-white">
        <!-- Header -->
        <div class="p-5 lg:p-6 border-b border-slate-100 flex justify-between items-center shrink-0 bg-slate-900 text-white">
          <div class="flex items-center gap-4">
            <button @click="selectedRoom = null" class="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white">
              <LucideArrowLeft :size="20" />
            </button>
            <div class="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center text-sm font-bold text-white italic shadow-lg shadow-brand-gold/20">
              {{ selectedRoom.userName?.[0] }}
            </div>
            <div>
              <h4 class="text-xs font-bold tracking-widest text-brand-gold uppercase">{{ selectedRoom.userName }}</h4>
              <p class="text-[8px] text-slate-400 tracking-widest uppercase">{{ selectedRoom.userEmail }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
             <span class="text-[9px] text-emerald-400 tracking-[0.2em] font-bold hidden sm:block animate-pulse">● Live Connection</span>
          </div>
        </div>

        <!-- Messages -->
        <div class="flex-grow overflow-y-auto p-6 lg:p-10 space-y-10 bg-slate-50/30 custom-scrollbar" ref="messageContainer">
          <div v-for="(msg, idx) in messages" :key="idx" 
               :class="msg.senderType === 'ADMIN' ? 'justify-end' : 'justify-start'"
               class="flex group">
            <div :class="msg.senderType === 'ADMIN' ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none shadow-sm'"
                 class="max-w-[85%] lg:max-w-[65%] p-5 rounded-2xl relative transition-all hover:scale-[1.01]">
              <p class="text-xs leading-relaxed font-medium">{{ msg.message }}</p>
              <div class="flex items-center justify-between mt-3 border-t border-white/10 pt-2" :class="msg.senderType === 'ADMIN' ? 'opacity-40' : 'opacity-100'">
                <span class="text-[7px] font-bold tracking-widest uppercase">{{ formatTime(msg.createdAt) }}</span>
                <LucideCheck v-if="msg.senderType === 'ADMIN'" :size="10" class="text-brand-gold" />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-6 lg:p-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 shrink-0 bg-white">
          <input 
            v-model="newMessage" 
            @keyup.enter="sendMessage" 
            type="text" 
            placeholder="Type your official response..." 
            class="flex-grow !bg-slate-50 !border-slate-100 px-6 py-4 rounded-xl outline-none focus:!border-brand-gold focus:!bg-white transition-all text-xs font-medium" 
          />
          <button 
            @click="sendMessage" 
            :disabled="!newMessage.trim()"
            class="bg-slate-900 text-white px-8 py-4 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-brand-gold hover:text-white transition-all shadow-lg shadow-slate-900/10 disabled:opacity-30"
          >
            Send Response
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucideMessageSquare, LucideCheck, LucideArrowLeft } from 'lucide-vue-next';
import { io } from 'socket.io-client';

const { $api } = useNuxtApp();
const selectedRoom = ref(null);
const newMessage = ref('');
const messages = ref([]);
const activeRooms = ref([]);
const messageContainer = ref(null);

let socket;

const fetchRooms = async () => {
  try {
    const data = await $api.get('/chat/rooms');
    activeRooms.value = data;
  } catch (e) {
    console.error('Failed to fetch rooms', e);
  }
};

const selectRoom = async (room) => {
  selectedRoom.value = room;
  try {
    const data = await $api.get(`/chat/history/${room._id}`);
    messages.value = data;
    
    // Join room for real-time
    if (socket) {
      socket.emit('joinRoom', room._id);
    }
    
    // Mark as read
    await $api.patch(`/chat/read/${room._id}`);
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
    createdAt: new Date()
  };

  socket.emit('sendMessage', payload);
  newMessage.value = '';
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
  
  socket = io('http://localhost:4000');
  
  socket.on('message', (msg) => {
    if (selectedRoom.value && msg.roomId === selectedRoom.value._id) {
      messages.value.push(msg);
      scrollToBottom();
    }
    fetchRooms(); // Refresh last message in list
  });

  socket.on('adminNotification', (data) => {
    fetchRooms();
  });
});

definePageMeta({ layout: 'default' });
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
