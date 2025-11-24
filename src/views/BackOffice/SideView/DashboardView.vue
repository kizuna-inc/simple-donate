<script lang="ts" setup>
import type { summaryInterface } from '@/modules/interface/dashboard/summary'
import type { responseInterface } from '@/modules/interface/responseInterface'
import { onMounted, ref } from 'vue'

const summarizeData = ref<summaryInterface | null | undefined>(null)

const parser = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) {
    return amount
  }

  return parseFloat(String(amount)).toFixed(2)
}

onMounted(async () => {
  const fetchCall = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/dashboard/summary`, {
    method: 'get',
    headers: new Headers({
      Authorization: `${window.sessionStorage.getItem('token')}`,
    }),
  })

  if (!fetchCall.ok) {
    console.error('not ok bro, not ok')
    return
  }

  const fetchPayload = (await fetchCall.json()) as responseInterface<summaryInterface>

  if (fetchPayload.status !== 1) {
    console.error('not ok bro, not ok but maybe not this side fault..')
    return
  }

  summarizeData.value = fetchPayload.payload
})
</script>

<template>
  <div class="main-display-container">
    <div class="top-header">
      <div class="box all-donate">
        <h2>ยอดรวมโดเนทที่ได้รับทั้งหมด</h2>
        <p>{{ parser(summarizeData?.widget.all_time) }} บาท</p>
      </div>
      <div class="box all-donate">
        <h2>ยอดรวมโดเนทที่ได้รับวันนี้</h2>
        <p>{{ parser(summarizeData?.widget.today) }} บาท</p>
      </div>
    </div>

    <div class="graph-data">
      <h1>กราฟข้อมูลเปรียบเทียบรายวัน</h1>
      <h1 class="coming-soon">Coming soon</h1>
    </div>
  </div>
</template>

<style scoped>
.main-display-container {
  min-width: 75dvw;
  width: 100%;
  padding: 1rem;

  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.main-display-container.min {
  width: 100% !important;
}

.top-header {
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.box {
  width: 18rem;
  aspect-ratio: 4/2;

  border: 1px solid rgba(245, 245, 245, 0.3);
  border-left: 0 !important;
  border-bottom: 0 !important;
  border-radius: 1rem;
  padding: 1rem;

  background: linear-gradient(45deg, transparent, transparent, rgba(245, 245, 245, 0.2));
}

.coming-soon {
  opacity: 0.6;
}
</style>
