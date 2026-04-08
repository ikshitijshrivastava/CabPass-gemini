// --- 1. DATA STORAGE SETUP ---
// This pulls saved data from your tablet's memory or starts with empty lists
let drivers = JSON.parse(localStorage.getItem('cp_drivers')) || [];
let customers = JSON.parse(localStorage.getItem('cp_customers')) || [];
let jobs = JSON.parse(localStorage.getItem('cp_jobs')) || [];

// --- 2. DRIVER MANAGEMENT ---
function saveDriver(name, carModel, regNo, color, phone) {
    const newDriver = {
        id: Date.now(),
        name: name,
        car: `${color} ${carModel}`,
        reg: regNo,
        phone: phone
    };
    drivers.push(newDriver);
    localStorage.setItem('cp_drivers', JSON.stringify(drivers));
    alert("Driver Saved!");
}

// --- 3. CUSTOMER MANAGEMENT ---
function saveCustomer(name, address, phone) {
    const newCustomer = {
        id: Date.now(),
        name: name,
        address: address,
        phone: phone
    };
    customers.push(newCustomer);
    localStorage.setItem('cp_customers', JSON.stringify(customers));
    alert("Customer Saved!");
}

// --- 4. JOB & WHATSAPP LOGIC ---
function createJob(pickup, drop, tariff, dateTime) {
    const jobData = {
        id: Date.now(),
        pickup: pickup,
        drop: drop,
        tariff: tariff,
        time: dateTime,
        status: 'Open'
    };
    
    jobs.push(jobData);
    localStorage.setItem('cp_jobs', JSON.stringify(jobs));
    
    // Format the message for the WhatsApp Group
    const waMessage = `🚖 *NEW JOB AVAILABLE* 🚖%0A%0A` +
                      `📍 *From:* ${pickup}%0A` +
                      `🏁 *To:* ${drop}%0A` +
                      `⏰ *Time:* ${dateTime}%0A` +
                      `💰 *Tariff:* ₹${tariff}%0A%0A` +
                      `Reply 'YES' to accept.`;

    // Open WhatsApp
    window.open(`https://wa.me/?text=${waMessage}`, '_blank');
}

// --- 5. PASSING DETAILS TO ACCEPTED DRIVER ---
// Once a driver says yes, use this to send them the private customer info
function shareDetailsToDriver(driverPhone, customerName, customerPhone, location) {
    const privateDetails = `✅ *JOB ASSIGNED* ✅%0A%0A` +
                           `👤 *Cust:* ${customerName}%0A` +
                           `📞 *Call:* ${customerPhone}%0A` +
                           `📍 *Location:* ${location}`;
    
    window.open(`https://wa.me/${driverPhone}?text=${privateDetails}`, '_blank');
}

// --- 6. BILLING & PAYMENTS ---
function markAsPaid(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
        job.status = 'Paid';
        localStorage.setItem('cp_jobs', JSON.stringify(jobs));
        alert("Payment Tracked!");
    }
}
