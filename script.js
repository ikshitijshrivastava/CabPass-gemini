// --- DATABASE INITIALIZATION ---
let jobs = JSON.parse(localStorage.getItem('cp_jobs')) || [];
let drivers = JSON.parse(localStorage.getItem('cp_drivers')) || [];
let customers = JSON.parse(localStorage.getItem('cp_customers')) || [];

// --- TABS & MODALS ---
function showTab(tabName) {
    // Hide all
    ['jobs', 'drivers', 'customers'].forEach(name => {
        document.getElementById(`section-${name}`).classList.add('hidden');
        document.getElementById(`tab-${name}`).className = "flex-1 p-4 text-gray-500";
    });
    // Show active
    document.getElementById(`section-${tabName}`).classList.remove('hidden');
    document.getElementById(`tab-${tabName}`).className = "flex-1 p-4 text-blue-600 font-bold border-b-2 border-blue-600";
    
    if (tabName === 'jobs') renderJobs();
    if (tabName === 'drivers') renderDrivers();
    if (tabName === 'customers') renderCustomers();
}

function toggleModal(id) {
    const el = document.getElementById(id);
    el.classList.toggle('hidden');
}

// --- JOB LOGIC ---
function handleSaveJob() {
    const pickup = document.getElementById('j-pickup').value;
    const drop = document.getElementById('j-drop').value;
    const tariff = document.getElementById('j-tariff').value;
    const time = document.getElementById('j-time').value;

    if (!pickup || !drop || !tariff) {
        alert("Please enter Pickup, Drop, and Tariff!");
        return;
    }

    const newJob = {
        id: Date.now(),
        pickup,
        drop,
        tariff,
        time: time || 'Not specified',
        status: 'Open'
    };

    // 1. SAVE to tablet memory
    jobs.unshift(newJob);
    localStorage.setItem('cp_jobs', JSON.stringify(jobs));

    // 2. REFRESH UI
    renderJobs();
    toggleModal('job-modal');

    // 3. SHARE to WhatsApp
    const message = `🚖 *CABPASS NEW JOB*%0A📍 *From:* ${pickup}%0A🏁 *To:* ${drop}%0A💰 *Tariff:* ₹${tariff}%0A⏰ *Time:* ${time}%0A%0A_Please reply to accept._`;
    window.open(`https://wa.me/?text=${message}`, '_blank');
}

function renderJobs() {
    const container = document.getElementById('job-list');
    container.innerHTML = jobs.length ? '' : '<p class="text-center text-gray-400 py-10">No active jobs found.</p>';
    
    jobs.forEach((j, index) => {
        const isCompleted = j.status === 'Completed';
        container.innerHTML += `
            <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 ${isCompleted ? 'border-green-500' : 'border-yellow-500'}">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-xs text-gray-400 font-bold uppercase">${j.time}</p>
                        <p class="text-lg font-bold">${j.pickup} → ${j.drop}</p>
                        <p class="text-blue-600 font-bold">₹${j.tariff}</p>
                    </div>
                    <span class="text-[10px] px-2 py-1 rounded-full uppercase font-bold ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                        ${j.status}
                    </span>
                </div>
                <div class="mt-4 flex gap-2">
                    ${!isCompleted ? `<button onclick="finishJob(${index})" class="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold">Generate Bill</button>` : ''}
                    <button onclick="deleteItem('jobs', ${index})" class="bg-red-50 text-red-500 px-3 py-2 rounded-lg text-xs">Delete</button>
                </div>
            </div>`;
    });
}

function finishJob(index) {
    jobs[index].status = 'Completed';
    localStorage.setItem('cp_jobs', JSON.stringify(jobs));
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("CABPASS RECEIPT", 20, 20);
    doc.setFontSize(12);
    doc.text(`From: ${jobs[index].pickup}`, 20, 40);
    doc.text(`To: ${jobs[index].drop}`, 20, 50);
    doc.text(`Total Amount: ₹${jobs[index].tariff}`, 20, 70);
    doc.text("Thank you for choosing CabPass!", 20, 90);
    doc.save(`Bill_${jobs[index].id}.pdf`);
    
    renderJobs();
}

// --- DRIVER & CUSTOMER LOGIC ---
function handleSaveDriver() {
    const name = document.getElementById('d-name').value;
    const car = document.getElementById('d-car').value;
    const reg = document.getElementById('d-reg').value;
    const phone = document.getElementById('d-phone').value;
    const color = document.getElementById('d-color').value;

    if (!name || !phone) return alert("Name and Phone required");

    drivers.push({ name, car, reg, phone, color });
    localStorage.setItem('cp_drivers', JSON.stringify(drivers));
    toggleModal('driver-modal');
    renderDrivers();
}

function renderDrivers() {
    const list = document.getElementById('driver-list');
    list.innerHTML = drivers.length ? '' : '<p class="text-center text-gray-400 py-10">No drivers saved.</p>';
    drivers.forEach((d, i) => {
        list.innerHTML += `
            <div class="bg-white p-4 rounded-xl border flex justify-between items-center">
                <div>
                    <p class="font-bold">${d.name}</p>
                    <p class="text-xs text-gray-500">${d.color} ${d.car} (${d.reg})</p>
                </div>
                <button onclick="deleteItem('drivers', ${i})" class="text-red-400 text-xs underline">Delete</button>
            </div>`;
    });
}

function handleSaveCustomer() {
    const name = document.getElementById('c-name').value;
    const address = document.getElementById('c-address').value;
    const phone = document.getElementById('c-phone').value;

    if (!name) return alert("Name required");

    customers.push({ name, address, phone });
    localStorage.setItem('cp_customers', JSON.stringify(customers));
    toggleModal('customer-modal');
    renderCustomers();
}

function renderCustomers() {
    const list = document.getElementById('customer-list');
    list.innerHTML = customers.length ? '' : '<p class="text-center text-gray-400 py-10">No customers saved.</p>';
    customers.forEach((c, i) => {
        list.innerHTML += `
            <div class="bg-white p-4 rounded-xl border">
                <p class="font-bold">${c.name}</p>
                <p class="text-sm text-gray-600">${c.address}</p>
                <p class="text-xs text-blue-500">${c.phone}</p>
            </div>`;
    });
}

function deleteItem(type, index) {
    if (type === 'jobs') jobs.splice(index, 1), localStorage.setItem('cp_jobs', JSON.stringify(jobs)), renderJobs();
    if (type === 'drivers') drivers.splice(index, 1), localStorage.setItem('cp_drivers', JSON.stringify(drivers)), renderDrivers();
}

// Start-up
renderJobs();
