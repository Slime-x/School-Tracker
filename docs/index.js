const schedule = {
    Sunday: [],
    Monday: ["Computer", "Chemistry [D.P]", "Lab Physics", "Lab Physics", "Chemistry [LBP]", "Nepali", "Chemistry [mam]"],
    Tuesday: ["Computer", "Chemistry [D.P]", "Lab Chemistry", "Lab Chemistry", "Chemistry [LBP]", "Nep/Math", "Chemistry [mam]"],
    Wednesday: ["Computer", "Chemistry [D.P]", "Physics [ML]", "English", "Physics [DBA]", "Math [Nabin]", "Math [JPC]"],
    Thursday: ["Computer", "Math [Nabin]", "Physics [ML]", "English", "Eng/Math", "Physics [DBA]", "Math [JPC]"],
    Friday: ["Computer", "Physics [ML]", "Math [Nabin]", "English", "Physics [ML]", "Nepali", "Math [JPC]"],
    Saturday: []
}

// Format a Date as a local YYYY-MM-DD string. toISOString() converts to UTC
// first, which shifts the date near midnight in timezones ahead of UTC
// (like Nepal) - this was the source of the "wrong day" bug.
function formatDateLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
}

function parseLocalDate(dateStr) {
    return new Date(dateStr + "T00:00:00");
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
        body.innerHTML = "<tr><td colspan='2'>No classes today</td></tr>";
    } else {
        for (let i = 0; i < subjects.length; i++) {
            body.innerHTML += "<tr><td>" + (i + 1) + "</td><td>" + subjects[i] + "</td></tr>";
        }
    }
}

const today = new Date();
showSchedule(today);

const datePicker = document.getElementById("datePicker");
datePicker.value = formatDateLocal(today);

const tomorrowBtn = document.getElementById("tmrBtn");
let showingTomorrow = false;

function resetTomorrowToggle() {
    showingTomorrow = false;
    tomorrowBtn.textContent = "Show tomorrow's classes";
    tomorrowBtn.classList.remove("is-active");
}

datePicker.addEventListener("change", function () {
    // Picking a date manually always overrides the tomorrow toggle, so the
    // button label never disagrees with what's on screen.
    resetTomorrowToggle();
    showSchedule(parseLocalDate(datePicker.value));
});

tomorrowBtn.addEventListener("click", function () {
    showingTomorrow = !showingTomorrow;

    if (showingTomorrow) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        showSchedule(tomorrow);
        tomorrowBtn.textContent = "Show today's classes";
        tomorrowBtn.classList.add("is-active");
    } else {
        showSchedule(parseLocalDate(datePicker.value));
        resetTomorrowToggle();
    }
});


/* ======== Copy Check Tracker ========== */

const SUBJECT_KEY = "schoolTrackerSubjects";

function loadSubjects() {
    try {
        const raw = localStorage.getItem(SUBJECT_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveSubjects(list) {
    localStorage.setItem(SUBJECT_KEY, JSON.stringify(list));
}

function checkedStatusText(dateStr) {
    if (!dateStr) {
        return "Not checked yet";
    }

    const checkedDate = parseLocalDate(dateStr);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const diffDays = Math.round((startOfToday - checkedDate) / 86400000);
    const formattedDate = checkedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });

    if (diffDays <= 0) {
        return "Checked today (" + formattedDate + ")";
    }
    if (diffDays === 1) {
        return "Checked 1 day ago (" + formattedDate + ")";
    }
    return "Checked " + diffDays + " days ago (" + formattedDate + ")";
}

let subjects = loadSubjects();

function renderSubjects() {
    const list = document.getElementById("subjectList");

    // Remember which notes were expanded so re-rendering (after a check-in
    // or a note save) doesn't snap them shut on the person mid-edit.
    const openIds = new Set();
    list.querySelectorAll(".subject-card__note[open]").forEach(function (details) {
        const card = details.closest(".subject-card");
        if (card) {
            openIds.add(card.dataset.id);
        }
    });

    list.innerHTML = "";

    if (subjects.length === 0) {
        list.innerHTML = "<li class='empty-state'>No subjects yet. Add one above.</li>";
        return;
    }

    subjects.forEach(function (subject) {
        const li = document.createElement("li");
        li.className = "subject-card";
        li.dataset.id = subject.id;

        li.innerHTML =
            "<div class='subject-card__top'>" +
            "<span class='subject-card__name'>" + subject.name + "</span>" +
            "<button type='button' class='icon-btn delete-btn' title='Delete subject' aria-label='Delete " + subject.name + "'>&times;</button>" +
            "</div>" +
            "<div class='subject-card__status'>" +
            "<span class='status-text'>" + checkedStatusText(subject.lastChecked) + "</span>" +
            "<button type='button' class='check-btn'>Mark checked</button>" +
            "</div>" +
            "<details class='subject-card__note'" + (openIds.has(subject.id) ? " open" : "") + ">" +
            "<summary>Note</summary>" +
            "<textarea class='note-input' placeholder='Copy check on Friday...'>" + (subject.note || "") + "</textarea>" +
            "<button type='button' class='save-note-btn'>Save note</button>" +
            "</details>";

        list.appendChild(li);
    });
}

document.getElementById("addSubjectForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const input = document.getElementById("newSubjectInput");
    const name = input.value.trim();
    if (!name) {
        return;
    }

    subjects.push({
        id: Date.now().toString(),
        name: name,
        lastChecked: null,
        note: ""
    });

    saveSubjects(subjects);
    renderSubjects();
    input.value = "";
    input.focus();
});

document.getElementById("subjectList").addEventListener("click", function (e) {
    const card = e.target.closest(".subject-card");
    if (!card) {
        return;
    }

    const subject = subjects.find(function (s) {
        return s.id === card.dataset.id;
    });
    if (!subject) {
        return;
    }

    if (e.target.classList.contains("check-btn")) {
        subject.lastChecked = formatDateLocal(new Date());
        saveSubjects(subjects);
        renderSubjects();
    }

    if (e.target.classList.contains("delete-btn")) {
        subjects = subjects.filter(function (s) {
            return s.id !== subject.id;
        });
        saveSubjects(subjects);
        renderSubjects();
    }

    if (e.target.classList.contains("save-note-btn")) {
        const textarea = card.querySelector(".note-input");
        subject.note = textarea.value;
        saveSubjects(subjects);
        renderSubjects();
    }
});

renderSubjects();
