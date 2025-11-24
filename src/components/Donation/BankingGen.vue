<script lang="ts" setup>
import Swal from 'sweetalert2'

import copy from '@/assets/image/copy.png'

import type { BankingInterface } from '@/modules/interface/install/banking'

const props = defineProps<{
  bank: BankingInterface | null
  amount: number
}>()

const copyClipboard = async (text: string | null) => {
  if (text !== null) {
    await navigator.clipboard.writeText(text)
    Swal.fire({
      icon: 'success',
      title: 'สำเร็จ',
      text: 'คัดลอกเลขบัญชีสำเร็จ',
    })
  }
}

const bankParser = (no: string | undefined | null) => {
  if (no !== undefined && no !== null) {
    let slugList = [2, 3, 8]

    let rtn = ''

    for (let i = 0; i < no.length; i++) {
      rtn += no[i]

      if (slugList.indexOf(i) !== -1) {
        rtn += '-'
      }
    }

    return rtn
  } else {
    return undefined
  }
}
</script>

<template>
  <div v-if="props.bank?.type === 1" class="preview">
    <div>
      <p class="label">ชื่อผู้รับ</p>
      <p class="main">
        {{ props.bank?.name }}
      </p>

      <p class="label">เลขบัญชี</p>
      <p class="main" @click="copyClipboard(props.bank?.no)">
        {{ bankParser(props.bank?.no) }}
        <img :src="copy" style="width: 20px; aspect-ratio: 1/1; filter: invert()" />
      </p>
      <p class="main-label">
        {{ props.bank?.bank }}
      </p>

      <p style="border-bottom: 1px solid #2e2f2f; margin: 0.5rem 0; width: 100%"></p>

      <p class="label">จำนวนเงิน</p>
      <p class="main">
        <b>{{ props.amount }} บาท</b>
      </p>
    </div>
  </div>
</template>

<style scoped>
.preview {
  width: 20rem;
  padding: 1rem;
  border-radius: 1rem;

  /* background: whitesmoke;
  color: #2e2f2f; */

  background: linear-gradient(45deg, transparent, rgba(245, 245, 245, 0.1));
  color: whitesmoke;
  backdrop-filter: blur(2px);

  border: 1px solid rgba(254, 254, 254, 0.4);
  border-bottom: 0;
  border-left: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.preview div {
  width: 100%;

  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
}

.preview .label {
  width: 100%;
  opacity: 0.6;
}

.preview .qrCode {
  width: 80%;

  margin: 0 auto;
  border-radius: 1rem;
  aspect-ratio: 1/1;
}

.preview p {
  margin: 0;
  padding: 0;
}

@media only screen and (max-width: 1200px) {
  .preview {
    min-width: 18rem;
    max-width: 22rem;
    width: 100%;
    flex-direction: row !important;
  }

  .preview div {
    width: 100%;
    margin-top: 0;
  }
}
</style>
