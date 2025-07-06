let currentYear, currentMonth;
let selectedStarts = [];
let predictedPeriod = null;
const email = localStorage.getItem("userEmail"); // ← corrected key


function formatDate(date) {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function updateMonthYearLabel() {
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const label = document.getElementById('monthYearLabel');
    label.textContent = `${monthNames[currentMonth]} ${currentYear}`;
}

function renderCalendar(month, year) {
    currentMonth = month;
    currentYear = year;
    updateMonthYearLabel();

    const calendar = document.getElementById('calendar');
    calendar.innerHTML = "";

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
        const label = document.createElement('div');
        label.textContent = day;
        label.classList.add('calendar-day', 'calendar-label');
        calendar.appendChild(label);
    });

    const firstDay = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement('div');
        blank.classList.add('calendar-day');
        calendar.appendChild(blank);
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = formatDate(new Date());

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
        const date = new Date(year, month, dayNum);
        const dateStr = formatDate(date);

        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day', 'selectable');
        dayDiv.textContent = dayNum;

        if (dateStr === todayStr) {
            dayDiv.classList.add('today');
        }

        if (selectedStarts.includes(dateStr)) {
            dayDiv.classList.add('selected');
        }

        if (predictedPeriod === dateStr) {
            dayDiv.classList.add('predicted-start');
        }

        if (date <= new Date()) {
            dayDiv.addEventListener('click', async () => {
                const isSelected = selectedStarts.includes(dateStr);

                if (isSelected) {
                    // Remove from selected
                    selectedStarts = selectedStarts.filter(d => d !== dateStr);
                    dayDiv.classList.remove('selected');

                    // Delete from backend
                    try {
                        await fetch("/remove-period-date", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email, date: dateStr })
                        });
                    } catch (err) {
                        console.error("Failed to remove date:", err);
                    }

                } else {
                    // Add to selected
                    selectedStarts.push(dateStr);
                    selectedStarts.sort();
                    dayDiv.classList.add('selected');

                    // Save to backend
                    try {
                        await fetch("/add-period-date", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email, date: dateStr })
                        });
                    } catch (err) {
                        console.error("Failed to save date:", err);
                    }
                }
            });
        } else {
            dayDiv.classList.remove('selectable');
            dayDiv.style.cursor = 'default';
        }

        calendar.appendChild(dayDiv);
    }
}

document.getElementById('prevMonthBtn').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});

document.getElementById('nextMonthBtn').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});

async function predict() {
    if (selectedStarts.length < 4) {
        alert("Please select at least 4 previous period start dates.");
        return;
    }

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dates: selectedStarts })
        });

        const result = await response.json();

        if (response.ok) {
            predictedPeriod = result.predicted_date;
            document.getElementById('result').textContent =
                `Predicted next period start: ${predictedPeriod} (Cycle length: ${result.predicted_cycle_length} days)`;

            const predDateObj = new Date(predictedPeriod);
            if (predDateObj.getMonth() !== currentMonth || predDateObj.getFullYear() !== currentYear) {
                currentMonth = predDateObj.getMonth();
                currentYear = predDateObj.getFullYear();
            }

            renderCalendar(currentMonth, currentYear);
        } else {
            document.getElementById('result').textContent = `Error: ${result.error}`;
        }
    } catch (error) {
        document.getElementById('result').textContent = `Error: ${error.message}`;
    }
}

document.getElementById('predictBtn').addEventListener('click', predict);

// Load saved dates from DB on page load
async function loadSavedDates() {
    try {
        const res = await fetch("/get-period-dates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (data && Array.isArray(data.dates)) {
            selectedStarts = data.dates.sort();
        }
    } catch (err) {
        console.error("Error fetching saved dates:", err);
    }
}

// Initialize on load
window.onload = async () => {
    const today = new Date();
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();

    await loadSavedDates();
    renderCalendar(currentMonth, currentYear);
};
