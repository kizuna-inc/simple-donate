<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import type { OverviewInterface } from '@/modules/interface/install/overview'
import type { BankingInterface } from '@/modules/interface/install/banking'

import { isConfig } from '@/modules/session/configSetup'

import DonateSetup from '@/components/Donation/DonateSetup.vue'

const config = ref<OverviewInterface | null>(null)
const fullBankConfig = ref<BankingInterface | BankingInterface[] | null>(null)
const bankConfig = ref<BankingInterface | null>(null)
const state = ref<number>(0)

const isLoading = ref<boolean>(true)
const error = ref<String>('')

const bankingUpdate = () => {
  let itemPayload: BankingInterface | null | undefined = null

  if (Array.isArray(fullBankConfig.value)) {
    itemPayload = fullBankConfig.value[state.value]
  } else {
    itemPayload = fullBankConfig.value
  }

  if (itemPayload !== undefined && itemPayload !== null) {
    bankConfig.value = itemPayload
  } else {
    console.log(`can't find bank payload`)
  }
}

const switchState = (id: number) => {
  state.value = id
}

watch(state, () => bankingUpdate())

onMounted(async () => {
  const checkConfig = await isConfig(true)

  if (checkConfig) {
    try {
      const configFetch = await (
        await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/config`)
      ).json()

      const payload = configFetch.payload as OverviewInterface

      config.value = payload

      if (config.value === null) {
        return
      }

      if (config.value.banking === null) {
        return
      }

      fullBankConfig.value = config.value.banking

      bankingUpdate()
    } catch (e) {
      const err = e as Error

      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }
})
</script>

<template>
  <main v-if="isLoading && error === ''" class="loading-container">
    <h1>Loading..</h1>
  </main>

  <main v-if="error !== ''">
    <h1>Error</h1>
    <p>{{ error }}</p>
  </main>

  <main v-if="!isLoading && error === ''" class="loading-container">
    <DonateSetup
      :bank="bankConfig"
      :user="config !== undefined && config !== null ? config.detailed : null"
      :fullBank="
        fullBankConfig !== null && Array.isArray(fullBankConfig) ? fullBankConfig : undefined
      "
      :upState="switchState"
      :state="state"
    />
  </main>
</template>

<style scoped>
.loading-container {
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
