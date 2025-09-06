// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBwWUAEfAAHATNqiw3LdbyP_JuVN7_GobU",
    authDomain: "red-cross-project-database.firebaseapp.com",
    databaseURL: "https://red-cross-project-database-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "red-cross-project-database",
    storageBucket: "red-cross-project-database.appspot.com",
    messagingSenderId: "875886335283",
    appId: "1:875886335283:web:90d2030be7de3959ae1a46",
    measurementId: "G-YC8MJY9090"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle login form submission
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get email and password values from form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Sign in user with Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert('Login successful!');
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });
});
