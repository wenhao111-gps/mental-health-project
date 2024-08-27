<template>
  <h1>This is the home page</h1>
  <p>Welcome, {{ tokenName }}</p>
  <button @click="logOff">Log off</button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

const tokenName = ref('')

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    tokenName.value = token
  } else {
    router.push('/login')
  }
})

const logOff = () => {
  localStorage.removeItem('token')

  router.push('/login')
}
</script>
