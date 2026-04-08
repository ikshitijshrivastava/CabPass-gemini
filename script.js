// --- DATABASE ---
let drivers = JSON.parse(localStorage.getItem('cp_drivers')) || [];
let customers = JSON.parse(localStorage.getItem('cp_customers')) || [];
let jobs = JSON.parse(localStorage.getItem('cp_jobs')) || [];

// --- UI HELPERS ---
function showTab(tab) {
    ['jobs', 'drivers', 'customers'].forEach(t => {
        document.getElementById(`section-${t}`).classList.add('hidden');
        document.getElementById(`tab-${t}`).className = "flex-1 p-3 text-gray-600";
    });
    document.getElementById(`section-${tab}`).classList.remove('hidden');
    document.getElementById(`tab-${tab}`).className = "flex-1 p-3 text-blue-600 font-bold border-b-2 border-blue-600";
    
    if (tab === 'jobs') renderJobs();
    if (tab === 'drivers') renderDrivers();
    if (tab === 'customers') renderCustomers();
}

function toggleModal(id) {
    const modal = document.getElementById(id);
    modal.classList.toggle('hidden');
}

// --- JOB LOGIC ---
function handleSaveJob() {
    const pickup = document.getElementById('j-pickup').value;
    const drop = document.getElementById('j-drop').value;
    const tariff = document.getElementById('j-tariff').value;
    const time = document.getElementById('j-time').value;

    if (!pickup || !drop || !tariff) return alert("Fill all job details!");

    const newJob = { id: Date.now(), pickup, drop, tariff, time, status: 'Open' };
    jobs.push(newJob);
    localStorage.setItem('cp_jobs', JSON.stringify(jobs));
    
    // Auto-share to WA
    const text = `🚖 *NEW JOB*%0A📍 *From:* ${pickup}%0A🏁 *To:* ${drop}%0A💰 *Tariff:* ₹${tariff}%0A⏰ *Time:* ${time}`;
    window.open(`https://wa.me/?text=${text}`, '_blank');

    toggleModal('job-modal');
    renderJobs();
}

function renderJobs() {
    const list = document.getElementById('job-list');
    list.innerHTML = jobs.length ? '' : '<p class="text-center text-gray-400 mt-10">No active jobs.</p>';
    jobs.forEach((j, index) => {
        list.innerHTML += `
            <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 ${j.status === 'Open' ? 'border-yellow-500' : 'border-green-500'}">
                <div class="flex justify-between">
                    <span class="text-xs font-bold text-gray-400">${j.time}</span>
                    <span class="text-xs px-2 py-1 rounded ${j.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">${j.status}</span>
                </div>
                <p class="font-bold mt-1">${j.pickup} → ${j.drop}</p>
                <p class="text-blue-600 font-bold">₹${j.tariff}</p>
                <div class="mt-3 flex gap-2">
                    ${j.status === 'Open' ? `<button onclick="completeJob(${index})" class="flex-1 bg-green-600 text-white py-2 rounded text-xs text-center">Complete & Bill</button>` : ''}
                    <button onclick="deleteJob(${index})" class="bg-red-50 text-red-500 px-3 py-2 rounded text-xs">Delete</button>
                </div>
            </div>`;
    });
}

function completeJob(index) {
    jobs[index].status = 'Completed';
    localStorage.setItem('cp_jobs', JSON.stringify(jobs));
    
    // Generate simple PDF Bill
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("CABPASS INVOICE", 20, 20);
    doc.text(`From: ${jobs[index].pickup}`, 20, 40);
    doc.text(`To: ${jobs[index].drop}`, 20, 50);
    doc.text(`Total Paid: ₹${jobs[index].tariff}`, 20, 70);
    doc.save(`Bill_${jobs[index].id}.pdf`);
    
    renderJobs();
}

function deleteJob(index) {
    jobs.splice(index, 1);
    localStorage.setItem('cp_jobs', JSON.stringify(jobs));
    renderJobs();
}

// --- DRIVER & CUSTOMER LOGIC (Keep existing) ---
function handleSaveDriver() {
    const name = document.getElementById('d-name').value;
    const car = document.getElementById('d-car').value;
    const reg = document.getElementById('d-reg').value;
    const color = document.getElementById('d-color').value;
    const phone = document.getElementById('d-phone').value;
    drivers.push({ name, car, reg, color, phone });
    localStorage.setItem('cp_drivers', JSON.stringify(drivers));
    toggleModal('driver-modal');
    renderDrivers();
}

function renderDrivers() {
    const list = document.getElementById('driver-list');
    list.innerHTML = '';
    drivers.forEach(d => {
        list.innerHTML += `<div class="bg-white p-3 rounded border"><p class="font-bold">${d.name}</p><p class="text-xs text-gray-500">${d.car} | ${d.reg}</p></div>`;
    });
}

function handleSaveCustomer() {
    const name = document.getElementById('c-name').value;
    const address = document.getElementById('c-address').value;
    const phone = document.getElementById('c-phone').value;
    customers.push({ name, address, phone });
    localStorage.setItem('cp_customers', JSON.stringify(customers));
    toggleModal('customer-modal');
    renderCustomers();
}

function renderCustomers() {
    const list = document.getElementById('customer-list');
    list.innerHTML = '';
    customers.forEach(c => {
        list.innerHTML += `<div class="bg-white p-3 rounded border"><p class="font-bold">${c.name}</p><p class="text-xs text-gray-500">${c.address}</p></div>`;
    });
}

// Initial Load
renderJobs();
