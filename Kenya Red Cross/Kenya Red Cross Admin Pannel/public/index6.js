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
const db = getDatabase(app);

// Function to fetch and display reports data
async function fetchReports(reportType) {
    const reportsRef = ref(db, reportType);
    const usersRef = ref(db, 'Users');
    const tableBody = document.getElementById('reportsTable');
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Loading data...</td></tr>';

    try {
        const [reportsSnapshot, usersSnapshot] = await Promise.all([get(reportsRef), get(usersRef)]);
        const reportsData = reportsSnapshot.val();
        const usersData = usersSnapshot.val();

        tableBody.innerHTML = ''; // Clear existing rows

        if (reportsData) {
            let entries = [];

            if (reportType === "CoursePayments") {
                // Flatten the nested structure of CoursePayments
                Object.keys(reportsData).forEach((userKey) => {
                    const userPayments = reportsData[userKey];
                    Object.keys(userPayments).forEach((courseId) => {
                        entries.push({ ...userPayments[courseId], userEmail: userKey.replace('_', '.') });
                    });
                });
            } else {
                // For DonationReports and FinanceReports, use the existing structure
                entries = Object.keys(reportsData).map((key) => ({
                    ...reportsData[key],
                    userEmail: reportsData[key].email || reportsData[key].userEmail || reportsData[key].inventoryManager
                }));
            }

            // Display entries in the table
            entries.forEach((entry) => {
                const userEmail = entry.userEmail;
                const user = usersData[userEmail.replace('.', '_')];
                const username = user ? user.username : 'Unknown';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.donationId || entry.courseId || entry.itemName}</td>
                    <td>${entry.itemName || entry.paymentDetails || entry.fullName}</td>
                    <td>${entry.amount}</td>
                    <td>${entry.donationTime || entry.date || entry.dateTime}</td>
                    <td>${username} (${userEmail})</td>
                    <td><span class="badge ${entry.status === 'approved' ? 'bg-success' : 'bg-warning'}">${entry.status}</span></td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No data available</td></tr>';
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Failed to load data</td></tr>';
    }
}

// Function to download table data as CSV
function downloadTable() {
    let table = document.getElementById("reportsTable");
    let rows = Array.from(table.rows);
    let csvContent = rows.map(row => 
        Array.from(row.cells).map(cell => `"${cell.innerText}"`).join(",")
    ).join("\n");

    let blob = new Blob([csvContent], { type: "text/csv" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "financial_reports.csv";
    link.click();
}

// Event listeners
document.getElementById("report-type").addEventListener("change", (e) => {
    fetchReports(e.target.value);
});

document.getElementById("download-btn").addEventListener("click", downloadTable);

// Initial load
fetchReports("DonationReports");