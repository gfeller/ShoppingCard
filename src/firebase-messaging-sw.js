importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.5/firebase-messaging.js');


firebase.initializeApp({
  apiKey: "AIzaSyBYzkfzpJ4t1AvyNWZKSwr2vF4laPa9v-8",
  authDomain: "ikaufzetteli.firebaseapp.com",
  databaseURL: "https://ikaufzetteli.firebaseio.com",
  projectId: "ikaufzetteli",
  storageBucket: "ikaufzetteli.appspot.com",
  messagingSenderId: "477279744354",
  appId: "1:477279744354:web:2fff0adf68cbc535bdbc3b"
});

if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();
}
