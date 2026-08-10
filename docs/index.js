const schedule = {
    Sunday: [],
    Monday: ["subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5", "Subject 6", "Subject 7"],
    Tuesday: ["subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5", "Subject 6", "Subject 7"],
    Wednesday: ["subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5", "Subject 6", "Subject 7"],
    Thursday: ["subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5", "Subject 6", "Subject 7"],
    Friday: ["subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5", "Subject 6", "Subject 7"],
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
