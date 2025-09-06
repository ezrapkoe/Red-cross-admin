import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Store reports globally for search functionality
let allReports = [];

document.addEventListener('DOMContentLoaded', () => {
    // Add search input to the header
    const header = document.querySelector('.content h1');
    header.insertAdjacentHTML('afterend', `
        <div class="search-container" style="margin: 20px 0;">
            <input type="text" id="searchInput" placeholder="Search payments..." style="padding: 8px; width: 300px;">
            <div class="download-buttons" style="display: inline-block; margin-left: 20px;">
                <button id="downloadCsvBtn">Download CSV</button>
                <button id="downloadPdfBtn">Download PDF</button>
            </div>
        </div>
    `);

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const [usersSnapshot, paymentsSnapshot] = await Promise.all([
                    get(ref(db, 'Users')),
                    get(ref(db, 'CoursePayments'))
                ]);

                const users = usersSnapshot.val();
                const payments = paymentsSnapshot.val();
                allReports = []; // Reset global reports

                // Process all payments
                for (const userKey in payments) {
                    const userPayments = payments[userKey];
                    for (const paymentId in userPayments) {
                        const payment = userPayments[paymentId];
                        const userEmailKey = payment.userEmail.replace(/\./g, '_');
                        const username = users[userEmailKey]?.username || 'N/A';

                        allReports.push({
                            username,
                            userEmail: payment.userEmail,
                            courseId: payment.courseId,
                            amount: payment.amount,
                            date: payment.date,
                            time: payment.time,
                            paymentMethod: payment.paymentMethod,
                            paymentDetails: payment.paymentDetails,
                            status: payment.status,
                            transactionCode: payment.transactionCode || 'N/A'
                        });
                    }
                }

                populateTable(allReports);
                setupDownloadButtons(allReports);
                setupSearch();
            } catch (error) {
                console.error('Error loading data:', error);
            }
        } else {
            window.location.href = 'login.html';
        }
    });
});

function populateTable(reports) {
    const tbody = document.querySelector('#reportsTable tbody');
    tbody.innerHTML = '';

    reports.forEach(report => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${report.username}</td>
            <td>${report.userEmail}</td>
            <td>${report.courseId}</td>
            <td>KES ${report.amount.toLocaleString()}</td>
            <td>${report.date}</td>
            <td>${report.time}</td>
            <td>${report.paymentMethod}</td>
            <td>${report.paymentDetails}</td>
            <td>${report.status}</td>
            <td>${report.transactionCode}</td>
        `;
        tbody.appendChild(row);
    });
}

function setupDownloadButtons(reports) {
    document.getElementById('downloadCsvBtn').addEventListener('click', () => {
        const csvContent = convertToCSV(reports);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'course_payments_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    document.getElementById('downloadPdfBtn').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Course Payments Report', 10, 10);

        const headers = [
            'Username', 'User Email', 'Course ID', 'Amount', 'Date',
            'Time', 'Payment Method', 'Payment Details', 'Status', 'Transaction Code'
        ];
        const data = reports.map(report => [
            report.username,
            report.userEmail,
            report.courseId,
            `KES ${report.amount.toLocaleString()}`,
            report.date,
            report.time,
            report.paymentMethod,
            report.paymentDetails,
            report.status,
            report.transactionCode
        ]);

        doc.autoTable({
            head: [headers],
            body: data,
            startY: 20,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [76, 175, 80] }
        });

        doc.save('course_payments_report.pdf');
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredReports = allReports.filter(report => 
            Object.values(report).some(value => 
                String(value).toLowerCase().includes(searchTerm)
        ));
        populateTable(filteredReports);
    });
}

function convertToCSV(reports) {
    const headers = [
        'Username', 'User Email', 'Course ID', 'Amount', 'Date',
        'Time', 'Payment Method', 'Payment Details', 'Status', 'Transaction Code'
    ];
    
    const rows = reports.map(report => [
        report.username,
        report.userEmail,
        report.courseId,
        report.amount,
        report.date,
        report.time,
        report.paymentMethod,
        report.paymentDetails,
        report.status,
        report.transactionCode
    ]);

    return [headers, ...rows]
        .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');
}