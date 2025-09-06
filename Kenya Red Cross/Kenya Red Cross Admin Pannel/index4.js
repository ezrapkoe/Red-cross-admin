import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, onValue, update, set } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBwWUAEfAAHATNqiw3LdbyP_JuVN7_GobU",
    authDomain: "red-cross-project-database.firebaseapp.com",
    databaseURL: "https://red-cross-project-database-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "red-cross-project-database",
    storageBucket: "red-cross-project-database.appspot.com",
    messagingSenderId: "20559957669",
    appId: "1:20559957669:web:7505bffbe9c8dc44557fc8",
    measurementId: "G-KS4P0YPVQ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Check if the user is logged in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // User is not logged in, log them out and redirect
        signOut(auth).then(() => {
            window.location.href = 'login.html'; // Redirect to login page
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    } else {
        loadData(); // Load data if user is logged in
    }
});

// Load existing users from Firebase
function loadData() {
    const usersRef = ref(database, 'Users');
    onValue(usersRef, (snapshot) => {
        const users = snapshot.val();
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = ''; // Clear existing data

        // Filter to only include approved users
        const filteredUsers = Object.keys(users)
            .map(key => ({ key, ...users[key] })) // Include the key in the user object
            .filter(user => user.status === 'approved' && 
                (user.role === 'Service Manager' || 
                 user.role === 'Trainer' || 
                 user.role === 'Finance Manager' || 
                 user.role === 'Coordinator' || 
                 user.role === 'Inventory Manager' || 
                 user.role === 'Supplier'));

        // Display filtered users
        filteredUsers.forEach(({ key, username, email, role, password, signupTime }) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${username}</td>
                <td>${email}</td>
                <td>${role}</td>
                <td>${password}</td>
                <td>${new Date(signupTime).toLocaleString()}</td>
                <td>
                    <button class="delete" data-key="${key}">Delete</button>
                    <button class="deactivate" data-key="${key}">Deactivate</button>
                    <button class="suspend" data-key="${key}">Suspend</button>
                </td>
            `;
            tbody.appendChild(row);
            
            // Add event listeners for Deactivate and Suspend buttons
            const deactivateButton = row.querySelector('.deactivate');
            const suspendButton = row.querySelector('.suspend');

            deactivateButton.addEventListener('click', () => {
                updateUserStatusByKey(key, 'deactivated');
            });

            suspendButton.addEventListener('click', () => {
                updateUserStatusByKey(key, 'suspended');
            });
        });

        // Add delete functionality
        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', () => {
                const userKey = button.getAttribute('data-key');
                const userRef = ref(database, 'Users/' + userKey);
                set(userRef, null).then(() => {
                    loadData(); // Reload data after deletion
                });
            });
        });
    });
}

// Function to update user status by key
function updateUserStatusByKey(key, newStatus) {
    const userRef = ref(database, 'Users/' + key);
    update(userRef, { status: newStatus })
        .then(() => {
            console.log(`User status updated to ${newStatus}!`);
            loadData(); // Reload data to reflect the change
        })
        .catch((error) => {
            console.error('Error updating user status:', error);
        });
}

// Function to add a new user to the database and Firebase Authentication
function addUserToDatabase(username, email, password, role) {
    // Create user in Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const newUserRef = ref(database, 'Users/' + email.replace('.', '_'));
            const currentTime = Date.now(); // Get current timestamp for signupTime

            // Set user data in the Realtime Database
            set(newUserRef, {
                username: username,
                email: email,
                password: password, // Make sure to hash the password in a real application
                role: role,
                signupTime: currentTime,
                status: 'approved'
            }).then(() => {
                console.log('User added to the database successfully!');
                loadData(); // Reload data to reflect the new user
            }).catch((error) => {
                console.error('Error adding user to the database:', error);
            });
        })
        .catch((error) => {
            console.error('Error creating user in Authentication:', error.message);
        });
}

// Handle form submission
document.getElementById('userForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Validate input
    if (username && email && password && role) {
        // Call the function to add user to the database and Authentication
        addUserToDatabase(username, email, password, role);

        // Clear form fields
        document.getElementById('userForm').reset();
    } else {
        alert('Please fill in all fields.');
    }
});
