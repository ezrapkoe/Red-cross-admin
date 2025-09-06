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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Global variables
let allSupplyRequests = [];
let filteredRequests = [];
let currentPage = 1;
const itemsPerPage = 10;
let supplyChart = null;

// DOM elements
const tableBody = document.querySelector('#supplyRequestsTable tbody');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('status-filter');
const categoryFilter = document.getElementById('category-filter');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
const totalRequestsEl = document.getElementById('total-requests');
const totalAmountEl = document.getElementById('total-amount');
const approvedRequestsEl = document.getElementById('approved-requests');

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    await fetchSupplyRequests();
    setupEventListeners();
    updateSummaryCards();
    renderChart();
});

async function fetchSupplyRequests() {
    try {
        showLoadingState();
        
        const supplyRequestsRef = ref(db, 'SuppliedGoods');
        const usersRef = ref(db, 'Users');
        
        const [supplyRequestsSnapshot, usersSnapshot] = await Promise.all([
            get(supplyRequestsRef),
            get(usersRef)
        ]);

        const supplyRequestsData = supplyRequestsSnapshot.val();
        const usersData = usersSnapshot.val();

        allSupplyRequests = [];
        
        if (supplyRequestsData) {
            // Convert object to array and process each request
            allSupplyRequests = Object.entries(supplyRequestsData).map(([key, entry]) => {
                const inventoryManagerEmail = entry.inventoryManager;
                const supplierEmail = entry.supplier;

                // Fetch usernames from Users node
                const inventoryManagerUser = usersData?.[inventoryManagerEmail.replace(/\./g, '_')];
                const supplierUser = usersData?.[supplierEmail.replace(/\./g, '_')];

                return {
                    id: key,
                    requestId: entry.requestId || 'N/A',
                    itemName: entry.itemName || 'Unknown',
                    category: entry.category || 'Uncategorized',
                    requestCount: entry.requestCount || 0,
                    totalAmount: entry.totalAmount || 0,
                    inventoryManager: inventoryManagerUser 
                        ? `${inventoryManagerUser.username} (${inventoryManagerEmail})` 
                        : inventoryManagerEmail,
                    supplier: supplierUser 
                        ? `${supplierUser.username} (${supplierEmail})` 
                        : supplierEmail,
                    status: entry.status || 'pending',
                    timestamp: entry.timestamp || 'Unknown'
                };
            });
        }
        
        filteredRequests = [...allSupplyRequests];
        renderTable();
        updateSummaryCards();
        renderChart();
    } catch (error) {
        console.error("Error fetching supply requests:", error);
        showErrorState("Failed to load data. Please try again.");
    }
}

function showLoadingState() {
    tableBody.innerHTML = '<tr><td colspan="9" class="loading">Loading data...</td></tr>';
}

function showErrorState(message) {
    tableBody.innerHTML = `<tr><td colspan="9" class="error">${message}</td></tr>`;
}

function setupEventListeners() {
    // Search and filter events
    searchInput.addEventListener('input', debounce(filterAndRenderRequests, 300));
    statusFilter.addEventListener('change', filterAndRenderRequests);
    categoryFilter.addEventListener('change', filterAndRenderRequests);
    
    // Pagination events
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });
    
    // Export events
    document.getElementById('download-csv-btn').addEventListener('click', downloadCSV);
    document.getElementById('download-pdf-btn').addEventListener('click', downloadPDF);
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function filterAndRenderRequests() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusFilterValue = statusFilter.value;
    const categoryFilterValue = categoryFilter.value;
    
    filteredRequests = allSupplyRequests.filter(request => {
        const matchesSearch = Object.values(request).some(value => 
            String(value).toLowerCase().includes(searchTerm)
        );
        
        const matchesStatus = statusFilterValue ? request.status === statusFilterValue : true;
        const matchesCategory = categoryFilterValue ? request.category === categoryFilterValue : true;
        
        return matchesSearch && matchesStatus && matchesCategory;
    });
    
    currentPage = 1;
    renderTable();
    updateSummaryCards();
    renderChart();
}

