<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-sm-8 offset-sm-2">
        <h1 class="heading">Login</h1>
        <form @submit.prevent="login">
          <div class="row justify-content-center">
            <div class="col-6 mb-3">
              <label for="email" class="form-label">Email:</label>
              <input type="text" class="form-control" id="email" v-model="formData.email" />
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-6 mb-3">
              <label for="password" class="form-label">Password:</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.password"
              />
            </div>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Login</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase/init'
import { errorMessages } from 'vue/compiler-sfc'
import { signInWithEmailAndPassword } from 'firebase/auth'

const formData = ref({
  email: '',
  password: ''
})

const router = useRouter()

const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      formData.value.email,
      formData.value.password
    )
    const user = userCredential.user
    console.log('Log in successful: ', user)

    localStorage.setItem('currentUser', JSON.stringify(user))
    localStorage.setItem('token', await user.getIdToken())
    router.push('/HomePage')
  } catch (error) {
    console.error('Error during login: ', error)
    errorMessages.value = 'Invalid email or password.'
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}
.list-group-item {
  padding: 10px;
}

.heading {
  font-family: 'Arial', sans-serif;
  font-size: 3rem;
  letter-spacing: 2px;
  color: #4a90e2;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  text-align: center;
}
</style>
