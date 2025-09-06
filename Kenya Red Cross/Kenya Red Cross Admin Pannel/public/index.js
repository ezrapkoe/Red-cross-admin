// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, onValue, update, query, equalTo, orderByChild } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

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

// Reference to the 'Users' node in Firebase Realtime Database
const usersRef = ref(database, 'Users');

// Function to format timestamp to a readable date (dd/mm/yyyy)
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB');
}

// Function to update user status by email
function updateUserStatusByEmail(email, newStatus) {
    const userQuery = query(usersRef, orderByChild('email'), equalTo(email));

    onValue(userQuery, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
            const userKey = Object.keys(userData)[0];
            const userRef = ref(database, `Users/${userKey}`);

            update(userRef, { status: newStatus })
                .then(() => {
                    console.log(`User status updated to ${newStatus} for email: ${email}`);
                    loadData();
                })
                .catch((error) => console.error('Error updating status:', error));
        } else {
            console.error(`User with email ${email} not found.`);
        }
    }, { onlyOnce: true });
}

// Function to display user data in the table
function displayUsersData(usersData) {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing data

    usersData.forEach((user) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            
            <td>${formatDate(user.signupTime)}</td>
            <td>
                <button class="deactivate">Deactivate</button>
                <button class="suspend">Suspend</button>
            </td>
        `;

        tbody.appendChild(row);

        // Event listeners for Deactivate and Suspend buttons
        row.querySelector('.deactivate').addEventListener('click', () => {
            updateUserStatusByEmail(user.email, 'deactivated');
        });

        row.querySelector('.suspend').addEventListener('click', () => {
            updateUserStatusByEmail(user.email, 'suspended');
        });
    });
}

// Function to load and filter users data from Firebase
function loadData() {
    onValue(usersRef, (snapshot) => {
        const data = snapshot.val();

        const filteredUsers = Object.values(data).filter(user => 
            user.status === 'approved' && 
            (user.role === 'Youth' || user.role === 'Volunteer')
        );

        displayUsersData(filteredUsers);
    }, { onlyOnce: true });
}

// Load data on page load
loadData();

// Add this script after your existing JavaScript code

// Function to filter table rows based on search input
function filterTable() {
    const searchInput = document.getElementById('searchInput');
    const filter = searchInput.value.toLowerCase();
    const table = document.querySelector('.table');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        const row = rows[i];
        const username = row.cells[0].textContent.toLowerCase();
        const email = row.cells[1].textContent.toLowerCase();
        const role = row.cells[2].textContent.toLowerCase();

        if (username.includes(filter) || email.includes(filter) || role.includes(filter)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}

// Event listener for the search input
document.getElementById('searchInput').addEventListener('input', filterTable);

// Event listener for the search button (optional)
document.getElementById('searchButton').addEventListener('click', filterTable);
