<template>
  <div class="container mt-5">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h1 class="card-title">Home Page</h1>
      </div>
      <div class="card-body">
        <p class="lead">
          Welcome, <strong>{{ username }}</strong>
        </p>
        <p>
          You are: <span class="badge bg-info text-dark">{{ role }}</span>
        </p>

        <div v-if="isAdminOrEditor">
          <h2>Post a New Review</h2>
          <textarea
            v-model="newReviewContent"
            class="form-control"
            rows="4"
            placeholder="Enter your review here"
          ></textarea>
          <button @click="postReview" class="btn btn-primary mt-2">Post Review</button>
        </div>

        <button @click="logOff" class="btn btn-danger mt-3">Log off</button>

        <p class="lead">Send an Email</p>

        <div v-if="isAdminOrEditor">
          <h2>Send an Email</h2>
          <form @submit.prevent="sendEmail">
            <div class="mb-3">
              <label for="toEmail" class="form-label">To Email:</label>
              <input
                type="email"
                v-model="emailForm.toEmail"
                class="form-control"
                id="toEmail"
                required
              />
            </div>
            <div class="mb-3">
              <label for="subject" class="form-label">Subject:</label>
              <input
                type="text"
                v-model="emailForm.subject"
                class="form-control"
                id="subject"
                required
              />
            </div>
            <div class="mb-3">
              <label for="message" class="form-label">Message:</label>
              <textarea
                v-model="emailForm.message"
                class="form-control"
                id="message"
                rows="4"
                required
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Send Email</button>
          </form>
        </div>
        <div class="mt-5">
          <table id="reviewTable" class="display">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div class="container mt-5">
    <div v-for="review in reviews" :key="review.id" class="card mb-3">
      <div class="card-body">
        <p>{{ review.content }}</p>
        <p>Average Rating: {{ calculateAverage(review.id) }}</p>
        <div v-if="!userHasRated(review.id)">
          <label for="rating">Rate this review:</label>
          <select v-model="userRating" id="rating" class="form-select w-auto d-inline-block">
            <option value="" disabled>Select Rating</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
          <button @click="submitRating(review.id)" class="btn btn-primary ml-2">Submit</button>
        </div>
        <div v-else>
          <p>You have rated this review with a score of {{ getUserRating(review.id) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-dt/css/dataTables.dataTables.min.css'

const router = useRouter()

const username = ref('')
const role = ref('')

const isAdminOrEditor = ref(false)

const newReviewContent = ref('')

const emailForm = ref({
  toEmail: '',
  subject: '',
  message: ''
})

const postReview = () => {
  if (!newReviewContent.value.trim()) {
    alert('Content can not be empty.')
    return
  }
  const reviews = JSON.parse(localStorage.getItem('reviews')) || []
  const newReview = {
    id: Date.now(),
    content: newReviewContent.value,
    rating: []
  }

  reviews.push(newReview)
  localStorage.setItem('reviews', JSON.stringify(reviews))
  newReviewContent.value = ''
  alert('Review posted successfully!')
}

const reviews = ref([])

const userRating = ref('')

const currentUser = ref(null)

onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem('currentUser'))
  const reviewData = [
    { name: 'Mufinella Revie', email: 'mrevie0@cloudflare.com', age: 1, country: 'Thailand' },
    { name: 'De Toomey', email: 'dtoomey1@shinystat.com', age: 2, country: 'Philippines' },
    { name: 'Llewellyn Meneo', email: 'lmeneo2@etsy.com', age: 3, country: 'China' },
    { name: 'Nata Bownass', email: 'nbownass3@discuz.net', age: 4, country: 'Indonesia' },
    { name: 'Jacky Marin', email: 'jmarin4@gizmodo.com', age: 5, country: 'France' },
    { name: 'Hayward McKenzie', email: 'hmckenzie5@google.ru', age: 6, country: 'China' },
    { name: 'Janina Chalk', email: 'jchalk6@sciencedaily.com', age: 7, country: 'Poland' },
    { name: 'Windy Alejo', email: 'walejo7@wikispaces.com', age: 8, country: 'Sweden' },
    { name: 'Zahara Dronsfield', email: 'zdronsfield8@t-online.de', age: 9, country: 'Bahamas' },
    { name: 'Silvain Beldon', email: 'sbeldon9@google.es', age: 10, country: 'Ukraine' },
    { name: 'Vivie Poynzer', email: 'vpoynzera@a8.net', age: 11, country: 'Colombia' },
    { name: 'Basilius Archbell', email: 'barchbellb@ucla.edu', age: 12, country: 'Indonesia' },
    { name: 'Glad Eller', email: 'gellerc@blogspot.com', age: 13, country: 'Indonesia' },
    { name: 'Robby Triplet', email: 'rtripletd@dedecms.com', age: 14, country: 'China' },
    { name: 'Larine Nyland', email: 'lnylande@samsung.com', age: 15, country: 'France' },
    { name: 'Lurleen Forrest', email: 'lforrestf@spotify.com', age: 16, country: 'Nigeria' },
    {
      name: 'Davide Woodings',
      email: 'dwoodingsg@mayoclinic.com',
      age: 17,
      country: 'Czech Republic'
    },
    { name: 'Roxane Brockwell', email: 'rbrockwellh@discovery.com', age: 18, country: 'Egypt' },
    { name: 'Mayor Larchier', email: 'mlarchieri@paginegialle.it', age: 19, country: 'Brazil' },
    { name: 'Jessy Wardingley', email: 'jwardingleyj@meetup.com', age: 20, country: 'South Korea' },
    { name: 'Claudia Mold', email: 'cmoldk@privacy.gov.au', age: 21, country: 'Mongolia' },
    { name: 'Siouxie Nordass', email: 'snordassl@state.gov', age: 22, country: 'China' },
    { name: 'Carolan Wayte', email: 'cwaytem@mlb.com', age: 23, country: 'Spain' },
    { name: 'Dukey Bowden', email: 'dbowdenn@blogspot.com', age: 24, country: 'Indonesia' },
    { name: 'Dulce Pistol', email: 'dpistolo@stanford.edu', age: 25, country: 'Sweden' },
    { name: 'Abey Fransson', email: 'afranssonp@lulu.com', age: 26, country: 'Philippines' },
    {
      name: 'Dorelia Antyukhin',
      email: 'dantyukhinq@networksolutions.com',
      age: 27,
      country: 'China'
    },
    { name: 'Keir Fiander', email: 'kfianderr@paypal.com', age: 28, country: 'Indonesia' },
    {
      name: 'Jerrie Haslegrave',
      email: 'jhaslegraves@moonfruit.com',
      age: 29,
      country: 'United States'
    },
    { name: 'Lawry Yeaman', email: 'lyeamant@facebook.com', age: 30, country: 'Russia' }
  ]

  reviewData.forEach((row) => {
    $('#reviewTable tbody').append(`
      <tr>
        <td>${row.name}</td>
        <td>${row.email}</td>
        <td>${row.age}</td>
        <td>${row.country}</td>
      </tr>
    `)
  })

  $('#reviewTable').DataTable({
    pageLength: 10,
    searching: true,
    ordering: true
  })

  if (storedUser) {
    currentUser.value = storedUser
    username.value = storedUser.username
    role.value = storedUser.role
    isAdminOrEditor.value = role.value === 'Admin' || role.value === 'Editor'
  } else {
    router.push('/login')
  }
  const saveReviews = JSON.parse(localStorage.getItem('reviews')) || []
  reviews.value = saveReviews
})

