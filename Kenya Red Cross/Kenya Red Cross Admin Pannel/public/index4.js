import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, onValue, update, set } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCRHB6jRaZSlypKy3CIwYA2K8IQpJcq_p4",
    authDomain: "red-cross-project-batabase.firebaseapp.com",
    databaseURL: "https://red-cross-project-batabase-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "red-cross-project-batabase",
    storageBucket: "red-cross-project-batabase.firebasestorage.app",
    messagingSenderId: "649947953555",
    appId: "1:649947953555:web:e25d6452f03eb0d1c7d066",
    measurementId: "G-ZNJHX78LWD"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Utility function to hash the password using SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

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
        displayUsers(filteredUsers);

        // Add search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const searchQuery = e.target.value.toLowerCase();
            const filteredRows = filteredUsers.filter(user => 
                user.username.toLowerCase().includes(searchQuery) || 
                user.email.toLowerCase().includes(searchQuery)
            );
            displayUsers(filteredRows);
        });
    });
}

// Function to display users in the table
function displayUsers(users) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing data

    users.forEach(({ key, username, email, role, signupTime }) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${username}</td>
            <td>${email}</td>
            <td>${role}</td>
            <td>********</td> <!-- Hide password -->
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
async function addUserToDatabase(username, email, password, role) {
    // Hash the password before storing
    const hashedPassword = await hashPassword(password);

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
                password: hashedPassword, // Store hashed password
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