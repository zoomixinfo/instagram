import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyD6XCifmsYLkITilc9_-C4A0QuDUd2Lu0o",
  authDomain: "instagram-3e809.firebaseapp.com",
  projectId: "instagram-3e809",
  storageBucket: "instagram-3e809.appspot.com",
  messagingSenderId: "236198271004",
  appId: "1:236198271004:web:10c63d0fe33078044ea7d9",
  measurementId: "G-YPMF0FY0S8"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
export default firebase;