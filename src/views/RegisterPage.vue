<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-sm-8 offset-sm-2">
        <h1 class="heading">Be a member of us</h1>
        <form @submit.prevent="submitForm">
          <div class="row justify-content-center">
            <div class="col-6 mb-3">
              <label for="username" class="form-label">Username:</label>
              <input
                type="text"
                class="form-control"
                id="username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                v-model="formData.username"
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-6 mb-3">
              <label for="password" class="form-label">Password:</label>
              <input
                type="password"
                class="form-control"
                id="password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                v-model="formData.password"
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-6 mb-3">
              <label for="confirm-password" class="form-label">Confirm password</label>
              <input
                type="password"
                class="form-control"
                id="confirm-password"
                v-model="formData.confirmPassword"
                @blur="() => validateConfirmPassword(true)"
              />
              <div v-if="errors.confirmPassword" class="text-danger">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-6 mb-3">
              <label for="gender" class="form-label">Gender</label>
              <select
                class="form-select"
                id="gender"
                @blur="() => validateGender(true)"
                @input="() => validateGender(false)"
                v-model="formData.gender"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
              <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
            </div>
          </div>

          <div class="row justify-content-center">
            <div class="col-6 mb-3">
              <label for="email" class="form-label">Email:</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="formData.email"
                @blur="() => validateEmail(true)"
              />
              <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
            </div>
          </div>
          <div class="row justify-content-center">
            <div class="col-6 mb-3">
              <label for="role" class="form-label">Role:</label>
              <select class="form-select" id="role" v-model="formData.role">
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  gender: '',
  email: '',
  role: ''
})

const submittedData = ref([])

const submitForm = () => {
  validateName(true)
  if (
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    !errors.value.email &&
    !errors.value.gender &&
    !errors.value.role
  ) {
    const existingUsers = JSON.parse(localStorage.getItem('allUsersData')) || []
    existingUsers.push({ ...formData.value })
    localStorage.setItem('allUsersData', JSON.stringify(existingUsers))
    submittedData.value.push({ ...formData.value })
    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    gender: '',
    email: '',
    role: ''
  }
}

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  gender: null,
  email: null,
  role: null
})

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character'
  } else {
    errors.value.password = null
  }
}

const validateEmail = (blur) => {
  const email = formData.value.email
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  if (!emailPattern.test(email)) {
    if (blur) errors.value.email = 'Please enter a valid email address.'
  } else {
    errors.value.email = null
  }
}

const validateGender = (blur) => {
  const gender = formData.value.gender

  if (!gender || !['male', 'female', 'other'].includes(gender)) {
    if (blur) errors.value.gender = 'You must select a gender.'
  } else {
    errors.value.gender = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Password do not match.'
  } else {
    errors.value.confirmPassword = null
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
