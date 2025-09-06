// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, onValue, update, query, equalTo, orderByChild } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

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

// Reference to the 'Users' node in Firebase Realtime Database
const usersRef = ref(database, 'Users');

// Function to convert timestamp to a readable date format
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB'); // Format as dd/mm/yyyy
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
                <button class="deactivate">Deactivate</button>
                <button class="suspend">Suspend</button>
            </td>
        `;

        // Append row to table body
        tbody.appendChild(row);

        // Add event listeners to the buttons
        const deactivateButton = row.querySelector('.deactivate');
        const suspendButton = row.querySelector('.suspend');

        // Update status to 'deactivated' when Deactivate button is clicked
        deactivateButton.addEventListener('click', () => {
            updateUserStatusByEmail(user.email, 'deactivated');
        });

        // Update status to 'suspended' when Suspend button is clicked
        suspendButton.addEventListener('click', () => {
            updateUserStatusByEmail(user.email, 'suspended');
        });
    });
}

// Function to load and display users data from Firebase
function loadData() {
    onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        
        // Filter users whose status is 'approved' and role is 'Youth' or 'Volunteer'
        const filteredUsers = Object.keys(data)
            .map(key => data[key]) // Use user data directly without ID
            .filter(user => user.status === 'approved' && (user.role === 'Youth' || user.role === 'Volunteer'));

        // Display the filtered data in the table
        displayUsersData(filteredUsers);
    }, {
        onlyOnce: true // Set to false if you want live updates
    });
}

// Load data on page load
loadData();
