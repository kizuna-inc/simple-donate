<script lang="ts" setup>
import axios from 'axios'
import Swal from 'sweetalert2'
import { onMounted, ref } from 'vue'

const image = ref<Blob | undefined>()
const sound = ref<Blob | undefined>()

const imageActive = ref<boolean>(false)
const imageName = ref<string>('')
const imagePreview = ref<string>('')
const imageElement = ref<HTMLInputElement | null>(null)

const soundActive = ref<boolean>(false)
const soundName = ref<string>('')
const soundPreview = ref<string>('')
const soundElement = ref<HTMLInputElement | null>(null)

const imageStore = async (file: File) => {
  const buffer = await file.arrayBuffer()
  const blob = new Blob([buffer], { type: file.type })

  imageName.value = file.name
  imagePreview.value = URL.createObjectURL(blob)

  image.value = blob
}
const imageHandler = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (file !== undefined && file !== null) {
    await imageStore(file)
  }
}
const imageDrop = async (e: DragEvent) => {
  imageActive.value = false

  if (e.dataTransfer) {
    let file = Array.from(e.dataTransfer.files)[0]

    if (file !== undefined && file !== null) {
      await imageStore(file)
    }
  }
}
const imageClick = () => {
  imageElement.value?.click()
}
const imageDragOver = (e: DragEvent) => {
  imageActive.value = true
}
const imageDragLeave = (e: DragEvent) => {
  imageActive.value = false
}

const soundStore = async (file: File) => {
  const buffer = await file.arrayBuffer()
  const blob = new Blob([buffer], { type: file.type })

  soundName.value = file.name
  soundPreview.value = URL.createObjectURL(blob)

  sound.value = blob
}
const soundHandler = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (file !== undefined && file !== null) {
    await soundStore(file)
  }
}
const soundDrop = async (e: DragEvent) => {
  soundActive.value = false

  if (e.dataTransfer) {
    let file = Array.from(e.dataTransfer.files)[0]

    if (file !== undefined && file !== null) {
      await soundStore(file)
    }
  }
}
const soundClick = () => {
  soundElement.value?.click()
}
const soundDragOver = (e: DragEvent) => {
  soundActive.value = true
}
const soundDragLeave = (e: DragEvent) => {
  soundActive.value = false
}

const textElement = ref<string>('')

const link = `${import.meta.env.VITE_SOCKET}/screen`

const testPing = () => {
  fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/socket/test`)
}

const textUpdate = async () => {
  const textPayload = textElement.value
    .replace('<ผู้ใช้>', '--user--')
    .replace('<จำนวนเงิน>', '--amount--')

  const data = await (
    await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/config/overlay/update/text`, {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: String(window.sessionStorage.getItem('token')),
      }),
      body: JSON.stringify({
        text: textPayload,
      }),
    })
  ).json()

  if (data.status === 1) {
    Swal.fire({
      title: 'สำเร็จ!',
      text: 'เปลี่ยนข้อความสำเร็จแล้ว',
      icon: 'success',
    }).then(() => {
      mountedFunction()
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'มีบางอย่างผิดพลาดเกิดขึ้น',
      text: 'กรุณาติดต่อ Maintainer หรือ สร้าง Issue ไว้บน Repository หลักบน Github เพื่อรับความช่วยเหลือ',
    })
  }
}
const imageUpdate = async () => {
  if (image.value === undefined) {
    return
  }

  const UploadForm = new FormData()

  UploadForm.append(
    'file',
    new File([image.value], `alert.${image.value.type.split('/').reverse()[0]}`),
  )

  const resp = (
    await axios({
      method: 'post',
      url: `${import.meta.env.VITE_API_ENDPOINT}/api/config/overlay/update/image`,
      data: UploadForm,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: String(window.sessionStorage.getItem('token')),
      },
    })
  ).data

  if (resp.status > 0) {
    Swal.fire({
      title: 'สำเร็จ!',
      text: 'เปลี่ยนรูปสำเร็จแล้ว',
      icon: 'success',
    }).then(() => {
      imageName.value = ''
      imagePreview.value = ''
      image.value = undefined
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'มีบางอย่างผิดพลาดเกิดขึ้น',
      text: 'กรุณาติดต่อ Maintainer หรือ สร้าง Issue ไว้บน Repository หลักบน Github เพื่อรับความช่วยเหลือ',
    }).then(() => console.error(resp.message))
  }
}
const soundUpdate = async () => {
  if (sound.value === undefined) {
    return
  }

  const UploadForm = new FormData()

  UploadForm.append(
    'file',
    new File([sound.value], `alert.${sound.value.type.split('/').reverse()[0]}`),
  )

  const resp = (
    await axios({
      method: 'post',
      url: `${import.meta.env.VITE_API_ENDPOINT}/api/config/overlay/update/sound`,
      data: UploadForm,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: String(window.sessionStorage.getItem('token')),
      },
    })
  ).data

  if (resp.status > 0) {
    Swal.fire({
      title: 'สำเร็จ!',
      text: 'เปลี่ยนเสียงเตือนสำเร็จแล้ว',
      icon: 'success',
    }).then(() => {
      soundName.value = ''
      soundPreview.value = ''
      sound.value = undefined
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'มีบางอย่างผิดพลาดเกิดขึ้น',
      text: 'กรุณาติดต่อ Maintainer หรือ สร้าง Issue ไว้บน Repository หลักบน Github เพื่อรับความช่วยเหลือ',
    }).then(() => console.error(resp.message))
  }
}