function renderTable() {
    tableBody.innerHTML = '';
    
    if (filteredRequests.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9" class="no-data">No matching requests found</td></tr>';
        updatePaginationControls();
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredRequests.length);
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);
    
    // Create table rows
    paginatedRequests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.requestId}</td>
            <td>${request.itemName}</td>
            <td>${request.category}</td>
            <td>${request.requestCount}</td>
            <td>Kshs${formatNumber(request.totalAmount)}</td>
            <td>${request.inventoryManager}</td>
            <td>${request.supplier}</td>
            <td><span class="status-badge ${request.status}">${request.status}</span></td>
            <td>${request.timestamp}</td>
        `;
        tableBody.appendChild(row);
    });
    
    updatePaginationControls();
}

function updatePaginationControls() {
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;
    
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function updateSummaryCards() {
    const totalRequests = filteredRequests.length;
    const totalAmount = filteredRequests.reduce((sum, request) => sum + (request.totalAmount || 0), 0);
    const approvedRequests = filteredRequests.filter(request => request.status === 'approved').length;
    
    totalRequestsEl.textContent = totalRequests;
    totalAmountEl.textContent = `Kshs ${formatNumber(totalAmount)}`;
    approvedRequestsEl.textContent = approvedRequests;
}

function renderChart() {
    const ctx = document.getElementById('supplyChart').getContext('2d');
    
    // Group by category and calculate totals
    const categories = {};
    filteredRequests.forEach(request => {
        if (!categories[request.category]) {
            categories[request.category] = 0;
        }
        categories[request.category] += request.totalAmount || 0;
    });
    
    // Destroy previous chart if it exists
    if (supplyChart) {
        supplyChart.destroy();
    }
    
    supplyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Total Amount by Category',
                data: Object.values(categories),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `$${formatNumber(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return `$${formatNumber(value)}`;
                        }
                    }
                }
            }
        }
    });
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function downloadCSV() {
    if (filteredRequests.length === 0) {
        alert("No data to export");
        return;
    }
    
    // CSV header
    const headers = [
        'Request ID', 'Item Name', 'Category', 'Request Count', 'Total Amount',
        'Inventory Manager', 'Supplier', 'Status', 'Timestamp'
    ];
    
    // CSV rows
    const rows = filteredRequests.map(request => [
        request.requestId,
        request.itemName,
        request.category,
        request.requestCount,
        request.totalAmount,
        request.inventoryManager,
        request.supplier,
        request.status,
        request.timestamp
    ]);
    
    // Combine header and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `supply_requests_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadPDF() {
    if (filteredRequests.length === 0) {
        alert("No data to export");
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape'
    });
    
    // Add title and date
    doc.setFontSize(18);
    doc.text('Supply Requests Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
    
    // Prepare data
    const headers = [
        'Request ID', 'Item Name', 'Category', 'Count', 'Amount',
        'Inventory Manager', 'Supplier', 'Status', 'Timestamp'
    ];
    
    const data = filteredRequests.map(request => [
        request.requestId,
        request.itemName,
        request.category,
        request.requestCount,
        `$${formatNumber(request.totalAmount)}`,
        request.inventoryManager.split(' (')[0],
        request.supplier.split(' (')[0],
        request.status,
        request.timestamp
    ]);
    
    // Generate table
    doc.autoTable({
        head: [headers],
        body: data,
        startY: 30,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [220, 53, 69] },
        columnStyles: {
            4: { cellWidth: 'auto', halign: 'right' },
            3: { halign: 'right' }
        },
        margin: { left: 10, right: 10 }
    });
    
    // Add summary
    const totalAmount = filteredRequests.reduce((sum, request) => sum + (request.totalAmount || 0), 0);
    doc.setFontSize(10);
    doc.text(`Total Requests: ${filteredRequests.length}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Amount: $${formatNumber(totalAmount)}`, 14, doc.lastAutoTable.finalY + 15);
    
    // Save the PDF
    doc.save(`supply_requests_${new Date().toISOString().slice(0, 10)}.pdf`);
}