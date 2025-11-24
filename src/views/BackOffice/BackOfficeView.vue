<script lang="ts" setup>
import { ref } from 'vue'

import Navbar from '@/components/BackOffice/Navbar.vue'

const isMin = ref<boolean>(false)

const minToggle = () => {
  isMin.value = !isMin.value
}
</script>

<template>
  <div class="main-container">
    <Navbar :isMin="isMin" :toggle="minToggle" />
    <router-view />
  </div>
</template>

<style scoped>
.main-container {
  width: 100%;
  height: 100dvh;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
}

@media only screen and (max-width: 1200px) {
  .main-container {
    flex-direction: column !important;
  }
}
</style>
