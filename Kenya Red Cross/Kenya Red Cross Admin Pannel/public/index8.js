import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

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

// DOM elements
const reportCategory = document.getElementById('reportCategory');
const searchInput = document.getElementById('searchInput');
const reportTableHead = document.getElementById('reportTableHead');
const reportTableBody = document.getElementById('reportTableBody');
const downloadBtn = document.getElementById('download-btn');

// Fetch data from Firebase
async function fetchData(category) {
    const dataRef = ref(database, category);
    const snapshot = await get(dataRef);
    return snapshot.val();
}

// Fetch username from Users node
async function fetchUsername(email) {
    const userRef = ref(database, `Users/${email.replace('.', '_')}`);
    const snapshot = await get(userRef);
    return snapshot.val()?.username || 'N/A';
}

// Generate table columns based on the selected category
function generateTableColumns(category) {
    const columns = {
        AssignedCourses: ['Course ID', 'Course Title', 'Course Description', 'Course Duration', 'Trainer Name', 'Trainer Email', 'Certification Status'],
        Enrollments: ['Course ID', 'Title', 'Description', 'Duration', 'Email', 'Username', 'Status', 'Certification Status'],
        Feedbacks: ['Feedback ID', 'Message', 'Sender Email', 'Receiver Email', 'Timestamp'],
        ItemRequests: ['Item Name', 'Quantity', 'Status', 'Trainer Email'],
        PaidRequests: ['Amount', 'Category', 'DateTime', 'Inventory Manager', 'Item Name', 'Request Count', 'Status', 'Supplier'],
        SupplyRequest: ['Category', 'Inventory Manager', 'Item Name', 'Request Count', 'Request ID', 'Status', 'Supplier', 'Timestamp', 'Total Amount'],
        groups: ['Group ID', 'Group Name', 'Members'],
        tasks: ['Task ID', 'Description', 'Start Date', 'End Date', 'Group ID']
    };

    reportTableHead.innerHTML = ''; // Clear existing columns
    const headerRow = document.createElement('tr');

    columns[category].forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });

    reportTableHead.appendChild(headerRow);
}

