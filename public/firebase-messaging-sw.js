importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBD5pz6aKj4Z2VQcIkrU6WOiGqbwl2ydck",
  authDomain: "projeto-instagram-93637.firebaseapp.com",
  projectId: "projeto-instagram-93637",
  storageBucket: "projeto-instagram-93637.appspot.com",
  messagingSenderId: "565751004441",
  databaseURL: "https://projeto-instagram-93637-default-rtdb.firebaseio.com/",
  appId: "1:565751004441:web:3ac6ea830471f20bf21988",
  measurementId: "G-B0HR936FKW"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});