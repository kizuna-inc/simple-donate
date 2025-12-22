<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import type { transactionInterface } from '@/modules/interface/dashboard/transaction'
import type { responseInterface } from '@/modules/interface/responseInterface'
import { dateParser } from '@/modules/functions/dateParser'

const transactionData = ref<transactionInterface[] | undefined | null>(undefined)

onMounted(async () => {
  const fetchData = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/dashboard/transaction`, {
    method: 'get',
    headers: new Headers({
      Authorization: `${window.sessionStorage.getItem('token')}`,
    }),
  })

  if (!fetchData.ok) {
    console.log('something error :|')
    return
  }

  const fetchResponse = (await fetchData.json()) as responseInterface<transactionInterface[]>

  if (fetchResponse.status !== 1) {
    console.log('something error :|')
    console.log(fetchResponse.message)

    return
  }

  transactionData.value = fetchResponse.payload
})
</script>

<template>
  <div class="main-display-container">
    <!-- Transaction Table -->
    <h1>รายการโดเนท</h1>
    <table class="table table-striped table-dark">
      <thead>
        <tr>
          <th scope="col">ลำดับ</th>
          <th scope="col">ชื่อผู้โดเนท</th>
          <th scope="col">ข้อความ</th>
          <th scope="col">จำนวนเงิน</th>
          <th scope="col">วันที่ และ เวลา</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in transactionData">
          <td scope="row">
            {{ key + 1 }}
          </td>
          <td>
            {{ item.name }}
          </td>
          <td>
            {{ item.message }}
          </td>
          <td>
            {{ item.amount }}
          </td>
          <td>
            {{ dateParser(item.create_at) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.main-display-container {
  min-width: 75dvw;
  width: 100%;

  padding: 1rem;
}

.main-display-container.min {
  width: 100% !important;
}

/* table {
  width: 100%;
  text-align: center;
  border-collapse: collapse;

  thead {
    font-size: bold;
  }

  tr {
    border: 1px solid whitesmoke;
  }

  th,
  td {
    padding: 1rem;
    border: 1px solid whitesmoke;
  }
} */
</style>
