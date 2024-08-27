<template>
  <h1>This is the home page</h1>
  <p>Welcome, {{ username }}</p>
  <button @click="logOff">Log off</button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

const username = ref('')

onMounted(() => {
  const allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || []
  const currentUser = localStorage.getItem('currentUser')
  if (currentUser) {
    const user = allUsersData.find((user) => user.username === currentUser)
    if (user) {
      username.value = user.username
    } else {
      router.push('/login')
    }
  } else {
    router.push('/login')
  }
})

const logOff = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('currentUser')
  router.push('/login')
}
</script>
