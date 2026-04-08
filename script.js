// --- DATABASE ---
let drivers = JSON.parse(localStorage.getItem('cp_drivers')) || [];
let customers = JSON.parse(localStorage.getItem('cp_customers')) || [];
let jobs = JSON.parse(localStorage.getItem('cp_jobs')) || [];

// --- UI TAB SWITCHING ---
function showTab(tab) {
    // Hide all sections
    ['jobs', 'drivers', 'customers'].forEach(t => {
        document.getElementById(`section-${t}`).classList.add('hidden');
        document.getElementById(`tab-${t}`).classList.remove('text-blue-600', 'font-bold', 'border-b-2', 'border-blue-600');
        document.getElementById(`tab-${t}`).classList.add('text-gray-600');
    });

    // Show selected section
    document.getElementById(`section-${tab}`).classList.remove('hidden');
    document.getElementById(`tab-${tab}`).classList.add('text-blue-600', 'font-bold', 'border-b-2', 'border-blue-600');
    
    if (tab === 'drivers') renderDrivers();
    if (tab === 'customers') renderCustomers();
}

function toggleModal(id) {
    const modal = document.getElementById(id);
    modal.classList.toggle('hidden');
}

// --- DRIVER LOGIC ---
function handleSaveDriver() {
    const name = document.getElementById('d-name').value;
    const car = document.getElementById('d-car').value;
    const reg = document.getElementById('d-reg').value;
    const color = document.getElementById('d-color').value;
    const phone = document.getElementById('d-phone').value;

    if (!name || !phone) return alert("Name and Phone are required!");

    drivers.push({ name, car, reg, color, phone });
    localStorage.setItem('cp_drivers', JSON.stringify(drivers));
    toggleModal('driver-modal');
    renderDrivers();
}

function renderDrivers() {
    const list = document.getElementById('driver-list');
    list.innerHTML = drivers.length ? '' : '<p class="text-gray-500 text-center">No drivers added yet.</p>';
    drivers.forEach((d, index) => {
        list.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow-sm border">
                <p class="font-bold">${d.name}</p>
                <p class="text-sm text-gray-600">${d.color} ${d.car} (${d.reg})</p>
                <div class="mt-3 flex gap-2">
                    <button onclick="shareDriver('${index}')" class="bg-green-500 text-white px-3 py-1 rounded text-xs">Share to WA</button>
                    <button onclick="deleteItem('drivers', ${index})" class="bg-red-100 text-red-600 px-3 py-1 rounded text-xs">Delete</button>
                </div>
            </div>`;
    });
}

function shareDriver(index) {
    const d = drivers[index];
    const text = `🚖 *Driver Details*%0A*Name:* ${d.name}%0A*Car:* ${d.color} ${d.car}%0A*Reg No:* ${d.reg}%0A*Contact:* ${d.phone}`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

// --- CUSTOMER LOGIC ---
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
    list.innerHTML = customers.length ? '' : '<p class="text-gray-500 text-center">No customers added yet.</p>';
    customers.forEach((c, index) => {
        list.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow-sm border">
                <p class="font-bold">${c.name}</p>
                <p class="text-sm text-gray-600">${c.address}</p>
                <p class="text-sm text-blue-600">${c.phone}</p>
            </div>`;
    });
}

function deleteItem(type, index) {
    if (type === 'drivers') {
        drivers.splice(index, 1);
        localStorage.setItem('cp_drivers', JSON.stringify(drivers));
        renderDrivers();
    }
}

// Load initial data
renderDrivers();
renderCustomers();
