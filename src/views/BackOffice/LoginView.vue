<script lang="ts" setup>
import type { loginPayload } from '@/modules/interface/auth/response'
import type { responseInterface } from '@/modules/interface/responseInterface'
import { isConfig } from '@/modules/session/configSetup'
import Swal from 'sweetalert2'
import { onMounted, ref } from 'vue'

const username = ref<string>('')
const password = ref<string>('')

const submitHandler = async () => {
  if (username.value !== '' && password.value !== '') {
    let payload = {
      username: username.value,
      password: password.value,
    }

    const loginFetch = (await (
      await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/auth/login`, {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
        }),
        body: JSON.stringify(payload),
      })
    ).json()) as responseInterface<loginPayload>

    console.log(loginFetch)

    if (loginFetch.status === 0) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: loginFetch.message,
        icon: 'error',
      })

      return
    }

    if (loginFetch.payload !== null && loginFetch.payload !== undefined) {
      window.sessionStorage.setItem('token', loginFetch.payload.token)
      window.sessionStorage.setItem('username', loginFetch.payload.username)

      window.location.replace('/admin')
    }
  }
}

onMounted(async () => {
  await isConfig(true)
})
</script>

<template>
  <div class="main-container">
    <form @submit.prevent="submitHandler">
      <h1 class="text-center">เข้าสู่ระบบ</h1>
      <input type="text" placeholder="ชื่อผู้ใช้งาน" v-model="username" required />
      <input type="password" placeholder="รหัสผ่าน" v-model="password" required />

      <button type="submit" class="btn btn-login py-2">เข้าสู่ระบบ</button>
    </form>
  </div>
</template>

<style scoped>
.main-container {
  width: 100%;
  min-height: 100dvh;

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
}

form {
  min-width: 22rem;
  width: 50%;
  padding: 1rem 0;

  color: whitesmoke;
  border-radius: 1rem;

  background: linear-gradient(45deg, transparent, rgba(245, 245, 245, 0.1));
  border: 1px solid rgba(245, 245, 245, 0.4);
  border-bottom: 0;
  border-left: 0;
  backdrop-filter: blur(1rem);

  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  justify-content: center;
  align-items: center;

  * {
    width: 18rem;
  }

  input {
    padding: 0.5rem;
    border-radius: 1rem;
    outline: 0;

    border: 2px solid #2e2f2f;
  }

  input:focus {
    border: 2px solid #fe6e6f;
  }

  .btn-login {
    color: whitesmoke;
    border-radius: 1rem;

    background: linear-gradient(45deg, transparent, rgba(245, 245, 245, 0.1));
    border: 1px solid rgba(245, 245, 245, 0.4);
    border-bottom: 0;
    border-left: 0;
    backdrop-filter: blur(1rem);
  }
}
</style>
