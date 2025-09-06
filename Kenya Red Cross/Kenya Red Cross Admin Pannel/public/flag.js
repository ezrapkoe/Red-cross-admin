// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// Firebase configuration
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

// Reference to the Users node
const usersRef = ref(database, "Users");

// Monitor changes in the Users node
onValue(usersRef, (snapshot) => {
    if (snapshot.exists()) {
        const usersData = snapshot.val();

        // Clear existing rows in the table
        const tbody = document.querySelector(".table tbody");
        tbody.innerHTML = "";

        Object.entries(usersData).forEach(([key, user]) => {
            const { email, username, role, password, signupTime, status } = user;

            // Format signup date
            const signupDate = new Date(signupTime).toLocaleDateString();

            // Create a new row for the table
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${username}</td>
                <td>${email}</td>
                <td>${role}</td>
                <td>${password}</td>
                <td>${signupDate}</td>
                <td>
                    <button class="action-btn">Action</button>
                </td>
            `;

            // Append the row to the table
            tbody.appendChild(row);
        });

        // Display the update time
        displayUpdateTime();
    }
});

// Function to display the update time
function displayUpdateTime() {
    let updateTimeElement = document.getElementById("update-time");

    if (!updateTimeElement) {
        // Create the element if it doesn't exist
        updateTimeElement = document.createElement("div");
        updateTimeElement.id = "update-time";
        updateTimeElement.style.color = "black";
        updateTimeElement.style.marginTop = "10px";
        updateTimeElement.style.fontWeight = "bold";
        updateTimeElement.style.fontSize = "16px";
        document.body.appendChild(updateTimeElement);
    }

    // Update the time
    const now = new Date();
    updateTimeElement.textContent = `Last updated: ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}`;
}
