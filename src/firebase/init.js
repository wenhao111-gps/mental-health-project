import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAAdtO_WLbpblfwwWqY1785puWWyH7ad80',
  authDomain: 'mental-health-d8d0f.firebaseapp.com',
  projectId: 'mental-health-d8d0f',
  storageBucket: 'mental-health-d8d0f.appspot.com',
  messagingSenderId: '737879193202',
  appId: '1:737879193202:web:b6aa21513682e9dd1bb4eb'
}

const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

export { auth, db }
