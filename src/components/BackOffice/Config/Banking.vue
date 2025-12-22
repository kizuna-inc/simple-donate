<script setup lang="ts">
import Swal from 'sweetalert2'
import { onMounted, ref } from 'vue'
import axios from 'axios'

import { BankingList } from '@/modules/constant/bankList'
import { bankParser } from '@/modules/functions/bankParser'
import type { BankingInterface } from '@/modules/interface/install/banking'
import type { responseInterface } from '@/modules/interface/responseInterface'

const payload = ref<BankingInterface[]>()
const modalStatus = ref<boolean>(false)
const modalItem = ref<'edit' | 'new' | ''>('')

const name = ref<string>('')
const no = ref<string>('')
const type = ref<number>(0)
const bank = ref<string>('')

const idTemp = ref<number>(0)

const modalUp = () => {
  modalStatus.value = true
}
const modalDown = () => {
  modalStatus.value = false
}

const resetForm = () => {
  name.value = ''
  no.value = ''
  type.value = 0
  bank.value = ''
}

const editItem = async (targetID: number | undefined) => {
  if (targetID === undefined) return

  const dataPayload = await (
    await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/config/banking/info`, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: String(window.sessionStorage.getItem('token')),
      }),
      body: JSON.stringify({
        id: targetID,
      }),
    })
  ).json()

  // MountData
  let data = dataPayload.payload as BankingInterface

  name.value = String(data.name)
  no.value = String(data.no)
  type.value = Number(data.type)
  bank.value = String(data.bank)

  modalItem.value = 'edit'
  idTemp.value = targetID
  modalUp()
}
const editItemSubmit = async () => {
  if (name.value === '' || no.value === '') return

  const editData = (
    await axios(`${import.meta.env.VITE_API_ENDPOINT}/api/config/banking/update`, {
      method: 'post',
      headers: {
        Authorization: String(window.sessionStorage.getItem('token')),
        'Content-Type': 'application/json',
      },
      data: {
        id: idTemp.value,
        name: name.value,
        no: no.value,
        type: type.value,
        bank: bank.value,
      },
    })
  ).data as responseInterface<BankingInterface>

  if (editData.status === 1) {
    Swal.fire({
      title: 'แก้ไขข้อมูลสำเร็จ',
      icon: 'success',
    }).then(() => {
      resetForm()
      idTemp.value = 0

      mountedPayload()
      modalDown()
    })
  }
}

const newItem = () => {
  modalItem.value = 'new'
  modalUp()
}
const newItemSubmit = async () => {
  if (name.value === '' || no.value === '') return

  const createData = await axios(`${import.meta.env.VITE_API_ENDPOINT}/api/config/banking/new`, {
    method: 'post',
    headers: {
      Authorization: String(window.sessionStorage.getItem('token')),
    },
    data: {
      name: name.value,
      no: no.value,
      type: type.value,
      bank: bank.value,
    },
  })

  console.log(createData.data)

  if (createData.data.status === 1) {
    Swal.fire({
      title: 'สร้างข้อมูลสำเร็จ',
      icon: 'success',
    }).then(() => {
      resetForm()
      mountedPayload()
      modalDown()
    })
  } else {
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: 'กรุณาติดต่อ Maintainer ของโปรเจค หรือ แจ้งลง Issue ใน github เพื่อแก้ไข',
      icon: 'error',
    })
  }
}

const rmItem = (targetID: number | undefined) => {
  if (targetID === undefined) return

  Swal.fire({
    title: 'ต้องการจะลบอันนี้ทิ้งใช่ไหม?',
    icon: 'question',
    confirmButtonText: 'ใช่',
    denyButtonText: 'ไม่ใช่',
    showDenyButton: true,
  }).then(async (resp) => {
    if (resp.isConfirmed) {
      const respFetch = await axios(
        `${import.meta.env.VITE_API_ENDPOINT}/api/config/banking/delete`,
        {
          method: 'post',
          headers: {
            Authorization: String(window.sessionStorage.getItem('token')),
          },
          data: {
            id: targetID,
          },
        },
      )

      if (respFetch.data.status === 1) {
        Swal.fire({
          title: 'ลบสำเร็จ',
          icon: 'success',
        }).then(async () => {
          await mountedPayload()
        })
      } else {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'กรุณาติดต่อ Maintainer ของโปรเจค หรือ แจ้งลง Issue ใน github เพื่อแก้ไข',
          icon: 'error',
        })
      }
    }
  })
}

const mountedPayload = async () => {
  const callBankPayload = await (
    await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/config/banking`, {
      method: 'get',
      headers: new Headers({
        Authorization: String(window.sessionStorage.getItem('token')),
      }),
    })
  ).json()

  payload.value = callBankPayload.payload
}

