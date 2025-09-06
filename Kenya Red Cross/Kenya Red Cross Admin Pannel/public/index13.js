import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

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
const db = getDatabase(app);

// Function to fetch and display Donations data
async function fetchDonations() {
    const donationsRef = ref(db, 'Donations');
    const tableBody = document.querySelector('#donationsTable tbody');
    tableBody.innerHTML = '<tr><td colspan="5">Loading data...</td></tr>';

    try {
        const donationsSnapshot = await get(donationsRef);
        const donationsData = donationsSnapshot.val();

        tableBody.innerHTML = ''; // Clear existing rows

        if (donationsData) {
            Object.keys(donationsData).forEach((key) => {
                const donation = donationsData[key];
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${donation.donationId}</td>
                    <td>${donation.fullName}</td>
                    <td>${donation.amount}</td>
                    <td>${donation.donationTime}</td>
                    <td>${donation.status}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="5">No data available</td></tr>';
        }
    } catch (error) {
        console.error("Error fetching Donations data:", error);
        tableBody.innerHTML = '<tr><td colspan="5">Failed to load data</td></tr>';
    }
}

// Function to download table data as CSV
function downloadCSV() {
    let table = document.getElementById("donationsTable");
    let rows = Array.from(table.rows);
    let csvContent = rows.map(row => 
        Array.from(row.cells).map(cell => `"${cell.innerText}"`).join(",")
    ).join("\n");

    let blob = new Blob([csvContent], { type: "text/csv" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "donations_report.csv";
    link.click();
}

// Function to download table data as PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Donations Report', 10, 10);

    // Add table headers
    const headers = [
        'ID', 'Donor Name', 'Amount', 'Date/Time', 'Status'
    ];
    const data = [];
    const rows = document.querySelectorAll('#donationsTable tbody tr');
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
    doc.save('donations_report.pdf');
}

// Event listeners for download buttons
document.getElementById("download-csv-btn").addEventListener("click", downloadCSV);
document.getElementById("download-pdf-btn").addEventListener("click", downloadPDF);

// Initial load
fetchDonations();