const sendEmail = () => {
  const formData = new FormData()
  formData.append('from', 'postmaster@sandbox403a4f9a2cc044628f608ff99a430e7d.mailgun.org')
  formData.append('to', emailForm.value.toEmail)
  formData.append('subject', emailForm.value.subject)
  formData.append('text', emailForm.value.message)

  fetch('https://api.mailgun.net/v3/sandbox403a4f9a2cc044628f608ff99a430e7d.mailgun.org/messages', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa('api:28d68bf78c6ad49fe17443409ea1feb0-5dcb5e36-7b38e538')
    },
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Mailgun API response:', data)
      alert('Email sent successfully!')
    })
    .catch((error) => {
      console.error('Error sending email via Mailgun API:', error)
      alert('Failed to send email: ' + error)
    })
}

const submitRating = (reviewId) => {
  if (!currentUser.value) {
    alert('You must be logged in to submit a rating.')
    return
  }

  const ratingsKey = `ratings_${reviewId}`
  const ratings = JSON.parse(localStorage.getItem(ratingsKey)) || []

  const existingRatingIndex = ratings.findIndex((r) => r.username === currentUser.value.username)

  if (existingRatingIndex !== -1) {
    ratings[existingRatingIndex].score = parseInt(userRating.value)
  } else {
    ratings.push({
      username: currentUser.value.username,
      score: parseInt(userRating.value)
    })
  }

  localStorage.setItem(ratingsKey, JSON.stringify(ratings))

  userRating.value = ''
  alert('Your rating has been submitted!')
}

const calculateAverage = (reviewId) => {
  const ratings = JSON.parse(localStorage.getItem(`ratings_${reviewId}`)) || []
  if (ratings.length === 0) return 'No ratings yet'
  const total = ratings.reduce((sum, rating) => sum + rating.score, 0)
  return (total / ratings.length).toFixed(1)
}

const userHasRated = (reviewId) => {
  if (!currentUser.value) return false

  const ratings = JSON.parse(localStorage.getItem(`ratings_${reviewId}`)) || []
  return ratings.some((rating) => rating.username === currentUser.value.username)
}

const getUserRating = (reviewId) => {
  if (!currentUser.value) return null

  const ratings = JSON.parse(localStorage.getItem(`ratings_${reviewId}`)) || []
  const rating = ratings.find((rating) => rating.username === currentUser.value.username)
  return rating ? rating.score : null
}

const logOff = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('currentUser')
  router.push('/login')
}
</script>
