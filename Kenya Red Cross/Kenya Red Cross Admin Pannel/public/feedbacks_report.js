import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

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

let allFeedbacks = [];

async function fetchFeedbacks() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const tableBody = document.getElementById('feedbacksTable');
    
    loadingIndicator.style.display = 'block';
    tableBody.innerHTML = '<tr><td colspan="5" class="loading">Loading data...</td></tr>';

    try {
        const snapshot = await get(ref(db, 'Feedbacks'));
        const feedbacksData = snapshot.val();
        tableBody.innerHTML = '';

        if (!feedbacksData) {
            tableBody.innerHTML = '<tr><td colspan="5" class="no-data">No feedback records found</td></tr>';
            return;
        }

        // Process all feedbacks from the nested structure
        allFeedbacks = [];
        for (const [conversationKey, conversation] of Object.entries(feedbacksData)) {
            for (const [feedbackKey, feedback] of Object.entries(conversation)) {
                allFeedbacks.push({
                    id: feedbackKey,
                    conversationId: conversationKey,
                    feedbackId: feedback.feedbackId,
                    senderEmail: feedback.senderEmail,
                    receiverEmail: feedback.receiverEmail,
                    message: feedback.message,
                    timestamp: feedback.timestamp,
                    formattedDate: formatDate(feedback.timestamp)
                });
            }
        }

        // Sort by timestamp (newest first)
        allFeedbacks.sort((a, b) => b.timestamp - a.timestamp);

        renderFeedbacks(allFeedbacks);

    } catch (error) {
        console.error("Error loading feedback data:", error);
        tableBody.innerHTML = '<tr><td colspan="5" class="error">Failed to load feedback data. Please try again.</td></tr>';
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function formatDate(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function renderFeedbacks(feedbacks) {
    const tableBody = document.getElementById('feedbacksTable');
    tableBody.innerHTML = '';

    if (feedbacks.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="no-data">No feedbacks match your search criteria</td></tr>';
        return;
    }

    feedbacks.forEach(feedback => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${feedback.feedbackId || 'N/A'}</td>
            <td>${feedback.senderEmail || 'Unknown'}</td>
            <td>${feedback.receiverEmail || 'Unknown'}</td>
            <td class="message-cell" title="${feedback.message || ''}">${feedback.message || 'No message'}</td>
            <td class="timestamp">${feedback.formattedDate}</td>
        `;
        tableBody.appendChild(row);
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const term = this.value.toLowerCase().trim();
        
        if (!term) {
            renderFeedbacks(allFeedbacks);
            return;
        }
        
        const filtered = allFeedbacks.filter(feedback => 
            (feedback.feedbackId && feedback.feedbackId.toLowerCase().includes(term)) ||
            (feedback.senderEmail && feedback.senderEmail.toLowerCase().includes(term)) ||
            (feedback.receiverEmail && feedback.receiverEmail.toLowerCase().includes(term)) ||
            (feedback.message && feedback.message.toLowerCase().includes(term))
        );
        
        renderFeedbacks(filtered);
    });
}

function downloadCSV() {
    if (allFeedbacks.length === 0) {
        alert("No feedback data to export");
        return;
    }

    const headers = ['Feedback ID', 'Sender', 'Receiver', 'Message', 'Date & Time'];
    const rows = allFeedbacks.map(feedback => [
        feedback.feedbackId || '',
        feedback.senderEmail || '',
        feedback.receiverEmail || '',
        feedback.message || '',
        feedback.formattedDate || ''
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `feedbacks_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadPDF() {
    if (allFeedbacks.length === 0) {
        alert("No feedback data to export");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title and date
    doc.setFontSize(18);
    doc.text('Feedbacks Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
    
    // Prepare table data
    const headers = ['Feedback ID', 'Sender', 'Receiver', 'Message', 'Date & Time'];
    const data = allFeedbacks.map(feedback => [
        feedback.feedbackId || 'N/A',
        feedback.senderEmail || 'Unknown',
        feedback.receiverEmail || 'Unknown',
        feedback.message || 'No message',
        feedback.formattedDate || 'Unknown'
    ]);
    
    // Generate table
    doc.autoTable({
        head: [headers],
        body: data,
        startY: 30,
        theme: 'grid',
        styles: { 
            fontSize: 8,
            cellPadding: 3,
            overflow: 'linebreak'
        },
        columnStyles: {
            3: { cellWidth: 'auto' } // Message column
        },
        headStyles: { 
            fillColor: [211, 47, 47], // Red color
            textColor: 255
        },
        margin: { left: 10, right: 10 }
    });
    
    // Save the PDF
    doc.save(`feedbacks_report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchFeedbacks();
    setupSearch();
    
    document.getElementById('download-csv-btn').addEventListener('click', downloadCSV);
    document.getElementById('download-pdf-btn').addEventListener('click', downloadPDF);
});