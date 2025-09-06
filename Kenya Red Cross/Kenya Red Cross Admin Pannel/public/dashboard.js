// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Wait for authentication state to be confirmed
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, fetch data
        fetchData();
    } else {
        // User is signed out, redirect to login
        window.location.href = "login.html";
    }
});

// Fetch data from Firebase
function fetchData() {
    const usersRef = ref(database, 'Users');
    const inventoryRef = ref(database, 'OrganisationInventory');
    const coursesRef = ref(database, 'Courses');
    const messagesRef = ref(database, 'ContactUsMessages');

    onValue(usersRef, (snapshot) => {
        const users = snapshot.val();
        displayUserStats(users);
    });

    onValue(inventoryRef, (snapshot) => {
        const inventory = snapshot.val();
        displayInventoryStats(inventory);
    });

    onValue(coursesRef, (snapshot) => {
        const courses = snapshot.val();
        displayCourseStats(courses);
    });

    onValue(messagesRef, (snapshot) => {
        const messages = snapshot.val();
        displayMessageStats(messages);
    });
}

// Display user statistics
function displayUserStats(users) {
    const userStats = {
        approved: 0,
        pending: 0,
        suspended: 0
    };

    for (const user in users) {
        if (users[user].status === "approved") userStats.approved++;
        else if (users[user].status === "pending") userStats.pending++;
        else if (users[user].status === "suspended") userStats.suspended++;
    }

    const userStatsHTML = `
        <div class="card">
            <h3>Users</h3>
            <p>Approved: ${userStats.approved}</p>
            <p>Pending: ${userStats.pending}</p>
            <p>Suspended: ${userStats.suspended}</p>
        </div>
    `;

    document.querySelector('.users').innerHTML += userStatsHTML;
}

// Display inventory statistics
function displayInventoryStats(inventory) {
    let inventoryHTML = '<div class="card"><h3>Inventory</h3>';
    for (const item in inventory) {
        inventoryHTML += `<p>${inventory[item].itemName}: ${inventory[item].count}</p>`;
    }
    inventoryHTML += '</div>';
    document.querySelector('.users').innerHTML += inventoryHTML;
}

// Display course statistics
function displayCourseStats(courses) {
    let courseHTML = '<div class="card"><h3>Courses</h3>';
    for (const course in courses) {
        courseHTML += `<p>${courses[course].title}: ${courses[course].fees}</p>`;
    }
    courseHTML += '</div>';
    document.querySelector('.users').innerHTML += courseHTML;
}
