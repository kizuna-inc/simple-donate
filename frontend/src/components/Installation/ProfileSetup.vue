<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import type { DetailedInterface } from '@/modules/interface/install/detailed'

const name = ref<string>('')
const description = ref<string>('')
const profileImage = ref<Blob | null>(null)
const backgroundImage = ref<Blob | null>(null)

const profileActive = ref<boolean>(false)
const profileName = ref<string>('')
const profilePreview = ref<string>('')
const profileElement = ref<HTMLInputElement | null>(null)

const bgActive = ref<boolean>(false)
const bgName = ref<string>('')
const bgPreview = ref<string>('')
const bgElement = ref<HTMLInputElement | null>(null)

const props = defineProps<{
  update: (payload: DetailedInterface) => 0 | 1
  payload: DetailedInterface
  next: () => void
  priv: () => void
}>()

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

const submitHandler = (e: SubmitEvent) => {
  e.preventDefault()

  let payload: DetailedInterface = {
    name: name.value,
    description: description.value,
    profileImage: profileImage.value !== null ? profileImage.value : null,
    backgroundImage: backgroundImage.value !== null ? backgroundImage.value : null,
  }

  let set = props.update(payload)

  if (set == 1) {
    props.next()
  }
}

// Active animation
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

// On mounted restoring data
onMounted(() => {
  const { payload } = props

  if (payload.name !== null && payload.name !== undefined && payload.name !== '') {
    name.value = payload.name
  }

  if (
    payload.description !== null &&
    payload.description !== undefined &&
    payload.description !== ''
  ) {
    description.value = payload.description
  }

  if (payload.profileImage !== null && payload.profileImage !== undefined) {
    if (typeof payload.profileImage !== 'string') {
      profileImage.value = payload.profileImage
      profilePreview.value = URL.createObjectURL(payload.profileImage)
    }
  }

  if (payload.backgroundImage !== null && payload.backgroundImage !== undefined) {
    if (typeof payload.backgroundImage !== 'string') {
      backgroundImage.value = payload.backgroundImage
      bgPreview.value = URL.createObjectURL(payload.backgroundImage)
    }
  }
})
</script>

<template>
  <h1 class="text-center mt-2 mb-3">ตั้งค่าระบบหลังบ้าน</h1>

  <form @submit="(e) => submitHandler(e)" class="mt-3 mb-4">
    <h4 class="text-left" style="text-decoration: underline">ตั้งค่าข้อมูลผู้ใช้</h4>

    <input class="text-left p-2" type="text" placeholder="ชื่อที่แสดง" v-model="name" />
    <textarea class="text-left p-2" type="text" placeholder="คำอธิบาย" v-model="description" />

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
      <input type="file" @change="profileHandler" style="display: none" ref="profileElement" />
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

    <div class="button-holder">
      <button
        type="button"
        class="btn btn-secondary p-2 w-full block text-start"
        @click="props.priv()"
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

  input,
  textarea {
    border-radius: 1rem;
    border: 2px solid #2e2f2f;
    outline: 0;
  }

  input[type='file'] {
    display: none;
  }

  textarea {
    height: 100px;
  }

  input:focus,
  textarea:focus {
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
