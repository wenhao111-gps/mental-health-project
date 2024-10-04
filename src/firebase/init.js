// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth' // Import Firebase Authentication
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAAdtO_WLbpblfwwWqY1785puWWyH7ad80',
  authDomain: 'mental-health-d8d0f.firebaseapp.com',
  projectId: 'mental-health-d8d0f',
  storageBucket: 'mental-health-d8d0f.appspot.com',
  messagingSenderId: '737879193202',
  appId: '1:737879193202:web:b6aa21513682e9dd1bb4eb'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app) // Initialize and export Firebase Authentication
const db = getFirestore(app) // Initialize and export Firestore

export { auth, db } // Export both auth and db
