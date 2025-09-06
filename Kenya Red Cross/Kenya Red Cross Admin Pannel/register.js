// Import the Firebase functions you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

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
const database = getDatabase(app);

// Handle sign-up form submission
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get user input values
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Check if password matches confirm password
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Create user with Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User successfully created
            const user = userCredential.user;
            const userId = user.uid;

            // Store user data in Firebase Realtime Database under 'administrator' node
            return set(ref(database, 'administrator/' + userId), {
                fullName: fullName,
                email: email,
                createdAt: new Date().toISOString(),
                role: 'administrator'
            });
        })
        .then(() => {
            alert("Account successfully created!");
            // Redirect to dashboard
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            console.error("Error: ", error);
            alert("Error: " + error.message);
        });
});
