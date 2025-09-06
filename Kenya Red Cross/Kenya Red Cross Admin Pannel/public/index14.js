import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

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

async function fetchClassAttendance() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const tableBody = document.querySelector('#attendanceTable');
    
    loadingIndicator.style.display = 'block';
    tableBody.innerHTML = '<tr><td colspan="7">Loading data...</td></tr>';

    try {
        const snapshot = await get(ref(db, 'ClassAttendance'));
        const attendanceData = snapshot.val();
        tableBody.innerHTML = '';

        if (!attendanceData) {
            tableBody.innerHTML = '<tr><td colspan="7">No attendance records found</td></tr>';
            return;
        }

        Object.entries(attendanceData).forEach(([sessionId, session]) => {
            const studentsCount = session.students ? Object.keys(session.students).length : 0;
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${sessionId}</td>
                <td>${session.courseTitle} (${session.courseId})</td>
                <td>${session.trainerName} (${session.trainerEmail})</td>
                <td>${session.activationTime}</td>
                <td>${session.expirationTime}</td>
                <td>${studentsCount}</td>
                <td>${session.active ? 'Active' : 'Inactive'}</td>
            `;
            
            row.addEventListener('click', () => showStudentDetails(session));
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading data:", error);
        tableBody.innerHTML = '<tr><td colspan="7">Failed to load data</td></tr>';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function showStudentDetails(session) {
    const modal = document.getElementById('studentDetailsModal');
    const content = document.getElementById('studentDetailsContent');
    const title = document.getElementById('studentDetailsTitle');
    
    title.textContent = `Students for ${session.courseTitle} (${session.activationTime})`;
    content.innerHTML = session.students 
        ? createStudentTable(session.students) 
        : '<p>No students attended this session.</p>';
    
    modal.style.display = 'block';
    document.querySelector('.close').onclick = () => modal.style.display = 'none';
}

function createStudentTable(students) {
    let html = '<table class="student-table"><tr><th>Name</th><th>Email</th><th>Sign Time</th></tr>';
    Object.values(students).forEach(student => {
        html += `<tr>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.signTime}</td>
        </tr>`;
    });
    return html + '</table>';
}

function downloadCSV() {
    const rows = Array.from(document.querySelectorAll('#attendanceTable tr'));
    const csv = rows.map(row => 
        Array.from(row.cells).map(cell => `"${cell.textContent}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'class_attendance.csv';
    link.click();
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.text('Class Attendance Report', 10, 10);
    
    const headers = [
        'Session ID', 'Course', 'Trainer', 'Activation Time', 
        'Expiration Time', 'Students', 'Status'
    ];
    
    const data = Array.from(document.querySelectorAll('#attendanceTable tr')).map(row => 
        Array.from(row.cells).map(cell => cell.textContent)
    );
    
    doc.autoTable({
        head: [headers],
        body: data,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [255, 0, 0] }
    });
    
    doc.save('class_attendance.pdf');
}

document.getElementById('searchInput').addEventListener('input', function() {
    const term = this.value.toLowerCase();
    document.querySelectorAll('#attendanceTable tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
});

document.getElementById('download-csv-btn').addEventListener('click', downloadCSV);
document.getElementById('download-pdf-btn').addEventListener('click', downloadPDF);

document.addEventListener('DOMContentLoaded', fetchClassAttendance);