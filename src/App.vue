<script setup lang="ts">
import Menubar from './components/ui/Menubar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto p-6">
      <Menubar/>
      <router-view />
    </div>
  </div>
</template>
