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

// Function to fetch and display FinanceRequests data
async function fetchFinanceRequests() {
    const financeRequestsRef = ref(db, 'FinanceRequests');
    const usersRef = ref(db, 'Users');
    const tableBody = document.querySelector('#financeRequestsTable tbody');
    tableBody.innerHTML = '<tr><td colspan="8">Loading data...</td></tr>';

    try {
        const [financeRequestsSnapshot, usersSnapshot] = await Promise.all([get(financeRequestsRef), get(usersRef)]);
        const financeRequestsData = financeRequestsSnapshot.val();
        const usersData = usersSnapshot.val();

        tableBody.innerHTML = ''; // Clear existing rows

        if (financeRequestsData) {
            Object.keys(financeRequestsData).forEach((key) => {
                const entry = financeRequestsData[key];
                const inventoryManagerEmail = entry.inventoryManager;
                const supplierEmail = entry.supplier;

                // Fetch usernames from Users node
                const inventoryManagerUser = usersData[inventoryManagerEmail.replace('.', '_')];
                const supplierUser = usersData[supplierEmail.replace('.', '_')];

                const inventoryManagerUsername = inventoryManagerUser ? inventoryManagerUser.username : 'Unknown';
                const supplierUsername = supplierUser ? supplierUser.username : 'Unknown';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.requestId}</td>
                    <td>${entry.itemName}</td>
                    <td>${entry.category}</td>
                    <td>${entry.requestCount}</td>
                    <td>${entry.totalAmount}</td>
                    <td>${inventoryManagerUsername} (${inventoryManagerEmail})</td>
                    <td>${supplierUsername} (${supplierEmail})</td>
                    <td>${entry.status}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="8">No data available</td></tr>';
        }
    } catch (error) {
        console.error("Error fetching FinanceRequests data:", error);
        tableBody.innerHTML = '<tr><td colspan="8">Failed to load data</td></tr>';
    }
}

// Function to download table data as CSV
function downloadCSV() {
    let table = document.getElementById("financeRequestsTable");
    let rows = Array.from(table.rows);
    let csvContent = rows.map(row => 
        Array.from(row.cells).map(cell => `"${cell.innerText}"`).join(",")
    ).join("\n");

    let blob = new Blob([csvContent], { type: "text/csv" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "finance_requests.csv";
    link.click();
}

// Function to download table data as PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Finance Requests Report', 10, 10);

    // Add table headers
    const headers = [
        'Request ID', 'Item Name', 'Category', 'Request Count', 'Total Amount',
        'Inventory Manager', 'Supplier', 'Status'
    ];
    const data = [];
    const rows = document.querySelectorAll('#financeRequestsTable tbody tr');
    rows.forEach(row => {
        const rowData = Array.from(row.cells).map(cell => cell.innerText);
        data.push(rowData);
    });

    // Use autoTable plugin to generate the table
    doc.autoTable({
        head: [headers],
        body: data,
        startY: 20, // Start below the title
        theme: 'grid', // Use grid theme for better readability
        styles: { fontSize: 8 }, // Adjust font size
        headStyles: { fillColor: [76, 175, 80] } // Green header background
    });

    // Save the PDF
    doc.save('finance_requests.pdf');
}

// Event listeners for download buttons
document.getElementById("download-csv-btn").addEventListener("click", downloadCSV);
document.getElementById("download-pdf-btn").addEventListener("click", downloadPDF);

// Initial load
fetchFinanceRequests();