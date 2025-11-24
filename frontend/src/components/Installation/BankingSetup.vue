<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import type { BankingInterface } from '@/modules/interface/install/banking'

import { BankingList } from '@/modules/constant/bankList'

const props = defineProps<{
  update: (payload: BankingInterface) => 0 | 1
  payload: BankingInterface
  next: () => void
  priv: () => void
}>()

// Ref Const
const name = ref<string>('')
const type = ref<number | ''>('') // 0 = PromptPay, 1 = Bank Account

const no = ref<string>('')
const bank = ref<string | undefined>(undefined)

// Handler Function
const typeHandler = (e: Event) => {
  const target = e.target as HTMLInputElement

  if (target.value !== '') {
    type.value = Number(target.value)
  }
}

const bankHandler = (e: Event) => {
  const target = e.target as HTMLInputElement

  if (target.value === '') {
    bank.value = undefined
    return
  }

  bank.value = target.value
}

const privHandler = () => {
  let payload: BankingInterface = {
    name: name.value,
    no: no.value,
    type: type.value !== '' ? Number(type.value) : 404,
    bank: type.value != 1 ? undefined : bank.value,
  }

  let set = props.update(payload)

  if (set == 1) {
    props.priv()
  }
}

const submitHandler = (e: SubmitEvent) => {
  e.preventDefault()

  let payload: BankingInterface = {
    name: name.value,
    no: no.value,
    type: type.value !== '' ? Number(type.value) : 404,
    bank: type.value != 1 ? undefined : bank.value,
  }

  let set = props.update(payload)

  if (set == 1) {
    props.next()
  }
}

// on mount component data restoration
onMounted(() => {
  const { payload } = props

  if (payload.name !== null && payload.name !== '') {
    name.value = payload.name
  }

  if (payload.type !== null && payload.type !== 404) {
    type.value = payload.type
  }

  if (payload.bank !== null && payload.bank !== '') {
    bank.value = payload.bank
  }

  if (payload.no !== null && payload.no !== '') {
    no.value = payload.no
  }
})
</script>

<template>
  <h1 class="text-center mt-2 mb-3">ตั้งค่าระบบหลังบ้าน</h1>

  <form @submit="(e) => submitHandler(e)" class="mt-3 mb-4">
    <h4 class="text-left" style="text-decoration: underline">ตั้งค่าบัญชีธนาคาร (เบื้องต้น)</h4>
    <p class="label-desp m-0 p-0">ตั้งค่าบัญชีธนาคารเบื้องต้นก่อน 1 บัญชีเพื่อตั้งค่าการทำงาน</p>

    <input
      class="text-left p-2"
      type="text"
      placeholder="ชื่อผู้ถือบัญชี"
      @bind="name"
      v-model="name"
    />

    <select name="type" @change="typeHandler" class="text-left p-2" :value="type" required>
      <option value="" selected disabled>เลือกประเภทบัญชี</option>
      <option value="0">PromptPay</option>
      <option value="1">บัญชีธนาคาร</option>
    </select>

    <hr class="mb-0" v-if="type !== ''" />

    <!-- BankAccount -->
    <div v-if="type === 1" class="condition-holder">
      <label for="bank" class="pb-0">
        <span class="label-title">ธนาคาร</span> <br />
        <span class="label-desp">เลือกธนาคารของคุณ</span>
      </label>
      <select
        name="bank"
        id="bank"
        class="text-left p-2"
        @change="bankHandler"
        v-model="bank"
        required
      >
        <option value="">- กรุณาเลือกธนาคารของบัญชีข้างต้น -</option>
        <option v-for="bank in BankingList" :value="bank">{{ bank }}</option>
      </select>

      <label for="no">
        <span class="label-title">หมายเลขบัญชี</span><br />
        <span class="label-desp">(จะใส่หรือไม่ใส่ '-' ก็ได้)</span>
      </label>
      <input
        class="text-left p-2"
        type="text"
        placeholder="หมายเลขบัญชี"
        @bind="no"
        v-model="no"
        name="no"
      />
    </div>

    <!-- PromptPay -->
    <div v-if="type === 0" class="condition-holder">
      <label for="promptpay">
        <span class="label-title">หมายเลขบัญชี PromptPay</span><br />
        <span class="label-desp"> (เบอร์โทรศัพท์, เลขบัตรประชาชน,​ ฯลฯ) </span>
      </label>
      <input
        class="text-left p-2"
        type="text"
        name="promptpay"
        placeholder="หมายเลขบัญชี PromptPay"
        @bind="no"
        v-model="no"
      />
    </div>

    <div class="button-holder">
      <button
        type="button"
        class="btn btn-secondary p-2 w-full block text-start"
        @click="privHandler"
      >
        &lt; ย้อนกลับ
      </button>
      <button type="submit" class="btn p-2 w-full block text-end">ไปต่อ &gt;</button>
    </div>
  </form>
</template>

<style scoped>
form {
  width: 22rem;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  .condition-holder {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 1rem;

    margin-bottom: 1rem;
  }

  input,
  select {
    border-radius: 1rem;
    border: 2px solid #2e2f2f;
    outline: 0;
  }

  input:focus,
  select:focus {
    border-radius: 1rem;
    border: 2px solid #fe6e6f;
  }

  button[type='submit'] {
    background: #fe6e6f !important;
    color: whitesmoke !important;
  }
}

.label-title {
  text-decoration: underline;
  font-weight: 600;
}

.label-desp {
  opacity: 0.8;
}

.button-holder {
  width: 100%;

  display: flex;
  gap: 1rem;

  * {
    width: 100%;
  }
}
</style>