// Display data in the table
async function displayData(category) {
    const data = await fetchData(category);
    reportTableBody.innerHTML = ''; // Clear existing data

    if (!data) {
        reportTableBody.innerHTML = '<tr><td colspan="10">No data found.</td></tr>';
        return;
    }

    switch (category) {
        case 'Enrollments':
            for (const [userEmail, courses] of Object.entries(data)) {
                for (const [courseId, courseDetails] of Object.entries(courses)) {
                    const row = document.createElement('tr');
                    const username = await fetchUsername(courseDetails.email);
                    row.innerHTML = `
                        <td>${courseId}</td>
                        <td>${courseDetails.title || 'N/A'}</td>
                        <td>${courseDetails.description || 'N/A'}</td>
                        <td>${courseDetails.duration || 'N/A'}</td>
                        <td>${courseDetails.email || 'N/A'}</td>
                        <td>${username}</td>
                        <td>${courseDetails.status || 'N/A'}</td>
                        <td>${courseDetails.certificationStatus || 'N/A'}</td>
                    `;
                    reportTableBody.appendChild(row);
                }
            }
            break;

        case 'AssignedCourses':
            for (const [key, value] of Object.entries(data)) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${key}</td>
                    <td>${value.courseTitle || 'N/A'}</td>
                    <td>${value.courseDescription || 'N/A'}</td>
                    <td>${value.courseDuration || 'N/A'}</td>
                    <td>${value.trainerName || 'N/A'}</td>
                    <td>${value.trainerEmail || 'N/A'}</td>
                    <td>${value.certificationStatus || 'N/A'}</td>
                `;
                reportTableBody.appendChild(row);
            }
            break;

        case 'Feedbacks':
            for (const [feedbackKey, feedbacks] of Object.entries(data)) {
                for (const [feedbackId, feedbackDetails] of Object.entries(feedbacks)) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${feedbackId}</td>
                        <td>${feedbackDetails.message || 'N/A'}</td>
                        <td>${feedbackDetails.senderEmail || 'N/A'}</td>
                        <td>${feedbackDetails.receiverEmail || 'N/A'}</td>
                        <td>${new Date(feedbackDetails.timestamp).toLocaleString() || 'N/A'}</td>
                    `;
                    reportTableBody.appendChild(row);
                }
            }
            break;

        case 'ItemRequests':
            for (const [key, value] of Object.entries(data)) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${value.itemName || 'N/A'}</td>
                    <td>${value.quantity || 'N/A'}</td>
                    <td>${value.status || 'N/A'}</td>
                    <td>${value.trainerEmail || 'N/A'}</td>
                `;
                reportTableBody.appendChild(row);
            }
            break;

        case 'PaidRequests':
            for (const [key, value] of Object.entries(data)) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${value.amount || 'N/A'}</td>
                    <td>${value.category || 'N/A'}</td>
                    <td>${value.dateTime || 'N/A'}</td>
                    <td>${value.inventoryManager || 'N/A'}</td>
                    <td>${value.itemName || 'N/A'}</td>
                    <td>${value.requestCount || 'N/A'}</td>
                    <td>${value.status || 'N/A'}</td>
                    <td>${value.supplier || 'N/A'}</td>
                `;
                reportTableBody.appendChild(row);
            }
            break;

        case 'SupplyRequest':
            for (const [key, value] of Object.entries(data)) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${value.category || 'N/A'}</td>
                    <td>${value.inventoryManager || 'N/A'}</td>
                    <td>${value.itemName || 'N/A'}</td>
                    <td>${value.requestCount || 'N/A'}</td>
                    <td>${value.requestId || 'N/A'}</td>
                    <td>${value.status || 'N/A'}</td>
                    <td>${value.supplier || 'N/A'}</td>
                    <td>${value.timestamp || 'N/A'}</td>
                    <td>${value.totalAmount || 'N/A'}</td>
                `;
                reportTableBody.appendChild(row);
            }
            break;

        case 'groups':
            for (const [key, value] of Object.entries(data)) {
                const members = Object.values(value)
                    .filter(member => typeof member === 'object')
                    .map(member => member.username)
                    .join(', ');
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${key}</td>
                    <td>${value.groupName || 'N/A'}</td>
                    <td>${members}</td>
                `;
                reportTableBody.appendChild(row);
            }
            break;

        case 'tasks':
            for (const [key, value] of Object.entries(data)) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${key}</td>
                    <td>${value.description || 'N/A'}</td>
                    <td>${value.startDate || 'N/A'}</td>
                    <td>${value.endDate || 'N/A'}</td>
                    <td>${value.groupId || 'N/A'}</td>
                `;
                reportTableBody.appendChild(row);
            }
            break;

        default:
            reportTableBody.innerHTML = '<tr><td colspan="10">Invalid category.</td></tr>';
    }
}

// Search functionality
function filterTable() {
    const filter = searchInput.value.toLowerCase();
    const rows = reportTableBody.getElementsByTagName('tr');

    for (const row of rows) {
        const cells = row.getElementsByTagName('td');
        let match = false;

        for (const cell of cells) {
            if (cell.textContent.toLowerCase().includes(filter)) {
                match = true;
                break;
            }
        }

        row.style.display = match ? '' : 'none';
    }
}

// Download table data as CSV
function downloadTable() {
    let table = document.getElementById("reportTableBody");
    let rows = Array.from(table.rows);
    let csvContent = rows.map(row => 
        Array.from(row.cells).map(cell => `"${cell.innerText}"`).join(",")
    ).join("\n");

    let blob = new Blob([csvContent], { type: "text/csv" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "service_reports.csv";
    link.click();
}

// Event listeners
reportCategory.addEventListener('change', () => {
    generateTableColumns(reportCategory.value);
    displayData(reportCategory.value);
});

searchInput.addEventListener('input', filterTable);
downloadBtn.addEventListener('click', downloadTable);

// Initial load
generateTableColumns(reportCategory.value);
displayData(reportCategory.value);