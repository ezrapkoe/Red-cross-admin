// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, onValue, update, query, equalTo, orderByChild } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js"; // Import auth functions

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
const database = getDatabase(app);
const auth = getAuth(); // Initialize Firebase Auth

// Reference to the 'Users' node in Firebase Realtime Database
const usersRef = ref(database, 'Users');

// Redirect to login.html if user is not logged in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html"; // Redirect to login page
    } else {
        loadData(); // Load data if user is logged in
    }
});

// Function to convert timestamp to a readable date format
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB'); // Format as dd/mm/yyyy
}

// Function to send a rejection email via the backend API
async function sendRejectionEmail(email) {
    try {
        const response = await fetch('http://localhost:3000/send-rejection-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            console.log('Rejection email sent successfully');
        } else {
            console.error('Failed to send rejection email');
        }
    } catch (error) {
        console.error('Error sending rejection email:', error);
    }
}

// Function to update user status in the database based on email
function updateUserStatusByEmail(email, newStatus) {
    // Create a query to find the user by email
    const userQuery = query(usersRef, orderByChild('email'), equalTo(email));

    // Perform the query
    onValue(userQuery, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
            // Get the unique key generated for the user
            const userKey = Object.keys(userData)[0];  
            
            // Create a reference to the user in the database by their unique key
            const userRef = ref(database, `Users/${userKey}`);

            // Update the status field of the user
            update(userRef, {
                status: newStatus
            }).then(() => {
                console.log(`User with email ${email} status updated to ${newStatus}`);

                // Send rejection email if status is 'rejected'
                if (newStatus === 'rejected') {
                    sendRejectionEmail(email);
                }

                // Reload data to reflect changes
                loadData();
            }).catch((error) => {
                console.error('Error updating status:', error);
            });
        } else {
            console.error(`No user found with email: ${email}`);
        }
    }, {
        onlyOnce: true
    });
}

// Function to display users data in the table
function displayUsersData(usersData) {
    const tbody = document.querySelector('tbody'); // Table body to display users
    tbody.innerHTML = ''; // Clear the table body before populating

    usersData.forEach((user) => {
        const signUpDate = formatDate(user.signupTime); // Convert signup timestamp to readable date

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.password}</td>
            <td>${signUpDate}</td> <!-- Display Sign Up Date -->
            <td>
                <button class="approve">Approve</button>
                <button class="suspend">Suspend</button>
                <button class="reject">Reject</button> <!-- New Reject button -->
            </td>
        `;

        // Append row to table body
        tbody.appendChild(row);

        // Add event listeners to the buttons
        const approveButton = row.querySelector('.approve');
        const suspendButton = row.querySelector('.suspend');
        const rejectButton = row.querySelector('.reject'); // New Reject button

        // Update status to 'approved' when Approve button is clicked
        approveButton.addEventListener('click', () => {
            updateUserStatusByEmail(user.email, 'approved');
        });

        // Update status to 'suspended' when Suspend button is clicked
        suspendButton.addEventListener('click', () => {
            updateUserStatusByEmail(user.email, 'suspended');
        });

        // Update status to 'rejected' when Reject button is clicked
        rejectButton.addEventListener('click', () => {
            updateUserStatusByEmail(user.email, 'rejected');
        });
    });
}

// Function to load and display users data from Firebase
function loadData() {
    onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        
        // Filter users whose status is 'pending' and role is 'Youth' or 'Volunteer'
        const filteredUsers = Object.keys(data)
            .map(key => data[key]) // Use user data directly without ID
            .filter(user => user.status === 'pending' && (user.role === 'Youth' || user.role === 'Volunteer'|| user.role === 'Supplier' || user.role === 'Trainer'));

        // Display the filtered data in the table
        displayUsersData(filteredUsers);
    }, {
        onlyOnce: false // Set to false if you want live updates
    });
}