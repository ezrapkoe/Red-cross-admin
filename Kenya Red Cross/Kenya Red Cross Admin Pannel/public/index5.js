// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, onValue, update, set, query, equalTo, orderByChild } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

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
const auth = getAuth(); 

// Reference to the 'Users' node in Firebase Realtime Database
const usersRef = ref(database, 'Users');

// Redirect to login page if not logged in
function redirectToLogin() {
    window.location.href = 'login.html';
}

// Check user authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadData(); 
    } else {
        redirectToLogin();
    }
});

// Format timestamp to a readable date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB');
}

// Hash the password before storing it in Firebase
function hashPassword(password) {
    return bcrypt.hashSync(password, 10); // Synchronous hash with salt rounds
}

// Encrypt and store a new user
function storeUser(user) {
    const hashedPassword = hashPassword(user.password); // Hash password
    const userRef = ref(database, `Users/${user.id}`);
    
    set(userRef, {
        ...user,
        password: hashedPassword // Store the hashed password
    }).then(() => {
        console.log(`User ${user.email} stored successfully.`);
    }).catch((error) => {
        console.error('Error storing user:', error);
    });
}

// Update user status by email
function updateUserStatusByEmail(email, newStatus) {
    const userQuery = query(usersRef, orderByChild('email'), equalTo(email));

    onValue(userQuery, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
            const userKey = Object.keys(userData)[0];
            const userRef = ref(database, `Users/${userKey}`);
            update(userRef, {
                status: newStatus
            }).then(() => {
                console.log(`User with email ${email} status updated to ${newStatus}`);
                loadData();
            }).catch((error) => {
                console.error('Error updating status:', error);
            });
        } else {
            console.error(`No user found with email: ${email}`);
        }
    }, { onlyOnce: true });
}

// Display users data in the table
function displayUsersData(usersData) {
    const tbody = document.querySelector('tbody'); 
    tbody.innerHTML = ''; 

    usersData.forEach((user) => {
        const signUpDate = formatDate(user.signupTime);

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>******</td> <!-- Display masked password -->
            <td>${signUpDate}</td>
            <td>
                <button class="activate">Activate</button>
            </td>
        `;

        tbody.appendChild(row);

        const activateButton = row.querySelector('.activate');
        activateButton.addEventListener('click', () => {
            updateUserStatusByEmail(user.email, 'approved');
        });
    });
}

// Load and display users data from Firebase
function loadData() {
    onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        const filteredUsers = Object.keys(data)
            .map(key => data[key])
            .filter(user => (user.status === 'suspended' || user.status === 'deactivated') && 
                (user.role === 'Service Manager' || user.role === 'Trainer' || 
                 user.role === 'Finance Manager' || user.role === 'Coordinator' || 
                 user.role === 'Inventory Manager' || user.role === 'Supplier'));

        displayUsersData(filteredUsers);
    }, { onlyOnce: false });
}