const mountedFunction = async () => {
  const data = await (
    await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/config/overlay`, {
      method: 'get',
      headers: new Headers({
        Authorization: String(window.sessionStorage.getItem('token')),
      }),
    })
  ).json()

  textElement.value = data.payload.text
    .replace('--user--', '<ผู้ใช้>')
    .replace('--amount--', '<จำนวนเงิน>')
}

onMounted(async () => await mountedFunction())
</script>

<template>
  <main style="overflow-y: auto">
    <header>
      <h1>ตั้งค่าหน้า Overlay (หน้าสตรีม)</h1>
    </header>

    <main class="main-container">
      <div class="preview-container">
        <iframe
          :src="link"
          frameborder="0"
          style="height: 1080px; overflow: none; aspect-ratio: 16/9"
        ></iframe>
      </div>

      <div class="item-container">
        <div class="controller">
          <button @click="() => testPing()" class="btn glass-button">ทดสอบ Overlay</button>
        </div>
        <div class="form-container">
          <!-- Donate  -->
          <form @submit.prevent="() => textUpdate()" class="text-update">
            <label for="text-donate"> คำที่จะแสดงตอนส่ง Donate </label>
            <textarea
              name="text-donate"
              id="text-donate"
              v-model="textElement"
              placeholder="คำที่จะแสดงตอนส่ง Donate"
              rows="4"
            ></textarea>
            <div>
              <p class="m-0">ใช้ <code><จำนวนเงิน></code> แทนค่าของจำนวนเงิน</p>
              <p class="m-0">ใช้ <code><ผู้ใช้></code> แทนค่าของผู้ใช้</p>
            </div>
            <button type="submit" class="btn glass-button">บันทึก</button>
          </form>

          <!-- Image -->
          <form @submit.prevent="() => imageUpdate()">
            <h3>รูปภาพแจ้งเตือน</h3>
            <div
              @dragover.prevent="imageDragOver"
              @dragleave.prevent="imageDragLeave"
              @drop.prevent="imageDrop"
              @click="imageClick"
              :class="imageActive ? 'dropzone active' : 'dropzone'"
            >
              <div v-if="imageName === '' && imagePreview === ''">
                <p>
                  ลากรูป หรือ กดที่กรอบนี้<br />
                  เพื่ออัพโหลดรูปที่จะแสดงในโดเนท
                </p>
              </div>

              <div v-else>
                <img :src="imagePreview" alt="image preview" />
                <p>
                  {{ imageName }}
                </p>
              </div>
              <input type="file" @change="imageHandler" style="display: none" ref="imageElement" />
            </div>

            <button type="submit" class="btn glass-button">บันทึก</button>
          </form>

          <!-- Sound -->
          <form @submit.prevent="() => soundUpdate()">
            <h3>เสียงแจ้งเตือน</h3>
            <div
              @dragover.prevent="soundDragOver"
              @dragleave.prevent="soundDragLeave"
              @drop.prevent="soundDrop"
              @click="soundClick"
              :class="soundActive ? 'dropzone active' : 'dropzone'"
            >
              <div v-if="soundName === '' && soundPreview === ''">
                <p>
                  ลากรูป หรือ กดที่กรอบนี้<br />
                  เพื่ออัพโหลดไฟล์เสียง
                </p>
              </div>

              <div v-else>
                <p>
                  {{ soundName }}
                </p>
              </div>
              <input type="file" @change="soundHandler" style="display: none" ref="soundElement" />
            </div>
            <button class="btn glass-button" type="submit">บันทึก</button>
          </form>
        </div>
      </div>
    </main>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;
}

header {
  width: 100%;
  margin: 0.5rem 0;
  padding: 0 1rem;
}

.main-container {
  width: 100%;

  padding: 1rem 0;

  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 1rem;
}

.preview-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  iframe {
    zoom: 0.33;
    border: 1px solid rgba(245, 245, 245, 0.2);
    border-radius: 1rem;
  }
}

.item-container {
  width: 80%;

  .controller {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: end;
  }
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

form {
  width: 18rem;

  background: linear-gradient(45deg, transparent, rgba(245, 245, 245, 0.3));
  border: 1px solid rgba(245, 245, 245, 0.4);
  border-left: 0;
  border-bottom: 0;

  padding: 1rem;
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.dropzone {
  width: 100%;
  padding: 1rem 0;
  min-height: 150px;

  border-radius: 1rem;
  border: 2px dotted #2e2f2f;

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
