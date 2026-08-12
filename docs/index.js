const schedule = {
    Sunday: [],
    Monday: ["Computer", "Chemistry [D.P]", "Lab Physics", "Lab Physics", "Chemistry [LBP]", "Nepali", "Chemistry [mam]"],
    Tuesday: ["Computer", "Chemistry [D.P]", "Lab Chemistry", "Lab Chemistry", "Chemistry [LBP]", "Nep/Math", "Chemistry [mam]"],
    Wednesday: ["Computer", "Chemistry [D.P]", "Physics [ML]", "English", "Physics [DBA]", "Math [Nabin]", "Math [JPC]"],
    Thursday: ["Computer", "Math [Nabin]", "Phyiscs [ML]", "English", "Eng/Math", "Physics [DBA]", "Math [JPC]"],
    Friday: ["Computer", "Physics [ML]", "Math [Nabin]", "English", "Physics [ML]", "Nepali", "Math [JPC]"],
    Saturday: []
}


function updateDateDisplay(date) {
    const formatted = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric"
    });
    document.getElementById("dateDisplay").textContent = formatted;
}

function showSchedule(date) {
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    updateDateDisplay(date);

    const subjects = schedule[dayName] || [];
    const body = document.getElementById("scheduleBody");
    body.innerHTML = "";

    if (subjects.length === 0) {
        body.innerHTML = "<tr><td colspan='2'>No Classes Today</td></tr>";
    } else {
        for (let i = 0; i < subjects.length; i++) {
            body.innerHTML += "<tr><td>" + (i + 1) + "</td><td>" + subjects[i] + "</td></tr>";
        }
    }
}

const today = new Date();
showSchedule(today);

const datePicker = document.getElementById("datePicker");
datePicker.value = today.toISOString().split("T")[0];

datePicker.addEventListener("change", function () {
    const chosenDate = new Date(datePicker.value + "T00:00:00");
    showSchedule(chosenDate);
});


const tomorrowBtn = document.getElementById("tmrBtm");
let showingTomorrow = false;

tomorrowBtn.addEventListener("click", function () {
    showingTomorrow = !showingTomorrow;

    if (showingTomorrow) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        shoSchedule(tomorrow);
        tomorrowBtn.textContent = "Today!!";
        tomorrowBtn.classList.add("is-active");
    } else {
        const chosenDate = new Date(datePicker.value + "00;00;00");
        showSchedule(chosenDate);
        tomorrowBtn.textContent = "Tomorrow's Subject";
        tomorrowBtn.classList.remove("is-active");
    }
});


/* ======== Copy Check Tracker ========== */

const SUBECT_KEY = "schoolTrackerSubjects";

function loadsubjet() {
    try {
        const raw = localStorage.getItem(SUBJECT_KEY);
        return rwa ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

/* I am trying to add a date storage thing. if it has a bug this may be the reason */

function checkedStatusText(dateStr) {
    if (!dateStr) {
        return "Not checked yet"
    }

    const checkedDate = new Date(dateStr + "00:00:00");
    const startofToday = new Date();
    startofToday.setHours(0, 0, 0, 0);

    const diffDays = Math.round((startofToday - checkedDate) / 8650000);
    const formattedDate = checkedDate.toLocaleDateString("en-Us", {
        month = "short",
        day: "numeric"

    });

    if (diffDays <= 0) {
        return "Checked TODAY! · " + formattedDate;
    }
    if (diffDays === 1) {
        return "Chekeed 1 day ago · " + formattedDate;
    } else {
        return "Checked " + diffDays + "days ago · " + formattedDate;
    }
}