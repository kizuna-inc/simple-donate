<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import type { OverviewInterface } from '@/modules/interface/install/overview'
import type { responseInterface } from '@/modules/interface/responseInterface'

import { logOut } from '@/modules/session/clearSession'

import Exit from '../icons/Exit.vue'
import History from '../icons/History.vue'
import Dashboard from '../icons/Dashboard.vue'

const { isMin, toggle } = defineProps<{
  isMin: boolean
  toggle: () => void
}>()

const config = ref<OverviewInterface | null>(null)
const background = ref<string>('')
const profile = ref<string>('')

const user = window.sessionStorage.getItem('username')

const callConfig = async () => {
  const call = (await (
    await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/config`)
  ).json()) as responseInterface<OverviewInterface>

  if (call.payload !== undefined && call.payload !== null) {
    config.value = call.payload

    if (call.payload.detailed !== null && call.payload.detailed !== undefined) {
      background.value = `${import.meta.env.VITE_API_ENDPOINT}/${call.payload.detailed.backgroundImage as string}`
      profile.value = `${import.meta.env.VITE_API_ENDPOINT}/${call.payload.detailed.profileImage as string}`
    }
  }
}

onMounted(() => {
  setTimeout(() => callConfig(), 1000)
})
</script>

<template>
  <div :class="isMin ? 'nav-container min' : 'nav-container'">
    <div class="userBox-overlay" :style="`background: url(${background})`">
      <div class="userBox">
        <div class="profile-image" :style="`background: url(${profile})`">
          <div class="profile-overlay"></div>
        </div>
        <div class="text-container" v-if="!isMin">
          <p>Welcome back,</p>
          <h3>{{ user }}</h3>
        </div>
      </div>
    </div>

    <RouterLink to="/admin" class="glass-btn">
      <Dashboard v-if="isMin" fill="#f5f5f5" style="width: 30px" />
      <span v-else>สรุปผล</span>
    </RouterLink>
    <RouterLink to="/admin/history" class="glass-btn">
      <History v-if="isMin" fill="#f5f5f5" style="width: 30px" />
      <span v-else>รายการย้อนหลัง</span>
    </RouterLink>
    <button type="button" class="glass-btn logout" @click="logOut">
      <Exit v-if="isMin" fill="#f5f5f5" style="width: 30px" />
      <span v-else>ออกจากระบบ</span>
    </button>

    <div style="height: 100%"></div>

    <button type="button" class="min-button glass-btn" @click="toggle()">
      {{ isMin ? '&raquo;' : '&laquo; ซ่อน' }}
    </button>
  </div>
</template>

<style scoped>
.nav-container {
  min-width: 25dvw !important;
  height: 100dvh;

  padding: 1rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  .userBox-overlay {
    height: 10rem;
    border-radius: 1rem;

    background-position: center !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
  }

  .userBox {
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(245, 245, 245, 0.1));

    color: whitesmoke;
    border: 1px solid rgba(245, 245, 245, 0.2);
    border-left: 0;
    border-bottom: 0;
    backdrop-filter: blur(2px) brightness(40%);

    border-radius: 1rem;

    padding: 1rem;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    .profile-image {
      width: 6.5rem;
      aspect-ratio: 1/1;

      background-position: center !important;
      background-size: cover !important;
      background-repeat: no-repeat !important;
      border-radius: 100%;
    }

    .profile-image:hover {
      transform: scale(0.9);
    }

    .profile-overlay {
      width: 100%;
      height: 100%;

      background: linear-gradient(45deg, transparent, rgba(245, 245, 245, 0.2));

      border-radius: 100%;
      border: 1px solid rgba(245, 245, 245, 0.3);
    }

    .text-container * {
      text-align: left;
      margin: 0;
    }
  }

  .glass-btn {
    display: block;
    text-align: center;
    text-decoration: none;

    background: linear-gradient(45deg, transparent, rgba(245, 245, 245, 0.3));

    color: whitesmoke;
    border: 1px solid rgba(245, 245, 245, 0.2);
    border-left: 0;
    border-bottom: 0;
    backdrop-filter: blur(2px);

    border-radius: 1rem;

    padding: 1rem;
  }

  .glass-btn:hover {
    opacity: 0.6;
  }

  .min-button {
    text-align: right;
  }

  .logout {
    background: linear-gradient(45deg, transparent, rgba(255, 0, 0, 0.3)) !important;
    border: 1px solid rgba(255, 0, 0, 0.2);
    border-left: 0;
    border-bottom: 0;

    transition: background 0.5s;
  }

  .logout:hover {
    background: linear-gradient(45deg, transparent, rgba(255, 0, 0, 0.1)) !important;
  }
}

.nav-container.min {
  min-width: 5dvw !important;

  .profile-image {
    width: 3rem;
  }
}

@media only screen and (max-width: 1200px) {
  .nav-container {
    min-width: 10dvh !important;

    .profile-image {
      width: 3rem;
    }
  }
}
</style>
