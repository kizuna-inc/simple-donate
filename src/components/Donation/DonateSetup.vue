<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { anyId } from 'promptparse/generate'
import QRCode from 'qrcode-svg'
import axios from 'axios'
import Swal from 'sweetalert2'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import VueTurnstile from 'vue-turnstile'

import '@/assets/css/donate.css'

import PromptPayGen from './PromptPayGen.vue'
import BankingGen from './BankingGen.vue'

import { BankType } from '@/modules/constant/bankType'

import type { BankingInterface, noBankingInterface } from '@/modules/interface/install/banking'
import type { DetailedInterface } from '@/modules/interface/install/detailed'

const props = defineProps<{
  user: DetailedInterface | null
  bank: BankingInterface | null
  fullBank: BankingInterface[] | undefined
  state: number | ''
  upState: (id: number) => void
}>()
const name = ref<string>('')
const message = ref<string>('')
const amount = ref<number | ''>(10)
const token = ref<string>('')

const type = ref<'MSISDN' | 'NATID' | 'EWALLETID' | 'BANKACC'>('MSISDN')
const qrCode = ref<string>('')

const slipImage = ref<Blob | null>(null)
const slipActive = ref<boolean>(false)
const slipName = ref<string>('')
const slipPreview = ref<string>('')
const slipElement = ref<HTMLInputElement | null>(null)

const isHide = ref<boolean>(false)
const isSubmit = ref<boolean>(false)

const bgLink = ref<string>('')
const pfpLink = ref<string>('')
const siteKey = ref<string>(import.meta.env.VITE_TURNSTILE_SITE_KEY)

const slipStore = async (file: File) => {
  const buffer = await file.arrayBuffer()
  const blob = new Blob([buffer], { type: file.type })

  slipName.value = file.name
  slipPreview.value = URL.createObjectURL(blob)

  slipImage.value = blob
}

const slipHandler = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (file !== undefined && file !== null) {
    await slipStore(file)
  }
}

const slipDrop = async (e: DragEvent) => {
  slipActive.value = false

  if (e.dataTransfer) {
    let file = Array.from(e.dataTransfer.files)[0]

    if (file !== undefined && file !== null) {
      await slipStore(file)
    }
  }
}

const slipClick = () => {
  slipElement.value?.click()
}

const qrCodeGen = () => {
  if (amount.value === '') {
    amount.value = 0
  }

  if (amount.value > 0 && props.bank !== null) {
    var newAmount = amount.value

    if (amount.value < 10) {
      newAmount = 10
    }

    if (props.bank.no === null) return

    switch (props.bank.no.length) {
      case 13:
        type.value = 'NATID'
        break

      case 15:
        type.value = 'EWALLETID'
        break

      default:
        type.value = 'MSISDN'
        break
    }

    const payload = anyId({
      type: type.value,
      target: props.bank.no,
      amount: newAmount,
    })

    const qrcode = new QRCode({
      content: payload,
      container: 'svg-viewbox',
      join: true,
    })

    qrCode.value = qrcode.svg()
  }
}

const toggleRef = () => {
  isHide.value = !isHide.value
}

const clearForm = () => {
  isSubmit.value = !isSubmit.value

  // Clear other form
  name.value = ''
  message.value = ''
  amount.value = 10

  // Clear slip
  slipName.value = ''
  slipPreview.value = ''
  slipElement.value = null
  slipImage.value = null
}

