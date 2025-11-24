<script setup lang="ts">
const hasHistory = () => {
  return window.history.length > 2
}
</script>

<template>
  <div class="main-container">
    <img src="https://http.cat/404" alt="404" />
    <button class="back" type="button" @click="hasHistory() ? $router.go(-1) : $router.push('/')">
      &laquo; ย้อนกลับ
    </button>
  </div>
</template>

<style scoped>
.main-container {
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: black;

  img {
    min-width: 18rem;
    width: 50%;
  }

  button {
    padding: 0.5rem 1rem;
    color: whitesmoke;
    border-radius: 1rem;

    background: linear-gradient(45deg, transparent, rgba(245, 245, 245, 0.2));
    border: 1px solid rgba(245, 245, 245, 0.4);
    border-bottom: 0;
    border-left: 0;
  }
}
</style>