onMounted(async () => {
  await mountedPayload()
})
</script>

<template>
  <main>
    <div class="header">
      <h1>ตั้งค่าธนาคาร</h1>
      <div class="button-container">
        <button class="glass-button" type="button" @click="() => newItem()">
          เพิ่มข้อมูลธนาคาร
        </button>
      </div>
    </div>

    <table class="table table-striped w-full">
      <thead>
        <tr>
          <th class="text-center" style="width: 1%">ID</th>
          <th class="text-center" style="width: 30%">ชื่อ</th>
          <th class="text-center" style="width: 25%">เลขที่บัญชี</th>
          <th class="text-center" style="width: 30%">ประเภทบัญชี</th>
          <th class="text-center" style="width: 10%">การจัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pl in payload">
          <td class="text-center">{{ pl.id }}</td>
          <td>{{ pl.name }}</td>
          <td>{{ pl.type === 1 ? bankParser(pl.no) : pl.no }}</td>
          <td>{{ pl.type === 0 ? 'พร้อมเพย์' : `ธนาคาร // ${pl.bank}` }}</td>
          <td>
            <div
              style="
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 0.5rem;
              "
            >
              <button type="button" class="btn btn-primary" @click="() => editItem(pl.id)">
                <span class="icon material-icons-outlined"> mode_edit_outline </span>
              </button>
              <button type="button" class="btn btn-danger" @click="() => rmItem(pl.id)">
                <span class="icon material-icons-outlined"> delete </span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </main>

  <div :class="`modalContainer ${!modalStatus ? 'hide' : ''}`" @click="modalDown()"></div>
  <form
    @submit.prevent="
      () => (modalItem === 'new' ? newItemSubmit() : modalItem === 'edit' ? editItemSubmit() : '')
    "
    :class="`modalForm ${!modalStatus ? 'hide' : ''}`"
  >
    <input type="text" placeholder="ชื่อ" id="bank_name" name="bank_name" v-model="name" />
    <input type="text" placeholder="เลขที่บัญชี" id="no" name="no" v-model="no" />
    <select placeholder="ประเภทบัญชี" name="type" id="type" v-model="type">
      <option :value="0">PromptPay</option>
      <option :value="1">ธนาคาร</option>
    </select>
    <select placeholder="ธนาคาร" name="bank" v-if="type === 1" id="bank" v-model="bank">
      <option disabled value="">กรุณาเลือกธนาคาร</option>
      <option v-for="bank in BankingList" :value="bank">{{ bank }}</option>
    </select>

    <button type="submit" class="btn px-4 py-3 glass-button">
      {{
        modalItem === 'new' ? 'เพิ่มข้อมูลบัญชี' : modalItem === 'edit' ? 'แก้ไขข้อมูลบัญชี' : ''
      }}
    </button>
  </form>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;
}

.header {
  width: 100%;
  margin: 0.5rem 0;

  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding: 0 1rem;

  div.button-container,
  h1 {
    display: flex;
    width: 100%;
  }

  h1 {
    justify-content: start;
  }

  div.button-container {
    justify-content: end;
  }

  div.button-container button {
    padding: 0.5rem;
  }
}

.modalContainer {
  width: 100%;
  height: 100dvh;

  backdrop-filter: blur(0.3rem);
  background: rgba(0, 0, 0, 0.3);

  position: fixed;
  top: 0;
  left: 0;
}

.modalForm {
  min-width: 18rem;
  max-width: 70%;

  background: linear-gradient(45deg, transparent, rgba(245, 245, 245, 0.2));
  border: 1px solid whitesmoke;
  border-left: 0;
  border-bottom: 0;
  border-radius: 1rem;

  padding: 1rem 2rem;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;

  input,
  select {
    width: 100%;
    padding: 0.5rem;

    background: linear-gradient(45deg, rgba(245, 245, 245, 0.2), rgba(245, 245, 245, 0.8));
    background-size: 200% 200%;
    background-position: 0%;
    color: whitesmoke;

    border: 1px solid whitesmoke;
    border-left: 0;
    border-bottom: 0;
    border-radius: 1rem;
    outline: 0;
  }

  input:focus,
  input:hover,
  select:focus,
  select:hover {
    background-position: 100% 100%;
  }
}
</style>
