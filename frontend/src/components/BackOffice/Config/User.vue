<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import { Reorder } from 'motion-v'

import type { DetailedInterface } from '@/modules/interface/install/detailed'
import type { UserInterface } from '@/modules/interface/install/user'
import type { BankingInterface } from '@/modules/interface/install/banking'
import type { ConfigInterface } from '@/modules/interface/install/config'
import { BankType } from '@/modules/constant/bankType'
import type { responsivePayload } from '@/modules/class/payload'

const username = ref<string>('')
const oldPassword = ref<string>('')
const newPassword = ref<string>('')
const conPassword = ref<string>('')

const name = ref<string>('')
const description = ref<string>('')
const profileImage = ref<Blob | null>(null)
const backgroundImage = ref<Blob | null>(null)

const minAmount = ref<number>(10)
const bankingList = ref<BankingInterface[]>([])
const bankOrder = ref<number[]>([])

const profileActive = ref<boolean>(false)
const profileName = ref<string>('')
const profilePreview = ref<string>('')
const profileElement = ref<HTMLInputElement | null>(null)

const bgActive = ref<boolean>(false)
const bgName = ref<string>('')
const bgPreview = ref<string>('')
const bgElement = ref<HTMLInputElement | null>(null)

const userSubmit = async () => {
  if (newPassword.value !== conPassword.value) {
    Swal.fire({
      title: 'รหัสผ่านไม่ตรงกัน',
      text: 'กรุณากลับไปตรวจสอบอีกครั้ง',
      icon: 'error',
    })

    return
  }

  const payload = {
    username: username.value,
    password: oldPassword.value,
    newPassword: newPassword.value,
  }

  const sendPayload = await (
    await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/config/user/update/login`, {
      method: 'post',
      headers: new Headers({
        Authorization: String(window.sessionStorage.getItem('token')),
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(payload),
    })
  ).json()

  if (sendPayload.status === 0) {
    let msg = ''

    if (sendPayload.message === 'wrong password') {
      msg = 'รหัสผ่านเก่าของคุณผิด กรุณาตรวจสอบรหัสผ่านอีกครั้ง'
    } else {
      msg =
        'กรุณาติดต่อ Maintainer หรือ สร้าง Issue ไว้บน Repository หลักบน Github เพื่อรับความช่วยเหลือ'
    }

    Swal.fire({
      icon: 'error',
      title: 'มีบางอย่างผิดพลาดเกิดขึ้น',
      text: msg,
    })

    return
  }

  Swal.fire({
    title: 'สำเร็จ!',
    text: 'เปลี่ยนรหัสผ่านสำเร็จแล้ว',
    icon: 'success',
  }).then(() => {
    oldPassword.value = ''
    newPassword.value = ''
    conPassword.value = ''

    Swal.fire({
      title: 'คุณต้องการออกจากระบบหรือไม่?',
      text: 'เพื่อความปลอดภัย กรุณาออกจากระบบ และ เข้าสู่ระบบใหม่อีกครั้ง',
      icon: 'question',
      showDenyButton: true,
      denyButtonText: 'ไม่เป็นไร',
      confirmButtonText: 'ตกลง',
    }).then((result) => {
      if (result.isConfirmed) {
        window.sessionStorage.clear()
        window.location.replace('/login')
      }
    })
  })
}

const detailSubmit = async () => {
  const UploadForm = new FormData()

  if (profileImage.value !== null) {
    UploadForm.append(
      'profile',
      new File([profileImage.value], `profile.${profileImage.value.type.split('/').reverse()[0]}`),
    )
  }

  if (backgroundImage.value !== null) {
    UploadForm.append(
      'background',
      new File(
        [backgroundImage.value],
        `profile.${backgroundImage.value.type.split('/').reverse()[0]}`,
      ),
    )
  }

  UploadForm.append('name', name.value)
  UploadForm.append('description', description.value)

  const UploadImage = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/upload/image/update`, {
    method: 'post',
    headers: new Headers({
      Authorization: String(window.sessionStorage.getItem('token')),
    }),
    body: UploadForm,
  })

  console.log(await UploadImage.json())
}

