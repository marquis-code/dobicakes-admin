<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UiToastProvider />
  </div>
</template>
<script setup>
const { fetchProfile } = useAdminAuth();
onMounted(fetchProfile);
</script>
