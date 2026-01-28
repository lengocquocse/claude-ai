// Start date: September 26, 2025
const startDate = new Date('2025-09-26T00:00:00');

function calculateDuration() {
    const now = new Date();
    const diff = now - startDate;

    // If the date hasn't arrived yet
    if (diff < 0) {
        document.getElementById('years').textContent = '0';
        document.getElementById('months').textContent = '0';
        document.getElementById('days').textContent = '0';
        document.getElementById('totalDays').textContent = '0';
        document.getElementById('totalHours').textContent = '0';
        document.getElementById('totalMinutes').textContent = '0';
        return 0;
    }

    // Calculate total values
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diff / (1000 * 60));

    // Calculate years, months, days
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();

    // Adjust for negative days
    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }

    // Update DOM
    document.getElementById('years').textContent = years;
    document.getElementById('months').textContent = months;
    document.getElementById('days').textContent = days;
    document.getElementById('totalDays').textContent = totalDays.toLocaleString();
    document.getElementById('totalHours').textContent = totalHours.toLocaleString();
    document.getElementById('totalMinutes').textContent = totalMinutes.toLocaleString();

    return totalDays;
}

function updateMilestones(totalDays) {
    const milestones = document.querySelectorAll('.milestone');

    milestones.forEach(milestone => {
        const requiredDays = parseInt(milestone.dataset.days);
        if (totalDays >= requiredDays) {
            milestone.classList.add('achieved');
        } else {
            milestone.classList.remove('achieved');
        }
    });
}

function update() {
    const totalDays = calculateDuration();
    updateMilestones(totalDays);
}

// Initial update
update();

// Update every second for live counter feel
setInterval(update, 1000);

// Add subtle animation on load
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.header, .counter-section, .quote-section, .milestones, .footer');

    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });
});
