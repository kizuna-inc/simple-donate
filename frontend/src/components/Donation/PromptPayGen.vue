<script lang="ts" setup>
import Swal from 'sweetalert2'

import copy from '@/assets/image/copy.png'

import type { BankingInterface } from '@/modules/interface/install/banking'

const props = defineProps<{
  bank: BankingInterface | null
  amount: number
  qrCode: string
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
</script>

<template>
  <div class="preview" v-if="props.bank?.type === 0">
    <div v-html="props.qrCode" class="qrCode" v-if="props.amount > 0"></div>

    <div>
      <p class="label">ชื่อผู้รับ</p>
      <p class="main">
        {{ props.bank?.name }}
      </p>

      <p class="label">เลขบัญชี</p>
      <p class="main" @click="copyClipboard(props.bank?.no)">
        {{ props.bank?.no }}
        <img :src="copy" style="width: 20px; aspect-ratio: 1/1; filter: invert()" />
      </p>

      <!-- <p style="border-bottom: 1px solid #2e2f2f; margin: 0.5rem 0; width: 100%"></p> -->
      <p style="border-bottom: 1px solid whitesmoke; margin: 0.5rem 0; width: 100%"></p>

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

  .preview .qrCode {
    width: 300px;
  }

  .preview div {
    width: 50%;
    margin-top: 0;
  }
}
</style>