const submitHandler = async () => {
  if (slipImage.value === null) {
    return
  }

  if (amount.value === '') {
    return
  }

  if (amount.value < 10) {
    Swal.fire({
      icon: 'error',
      title: 'มีบางอย่างผิดพลาด',
      text: 'จำนวนเงินของคุณน้อยกว่าที่กำหนด​ กรุณาลองใหม่อีกครั้ง',
    })
    return
  }

  if (token.value === '') {
    Swal.fire({
      icon: 'error',
      title: 'มีบางอย่างผิดพลาด',
      text: 'Captcha ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง',
    })
    return
  }

  const slipUploadForm = new FormData()

  slipUploadForm.append(
    'slip',
    new File([slipImage.value], `profile.${slipImage.value.type.split('/').reverse()[0]}`),
  )
  slipUploadForm.append('name', name.value)
  slipUploadForm.append('message', message.value)
  slipUploadForm.append('amount', String(amount.value))
  slipUploadForm.append('method', String(props.bank?.type))
  slipUploadForm.append('token', token.value)

  const donateSend = await (
    await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/socket/donate`, {
      method: 'post',
      headers: new Headers({}),
      body: slipUploadForm,
    })
  ).json()

  console.log(donateSend)

  if (donateSend.status == 1) {
    isSubmit.value = !isSubmit.value
  } else {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด!',
      text: donateSend.message,
    })
  }
}

onMounted(() => {
  if (props.user !== null) {
    bgLink.value = `${import.meta.env.VITE_API_ENDPOINT}/${props.user.backgroundImage}`
    pfpLink.value = `${import.meta.env.VITE_API_ENDPOINT}/${props.user.profileImage}`

    qrCodeGen()
  }
})

watch(amount, () => {
  if (amount.value === '') {
    amount.value = 0
  }
  qrCodeGen()
})

// Active animation
const slipDragOver = (e: DragEvent) => {
  slipActive.value = true
}
const slipDragLeave = (e: DragEvent) => {
  slipActive.value = false
}
</script>

<template>
  <div class="upload-container">
    <div class="overlay">
      <div class="banner" :style="`background: url(${bgLink});`">
        <div class="top-overlay">
          <div class="profile-container">
            <div class="profile-img" :style="`background: url(${pfpLink});`"></div>
            <div class="profile-info">
              <h3>{{ props.user?.name }}</h3>
              <p>{{ props.user?.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="submitHandler" v-if="!isSubmit">
        <div class="previewBox">
          <PromptPayGen :bank="props.bank" :amount="Number(amount)" :qrCode="qrCode" />
          <BankingGen :bank="props.bank" :amount="Number(amount)" />
        </div>

        <div class="infoBox">
          <div>
            <label for="name"> ชื่อของคุณ </label>
            <input type="text" name="name" id="name" placeholder="ชื่อ" v-model="name" />
          </div>

          <div>
            <label for="desp"> ข้อความถึงสตรีมเมอร์</label>
            <textarea name="desp" id="desp" v-model="message" placeholder="ข้อความถึงสตรีมเมอร์" />
          </div>

          <div class="donate-controller">
            <div v-if="fullBank !== undefined" class="button-holder">
              <button
                class="bank-btn"
                v-for="(type, index) in fullBank as noBankingInterface[]"
                :disabled="props.state === index"
                @click="() => props.upState(index)"
              >
                {{ BankType[type.type] }}
              </button>
            </div>

            <div class="donate-block">
              <div class="donate-guide">
                <h3 class="heading" @click="toggleRef">
                  <span>วิธีการใช้งาน</span>
                  <span class="arrow">{{ isHide ? '&#9664;' : '&#9660;' }}</span>
                </h3>
                <ul :class="isHide ? 'hide listing' : 'listing'">
                  <li>ระบุชื่อและข้อความ</li>
                  <li>เลือกช่องทางชำระเงิน (PromptPay หรือ ธนาคาร)</li>
                  <li v-if="props.bank?.type === 0">
                    ระบุยอดเงิน สแกน QR Code ผ่านแอปฯ ธนาคาร และบันทึกรูปสลิป
                  </li>
                  <li v-if="props.bank?.type === 1">
                    ระบุยอดเงิน โอนเข้าบัญชีปลายทาง และบันทึกรูปสลิป
                  </li>
                  <li>แนบรูปสลิป รอให้รูปสลิปขึ้น แล้วกด "โดเนทเลย!"</li>
                </ul>
              </div>

              <div class="donate-form">
                <div>
                  <label for="anount">จำนวนเงินที่ต้องการ</label>
                  <input type="number" v-model="amount" name="amount" id="amount" />
                </div>

                <div class="qr-verifier">
                  <div
                    @dragover.prevent="slipDragOver"
                    @dragleave.prevent="slipDragLeave"
                    @drop.prevent="slipDrop"
                    @click="slipClick"
                    :class="slipActive ? 'dropzone active' : 'dropzone'"
                  >
                    <div v-if="slipName === '' && slipPreview === ''">
                      <p>
                        ลากรูป หรือ กดที่กรอบนี้<br />
                        เพื่ออัพโหลดรูปสลิป
                      </p>
                    </div>

                    <div v-else>
                      <img :src="slipPreview" alt="slip preview" />
                      <p>
                        {{ slipName }}
                      </p>
                    </div>
                    <input
                      type="file"
                      @change="slipHandler"
                      style="display: none"
                      ref="slipElement"
                    />
                  </div>
                </div>

                <VueTurnstile
                  :site-key="siteKey"
                  v-model="token"
                  theme="dark"
                  appearance="always"
                  style="
                    width: fit-content;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                />

                <button class="submit-btn" submit="submitHandler()">โดเนทเลย!</button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div class="completion" v-if="isSubmit">
        <DotLottieVue
          style="width: 200px; aspect-ratio: 1/1"
          autoplay
          src="/lotties/tick_box.lottie"
        />

        <h2>โดเนทสำเร็จ!!</h2>

        <p>อยากโดเนทอีกงั้นหรอ?</p>

        <button @click="clearForm()">โดเนทอีกรอบ!</button>
      </div>
    </div>
  </div>
</template>
