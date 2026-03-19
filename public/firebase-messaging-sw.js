// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/12.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.10.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyA3GGbTiVIt0bw5uNEkuly0vvkr_omcLx4",
    authDomain: "dutupulmo.firebaseapp.com",
    projectId: "dutupulmo",
    storageBucket: "dutupulmo.firebasestorage.app",
    messagingSenderId: "970918559461",
    appId: "1:970918559461:web:4e573754d2f070589f1e0c",
    measurementId: "G-N6V1SV3P70"
});

const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
    console.log("Background message received:", payload);

    const title = payload.notification?.title || payload.data?.title;
    const body = payload.notification?.body || payload.data?.body;

    self.registration.showNotification(title, {
        body: body,
        icon: "/logo.jpg"
    });
});