const configSubmit = async () => {
  if (minAmount.value < 10) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาดขึ้น',
      text: 'ยอดเงินขั้นต่ำไม่ควรต่ำกว่า 10 บาท กรุณาแก้ไขใหม่อีกครั้ง',
    })
  }

  const payload = {
    minAmount: minAmount.value,
    order: bankOrder.value,
  }

  const updateConfig = (await (
    await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/config/user/update/config`, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: String(window.sessionStorage.getItem('token')),
      }),
      body: JSON.stringify(payload),
    })
  ).json()) as responsivePayload<undefined>

  if (updateConfig.status === 1) {
    Swal.fire({
      title: 'สำเร็จ!',
      text: 'อัพเดทการตั้งค่าสำเร็จ',
      icon: 'success',
    })
  } else {
    console.log(updateConfig.message)

    Swal.fire({
      title: 'มีข้อผิดพลาดเกิดขึ้น',
      text: 'มีบางอย่างผิดพลาดเกิดขึ้น',
      icon: 'error',
    })
  }
}

const onMountedFunction = async () => {
  // CallData
  const call = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/config/user`, {
    method: 'get',
    headers: new Headers({
      Authorization: String(window.sessionStorage.getItem('token')),
    }),
  })

  const data = await call.json()
  const login = data.payload.login as UserInterface
  const detail = data.payload.detail as DetailedInterface
  const bankItem = data.payload.bank as BankingInterface[]
  const config = data.payload.config as ConfigInterface

  username.value = String(login.username)

  name.value = String(detail.name)
  description.value = String(detail.description)

  minAmount.value = Number(config.minAmount) > 10 ? Number(config.minAmount) : 10
  bankingList.value = bankItem

  let newOrder: number[] = []

  if (config.order === undefined) {
    for (let i = 0; i < bankItem.length; i++) {
      newOrder.push(i)
    }

    bankOrder.value = newOrder
  } else {
    for (let i = 0; i < config.order.length; i++) {
      let item = bankItem.find((bank) => bank.id === config.order[i])
      console.log(item)
    }
  }
}

onMounted(async () => await onMountedFunction())

// Profile
const profileStore = async (file: File) => {
  const buffer = await file.arrayBuffer()
  const blob = new Blob([buffer], { type: file.type })

  profileName.value = file.name
  profilePreview.value = URL.createObjectURL(blob)

  profileImage.value = blob
}
const profileHandler = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (file !== undefined && file !== null) {
    await profileStore(file)
  }
}
const profileDrop = async (e: DragEvent) => {
  profileActive.value = false

  if (e.dataTransfer) {
    let file = Array.from(e.dataTransfer.files)[0]

    if (file !== undefined && file !== null) {
      await profileStore(file)
    }
  }
}
const profileClick = () => {
  profileElement.value?.click()
}

// Background
const bgStore = async (file: File) => {
  const buffer = await file.arrayBuffer()
  const blob = new Blob([buffer], { type: file.type })

  bgName.value = file.name
  bgPreview.value = URL.createObjectURL(blob)

  backgroundImage.value = blob
}
const bgHandler = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (file !== undefined && file !== null) {
    await bgStore(file)
  }
}
const bgDrop = async (e: DragEvent) => {
  profileActive.value = false

  if (e.dataTransfer) {
    let file = Array.from(e.dataTransfer.files)[0]

    if (file !== undefined && file !== null) {
      await bgStore(file)
    }
  }
}
const bgClick = () => {
  bgElement.value?.click()
}

const profileDragOver = (e: DragEvent) => {
  profileActive.value = true
}
const profileDragLeave = (e: DragEvent) => {
  profileActive.value = false
}
const bgDragOver = (e: DragEvent) => {
  bgActive.value = true
}
const bgDragLeave = (e: DragEvent) => {
  bgActive.value = false
}
</script>

