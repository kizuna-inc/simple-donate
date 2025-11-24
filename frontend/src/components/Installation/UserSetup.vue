<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Swal from 'sweetalert2'

import type { UserInterface } from '@/modules/interface/install/user'

const username = ref<string>('')
const password = ref<string>('')
const conPassword = ref<string>('')

const showPassword = ref<boolean>(false)

const props = defineProps<{
  update: (payload: UserInterface) => 0 | 1
  payload: UserInterface
  next: () => void
}>()

const submitHandler = (e: SubmitEvent) => {
  e.preventDefault()

  if (conPassword.value !== password.value) {
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: 'รหัสผ่านไม่ตรงกัน',
      icon: 'error',
      confirmButtonText: 'โอเค',
    })
    return
  }

  let payload: UserInterface = {
    username: username.value,
    password: password.value,
  }

  // console.log(payload)

  let set = props.update(payload)

  if (set == 1) {
    props.next()
  }
}

onMounted(() => {
  if (props.payload.username !== null && props.payload.password !== null) {
    if (props.payload.username !== '' && props.payload.password !== '') {
      username.value = props.payload.username
      password.value = props.payload.password
      conPassword.value = props.payload.password
    }
  }
})
</script>

<template>
  <h1 class="text-center mt-2 mb-3">ตั้งค่าระบบหลังบ้าน</h1>

  <form @submit="(e) => submitHandler(e)" class="mt-3 mb-4">
    <h4 class="text-left" style="text-decoration: underline">ตั้งค่าผู้ใช้</h4>

    <input
      class="text-left p-2"
      type="text"
      placeholder="ชื่อผู้ใช้งาน"
      @bind="username"
      v-model="username"
    />
    <input
      class="text-left p-2"
      :type="showPassword ? 'text' : 'password'"
      placeholder="รหัสผ่าน"
      @bind="password"
      v-model="password"
    />
    <input
      class="text-left p-2"
      :type="showPassword ? 'text' : 'password'"
      placeholder="ยืนยันรหัสผ่าน"
      @bind="password"
      v-model="conPassword"
    />

    <div>
      <input type="checkbox" v-model="showPassword" id="pwd-check" />
      <label for="pwd-check"> &nbsp; แสดงรหัสผ่าน </label>
    </div>

    <div class="button-holder">
      <button type="button" class="btn btn-secondary p-2 w-full block text-start" disabled>
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

  input {
    border-radius: 1rem;
    border: 2px solid #2e2f2f;
    outline: 0;
  }

  input:focus {
    border-radius: 1rem;
    border: 2px solid #fe6e6f;
  }

  button[type='submit'] {
    background: #fe6e6f !important;
    color: whitesmoke !important;
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
