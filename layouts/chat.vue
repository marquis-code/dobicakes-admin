<template>
 <div class="h-screen w-screen bg-[#dadbd3] overflow-hidden antialiased">
 <!-- WhatsApp Background Stripe -->
 <div class="absolute top-0 left-0 w-full h-[127px] bg-[#00a884] -z-0"></div>
 
 <!-- Main Chat Container -->
 <div class="relative z-10 h-[calc(100vh-38px)] max-w-[1600px] mx-auto mt-[19px] flex shadow-2xl overflow-hidden bg-[#f0f2f5]">
 <slot />
 </div>
 </div>
</template>

<script setup>
// Minimal layout for WhatsApp-style chat
</script>

<style>
/* Reset some default dashboard styles if any */
body {
 margin: 0;
 padding: 0;
}
</style>
