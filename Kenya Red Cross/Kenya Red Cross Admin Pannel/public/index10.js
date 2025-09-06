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
            <input type="text" id="searchInput" placeholder="Search enrollments..." style="padding: 8px; width: 300px;">
            <div class="download-buttons" style="display: inline-block; margin-left: 20px;">
                <button id="downloadCsvBtn">Download CSV</button>
                <button id="downloadPdfBtn">Download PDF</button>
            </div>
        </div>
    `);

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const [usersSnapshot, enrollmentsSnapshot] = await Promise.all([
                    get(ref(db, 'Users')),
                    get(ref(db, 'Enrollments'))
                ]);

                const users = usersSnapshot.val();
                const enrollments = enrollmentsSnapshot.val();
                allReports = []; // Reset global reports

                // Process all enrollments
                for (const userKey in enrollments) {
                    const userEnrollments = enrollments[userKey];
                    for (const courseId in userEnrollments) {
                        const enrollment = userEnrollments[courseId];
                        const userEmailKey = enrollment.email.replace(/\./g, '_');
                        const username = users[userEmailKey]?.username || 'N/A';

                        allReports.push({
                            username,
                            userEmail: enrollment.email,
                            courseTitle: enrollment.title,
                            description: enrollment.description,
                            duration: enrollment.duration,
                            startDate: enrollment.startDate || 'N/A',
                            endDate: enrollment.endDate || 'N/A',
                            certificationStatus: enrollment.certificationStatus,
                            status: enrollment.status
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
            <td>${report.courseTitle}</td>
            <td>${report.description}</td>
            <td>${report.duration}</td>
            <td>${report.startDate}</td>
            <td>${report.endDate}</td>
            <td>${report.certificationStatus}</td>
            <td>${report.status}</td>
        `;
        tbody.appendChild(row);
    });
}

function setupDownloadButtons(reports) {
    document.getElementById('downloadCsvBtn').addEventListener('click', () => {
        const visibleReports = getVisibleReports();
        const csvContent = convertToCSV(visibleReports);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'enrollments_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    document.getElementById('downloadPdfBtn').addEventListener('click', () => {
        const visibleReports = getVisibleReports();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('Enrollments Report', 10, 10);

        const headers = [
            'Username', 'User Email', 'Course Title', 'Description', 'Duration',
            'Start Date', 'End Date', 'Certification Status', 'Status'
        ];
        const data = visibleReports.map(report => [
            report.username,
            report.userEmail,
            report.courseTitle,
            report.description,
            report.duration,
            report.startDate,
            report.endDate,
            report.certificationStatus,
            report.status
        ]);

        doc.autoTable({
            head: [headers],
            body: data,
            startY: 20,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [76, 175, 80] }
        });

        doc.save('enrollments_report.pdf');
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredReports = allReports.filter(report => 
            Object.values(report).some(value => 
                String(value).toLowerCase().includes(searchTerm))
        );
        populateTable(filteredReports);
    });
}

function getVisibleReports() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (!searchTerm) return allReports;
    
    return allReports.filter(report => 
        Object.values(report).some(value => 
            String(value).toLowerCase().includes(searchTerm))
    );
}

function convertToCSV(reports) {
    const headers = [
        'Username', 'User Email', 'Course Title', 'Description', 'Duration',
        'Start Date', 'End Date', 'Certification Status', 'Status'
    ];
    
    const rows = reports.map(report => [
        report.username,
        report.userEmail,
        report.courseTitle,
        report.description,
        report.duration,
        report.startDate,
        report.endDate,
        report.certificationStatus,
        report.status
    ]);

    return [headers, ...rows]
        .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');
}