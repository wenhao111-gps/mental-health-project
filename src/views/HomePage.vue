<template>
  <h1>This is the home page</h1>
  <p>Welcome, {{ username }}</p>
  <p>You are {{ role }}</p>
  <div v-if="isAdminOrEditor">
    <h2>Only Admin, Editor can see this</h2>
    <textarea v-model="editableContent"></textarea>
    <button @click="saveContent">Save</button>
  </div>
  <button @click="logOff">Log off</button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

const username = ref('')
const role = ref('')
const editableContent = ref('')

const isAdminOrEditor = ref(false)

onMounted(() => {
  const allUsersData = JSON.parse(localStorage.getItem('allUsersData')) || []
  const currentUser = localStorage.getItem('currentUser')

  if (currentUser) {
    const user = allUsersData.find(
      (user) => user.username === currentUser,
      (user) => user.role === currentUser
    )
    if (user) {
      username.value = user.username
      role.value = user.role
      isAdminOrEditor.value = role.value === 'Admin' || role.value === 'Editor'
      if (isAdminOrEditor.value) {
        editableContent.value = loadContent()
      }
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

const loadContent = () => {
  return 'Editable content here...'
}

const saveContent = () => {
  console.log('COntent saved: ', editableContent.value)
}
</script>
