<script setup lang="ts">
// Library
import { onMounted, ref } from 'vue'
import Swal from 'sweetalert2'

// CSS
import '@/assets/css/install.css'

import UserSetup from '@/components/Installation/UserSetup.vue'
import ProfileSetup from '@/components/Installation/ProfileSetup.vue'
import BankingSetup from '@/components/Installation/BankingSetup.vue'
import OverviewSetup from '@/components/Installation/OverviewSetup.vue'

import type { UserInterface } from '@/modules/interface/install/user'
import type { DetailedInterface } from '@/modules/interface/install/detailed'
import type { BankingInterface } from '@/modules/interface/install/banking'

import { isConfig } from '@/modules/session/configSetup'

import { PayloadClass } from '@/modules/class/install/payload'
import { UserPayload } from '@/modules/class/install/user'
import { DetailClass } from '@/modules/class/install/detailed'
import { BankingClass } from '@/modules/class/install/banking'

// Bunch of Constant
const state = ref<number>(0)

const resp = new PayloadClass()

const userPayload = new UserPayload()
const detailPayload = new DetailClass()
const bankingPayload = new BankingClass()

// Function :D
const nextState = async () => {
  state.value += 1

  if (state.value === 3) {
    resp.user = userPayload
    resp.detailed = detailPayload
    resp.banking = bankingPayload
  }
}

const privState = () => {
  state.value -= 1
}

// Update
const userUpdate = (value: UserInterface) => {
  if (
    userPayload.username !== '' &&
    userPayload.username !== null &&
    userPayload.password !== '' &&
    userPayload.password !== null
  ) {
    if (value.username === '' && userPayload.username !== '') {
      value.username = userPayload.username
    }

    if (value.password === '' && userPayload.password !== '') {
      value.password = userPayload.password
    }
  } else {
    if (value.username === null || value.username === '') {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณากรอกฟอร์มให้ครบ',
        icon: 'error',
        confirmButtonText: 'โอเค',
      })
      return 0
    }

    if (value.password === null || value.password === '') {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณากรอกฟอร์มให้ครบ',
        icon: 'error',
        confirmButtonText: 'โอเค',
      })
      return 0
    }
  }

  userPayload.username = value.username
  userPayload.password = value.password

  // console.log(userPayload)

  return 1
}

const detailUpdate = (value: DetailedInterface) => {
  if (
    detailPayload.name !== null &&
    detailPayload.description !== null &&
    detailPayload.profileImage !== null &&
    detailPayload.backgroundImage !== null
  ) {
    if (value.name === '' && detailPayload.name !== '') {
      value.name = detailPayload.name
    }

    if (value.description === '' && detailPayload.description !== '') {
      value.description = detailPayload.description
    }

    if (
      value.profileImage === null &&
      detailPayload.profileImage !== null &&
      typeof detailPayload.profileImage !== 'string'
    ) {
      value.profileImage = detailPayload.profileImage
    }

    if (
      value.backgroundImage === null &&
      detailPayload.backgroundImage !== null &&
      typeof detailPayload.backgroundImage !== 'string'
    ) {
      value.backgroundImage = detailPayload.backgroundImage
    }
  } else {
    if (value.name === null) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ยังไม่ได้ตั้งค่าชื่อของผู้ใช้งาน',
        icon: 'error',
        confirmButtonText: 'โอเค',
      })
      return 0
    }

    if (value.description === null) {
      value.description = ''
    }

    if (value.profileImage === null) {
      value.profileImage = null
    }

    if (value.backgroundImage === null) {
      value.backgroundImage = null
    }
  }

  detailPayload.name = value.name
  detailPayload.description = value.description
  detailPayload.profileImage = value.profileImage != null ? value.profileImage : ''
  detailPayload.backgroundImage = value.backgroundImage

  return 1
}

const bankingUpdate = (value: BankingInterface) => {
  if (value.name === '' || value.name === null) {
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: 'ชื่อบัญชียังว่างอยู่ กรุณากรอกให้ครบ',
      icon: 'error',
      confirmButtonText: 'โอเค',
    })

    return 0
  }

  if (value.no === '' || value.no === null) {
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: 'หมายเลขบัญชียังว่างอยู่ กรุณากรอกให้ครบ',
      icon: 'error',
      confirmButtonText: 'โอเค',
    })

    return 0
  }

  if (value.type === 404 || value.type === null) {
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: 'ยังมีช่องที่ยังว่างอยู่ กรุณาไปกรอกให้ครบ',
      icon: 'error',
      confirmButtonText: 'โอเค',
    })

    return 0
  }

  if (value.type === 1 && value.bank !== undefined) {
    if (bankingPayload.bank !== undefined || bankingPayload.bank !== '') {
      if (value.bank === undefined || value.bank === '') {
        value.bank = bankingPayload.bank
      }
    } else {
      if (value.bank === undefined || value.bank === '') {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'คุณยังไม่ได้เลือกธนาคารของคุณ กรุณากรอกให้ครบ',
          icon: 'error',
          confirmButtonText: 'โอเค',
        })

        return 0
      }
    }

    bankingPayload.bank = value.bank
  }

  bankingPayload.name = value.name
  bankingPayload.no = value.no
  bankingPayload.type = value.type

  return 1
}

onMounted(async () => {
  await isConfig(false)
})
</script>

<template>
  <div class="flex-container">
    <div class="install-box">
      <div v-if="state === 0">
        <UserSetup :update="userUpdate" :next="nextState" :payload="userPayload" />
      </div>

      <div v-if="state === 1">
        <ProfileSetup
          :update="detailUpdate"
          :next="nextState"
          :priv="privState"
          :payload="detailPayload"
        />
      </div>

      <div v-if="state === 2">
        <BankingSetup
          :update="bankingUpdate"
          :next="nextState"
          :priv="privState"
          :payload="bankingPayload"
        />
      </div>

      <div v-if="state === 3">
        <OverviewSetup :next="nextState" :priv="privState" :payload="resp" />
      </div>
    </div>
  </div>
</template>
