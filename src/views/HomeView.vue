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
  }
})
</script>

<template>
  <main>
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
