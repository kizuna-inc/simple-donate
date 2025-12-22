<script lang="ts" setup>
import { ref } from 'vue'

import User from '@/components/BackOffice/Config/User.vue'
import Banking from '@/components/BackOffice/Config/Banking.vue'
import Overlay from '@/components/BackOffice/Config/Overlay.vue'

const page = ref<1 | 2 | 3>(1)

const switcher = (no: 1 | 2 | 3) => {
  page.value = no
}
</script>

<template>
  <div class="main-display-container">
    <div class="mini-nav">
      <button :class="page === 1 ? 'active' : ''" @click="() => switcher(1)">ตั้งค่าผู้ใช้</button>
      <button :class="page === 2 ? 'active' : ''" @click="() => switcher(2)">ตั้งค่าธนาคาร</button>
      <button :class="page === 3 ? 'active' : ''" @click="() => switcher(3)">
        ตั้งค่า Overlay (ตอนสตรีม)
      </button>
    </div>
    <div class="display">
      <User v-if="page === 1" />
      <Banking v-if="page === 2" />
      <Overlay v-if="page === 3" />
    </div>
  </div>
</template>

<style scoped>
.main-display-container {
  min-width: 75dvw;
  width: 100%;
  height: 100dvh;
  padding: 1rem;

  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.mini-nav {
  width: 100%;
  height: 5%;

  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid whitesmoke;

  button {
    background: linear-gradient(45deg, transparent, rgba(245, 245, 245, 0.2));
    color: whitesmoke;
    opacity: 0.6;

    border: 1px solid whitesmoke;
    border-left: 0;
    border-bottom: 0;

    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;

    padding: 0 1rem;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  button.active {
    opacity: 1 !important;
  }
}

.display {
  width: 100%;
  height: calc(100% - 5% - 2rem);
}
</style>
