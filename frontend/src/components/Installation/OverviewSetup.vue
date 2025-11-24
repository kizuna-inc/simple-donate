<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

import type { OverviewInterface } from '@/modules/interface/install/overview'
import type { responseInterface } from '@/modules/interface/responseInterface'
import type { BankingInterface } from '@/modules/interface/install/banking'

const props = defineProps<{
  payload: OverviewInterface | null
  next: () => void
  priv: () => void
}>()

const { payload } = props

const showPassword = ref<boolean>(false)

const pfpLink = ref<string>('')
const bgLink = ref<string>('')

const bankConfig = ref<BankingInterface | null | undefined>()

// console.log(payload)

onMounted(() => {
  if (!Array.isArray(props.payload?.banking)) {
    bankConfig.value = props.payload?.banking
  }
})

const submitHandler = async () => {
  if (payload !== null && payload.detailed !== null) {
    // Image uploader
    if (
      payload.detailed.profileImage !== null &&
      typeof payload.detailed.profileImage !== 'string'
    ) {
      const pfpUploadForm = new FormData()

      pfpUploadForm.append('type', 'profile')
      pfpUploadForm.append(
        'image',
        new File(
          [payload.detailed.profileImage],
          `profile.${payload.detailed.profileImage.type.split('/').reverse()[0]}`,
        ),
      )

      const resp = (
        await axios({
          method: 'post',
          url: `${import.meta.env.VITE_API_ENDPOINT}/api/upload/image`,
          data: pfpUploadForm,
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      ).data

      if (resp.status > 0) {
        console.log(resp.message)

        pfpLink.value = resp.payload
      }
    }

    // Background uploader
    if (
      payload.detailed.backgroundImage !== null &&
      typeof payload.detailed.backgroundImage !== 'string'
    ) {
      const bgUploadForm = new FormData()

      bgUploadForm.append('type', 'background')
      bgUploadForm.append(
        'image',
        new File(
          [payload.detailed.backgroundImage],
          `profile.${payload.detailed.backgroundImage.type.split('/').reverse()[0]}`,
        ),
      )

      const resp = (
        await axios({
          method: 'post',
          url: `${import.meta.env.VITE_API_ENDPOINT}/api/upload/image`,
          data: bgUploadForm,
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      ).data

      if (resp.status > 0) {
        console.log(resp.message)

        bgLink.value = resp.payload
      }
    }

    // payloadUploader
    if (bgLink.value !== '' && pfpLink.value !== '') {
      const FinalForm = new FormData()

      // User Payload
      if (payload.user !== null) {
        if (payload.user.username !== null) {
          FinalForm.append('username', payload.user.username)
        } else {
          return
        }

        if (payload.user.password !== undefined && payload.user.password !== null) {
          FinalForm.append('password', payload.user.password)
        } else {
          return
        }
      }

      // Detail Payload
      if (payload.detailed !== null) {
        if (payload.detailed.name !== null) {
          FinalForm.append('name', payload.detailed.name)
        } else {
          return
        }

        if (payload.detailed.description !== null) {
          FinalForm.append('description', payload.detailed.description)
        } else {
          return
        }

        FinalForm.append('profileImage', pfpLink.value)
        FinalForm.append('backgroundImage', bgLink.value)
      }

      // Banking Payload
      if (bankConfig.value !== null && bankConfig.value !== undefined) {
        if (bankConfig.value.name !== null) {
          FinalForm.append('account_name', bankConfig.value.name)
        }

        if (bankConfig.value.no !== null) {
          FinalForm.append('account_no', bankConfig.value.no)
        }

        if (bankConfig.value.type !== null) {
          FinalForm.append('account_type', String(bankConfig.value.type))

          if (bankConfig.value.type === 1 && bankConfig.value.bank !== undefined) {
            FinalForm.append('account_bank', bankConfig.value.bank)
          }
        }
      }

      const sendReq = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_API_ENDPOINT}/api/config/start`,
        data: JSON.stringify(Object.fromEntries(FinalForm.entries())),
        headers: { 'Content-Type': 'application/json' },
      })

      const resp = sendReq.data as responseInterface<OverviewInterface>

      console.log(resp)

      if (resp.status === 1) {
        Swal.fire({
          title: 'สำเร็จ!',
          text: 'ตั้งค่าผู้ใช้เริ่มต้นสำเร็จแล้ว!',
          icon: 'success',
          confirmButtonText: 'โอเค',
        }).then(() => {
          document.location.replace('/')
        })
      }
    } else {
      return
    }
  }
}

const bgIMG =
  payload !== null &&
  payload.detailed !== null &&
  payload.detailed.backgroundImage !== null &&
  typeof payload.detailed.backgroundImage !== 'string'
    ? URL.createObjectURL(payload.detailed.backgroundImage)
    : ''

const pfpIMG =
  payload !== null &&
  payload.detailed !== null &&
  payload.detailed.profileImage !== null &&
  typeof payload.detailed.profileImage !== 'string'
    ? URL.createObjectURL(payload.detailed.profileImage)
    : ''
</script>

<template>
  <h1 class="text-center mt-2 mb-3">ตั้งค่าระบบหลังบ้าน</h1>

  <div class="mt-3 mb-4 overview-container">
    <h4 class="text-left" style="text-decoration: underline">ตรวจสอบข้อมูล</h4>

    <!-- User info -->
    <div class="overview-data" id="userData">
      <p class="overview-heading">ข้อมูลผู้ใช้</p>
      <p>ชื่อผู้ใช้ : {{ payload?.user?.username }}</p>
      <p>
        รหัสผ่าน :
        {{ showPassword ? payload?.user?.password : payload?.user?.password?.replace(/./g, '*') }}
      </p>

      <div>
        <input type="checkbox" v-model="showPassword" id="pwd-check" />
        <label for="pwd-check"> &nbsp; แสดงรหัสผ่าน </label>
      </div>
    </div>

    <hr class="my-0" />

    <!-- Detail info -->
    <div class="overview-data" id="detailData">
      <p class="overview-heading">ข้อมูลหน้าโดเนท</p>

      <div class="bg-container" :style="`background: url(` + bgIMG + `)`">
        <div class="bg-overlay">
          <div class="img-container" :style="`background: url(` + pfpIMG + `)`"></div>
          <div class="text-container">
            <p class="head">{{ payload?.detailed?.name }}</p>
            <p class="desp">
              {{ payload?.detailed?.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <hr class="my-0" />

    <!-- Banking info -->
    <div class="overview-data" id="bankingData">
      <p class="overview-heading">ข้อมูลบัญชีธนาคาร</p>
      <p>ชื่อเจ้าของบัญชี : {{ bankConfig?.name }}</p>

      <p>
        ประเภทบัญชี :
        <span v-if="bankConfig?.type === 1">ธนาคาร</span>
        <span v-else>PromptPay</span>
      </p>

      <p v-if="bankConfig?.type === 1">ธนาคาร : {{ bankConfig.bank }}</p>

      <p>เลขบัญชี / หมายเลขปลายทาง : {{ bankConfig?.no }}</p>
    </div>

    <hr class="my-0" />

    <div class="button-holder">
      <button
        type="button"
        class="btn btn-secondary p-2 w-full block text-start"
        @click="props.priv()"
      >
        &lt; ย้อนกลับ
      </button>
      <button class="btn p-2 w-full block text-end pass" @click="submitHandler" type="button">
        ไปต่อ &gt;
      </button>
    </div>
  </div>
</template>

<style scoped>
.overview-container {
  width: 22rem;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  button.pass {
    background: #fe6e6f !important;
    color: whitesmoke !important;
  }

  .overview-heading {
    font-size: 18px;
    font-weight: 600;
    text-decoration: underline;
  }
}

.bg-container {
  width: 100%;
  aspect-ratio: 21/9;

  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center !important;

  border-radius: 10px;

  .bg-overlay {
    width: 100%;
    height: 100%;

    padding: 1rem;
    gap: 1rem;
    border-radius: 10px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
  }

  .img-container {
    height: 90%;
    aspect-ratio: 1/1;

    border-radius: 1rem;

    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
  }

  .text-container {
    width: 100%;
    height: 80%;
    color: whitesmoke;
  }

  .text-container p {
    margin: 0;
  }

  .text-container p.head {
    font-weight: 600;
    font-size: 18px;
  }

  .text-container p.desp {
    opacity: 0.6;
    height: calc(100% - 18px);
  }
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
