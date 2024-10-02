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

const router = useRouter()

const username = ref('')
const role = ref('')

const isAdminOrEditor = ref(false)

const newReviewContent = ref('')

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