<template>
  <main>
    <header>
      <h1>ตั้งค่าผู้ใช้</h1>
    </header>

    <main class="main-container pt-2">
      <div class="cut-container">
        <!-- User System Settings -->
        <form style="max-width: 18rem" @submit.prevent="() => userSubmit()">
          <label for="username"> ชื่อผู้ใช้ </label>
          <input type="text" v-model="username" name="username" placeholder="ชื่อผู้ใช้" disabled />
          <br />
          <label for="oldPassword"> รหัสผ่านเก่า </label>
          <input
            type="password"
            v-model="oldPassword"
            name="oldPassword"
            placeholder="รหัสผ่านเก่า"
            required
          />
          <label for="newPassword"> รหัสผ่านใหม่ </label>
          <input
            type="password"
            v-model="newPassword"
            name="newPassword"
            placeholder="รหัสผ่านใหม่"
            required
          />
          <label for="conPassword">ยืนยันรหัสผ่านใหม่</label>
          <input
            type="password"
            v-model="conPassword"
            name="conPassword"
            placeholder="ยืนยันรหัสผ่านใหม่"
            required
          />
          <br />
          <button type="submit" class="btn glass-button">บันทึก</button>
        </form>

        <!-- Minor Config -->
        <form @submit.prevent="() => configSubmit()">
          <label for="minAmount">จำนวนเงินต่ำสุด</label>
          <input
            type="number"
            placeholder="จำนวนเงินต่ำสุด"
            v-model="minAmount"
            id="minAmount"
            name="minAmount"
          />

          <label>การจัดเรียงธนาคาร</label>
          <div class="bank-order">
            <Reorder.Group axis="y" v-model:values="bankOrder" as="ul">
              <Reorder.Item v-for="bank in bankOrder" :key="bank" :value="bank" as="li">
                {{
                  bankingList[bank]?.type === 1
                    ? bankingList[bank]?.bank
                    : BankType[Number(bankingList[bank]?.type)]
                }}
              </Reorder.Item>
            </Reorder.Group>
          </div>

          <br />

          <button type="submit" class="btn glass-button">บันทึก</button>
        </form>
      </div>

      <!-- User Data Update -->
      <div class="long-container">
        <form @submit.prevent="() => detailSubmit()" class="data-submit">
          <div class="container-manager">
            <div class="minor-container">
              <label for="showName">ชื่อ</label>
              <input
                type="text"
                id="showName"
                name="showName"
                placeholder="ชื่อ"
                v-model="name"
                required
              />

              <label for="showName">คำอธิบาย // คำโปรย</label>
              <textarea
                required
                type="text"
                id="desp"
                name="desp"
                v-model="description"
                rows="3"
                placeholder="คำอธิบาย // คำโปรย"
              />
            </div>

            <div class="minor-container">
              <!-- Profile Upload -->
              <div
                @dragover.prevent="profileDragOver"
                @dragleave.prevent="profileDragLeave"
                @drop.prevent="profileDrop"
                @click="profileClick"
                :class="profileActive ? 'dropzone active' : 'dropzone'"
              >
                <div v-if="profileName === '' && profilePreview === ''">
                  <p>
                    ลากรูป หรือ กดที่กรอบนี้<br />
                    เพื่ออัพโหลดรูปโปรไฟล์
                  </p>
                </div>

                <div v-else>
                  <img :src="profilePreview" alt="profile preview" />
                  <p>
                    {{ profileName }}
                  </p>
                </div>
                <input
                  type="file"
                  @change="profileHandler"
                  style="display: none"
                  ref="profileElement"
                />
              </div>

              <!-- Background Upload -->
              <div
                @dragover.prevent="bgDragOver"
                @dragleave.prevent="bgDragLeave"
                @drop.prevent="bgDrop"
                @click="bgClick"
                :class="bgActive ? 'dropzone active' : 'dropzone'"
              >
                <div v-if="bgName === '' && bgPreview === ''">
                  <p>
                    ลากรูป หรือ กดที่กรอบนี้<br />
                    เพื่ออัพโหลดรูปพื้นหลัง
                  </p>
                </div>

                <div v-else>
                  <img :src="bgPreview" alt="background preview" />
                  <p>
                    {{ bgName }}
                  </p>
                </div>
                <input type="file" @change="bgHandler" style="display: none" ref="bgElement" />
              </div>
            </div>
          </div>

          <br />

          <button class="btn glass-button" type="submit">บันทึก</button>
        </form>
      </div>
    </main>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;

  overflow-y: auto;
}

header {
  width: 100%;
  margin: 0.5rem 0;
  padding: 0 1rem;
}

input,
textarea {
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
  resize: none;
}

input:hover,
input:focus,
textarea:hover,
textarea:focus {
  background-position: 100% 100%;
}

.main-container {
  width: 100%;
  min-height: 50dvh;
  height: calc(100% - 5rem);

  display: flex;
  flex-direction: row;

  gap: 1rem;

  justify-content: start;
  align-items: start;
  flex-wrap: wrap;
}

form {
  min-width: 18rem;
  height: fit-content;
  padding: 1rem;

  color: whitesmoke;
  background: linear-gradient(45deg, transparent, rgba(245, 245, 245, 0.2));

  border-radius: 1rem;
  border: 1px solid rgba(245, 245, 245, 0.4);
  border-left: 1px solid rgba(245, 245, 245, 0.1);
  border-bottom: 1px solid rgba(245, 245, 245, 0.1);

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cut-container {
  width: 18rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.long-container {
  width: calc(100% - 20rem);

  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.data-submit {
  max-width: 40rem;
  width: 100%;
}

.data-submit .container-manager {
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
  gap: 1rem;
}

.minor-container {
  width: 100%;
  height: auto;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bank-order {
  width: 100%;
  ul {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0;
    margin: 0;
  }

  li {
    width: 100%;

    padding: 1rem 0.5rem;
    margin: 0;
    text-align: center;

    background: linear-gradient(45deg, transparent, rgba(245, 245, 245, 0.2));
    background-size: 400% 400%;
    background-position: 50% 50%;

    border: 1px solid rgba(245, 245, 245, 0.2);
    border-radius: 1rem;
    border-left: 0;
    border-bottom: 0;
  }

  li:hover {
    background-position: 100% 100%;
    cursor: grab;
  }
}

.dropzone {
  width: 100%;
  padding: 1rem 0;
  min-height: 150px;

  border-radius: 1rem;
  border: 2px dotted #f5f5f5;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.dropzone.active {
  border-color: #fe6e6f;
}

.dropzone * {
  width: 100%;
  padding: 0 !important;
  margin: 0 !important;
}

.dropzone:hover {
  border-color: #fe6e6f;
  cursor: pointer;
}

.dropzone div img {
  width: 150px;
  height: auto;
}

input[type='file'] {
  display: none;
}
</style>
