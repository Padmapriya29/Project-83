import firebase from "firebase";
require("@firebase/firestore");
var firebaseConfig = {
  apiKey: "AIzaSyBxOzVsr6x5DT3KKDu5_rqnHTxKzG2B99A",
  authDomain: "barter-system-app--padmapriya.firebaseapp.com",
  projectId: "barter-system-app--padmapriya",
  storageBucket: "barter-system-app--padmapriya.appspot.com",
  messagingSenderId: "127214612511",
  appId: "1:127214612511:web:49bbd1a615c4364aa0e52a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase.firestore();
